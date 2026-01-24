const express = require ('express')
const { createRedirectUrl } = require('../Controller/flutterwave.controller')
const isAuth = require('../Config/auth')
const { createWallet } = require('../Controller/wallet.controller')


const Route = express.Router()
Route.post ('/create-wallet', isAuth, createWallet)
Route.post ('/make-payment', isAuth, createRedirectUrl)



module.exports = Route