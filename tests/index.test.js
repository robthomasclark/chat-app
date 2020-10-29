const request = require('supertest');
const app = require('../src/app');

// afterAll(async () => {
//     await app.removeAllListeners();
// })

// afterAll(async () => {
//     await new Promise(resolve => setTimeout(() => resolve(), 500)); // avoid jest open handle error
// });

test('test get homepage', async () => {
        const response = await request(app).get('/').send().expect(200);
})