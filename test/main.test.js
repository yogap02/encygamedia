const request = require('supertest');

// const sum = require('./helper');

const baseUrl = 'http://127.0.0.1:5000';
const adminAccount = {
    email: 'admin@encygamedia.space',
    password: 'admin',
    token: ''
  }

describe('Perform Test for - Auth' , () => {

    it('( + ) Admin able to logged in', async () => {
        const response = await request(baseUrl)
            .post("/login")
            .set('Accept', 'application/json')
            .send(`email=${adminAccount.email}`)
            .send(`password=${adminAccount.password}`)
            .then(res => {
                console.log(res.body)
                expect(res.statusCode).toEqual(200);
                expect(res.body.email).toEqual(adminAccount.email);
                expect(res.body.accessToken).toBeDefined()
                adminAccount.token = res.body.acessToken
            })
    })

})