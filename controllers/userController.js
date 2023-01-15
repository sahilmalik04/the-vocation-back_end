const sendMail = require('../common/sendMail');
const userModel = require("../models/userModel")

const registerUser = async (req, res) => {
    try {
        const userRegData = new userModel({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            city: req.body.city,
            country: req.body.country,
            phone: req.body.phone,
            type: 'user'
        })

        const isExist = await userModel.findOne({ email: req.body.email })
        if (isExist) {
            res.status(409).send({ success: false, data: "oops! user already registered" });
        }
        else {
            const save = await userRegData.save();
            res.status(200).send({ success: true, data: save });
        }

    }
    catch (error) {
        res.status(400).send({ success: false, data: error.message })
    }
}

const loginUser = async (req, res) => {
    try {
        let email = req.body.email;
        let password = req.body.password;

        const emailExist = await userModel.findOne({ email: email });

        if (emailExist) {
            var loginUserData = {
                _id: emailExist._id,
                first_name: emailExist.first_name,
                last_name: emailExist.last_name,
                email: emailExist.email,
                type: ''
            }
            if (emailExist.email === 'admin@gmail.com') {
                loginUserData.type = 'admin'
            }
            else {
                loginUserData.type = 'user'
            }
            if (emailExist && password !== emailExist.password) {
                res.status(401).send({ success: false, data: "password is incorrect, please try again" });
            }
            else {
                res.status(200).send({ success: true, data: loginUserData });
            }
        }
        else {
            res.status(404).send({ success: false, data: "email not found" });
        }
    }
    catch (error) {
        res.status(400).send({ success: false, data: error.message })
    }
}

const resetPasswordUser = async (req, res) => {
    try {
        let forgotmail = req.body.email;

        const isExist = await userModel.findOne({ email: forgotmail });

        if (isExist) {
            const html = `<div style="padding: 5px"> Hi, <br></br> You can use the following link below to reset your password <br></br> <a href="http://localhost:3000/user_resetPassword_3/${isExist._id}">Reset Password</a> <br></br><br></br>Thanks, <div>Team TheVocation</div> </div>`
            const subject = 'user-reset-password'

            const result = await sendMail(forgotmail, html, subject);
            if (result.success === true) {
                res.status(200).send({ success: true, data: "email has been sent successfully" });
            }
            else{
                res.status(400).send(result);
            }
        } else {
            res.status(404).send({ success: false, data: "email does't exist" });
        }
    }
    catch (error) {
        res.status(400).send({ success: false, data: error.message });
    }
}

const setNewPasswordUser = async (req, res) => {
    try {
        const _id = req.body._id;
        const new_password = req.body.new_password;

        const isExist = await userModel.findById({ _id: _id })

        if (isExist) {
            const setNew = await userModel.findByIdAndUpdate(
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
        res.status(400).send({ success: false, data: error.message });
    }
}

module.exports = {
    registerUser,
    loginUser,
    resetPasswordUser,
    setNewPasswordUser
}