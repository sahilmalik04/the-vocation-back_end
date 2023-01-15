const nodemailer = require('nodemailer');


const sendMail = async (forgotmail, html, subject) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        // host: 'smtp.gmail.com',
        port: 25,
        auth: {
            user: 'sahilmalik15.sm@gmail.com',
            pass: "xhmaxlascipnbiiq"
        }
    })

    let mailOptions = {
        from: 'sahilmalik15.sm@gmail.com',
        to: forgotmail,
        subject: subject,
        html: html
    }
    try {
        let info = await transporter.sendMail(mailOptions)
        if (info) {
            return { success: true }
        }
    } catch (error) {
        if (error) {
            return { success: false, error: error }
        }
    }

}
module.exports = sendMail;