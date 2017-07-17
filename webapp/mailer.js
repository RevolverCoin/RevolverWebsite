var nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport('smtps://info@revolvercoin.org:fuPxg90CcPKtvv8tYO6L@smtp.gmail.com');
var mailer = {

    send: function (subject, text, html, callback) {

        var mailOptions = {
            from: '"RevolverCoin Team" <info@revolvercoin.org>',
            to: 'andy.sevens.777@gmail.com',
            subject:subject,
            text:text,
            html:html
        };

        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                console.log(error);
                return callback(error);
            }
            console.log('Message sent: ' + info.response);
            callback(null);
        });
    }
};

module.exports = mailer;

