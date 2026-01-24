const express = require ('express')
const { createRedirectUrl } = require('../Controller/flutterwave.controller')
const isAuth = require('../Config/auth')
const { createWallet, getAllWallets } = require('../Controller/wallet.controller')


const Route = express.Router()


Route.post ('/create-wallet', isAuth, createWallet)
Route.post ('/make-payment', isAuth, createRedirectUrl)
Route.get ('/get-all-wallets', isAuth, getAllWallets)



module.exports = Route