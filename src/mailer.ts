import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

import CryptoJS from 'crypto-js';
import * as fs from 'fs';

export class Mailer
{
    private static user = process.env.MAILER_ADDRESS;
    private static pass = process.env.MAILER_PASS;

    private static transporter: Mail = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 587,
        secure: false,
        requireTLS: true,
        service: 'gmail',
        auth: {
            user: Mailer.user,
            pass: Mailer.pass,
        },
    });

    static async sendEmail(userEmail: string)
    {
        var symmetricKey  = fs.readFileSync('./keys/symmetric.key', 'utf8');
        var activationToken = CryptoJS.AES.encrypt(userEmail, symmetricKey).toString().replaceAll('+','xMl3Jk').replaceAll('/','Por21Ld').replaceAll('=','Ml32');

        var mailOptions = {
            from: Mailer.user,
            to: userEmail,
            subject: 'Attiva il tuo account URental',
            text: 'http://' + process.env.SERVER_HOST + ':' + process.env.SERVER_PORT + '/users/activate?token=' + activationToken
        };

        Mailer.transporter.sendMail(mailOptions, function(error, info){
            if (error)
                console.log(error);
        });
    }
}
