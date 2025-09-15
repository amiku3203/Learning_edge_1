const mongoose= require("mongoose");


const connectDb= async ()=>{
   
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Congrats You are Connectd to Database =>")
    } catch (error) {
        console.log("Erro",error);
        return;
    }


}

module.exports=connectDb;