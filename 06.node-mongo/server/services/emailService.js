const transporter = require("../config/email");

const sendEmail = async (to, subject, html) => {
    try {
        const info = await transporter.sendMail({
            from: `"ShopApp" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html
        });

        console.log("Email sent:", info.messageId);
    } catch (error) {
        console.log("Email error:", error.message);
    }
};

module.exports = sendEmail;