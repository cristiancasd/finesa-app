const path            =  require("path")
const fs              =  require('fs')
const { response }    =  require("express");
const {subirArchivo}  =  require('../helpers/subir-archivo');
const usuario         =  require("../models/user");
const producto        =  require("../models/product");

const cloudinary =require('cloudinary').v2;
cloudinary.config(process.env.CLOUDINARY_URL);

require("colors");

const cargarArchivo= async(req,res=response)=>{

    try{    
      const pathCompleto=await subirArchivo(req.files,undefined,'img') 
      res.json({
        nombre: pathCompleto 
      })
    }
    catch(err){
      res.status(400).json({err})
    }   
} 


const actualizarImagenCloudinary= async (req,res=response)=>{
  console.log('estoy en actualizaImagenCloudinary');
  const {id, coleccion} = req.params; 


  let modelo;

  switch(coleccion){
    case 'usuarios':
      modelo = await usuario.findById(id);  
      if(!modelo){                          
        return res.status(400).json({
          msg:`No existe un usuario con el id ${id}`
        });
      }
      break;      
    case 'products':
      modelo = await producto.findById(id);   
    
      if(!modelo){                           
        return res.status(400).json({
          msg:`No existe un producto con el id ${id}`
        });
      }
      break;
    default:
      return res.status(500).json({msg:'Se me olvidó validar esto 3'}); 
  }

  
  if(modelo.img){ 
    const nombreArr=modelo.img.split('/');
    const nombre=nombreArr[nombreArr.length-1];
    const [public_id] = nombre.split('.');
    cloudinary.uploader.destroy(public_id);
  }

  const{tempFilePath}=req.files.archivo
  const {secure_url} = await cloudinary.uploader.upload(tempFilePath)
  modelo.img=secure_url;
  await modelo.save();  
  console.log('Salvo modelo')
  res.json(modelo);          
}



module.exports={
    cargarArchivo,
    actualizarImagenCloudinary,
}