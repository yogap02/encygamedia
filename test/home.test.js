const request = require('supertest');
const helper = require('./helper/helper');
const dotenv = require('dotenv');

dotenv.config();

const baseUrl = process.env.TEST_URL;
const adminAccount = {
  email: 'admin@encygamedia.space',
  password: 'admin',
  token: ''
};

const gameSeed = parseInt(Math.floor(Math.random() * 3) + 1)

describe('Home Module', () => {

  describe('Header', () => {
    it('( + ) User successfully get header', async () => {
      await request(baseUrl)
        .get('/home/header')
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.statusCode).toEqual(200)
          expect(res.body.img1Url).toBeDefined()
          expect(res.body.img2Url).toBeDefined()
          expect(res.body.img3Url).toBeDefined()
          expect(res.body.img4Url).toBeDefined()
        });
    });
  });

  describe('Featured', () => {

    it('( + ) User successfully get featured games - no games', async () => {
      await request(baseUrl)
        .get('/home/featured')
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body).toEqual([]);
        });
    });

    it('(   ) Admin successfuly logged in', async () => {
      await helper.getAdminToken(baseUrl, adminAccount).then((r) => {
        adminAccount.token = r.accessToken;
      });
    });

    for(let i = 0; i< gameSeed; i++){
      it('(   ) Admin post several games to be checked', async () => {
        let gameName = `${helper.randomizer(1, 'prefix')} ${helper.randomizer(5)} - ${helper.randomizer(3, 'numbers')}`
        await request(baseUrl)
        .post('/game')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminAccount.token}`)
        .send(`name=${gameName}`)
        .send(`platform=Testing`)
        .send(`year=19${helper.randomizer(2, 'numbers')}`)
        .send(`price=${helper.randomizer(2, 'numbers', '0')}000`)
        .then((res) => {
          expect(res.statusCode).toEqual(201);
          expect(res.body.name).toEqual(gameName);
        });
      })
    } 

    it('( + ) User successfully get featured games - below 5 games', async () => {
      await request(baseUrl)
        .get('/home/featured')
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body).toHaveLength(gameSeed);
        });
    });

    for(let i = 0; i< 5; i++){
      it('(   ) Admin post several games to be checked', async () => {
        let gameName = `${helper.randomizer(1, 'prefix')} ${helper.randomizer(5)} - ${helper.randomizer(3, 'numbers')}`
        await request(baseUrl)
        .post('/game')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminAccount.token}`)
        .send(`name=${gameName}`)
        .send(`platform=Testing`)
        .send(`year=19${helper.randomizer(2, 'numbers')}`)
        .send(`price=${helper.randomizer(2, 'numbers', '0')}000`)
        .then((res) => {
          expect(res.statusCode).toEqual(201);
          expect(res.body.name).toEqual(gameName);
        });
      })
    } 

    it('( + ) User successfully get featured games - above 5 games', async () => {
      await request(baseUrl)
        .get('/home/featured')
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.statusCode).toEqual(200);
          expect(res.body).toHaveLength(5);
        });
    });

  });

  describe('Footer', () => {
    it('( + ) User successfully get footer', async () => {
      await request(baseUrl)
        .get('/home/footer')
        .set('Accept', 'application/json')
        .then((res) => {
          expect(res.statusCode).toEqual(200)
          expect(res.body.contact).toEqual('Yoga Pasramakrisnan - yoga.pasramakrsinan@gmail.com')
          expect(res.body.faqLink).toBeDefined()
          expect(res.body.toaLink).toBeDefined()
          expect(res.body.ppLink).toBeDefined()
        });
    });
  });

})