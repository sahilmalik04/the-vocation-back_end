const vendorModel = require('../models/vendorModel');
const sendMail = require('../common/sendMail');

const registerVendor = async (req, res) => {
    try {
        const regData = new vendorModel({
            fullName: req.body.fullName,
            sub_type: req.body.sub_type,
            email: req.body.email,
            password: req.body.password,
            id_proof: req.file.filename,
            type: 'vendor',
            authorized: false
        })

        // console.log(regData)
        const isExist = await vendorModel.findOne({ email: req.body.email });

        if (isExist) {
            res.status(409).send({ exist: false, data: "oops! user already registered with this mail" });
        }
        else {
            const save = await regData.save();
            res.status(200).send({ success: true, data: save });
        }
    }
    catch (error) {
        res.status(400).send({ file: false, data: "pdf files allowed only" });
    }
}

const loginVendor = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        const emailExist = await vendorModel.findOne({ email: email });

        if (emailExist === null) {
            res.status(404).send({ success: false, data: "email not found" });
        }
        else {
            var loginVendorData = {
                _id: emailExist._id,
                fullName: emailExist.fullName,
                email: emailExist.email,
                type: emailExist.type,
                authorized: emailExist.authorized
            }
            if (emailExist && password !== emailExist.password) {
                res.status(401).send({ success: false, data: "password is incorrect, please try again" });
            }
            else if (emailExist.authorized === false) {
                res.status(401).send({ success: false, data: "your account is not verified yet! please wait till verified" });
            }
            else {
                res.status(200).send({ success: true, data: loginVendorData });
            }

        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const resetPasswordVendor = async (req, res) => {
    try {
        let forgotmail = req.body.email;

        const isExist = await vendorModel.findOne({ email: forgotmail });

        if (isExist) {
            const html = `<div style="padding: 5px"> Hi, <br></br> You can use the following link below to reset your password <br></br> <a href="http://localhost:3000/vendor_resetPassword_3/${isExist._id}">Reset Password</a> <br></br><br></br>Thanks, <div>Team TheVocation</div> </div>`
            const subject = 'vendor-reset-password'
            const result = await sendMail(forgotmail, html, subject);
            if (result.success === true) {
                res.status(200).send({ success: true, data: "mail has been sent successfully" });
            }
            else{
                res.status(400).send(result);
            }
        }
        else {
            res.status(404).send({ success: false, data: "email does't exist" });
        }
    }
    catch (error) {
        res.status(400).send(error.message);
    }
}

const setNewPasswordVendor = async (req, res) => {
    try {
        const _id = req.body._id;
        const new_password = req.body.new_password;

        const verifyOldPassword = await vendorModel.findById({ _id: _id })

        if (verifyOldPassword) {
            const setNew = await vendorModel.findByIdAndUpdate(
                { _id: _id },
                { $set: { password: new_password } }
            )
            if (setNew) {
                res.status(200).send({ success: true, data: "password has been updated successfully, now you can login" })
            }
        }
        else {
            res.status(404).send({ success: false, data: "user id doesn't exist" });
        }
    }
    catch (error) {
        res.status(400).send(error.message)
    }
}

module.exports = {
    registerVendor,
    loginVendor,
    resetPasswordVendor,
    setNewPasswordVendor
}

