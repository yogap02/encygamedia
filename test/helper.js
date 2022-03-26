const request = require('supertest');

module.exports = {
  randomizer: function makeRandom(length , dataType = "all") {
    var characters = ''
    var result = ''
    switch (dataType) {
        case "alphabet" :
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
        case "numbers" : 
            characters = '0123456789'
        case "all" : 
            characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    }
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   return result;
  },
  getAdminToken: function loginAdmin(url, cred) {
    return new Promise ((resolve, reject) => {
      request(url)
      .post("/login")
      .set('Accept', 'application/json')
      .send(`email=${cred.email}`)
      .send(`password=${cred.password}`)
      .then(res => {
        if(res.statusCode != 200){
          return reject (res.body)
        } else {
          expect(res.statusCode).toEqual(200);
          expect(res.body.email).toEqual(cred.email);
          expect(res.body.accessToken).toBeDefined()
          return resolve(res.body)
        }
      })
    })
  }  
}