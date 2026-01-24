const express = require ('express')
const { createRedirectUrl } = require('../Controller/flutterwave.controller')
const isAuth = require('../Config/auth')


const Route = express.Router()

Route.post ('/make-payment', isAuth, createRedirectUrl)



module.exports = Route