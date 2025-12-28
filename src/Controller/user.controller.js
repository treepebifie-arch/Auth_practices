const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const User = require('../Models/user.models');
const sendEmail = require('../Config/email');
const e = require('express');


const signUp = async (req, res) => {
    const {name, email, password} = req.body
    if (!name || !email || !password) {
        return res.status(400).json('all fields are required')
    }
    const existingUser = await User.findOne({email})
    if (existingUser) {
        return res.status(400).json('user already exists')
    }
    const hashedPassword = await bcrypt.hash (password, 10)
    const otp = Math.floor (100000 + Math.random() * 900000)
    const otpExpiry = new Date (Date.now () + 5 * 60 * 1000)
    const newUser = new User ({
        name,
        email,
        password: hashedPassword,
        otp, 
        otpExpiry
    })
    await newUser.save()

    sendEmail (
       email,
       'Acccount Verification',
       `Your OTP for account verification is ${otp} and expires on ${otpExpiry}`
    )
    return res.status(201).json({message:'account created successfully', otp})
};

const login = async (req, res) => {
    const {email, password} = req.body
    if (!email || !password) {
        return res.status(400).json('all fields required')
    }
    const user = await User.findOne({email})
    if (!user) {
        return res.status(404).json('user not found')
    }
    if (!user.isVerified) {
        return res.status(401).json('Please verify your account')
    }
    const comparePassword = await bcrypt.compare(password, user.password)
    if(!comparePassword) {
        return res.status(401).json('invalid credentials')
    }
    const token = await jwt.sign({userId: user._id, role: user.role}, process.env.JWT_SECRET, 
    {expiresIn: '1h'})
    return res.status(200).json({message: 'login successful', token})
};

const verifyOtp = async (req, res) => {
    const {otp} = req.body
    try {
        if (!otp) {
            return res.status(400).json('otp is required')
        }
        const user = await User.findOne({otp});
        if (!user) {
            return res.status(404).json('account not found')
        };
        if (user.otpExpiry<new Date()) {
            return res.status(400).json('expired otp')
        };
        user.otp = null;
        user.otpExpiry =null;
        user.isVerified = true;
        await user.save()
        return res.status(200).json('account verification successful')
    } catch (err) {
        console.error('account verification error', err)
        return res.status(500).json('server error')  
    }
};

const resendOtp = async (req, res) => {
    const {email} = req.body
    try {
        if (!email) {
            return res.status(400).json('email is required')
        };
        const user = await User.findOne({email})
        if(!user) {
            return res.status(404).json('account not found')
        };
        const otp = Math.floor(100000 + Math.random() * 900000);
        const otpExpiry = new Date (Date.now() + 5 * 60 * 1000);
        user.otp = otp,
        user.otpExpiry = otpExpiry,
        await user.save();

        sendEmail(
            email,
            'OTP resend',
            `Your new otp for account verification is ${otp}, expires on ${otpExpiry}`
        )
        return res.status(200).json({message: 'otp resent successfully', otp})        
    } catch (err) {
        console.error('otp resend failed', err)
        return res.status(500).json('server error')        
    }
};

const getAllUsers = async (req, res) => {
    const {role} = req.user
    try {
        if (role !=='admin') {
            return res.status(403).json({message: 'Access denied'});
        }
        const users = await User.find().select('-password -otp -otpExpiry')
        return res.status(200).json(users)
    } catch (err) {
        console.error('error', err)
        return res.status(500).json('server error')
    }
};

const updateRole = async (req, res) => {
    const {role} = req.user
    try {
        if (role !=='admin') {
            return res.status(403).json({message: 'Access denied'});
        }
        const {userId} = req.params
        const updatedUser = await User.findByIdAndUpdate (userId, {role: 'admin'},
            {new: true})
        if (!updatedUser) {
            return res.status(404).json({message: 'user not found'})
        }
        return res.status(200).json(`${updatedUser.name} is now an admin`)
    } catch (err) {
        console.error('error', err)
        return res.status(500).json('server error')
    }
}

module.exports = {signUp, login, verifyOtp, resendOtp, getAllUsers, updateRole}