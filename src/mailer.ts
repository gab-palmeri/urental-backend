import nodemailer from "nodemailer";
import Mail from "nodemailer/lib/mailer";

import CryptoJS from 'crypto-js';
import * as fs from 'fs';

export class Mailer
{
    private static user: string;
    private static pass: string;
    private static transporter: Mail;

	static init()
	{
		Mailer.user = process.env.MAILER_ADDRESS;
		Mailer.pass = process.env.MAILER_PASS;

		Mailer.transporter = nodemailer.createTransport({
			host: 'smtp.gmail.com',
			port: 587,
			secure: true,
			requireTLS: true,
			service: 'gmail',
			auth: {
				user: Mailer.user,
				pass: Mailer.pass,
			},
    	});
	}

	static async sendActivationMail(userEmail: string)
    {
        var symmetricKey  = fs.readFileSync('./keys/symmetric.key', 'utf8');
        var activationToken = CryptoJS.AES.encrypt(userEmail, symmetricKey).toString().replaceAll('+','xMl3Jk').replaceAll('/','Por21Ld').replaceAll('=','Ml32');

        var mailOptions = {
            from: Mailer.user,
            to: userEmail,
            subject: 'Attiva il tuo account URental',
            text: 'http://' + process.env.CLIENT_HOST + ':' + process.env.CLIENT_PORT + '/activate/' + activationToken
        };

        Mailer.transporter.sendMail(mailOptions, function(error, info){
            if (error)
                console.log(error);
        });
    }

	static async sendBookingMail(userEmail: string, message:string) {
		
		var mailOptions = {
			from: Mailer.user,
			to: userEmail,
			subject: 'Il tuo noleggio su urental',
			text: message
		};

		Mailer.transporter.sendMail(mailOptions, function (error, info) {
			if (error)
				console.log(error);
		});
	}
}
