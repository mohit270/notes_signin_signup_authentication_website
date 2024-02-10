const mongoose = require('mongoose');
mongoose.set('strictQuery',false);
const connectDB = async()=>{
    try{
        const connect = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`congrasulation Your Database Connected : ${connect.connection.host}`);
    }catch(error){
        console.log(`Sorry Your Database Failed To Connected :${error}`);
    }
}
module.exports = connectDB;