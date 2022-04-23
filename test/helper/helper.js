const request = require('supertest');

module.exports = {
  randomizer: function makeRandom(length, dataType = 'all', exclude = '') {
    let characters = '';
    let result = '';
    switch (dataType) {
      case 'alphabet':
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        break
      case 'numbers':
        characters = '0123456789';
        break
      case 'all':
        characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        break
      case 'prefix':
        characters = ['The','Premier','Your','My','Chronicle of','Story of','Our']
        break
    }
    if (exclude != ''){
      characters = characters.replace(exclude, '');
    }
    let charactersLength = characters.length;
    let breaker = 10
    while ((result == undefined) | (result == '') | (result == null)) {
      if (typeof(characters) == 'string'){
        for (let i = 0; i < length; i++) {
          result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
      } else if (typeof(characters) == 'object'){
        result = characters[(Math.floor(Math.random() * charactersLength))];
      }
      breaker--
      if (breaker == 0){
        break
      }
    }
    return result;
  },
  getAdminToken: function loginAdmin(url, cred) {
    return new Promise((resolve, reject) => {
      request(url)
        .post('/login')
        .set('Accept', 'application/json')
        .send(`email=${cred.email}`)
        .send(`password=${cred.password}`)
        .then((res) => {
          if (res.statusCode != 200) {
            return reject(res.body);
          } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(cred.email);
            expect(res.body.accessToken).toBeDefined();
            return resolve(res.body);
          }
        });
    });
  },
  destroyAdminToken: function loginAdmin(url, cred) {
    return new Promise((resolve, reject) => {
      request(url)
        .post('/logout')
        .set('Accept', 'application/json')
        .set('Authorization', `Bearer ${cred.token}`)
        .then((res) => {
          if (res.statusCode != 200) {
            return reject(res.body);
          } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.email).toEqual(cred.email);
            expect(res.body.status).toEqual('Success');
            return resolve(res.body);
          }
        });
    });
  },
};
