const request = require('supertest');
const helper = require('./helper/helper');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

const baseUrl = process.env.TEST_URL;
const adminAccount = {
  email: 'admin@encygamedia.space',
  password: 'admin',
  token: ''
};

const randint = helper.randomizer(1, 'numbers', '0')

const gameInfo = {
  gameName : `${helper.randomizer(1, 'prefix')} ${helper.randomizer(5)} - ${helper.randomizer(3, 'numbers')}`,
  gamePlatform : 'Testing',
  gameRelease : `19${helper.randomizer(2, 'numbers')}`,
  gamePrice : `${helper.randomizer(2, 'numbers', '0')}000`,
  gameId : ''
}

const updatedGameInfo = {
  gameName : `updated_${gameInfo.gameName}`,
  gamePlatform : `updated_${gameInfo.gamePlatform}`,
  gameRelease : `2020`,
  gamePrice : `123456`,
}

describe('Game Module', () => {

  describe('Post a Game', () => {

    it('(   ) Generate Admin Token', async () => {
      await helper.getAdminToken(baseUrl, adminAccount).then((r) => {
        adminAccount.token = r.accessToken;
      });
    });

    it('( + ) Admin successfully post a game', async () => {
      await request(baseUrl)
      .post('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .send(`name=${gameInfo.gameName}`)
      .send(`platform=${gameInfo.gamePlatform}`)
      .send(`year=${gameInfo.gameRelease}`)
      .send(`price=${gameInfo.gamePrice}`)
      .then((res) => {
        gameInfo.gameId = res.body.id
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toEqual(gameInfo.gameName);
        expect(res.body.platform).toEqual(gameInfo.gamePlatform);
        expect(res.body.year).toEqual(gameInfo.gameRelease);
        expect(res.body.price).toEqual(gameInfo.gamePrice);
      });
    })

    it('( - ) Admin failed post a game - duplicated', async () => {
      await request(baseUrl)
      .post('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .send(`name=${gameInfo.gameName}`)
      .send(`platform=${gameInfo.gamePlatform}`)
      .send(`year=${gameInfo.gameRelease}`)
      .send(`price=${gameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(409);
        expect(res.body.errorMessages).toEqual('Game Is Already Existed');
      });
    })

    it('( - ) Admin failed post a game - no auth', async () => {
      await request(baseUrl)
      .post('/game')
      .set('Accept', 'application/json')
      .send(`name=${gameInfo.gameName}`)
      .send(`platform=${gameInfo.gamePlatform}`)
      .send(`year=${gameInfo.gameRelease}`)
      .send(`price=${gameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(401);
        expect(res.body.errorMessages).toEqual('Unauthorized');
      });
    })

    it('( - ) Admin failed post a game - wrong token', async () => {
      await request(baseUrl)
      .post('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer 1234`)
      .send(`name=${gameInfo.gameName}`)
      .send(`platform=${gameInfo.gamePlatform}`)
      .send(`year=${gameInfo.gameRelease}`)
      .send(`price=${gameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(403);
        expect(res.body.errorMessages).toEqual('Insufficient permission');
      });
    })

    it('( - ) Admin failed to post a game - null name', async () => {
      await request(baseUrl)
      .post('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .send(`name=`)
      .send(`platform=${gameInfo.gamePlatform}`)
      .send(`year=${gameInfo.gameRelease}`)
      .send(`price=${gameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual('Game Name Is Mandatory');
      });
    })

    it('( - ) Admin failed to post a game - no name', async () => {
      await request(baseUrl)
      .post('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .send(`platform=${gameInfo.gamePlatform}`)
      .send(`year=${gameInfo.gameRelease}`)
      .send(`price=${gameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual('Game Name Is Mandatory');
      });
    })

    it('( - ) Admin failed to post a game - null platform', async () => {
      await request(baseUrl)
      .post('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .send(`name=${gameInfo.gameName}`)
      .send(`platform=`)
      .send(`year=${gameInfo.gameRelease}`)
      .send(`price=${gameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual('Game Platform Is Mandatory');
      });
    })

    it('( - ) Admin failed to post a game - no platform', async () => {
      await request(baseUrl)
      .post('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .send(`name=${gameInfo.gameName}`)
      .send(`year=${gameInfo.gameRelease}`)
      .send(`price=${gameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual('Game Platform Is Mandatory');
      });
    })

    it('( - ) Admin failed to post a game - null year', async () => {
      await request(baseUrl)
      .post('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .send(`name=${gameInfo.gameName}`)
      .send(`platform=${gameInfo.gamePlatform}`)
      .send(`year=`)
      .send(`price=${gameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual('Game Year Is Mandatory');
      });
    })

    it('( - ) Admin failed to post a game - no year', async () => {
      await request(baseUrl)
      .post('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .send(`name=${gameInfo.gameName}`)
      .send(`platform=${gameInfo.gamePlatform}`)
      .send(`price=${gameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual('Game Year Is Mandatory');
      });
    })

    it('( - ) Admin failed to post a game - null price', async () => {
      await request(baseUrl)
      .post('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .send(`name=${gameInfo.gameName}`)
      .send(`platform=${gameInfo.gamePlatform}`)
      .send(`year=${gameInfo.gameRelease}`)
      .send(`price=`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual('Game Price Is Mandatory');
      });
    })

    it('( - ) Admin failed to post a game - no price', async () => {
      await request(baseUrl)
      .post('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .send(`name=${gameInfo.gameName}`)
      .send(`platform=${gameInfo.gamePlatform}`)
      .send(`year=${gameInfo.gameRelease}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual('Game Price Is Mandatory');
      });
    })
  
  });
  
  describe('Edit a Game', () => {

    it('(   ) Get Admin Token', async () => {
      await helper.getAdminToken(baseUrl, adminAccount).then((r) => {
        adminAccount.token = r.accessToken;
      });
    });

    it('( + ) Admin successfully edit a game using id', async () => {
      await request(baseUrl)
      .put('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .query({ id: gameInfo.gameId })
      .send(`name=${updatedGameInfo.gameName}`)
      .send(`platform=${updatedGameInfo.gamePlatform}`)
      .send(`year=${updatedGameInfo.gameRelease}`)
      .send(`price=${updatedGameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(201);
        expect(res.body.name).toEqual(updatedGameInfo.gameName);
        expect(res.body.platform).toEqual(updatedGameInfo.gamePlatform);
        expect(res.body.year).toEqual(updatedGameInfo.gameRelease);
        expect(res.body.price).toEqual(updatedGameInfo.gamePrice);
        expect(res.body.id).toEqual(gameInfo.gameId);
      });
    })

    it('( - ) Admin failed to edit a game using id - duplicate', async () => {
      await request(baseUrl)
      .put('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .query({ id: gameInfo.gameId })
      .send(`name=${gameInfo.gameName}`)
      .send(`platform=${updatedGameInfo.gamePlatform}`)
      .send(`year=${updatedGameInfo.gameRelease}`)
      .send(`price=${updatedGameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(409);
        expect(res.body.errorMessages).toEqual('Game Is Already Existed');
      });
    })

    it('( - ) Admin failed to edit a game using id - no auth', async () => {
      await request(baseUrl)
      .put('/game')
      .set('Accept', 'application/json')
      .query({ id: gameInfo.gameId })
      .send(`name=${updatedGameInfo.gameName}`)
      .send(`platform=${updatedGameInfo.gamePlatform}`)
      .send(`year=${updatedGameInfo.gameRelease}`)
      .send(`price=${updatedGameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(401);
        expect(res.body.errorMessages).toEqual('Unauthorized');
      });
    })

    it('( - ) Admin failed to edit a game using id - wrong token', async () => {
      await request(baseUrl)
      .put('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer 1234`)
      .query({ id: gameInfo.gameId })
      .send(`name=${updatedGameInfo.gameName}`)
      .send(`platform=${updatedGameInfo.gamePlatform}`)
      .send(`year=${updatedGameInfo.gameRelease}`)
      .send(`price=${updatedGameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(403);
        expect(res.body.errorMessages).toEqual('Insufficient permission');
      });
    })

    it('( - ) Admin failed to edit a game using id - null name', async () => {
      await request(baseUrl)
      .put('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .query({ id: gameInfo.gameId })
      .send(`name=`)
      .send(`platform=${updatedGameInfo.gamePlatform}`)
      .send(`year=${updatedGameInfo.gameRelease}`)
      .send(`price=${updatedGameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual('Game Name Is Mandatory');
      });
    })

    it('( - ) Admin failed to edit a game using id - no name', async () => {
      await request(baseUrl)
      .put('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .query({ id: gameInfo.gameId })
      .send(`platform=${updatedGameInfo.gamePlatform}`)
      .send(`year=${updatedGameInfo.gameRelease}`)
      .send(`price=${updatedGameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual('Game Name Is Mandatory');
      });
    })

    it('( - ) Admin failed to edit a game using id - null platform', async () => {
      await request(baseUrl)
      .put('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .query({ id: gameInfo.gameId })
      .send(`name=${gameInfo.gameName}`)
      .send(`platform=`)
      .send(`year=${updatedGameInfo.gameRelease}`)
      .send(`price=${updatedGameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual('Game Platform Is Mandatory');
      });
    })

    it('( - ) Admin failed to edit a game using id - no platform', async () => {
      await request(baseUrl)
      .put('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .query({ id: gameInfo.gameId })
      .send(`name=${gameInfo.gameName}`)
      .send(`year=${updatedGameInfo.gameRelease}`)
      .send(`price=${updatedGameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual('Game Platform Is Mandatory');
      });
    })

    it('( - ) Admin failed to edit a game using id - null year', async () => {
      await request(baseUrl)
      .put('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .query({ id: gameInfo.gameId })
      .send(`name=${gameInfo.gameName}`)
      .send(`platform=${updatedGameInfo.gamePlatform}`)
      .send(`year=`)
      .send(`price=${updatedGameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual('Game Year Is Mandatory');
      });
    })

    it('( - ) Admin failed to edit a game using id - no year', async () => {
      await request(baseUrl)
      .put('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .query({ id: gameInfo.gameId })
      .send(`name=${gameInfo.gameName}`)
      .send(`platform=${updatedGameInfo.gamePlatform}`)
      .send(`price=${updatedGameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual('Game Year Is Mandatory');
      });
    })

    it('( - ) Admin failed to edit a game using id - null price', async () => {
      await request(baseUrl)
      .put('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .query({ id: gameInfo.gameId })
      .send(`name=${gameInfo.gameName}`)
      .send(`platform=${updatedGameInfo.gamePlatform}`)
      .send(`year=${updatedGameInfo.gameRelease}`)
      .send(`price=`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual('Game Price Is Mandatory');
      });
    })

    it('( - ) Admin failed to edit a game using id - no price', async () => {
      await request(baseUrl)
      .put('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .query({ id: gameInfo.gameId })
      .send(`name=${gameInfo.gameName}`)
      .send(`platform=${updatedGameInfo.gamePlatform}`)
      .send(`year=${updatedGameInfo.gameRelease}`)
      .then((res) => {
        expect(res.statusCode).toEqual(400);
        expect(res.body.errorMessages).toEqual('Game Price Is Mandatory');
      });
    })


  });

  describe('Get a Game', () => {

    it('(   ) Get Admin Token', async () => {
      await helper.getAdminToken(baseUrl, adminAccount).then((r) => {
        adminAccount.token = r.accessToken;
      });
    });

    it('(   ) Flush submitted game' , async () => {
      await request(baseUrl)
        .delete('/util/flushgame')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminAccount.token}`)
        .then((res) => {
          expect(res.statusCode).toEqual(204);
        });
    })

    it('( + ) Admin successfully get no game', async () => {
      await request(baseUrl)
      .get('/game')
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(0)
      });
    })

    it('(   ) Admin successfully post a game', async () => {
      await request(baseUrl)
      .post('/game')
      .set('Accept', 'application/json')
      .set('Authorization', `Bearer ${adminAccount.token}`)
      .send(`name=${gameInfo.gameName}`)
      .send(`platform=${gameInfo.gamePlatform}`)
      .send(`year=${gameInfo.gameRelease}`)
      .send(`price=${gameInfo.gamePrice}`)
      .then((res) => {
        expect(res.statusCode).toEqual(201);
      });
    })

    it('( + ) Admin successfully get games', async () => {
      await request(baseUrl)
      .get('/game')
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(1)
        gameInfo.gameId = res.body[0].id
        expect(res.body[0].name).toEqual(gameInfo.gameName)
        expect(res.body[0].platform).toEqual(gameInfo.gamePlatform)
        expect(res.body[0].year).toEqual(gameInfo.gameRelease)
        expect(res.body[0].price).toEqual(gameInfo.gamePrice)
      });
    })

    for (let a=0; a<randint; a++){
      it('(   ) Admin successfully post a game', async () => {
        await request(baseUrl)
        .post('/game')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${adminAccount.token}`)
        .send(`name=${gameInfo.gameName + a}`)
        .send(`platform=${gameInfo.gamePlatform}`)
        .send(`year=${gameInfo.gameRelease}`)
        .send(`price=${gameInfo.gamePrice}`)
        .then((res) => {
          expect(res.statusCode).toEqual(201);
        });
      })
    }

    it('( + ) Admin successfully get games as many as seeded', async () => {
      await request(baseUrl)
      .get('/game')
      .set('Accept', 'application/json')
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveLength(parseInt(randint) + 1)
      });
    })

    it('( + ) Admin successfully get single game with id', async () => {
      await request(baseUrl)
      .get('/game')
      .set('Accept', 'application/json')
      .query({ id: gameInfo.gameId })
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body[0].name).toEqual(gameInfo.gameName)
        expect(res.body[0].platform).toEqual(gameInfo.gamePlatform)
        expect(res.body[0].year).toEqual(gameInfo.gameRelease)
        expect(res.body[0].price).toEqual(gameInfo.gamePrice)
      });
    })

    it('( + ) Admin successfully get single game with name', async () => {
      await request(baseUrl)
      .get('/game')
      .set('Accept', 'application/json')
      .query({ name: gameInfo.gameName })
      .then((res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body[0].name).toEqual(gameInfo.gameName)
        expect(res.body[0].platform).toEqual(gameInfo.gamePlatform)
        expect(res.body[0].year).toEqual(gameInfo.gameRelease)
        expect(res.body[0].price).toEqual(gameInfo.gamePrice)
        expect(res.body[0].id).toEqual(gameInfo.gameId)
      });
    })

    it('( - ) Admin failed get single game with id - not found', async () => {
      await request(baseUrl)
      .get('/game')
      .set('Accept', 'application/json')
      .query({ id: 99999 })
      .then((res) => {
        expect(res.statusCode).toEqual(404);
        expect(res.body.errorMessages).toEqual('Game Not Found')
      });
    })

    it('( - ) Admin failed get single game with name - not found', async () => {
      await request(baseUrl)
      .get('/game')
      .set('Accept', 'application/json')
      .query({ name: 'nonExistedGame' })
      .then((res) => {
        expect(res.statusCode).toEqual(404);
        expect(res.body.errorMessages).toEqual('Game Not Found')
      });
    })

  });

})
