const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../../src/models/user');

const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: 'Betty Barker',
    email: 'bettybarker@example.com',
    password: 'passW0rd123',
    tokens: [{
        token: jwt.sign({_id: userOneId}, process.env.JWT_TOKEN_SECRET)
    }]
};

const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: 'Bert Barker',
    email: 'bertbarker@example.com',
    password: 'passW0rd123',
    tokens: [{
        token: jwt.sign({_id: userTwoId}, process.env.JWT_TOKEN_SECRET)
    }]
};

const setupDatabase = async () => {
    await User.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
};

module.exports = {
    userOneId,
    userOne,
    userTwoId,
    userTwo,
    setupDatabase
};
