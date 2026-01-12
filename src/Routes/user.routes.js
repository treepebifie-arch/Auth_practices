const express = require ('express');
const { signUp, login, verifyOtp, resendOtp, getAllUsers, updateRole, uploadProfilePicture } = require('../Controller/user.controller');
const isAuth = require('../Config/auth');
const upload = require('../Images/multer');


const router = express.Router()

router.post('/signup', signUp)
router.post('/login', login )
router.put('/verify-otp', verifyOtp)
router.put ('/resend-otp', resendOtp)
router.get('/get-all-users', isAuth, getAllUsers)
router.patch('/make-admin/:userId', isAuth, updateRole)
router.put('/upload-profile-picture', isAuth, upload.single('profilePicture'), uploadProfilePicture)



module.exports = router;