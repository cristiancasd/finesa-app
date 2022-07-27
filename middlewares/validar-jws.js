const jwt = require('jsonwebtoken');
require('colors')

const User = require('../models/user');

const validarJWT= async (req,res,next)=>{
    const token=req.header('c-token');
    console.log('token: ',token);

    if(!token){
         return res.status(401).json({
             msg:'No hay token en la petición'
         });
    }
    try{ 
        const {uid}= jwt.verify(token,process.env.SECRETOPRIVATEKEY); 

        const user=await User.findById(uid);        
        
        if(!user){ 
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en BD'
            })
        }        
        if(!user.userState){ 
            return res.status(401).json({
                msg: 'Token no válido - usuario ya fue eliminado'
            })
        }
        
        req.user=user;
        req.uid=uid; 
        next()
    }catch(error){
        
        res.status(401).json({
            msg:'Token no válido'
        })
    }
}

module.exports={
    validarJWT
}