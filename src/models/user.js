const mongoose = require('mongoose');
const validator = require('validator');
const passwordValidator = require('password-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const passwordSchema = new passwordValidator();
passwordSchema.is().min(7).is().max(100).has().uppercase().has()
    .lowercase().has().not().spaces().is().not().oneOf(['password']);

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        validate(value) {
            if (!passwordSchema.validate(value)) {
                throw new Error('Password requirements not satisfied');
            }
        }

    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Email is invalid');
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if (value < 0) {
                throw new Error('Age is invalid');
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    avatar: {
        type: Buffer
    }
}, {
    timestamps: true
});


userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    if (userObject.avatar) {
        userObject.avatar = 'uploaded and set';
    }
    return userObject;
};

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, process.env.JWT_TOKEN_SECRET);
    user.tokens = user.tokens.concat({token});
    await user.save();
    return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({email});
    if (!user) {
        throw new Error('Unable to login');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new Error('Unable to login');
    }

    return user;
};


//hash the plain text password before saving
userSchema.pre('save', async function (next) {
    const user = this;

    if (user.isModified('password')) {
        const hashedPassword = await bcrypt.hash(user.password, 8);
        //console.log('origninal password', user.password);
        user.password = hashedPassword;
        //console.log('saving hashed password', hashedPassword);
    }
    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;