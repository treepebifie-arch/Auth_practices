const express = require ('express')
const { createRedirectUrl, flutterwaveWebhook } = require('../Controller/flutterwave.controller')
const isAuth = require('../Config/auth')
const { createWallet, getAllWallets, transferFunds } = require('../Controller/wallet.controller')



const Route = express.Router()


Route.post ('/create-wallet', isAuth, createWallet)
Route.post ('/make-payment', isAuth, createRedirectUrl)
Route.get ('/get-all-wallets', isAuth, getAllWallets)
Route.post ('/transfer-funds', isAuth, transferFunds)
Route.post ('/webhook/flutterwave', flutterwaveWebhook)




module.exports = Route