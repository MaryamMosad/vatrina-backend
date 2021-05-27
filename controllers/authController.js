const crypto = require('crypto');
const { promisify } = require('util');
const User = require('./../models/userModel');
const catchAsync = require('./../Utils/catchAsync');
const jwt = require('jsonwebtoken');
const appError = require('./../Utils/appError');
const sendEmail = require('./../Utils/email');
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
}

// login and sending token Function
const createSendToken = (user, statusCode, res) => {
    const token = signToken(user._id);
    const cookieOptions = {
        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
        httpOnly: true
    };
    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

    res.cookie('jwt', token, cookieOptions);
    // Remove password from output
  user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        data: {
            token,
            user
        }
    });
}

exports.signup = catchAsync(async (req, res, next) => {
    const newUser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });
    createSendToken(newUser, 201, res);
});
exports.login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;

    //1)
    if (!email || !password) {
        return next(new appError('please enter email and password', 400));

    }
    //2)
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new appError('Incorrect Email or Password', 401))
    }
    //3)
    createSendToken(user, 200, res);
});
exports.protect = catchAsync(async (req, res, next) => {
    //1) Getting token and checking if it's correct
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    };

    if (!token) {
        return next(new appError('You are not logged in,Please log in to continue', 401));
    }
    //2) Verification
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //3) Check if the user still exists
    const freshUser = await User.findById(decoded.id);
    if (!freshUser) {
        return next(new appError('The user belonging to this token no longer exists', 401));
    };
    //4)Check if the user changed password after the token
    if (freshUser.changedPasswordAfter(decoded.iat)) {
        return next(new appError('User recently changed password! Please log in again', 401))
    }
    //Grant access to protected route
    req.user = freshUser;
    next();
});
exports.strictTo = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.userType)) {
            return next(new appError('You are not allowed to perform this action', 403))
        };
        next();
    };
};
exports.forgotPassword = catchAsync(async (req, res, next) => {
    //1) Get user based on posted email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new appError('There is no user with this email address', 404));
    };
    //2)Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });
    //3) send it to user's email
    const resetURL = `${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!'
        });
    } catch (err) {
        user.PasswordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });
        return next(new appError('there was an error sending email', 500));
    }
});
exports.resetPassword = catchAsync(async (req, res, next) => {
    //1)Get user based on the token 
    const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });
    //2)If the token hasn't expired and there's a user set the new password
    if (!user) {
        return next(new appError('Invalid or Expired token'));
    };
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.PasswordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    //3)Update changedAt

    //4) Log the user in 
    createSendToken(user, 200, res);


});
//Update password Function
exports.updatePassword = catchAsync(async (req, res, next) => {
    // 1) Get user from collection
    const user = await User.findById(req.user.id).select('+password');

    // 2) Check if POSTed current password is correct
    if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
        return next(new AppError('Your current password is wrong.', 401));
    }

    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended!

    // 4) Log user in, send JWT
    createSendToken(user, 200, res);
});