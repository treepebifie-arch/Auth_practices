const flutterwave = require ('flutterwave-node-v3');
const User = require('../Models/user.models');


//create Redirect link URL with flutterwave

const createRedirectUrl = async (req,res) => {
    const {userId} = req.user
    try {
        const {amount, currency, redirect_Url} = req.body;
        if (!userId){
            return res.status(400).json({message: 'User Id required'})
        };
        if (!amount || !currency || !redirect_Url) {
            return res.status(400).json({message: 'all fields are required'})
        };
        // get users details for the payment
        const user = await User.findById ({userId})
        if (!user) {
            return res.status(404).json ({message: 'user not found'})
        };
        //generate unique transaction reference
        const txRef = `Tx-${Date.now()}-${userId}`;
        //Initialize flutterwave
        const flw = new flutterwave (
            process.env.FLW_PUBLIC_KEY,
            process.env.FLW_SECRET_KEY
        );
        //create Payment Payload for Flutterwave
        const payload = { 
            tx_ref: txRef,
            amount: amount,
            currency: currency,
            redirect_Url: process.env.RE_URL,
            customer: {
                email: user.email,
                phoneNumber: user.phoneNumber,
                name: user.name
            },
            customizations: {
                title: 'Wallet funding',
                description: 'Fund your Wallet'
            },
        }

        // generate hosted payment link
        const response = await axios.post (
            'https://api.flutterwave.com/v3/payments',
            payload,
            {
                headers: {
                Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
                'content-Type': 'application/json'
            },
        } );
        return res.status(201).json({
            message: 'Payment link created successfully',
            paymentLink: response.data.data.link,
            txRef: txRef,
        })
    } catch (err) {
        console.error('redirect Url error', err)
        return res.status(500).json({message: 'server error'})
    }
}

module.exports = {createRedirectUrl}