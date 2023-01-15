const mongoose = require('mongoose');

const vendorModel = mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },
    sub_type: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    id_proof: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    authorized:{
        type:Boolean,
        Request: true
    }
})

module.exports = mongoose.model('vendor', vendorModel);