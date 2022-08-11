const nodemailer=require('nodemailer');
//const { eventNames } = require('../models/user');

const sendEmail = ({email,name,password,rol}) => {
   
    return new Promise((resolve, reject)=>{
        
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth: {
                //user: 'crissdeveloperemail@gmail.com',
                //pass: 'iclglbftvwsrstnq'
                user: process.env.EMAILSEND,
                pass: process.env.PASSWORDMAIL
            }
        });

        let mailOptions={
            from:"Remitente App",
            to: email,
            subject:"enviado desde nodemailer",
            text:
            `Nuevo usuario  :${name}
            Correo:         ${email}
            Contraseña:     ${password}
            Rol:     ${rol}
            Nueva cuenta creada
            `
        }
            
        transporter.sendMail(mailOptions,
            (error,info)=>{                    
                (info)
                        ? resolve('Correo enviado correctamente a '+email)
                        : reject('Hubo un error, no se envío correo de confirmación')                        
                })
            }) 
}
module.exports={sendEmail}