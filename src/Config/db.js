const mongoose = require ('mongoose')

const dbConnection = async () => {
    try {
        await mongoose.connect (process.env.MONGO_URI)
        console.log ('database connected successfully')
    } catch (err) {
        console.error(' database not connected', err)
        process.exit (1)
    }
};



module.exports = dbConnection;