const mongoose = require('mongoose')
const dbConnect = async ()=>{
    try{
        await mongoose.connect(process.env.MONGO_URI)
        console.log('Mongo DB Connected Success')
    } catch(error){
        console.log(`Error Connecting with Mongo: ${error.message}`)
        process.exit(1)
    }
}
module.exports = dbConnect

