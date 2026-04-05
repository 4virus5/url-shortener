const mongoose = require('mongoose')
const dbConnect = async ()=>{
    try{
        console.log(`Attempting to connect to MongoDB. MONGO_URI is ${process.env.MONGO_URI ? 'defined' : 'UNDEFINED'}`);
        await mongoose.connect(process.env.MONGO_URI, {
            serverSelectionTimeoutMS: 5000 // Fail after 5 seconds instead of hanging
        })
        console.log('Mongo DB Connected Success')
    } catch(error){
        console.error(`Error Connecting with Mongo: ${error.message}`)
        process.exit(1)
    }
}
module.exports = dbConnect

