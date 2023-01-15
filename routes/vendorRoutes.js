const express = require('express');
const vendorRoutes = express();

const bodyParser = require('body-parser')

vendorRoutes.use(bodyParser.json());
vendorRoutes.use(bodyParser.urlencoded({ extended: true }));

const multer = require('multer');
const path = require('path');

vendorRoutes.use(express.static('public'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../public/vendor_IDProof'), (error, success) => {
            if (error) throw error
        })
    },
    filename: (req, file, cb) => {
        const name = file.originalname;
        cb(null, name, (error, success) => {
            if (error) throw error
        })
    },
})

const upload = multer(
    {
        storage: storage,
        fileFilter: function (req, file, callback) {
            var ext = path.extname(file.originalname);
            if (ext !== '.pdf') {
                return callback(null, false)
            }
            callback(null, true)
        },
    }
);


const vendorController = require('../controllers/vendorController');
vendorRoutes.post('/vendorRegister', upload.single('id_proof'), vendorController.registerVendor);

// login vendor route
vendorRoutes.post('/vendorLogin', vendorController.loginVendor);

// reset password vendor route
vendorRoutes.post('/vendor_resetPassword', vendorController.resetPasswordVendor);
vendorRoutes.patch('/vendor_setNewPassword', vendorController.setNewPasswordVendor);


module.exports = vendorRoutes;