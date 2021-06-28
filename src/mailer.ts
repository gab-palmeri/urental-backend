import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

import CryptoJS from 'crypto-js';
import * as fs from 'fs';

export class Mailer
{
    private static user = "urental.mailer@gmail.com";
    private static pass = "dsffckkjrujjyjuw";

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
        var activationToken = CryptoJS.AES.encrypt(userEmail, symmetricKey).toString().replace('+','xMl3Jk').replace('/','Por21Ld').replace('=','Ml32');

        var mailOptions = {
            from: Mailer.user,
            to: userEmail,
            subject: 'Attiva il tuo account URental',
            text: 'http://localhost:7850/users/activate?token=' + activationToken
        };

        Mailer.transporter.sendMail(mailOptions, function(error, info){
            if (error)
                console.log(error);
        });
    }
}