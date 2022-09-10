import config from 'config';
import nodemailer, { SendMailOptions } from 'nodemailer';

const smtp = config.get<{
  user: string,
  pass: string,
  host: string,
  port: number,
  secure: boolean
}>('smtp');

const transporter = nodemailer.createTransport({
  ...smtp,
  auth: { user: smtp.user, pass: smtp.pass }
})

async function sendEmail(payload: SendMailOptions) {
  transporter.sendMail(payload, (err, info) => {
    if(err) {
      console.log(err, "Email sending error");
      return;
    }
    console.log(`Email preview URL: ${nodemailer.getTestMessageUrl(info)}`);
  })
}

export default sendEmail;