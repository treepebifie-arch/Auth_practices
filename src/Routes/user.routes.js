const express = require ('express');
const { signUp, login, verifyOtp, resendOtp, getAllUsers, updateRole } = require('../Controller/user.controller');
const isAuth = require('../Config/auth');


const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login )
router.put('/verify-otp', verifyOtp)
router.put ('/resend-otp', resendOtp)
router.get('/get-all-users', isAuth, getAllUsers)
router.patch('/make-admin/:userId', isAuth, updateRole)



module.exports = router;