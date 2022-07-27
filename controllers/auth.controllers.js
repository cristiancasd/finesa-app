const User=require('../models/user')
const bcryptjs=require('bcryptjs');
const { generarJWT } = require('../helpers/generarJWT');
const { response } = require('express');
const { googleVerify } = require('../helpers/google-verify');
const { json } = require('express/lib/response');
require('colors')

const login=async (req,res)=>{

    const{email,password}=req.body;
    try{
        const user=await User.findOne({email});              
        if(!user){                                                  
            return res.status(400).json({
                msg:'Usuario / password no son correctos - email'
            })
        }
        if(user.false){                                             
            return res.status(400).json({
                msg:'El usuario ya fue eliminado'
            })
        }
        const validPassword=bcryptjs.compareSync(password,user.password); 
        if(!validPassword){                                            
            return res.status(400).json({
                msg:'Usuario / password no son correctos - Password'
            })
        }

        // Generar el JWT
        const token = await generarJWT(user.id)                    
        console.log('el token es ============================'.red, token);
        res.json({
            msg:'Login ok',
            user,
            token
        })
        
    }catch(error){
        console.log(error)
        res.status(500).json({  
            msg: 'Hable con el administrador'
        })
    }
}


const googleSignIn=async(req, res=response)=>{       
    
    const{id_token}=req.body;
    
    try{        
        
        const {correo:email, nombre:name} = await googleVerify(id_token) 

        let user=await User.findOne({email});

        if(!user){
            const data={
                name,
                email,
                password:'cualquiercosa',                
                google:true,
                rol:"ADMIN_ROLE"
            };

            user=new User(data);
            console.log('voy a guardar en mi DB al usuario ...'.red, user)
            await user.save();
        }

        if(!user.userState){
            console.log('El usuario tiene estado false');
            return res.status(401).json({
                msg:'Hable con el administrador, usuario bloqueado'
            });
        }

        const token=await generarJWT(user.id);
        console.log('TOKEN del usuario:  ',token);

        
        res.json({
            user,
            token
        })

    }catch(err){

        console.log('err es ... ',err);
        res.status(400).json({
            ok:false,
            msg:'El google token no se pudo verificar'
        })
    }
}

const renovarToken = async (req, res = response) =>{
    const {user} = req;
    const token = await generarJWT(user.id);

    res.json({
        user,
        token
    })
}

module.exports={
    login,
    googleSignIn,
    renovarToken
}