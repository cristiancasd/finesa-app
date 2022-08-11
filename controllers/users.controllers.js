const bcryptjs=require('bcryptjs');
const { query } = require('express');
const { validationResult } = require('express-validator');
const { response } = require('express');



require('colors')


const User=require('../models/user');
const { sendEmail } = require('../helpers/sendEmail');


const usersGet=async (req,res=response)=>{
    const{limite=5000, desde=0}=req.query;                   //recibo los parametros en el enlace

    const [total,users] = await Promise.all([
        User.countDocuments({userState:true}),
        User.find({userState:true})                         //La condición retorna solo los que esten en true
            .skip(Number(desde))                             //Metodo ya incluido
            .limit(Number(limite))                           //Metodo ya incluido
    ]);
    
    res.json({                                                //La respuesta es una colección de dos respustas
        total,
        users
    });    
}

const userPost=async (req,res=response)=>{
    let respEmail='valor inicial'
    const {name,email,password, rol} = req.body
    const user=new User({name,email,password, rol});
    
    const passwordCrypt=bcryptjs.genSaltSync();
    user.password=bcryptjs.hashSync(password,passwordCrypt);
    await user.save();
    
    try{
        respEmail=await sendEmail({name,email,password, rol})
        console.log('respEmail ',respEmail)
    }catch(err){
        console.log(err);
        respEmail=err
    }
    
    res.json({
        msg:'New User',
        user,
        emailResponde: respEmail
    })    
}

const usersPut =  async (req, res) =>{
                                                              
    const {id}=req.params;                                //http://localhost:8080/api/usuarios/12  //id va a ser 12 
    const {_id, password, google,email, ...resto}=req.body; //no podemos recibir _id nuevo ya que este no se puede actualizar, resto no contiene los datos ahí establecidos                                                           
    
    if (password){                                          //Encriptar contraseña       
        const passwordCrypt = bcryptjs.genSaltSync();
        resto.password=bcryptjs.hashSync(password,passwordCrypt)     //resto ahora incluye el password encriptado
    }        
    const user=await User.findByIdAndUpdate(id,resto) //Actualiza los datos del id establecido
    res.json({    
        user
    });
}

const usersDelete = async (req, res) =>{
    const {id} = req.params;
    const uid=req.uid;
    const usuarioAutenticado=req.user;
    console.log('voy a borrar id'.red, id)
    const user=await User.findByIdAndUpdate(id,{userState:false}) 
    res.json({user,usuarioAutenticado});
}


module.exports={
    usersGet,
    userPost,
    usersDelete,
    usersPut
}