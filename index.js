const express = require("express");
const app = express();
const cors = require('cors');
app.use(cors());

require("./db/db_config");


// user routes
const userRoutes = require("./routes/userRoutes");
app.use('/api', userRoutes);

// vendor routes
const vendorRoutes = require('./routes/vendorRoutes');
app.use('/api', vendorRoutes);


app.listen('3005', ()=>{
    console.log("server has been started");
})