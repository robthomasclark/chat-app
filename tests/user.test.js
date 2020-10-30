const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user');
const {userOneId, userOne, setupDatabase} = require('./fixtures/db');

beforeEach(setupDatabase);

afterAll(async () => {
    await mongoose.connection.close();
})

// afterEach(() => {
//
// })

test('Should sign up a new valid user', async () => {
    const response = await request(app).post('/users').send({
        name: 'Rob Clark',
        email: 'robthomasclark@example.com',
        password: 'passW0rd123'
    }).expect(201);

    //check the DB to see if the user was created
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    //assertions about the response
    //expect(response.body.user.name).toBe('Bert Barker');
    expect(response.body).toMatchObject({
        user: {
            name: 'Rob Clark',
            email: 'robthomasclark@example.com'
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('passW0rd123');

});

test('Should not signup user with invalid name/email/password', async () => {
    const response = await request(app).post('/users').send({
        name: 'Rob Clark',
        email: 'robthomasclark@example.com',
        password: 'password'
    }).expect(400);
})

test('Should login an existing user', async () => {
    const response = await request(app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200);
    const user = await User.findById(response.body.user._id);
    expect(user).not.toBeNull();

    expect(user.tokens[1].token).toBe(response.body.token);
})

test('Should not login non existing user', async () => {
    await request(app).post('/users/login').send({
        email: 'robthomasclark@example.com',
        password: 'passW0rd123'
    }).expect(400);
})

test('Should get profile for logged in user', async () => {
    await request(app)
        .get('/users/me')
        .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .send()
        .expect(200);
})

test('Should not get profile for unauthenticated user', async () => {
    await request(app)
        .get('/users/me')
        //.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .send()
        .expect(401);
})

test('Should delete account for valid user', async () => {
    const response = await request(app)
        .delete('/users/me')
        .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .send()
        .expect(200);

    //check that the response has the id of user deleted
    expect(response.body._id).toBe(userOne._id.toString());

    //check the DB to see if the user was deleted
    const user = await User.findById(userOneId);
    expect(user).toBeNull();
})

test('Should not delete account for unauthenticated user', async () =>{
    await request(app)
        .delete('/users/me')
        //.set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .send()
        .expect(401);
})

test('Should upload avatar', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .attach('avatar', 'tests/fixtures/valid.jpg')
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));

})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .send({
            name: 'Betty Clark'
        })
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.name).toBe('Betty Clark');
})

test('Should not update invalid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .send({
            location: 'New Mexico'
        })
        .expect(400);
})

test('Should not update user if unauthenticated', async () => {
    await request(app)
        .patch('/users/me')
        .send({
            name: 'Betty Clark'
        })
        .expect(401);
})

test('Should not update user with invalid name/email/password', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', 'Bearer ' + userOne.tokens[0].token)
        .send({
            email: 'rob.clark#me.com'
        })
        .expect(400);
})

