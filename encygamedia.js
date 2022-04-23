/*
 * This code is owned by Yoga Pasramakrisnan
 * Hopefully this code will be useful for community
 * Especially for QA who want to learn API testing.
 * --
 * Created 2022
 */

const auth = require('./helper/auth')
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')

const app = express()
const port = 5000
const stores = []
const isDebug = false

const accessToken = {
  admin:[],
  user:[]
}

const adminAccount = {
  email: 'admin@encygamedia.space',
  password: 'admin',
  timeStamp: ''
}

let id = stores.length

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

function goodRes(parent, status, response) {
  parent.set('Content-Type', 'application/json')
  parent.status(status).json(response)
}

function failedRes(parent, status, code, messages) {
  parent.set('Content-Type', 'application/json')
  const error = {
    'errorCode': code,
    'errorMessages': messages
  }
  parent.status(status).json(error)
}

function gameGetter(req, res, param, keyword) {
  if (param == 'id') {
    req.query.exact == 'true'
  }
  if (req.query.exact == 'true') {
    for (let game of stores) {
      if (game[param] == keyword) {
        goodRes(res, 200, game)
        return
      }
    }
    failedRes(res, 404, 404, 'Game Not Found')
    return
  } else {
    let response = stores.filter((game) => {
      return (game[param]).toString().includes(keyword)
    })
    if (response.length) {
      goodRes(res, 200, response)
      return
    } else {
      failedRes(res, 404, 404, 'Game Not Found')
      return
    }
  }
}

app.get('/', (req, res) => {
  goodRes(res, 200, 'Hello, Welcome to Encygamedia !')
})

app.get('/home/header', (req, res) => {
  goodRes(res, 200, {
    img1Url: 'https://encygamedia.space/storage/image1.svg',
    img2Url: 'https://encygamedia.space/storage/image2.svg',
    img3Url: 'https://encygamedia.space/storage/image3.svg',
    img4Url: 'https://encygamedia.space/storage/image4.svg'
  })
})

app.get('/home/featured', (req, res) => {
  let result
  if (stores.length == 0){
    result = []
  } else {
    result = stores.slice(0, 5)
  }
  if(isDebug){
    console.log(`Stores : ${JSON.stringify(result, null, 4)}`)
  }
  goodRes(res, 200, result)
})

app.get('/home/footer', (req, res) => {
  goodRes(res, 200, {
    contact:'Yoga Pasramakrisnan - yoga.pasramakrsinan@gmail.com',
    faqLink:'https://encygamedia.space/faq',
    toaLink:'https://encygamedia.space/termsofagreement',
    ppLink: 'https://encygamedia.space/privacypolicy'
  })
})

app.get('/game', (req, res) => {
  const specificName = req.query.name
  const specificID = req.query.id
  if (specificName != undefined && specificID != undefined) {
    failedRes(res, 400, 400, 'Search only with Name | OR | ID')
    return
  }
  if (specificID != undefined) {
    gameGetter(req, res, 'id', specificID)
  } else if (specificName != undefined) {
    gameGetter(req, res, 'name', specificName)
  } else {
    goodRes(res, 200, stores)
    return
  }
})

app.post('/game', (req, res) => {
  const game = req.body
  const token = req.headers.authorization
  if (isDebug){
    console.log(`Game Request : ${JSON.stringify(game, null, 4)}`)
    console.log(`token : ${token}`)
  }
  if (token == undefined) {
    failedRes(res, 401, 401, 'Unauthorized')
    return
  }
  if (accessToken.admin.indexOf(token.split(' ')[1]) == -1) {
    failedRes(res, 403, 403, 'Insufficient permission')
    return
  }
  if (game.name == undefined | game.name == null | game.name == '') {
    failedRes(res, 400, 400, 'Game Name Is Mandatory')
    return
  }
  if (game.year == undefined | game.year == null | game.year == '') {
    failedRes(res, 400, 400, 'Game Year Is Mandatory')
    return
  }
  if (game.platform == undefined | game.platform == null | game.platform == '') {
    failedRes(res, 400, 400, 'Game Platform Is Mandatory')
    return
  }
  if (game.price == undefined | game.price == null | game.price == '') {
    failedRes(res, 400, 400, 'Game Price Is Mandatory')
    return
  }
  if (stores.some(i => i.name.includes(game.name))) {
    failedRes(res, 409, 409, 'Game Is Already Existed')
    return
  }
  id = parseInt(id) + 1
  game.id = id

  stores.push(game)
  goodRes(res, 201, game)
  return
})

app.put('/game', (req, res) => {
  const gameId = req.query.id
  const updateGame = req.body
  const token = req.headers.authorization
  if (gameId == undefined){
    failedRes(res, 400, 400, 'Game ID is Mandatory')
    return    
  }
  if (token == undefined) {
    failedRes(res, 401, 401, 'Unauthorized')
    return
  }
  if (accessToken.admin.indexOf(token.split(' ')[1]) == -1) {
    failedRes(res, 403, 403, 'Insufficient permission')
    return
  }
  if (updateGame.name == undefined  |  updateGame.name == null |  updateGame.name == '') {
    failedRes(res, 400, 400, 'Game Name Is Mandatory')
    return
  }
  if (updateGame.year == undefined  |  updateGame.year == null |  updateGame.year == '') {
    failedRes(res, 400, 400, 'Game Year Is Mandatory')
    return
  }
  if (updateGame.platform == undefined  |  updateGame.platform == null |  updateGame.platform == '') {
    failedRes(res, 400, 400, 'Game Platform Is Mandatory')
    return
  }
  if (updateGame.price == undefined  |  updateGame.price == null |  updateGame.price == '') {
    failedRes(res, 400, 400, 'Game Price Is Mandatory')
    return
  }
  if (stores.some(i => i.name.includes(updateGame.name))) {
    failedRes(res, 409, 409, 'Game Is Already Existed')
    return
  }
  let result = stores.filter((game) => {
    if ((game.id.toString()) == gameId){
      game.name = updateGame.name
      game.platform = updateGame.platform
      game.year = updateGame.year
      game.price = updateGame.price
      updateGame.id = game.id
      return game
    }
  })
  if (result.length){
    goodRes(res, 201, updateGame)
    return
  } else {
    failedRes(res, 404, 404, 'Game Not Found')
    return
  }
})

app.delete('/game', (req, res) => {
  const gameId = req.body.id
  const token = req.headers.authorization
  if (gameId == undefined){
    failedRes(res, 400, 400, 'Game ID is Mandatory')
    return    
  }
  if (token == undefined) {
    failedRes(res, 401, 401, 'Unauthorized')
    return
  }
  if (accessToken.admin.indexOf(token.split(' ')[1]) == -1) {
    failedRes(res, 403, 403, 'Insufficient permission')
    return
  }

  let result = stores.filter((game) => {
    if ((game.id.toString()) == gameId){
      stores.pop(game)
      return game
    }
  })
  if (result.length){
    goodRes(res, 204, '')
    return
  } else {
    failedRes(res, 404, 404, 'Game Not Found')
    return
  }

})

app.post('/login', (req, res) => {
  const cred = req.body
  if (isDebug){
    console.log(JSON.stringify(cred, null, 4))
  }
  if (cred.email == undefined | cred.email == null | cred.email == '') {
    failedRes(res, 400, 400, 'User Email Is Mandatory')
    return
  }
  if (cred.password == undefined | cred.password == null | cred.password == '') {
    failedRes(res, 400, 400, 'User Password Is Mandatory')
    return
  }
  if (cred.email == adminAccount.email && cred.password == adminAccount.password) {
    const newToken = auth.generateAccessToken(adminAccount)
    accessToken.admin.push(newToken) 
    adminAccount.timeStamp = new Date().getTime().toString()
    goodRes(res, 200, {
      email: adminAccount.email,
      accessToken: newToken
    })
    return
  } else {
    failedRes(res, 400, 400, 'Login failed, please check your email and password again')
    return
  }
})

app.post('/logout', (req, res) => {
  const token = req.headers.authorization
  if (isDebug){
    console.log(`Token : ${token}`)
  }
  if (token == undefined | token == ''| token == null) {
    failedRes(res, 401, 401, 'Logout failed')
    return    
  }
   if (accessToken.admin.indexOf(token.split(' ')[1]) != -1) {
    accessToken.admin.pop(token)
    adminAccount.timeStamp = new Date().getTime().toString()
    goodRes(res, 200, {
      email: adminAccount.email,
      status: 'Success'
    })
    return
  } else {
    failedRes(res, 400, 400, 'Logout failed')
    return
  }
})

app.delete('/util/flushgame', (req, res) => {
  const token = req.headers.authorization
  if (token == undefined) {
    failedRes(res, 401, 401, 'Unauthorized')
    return
  }
  if (accessToken.admin.indexOf(token.split(' ')[1]) == -1) {
    failedRes(res, 403, 403, 'Insufficient permission')
    return
  }
  stores.length = 0
  goodRes(res, 204, '')
})

app.listen(process.env.PORT || port, () => console.log(`\n#####################################################\n##                                                 ##\n##  Encygamedia Service is running on port : ${port}  ##\n##                                                 ##\n#####################################################\n`))