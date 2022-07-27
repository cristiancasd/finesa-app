const jwt = require("jsonwebtoken");    //Paquete generar JWT

const generarJWT = (uid='') => {
    return new Promise((resolve, reject)=>{
        const payload={uid};
        //llave secreta que si alguien la conoce puede firmar tokens como si ustedes liohubieran creado en su backend
        //Por ende lo creo en mi .env

        //Instrucción para crear un JWT
        jwt.sign(payload,process.env.SECRETOPRIVATEKEY,{
            expiresIn: '4h'     // Escoger cuanto dura el JWT
        }, (err,token)=>{
            if(err){
                console.log(err)
                reject('NO se pudo generar el token')
            }else{
                resolve(token);
            }
        })
    })
}

module.exports={
    generarJWT
}