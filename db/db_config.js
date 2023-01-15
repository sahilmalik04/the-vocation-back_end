const mongoose = require("mongoose");

const connect = mongoose.connect("mongodb://localhost:27017/TheVocation");

if(connect){
    console.log("db_connected");
}
else{
    console.log("error with db connectivity")
}