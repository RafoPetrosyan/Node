import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: 'petrsoyanrafo0@gmail.com',
        pass: '',
    },
});

class Mail {
    static send(to, subject) {
       return transporter.sendMail({
            from: 'Rafo Petrosyan <petrsoyanrafo0@gmail.com>',
            to,
            subject,
            html: '<strong>Hello</strong>'
        })
    }
}

export default Mail;
