const express = require ('express')
const { createRedirectUrl } = require('../Controller/flutterwave.controller')

const Route = express.Router()

Route.post ('/make-payment', createRedirectUrl)


module.exports = Route