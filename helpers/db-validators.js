
const Role=require('../models/rol');
const User=require('../models/user');
const Product=require('../models/product');
const Cart=require('../models/shoppingCart');


require('colors')

const esRoleValido=async(rol='')=>{  
    const existeRol = await Role.findOne({rol});
    if(!existeRol){
        throw new Error(' El rol no está registrado en la BD')
    }
}
const emailExiste=async(email='')=>{
    //Comprobar si el correo existe
  const existeEmail=await User.findOne({email});
  console.log('email ----'.green,email);
  console.log('existeEmail ----'.green,existeEmail)
  if(existeEmail){
    throw new Error('Ya se está usando el correo')
  }
}
const existeUsuarioId=async(id)=>{
  const existeUsuario = await User.findById(id);
  if (!existeUsuario){
    throw new Error('El id no existe')
  }
}


const existeProducto=async(product)=>{

  console.log('estoy en existeProducto'.yellow)
  
  let productUpper=product.toUpperCase();

  const query = { nameProduct: productUpper };
  console.log('Buscar si ya exite el producto'.yellow, query)

  let productoDb = await Product.findOne(query);
  console.log('productoDb es'.red, productoDb);

  if(productoDb){
    console.log('condicional')
    console.log(`Helper... El producto ${product}, ya existe`.yellow)
    throw new Error(`Helper... El producto ${product}, ya existe`)  
  }

  console.log(`Helper... El producto ${product}, No existe vamos a crearlo`.yellow)




}
const existeProductoPorID=async(id)=>{
  console.log('existeProductoPorID')
  console.log('id',id)
  const existeProd = await Product.findById(id);
  console.log('existeProd',existeProd)
  if (!existeProd){
    throw new Error('El id no existe en la base de datos')
  }
}

const coleccionesPermitidas=(coleccion='',colecciones=[])=>{
  console.log('estoy en coleccionesPermitidas')
  console.log('estoy en coleccion',coleccion, colecciones)
  const incluida = colecciones.includes(coleccion);
  if(!incluida){
    throw new Error(`La coleccion ${coleccion} no es permitida, ${colecciones}`)
  }
  console.log('voy a retornar')
  //next()//para que siga con el siguiente middlewares
  return true;
}


const diaExiste=async(date='')=>{
  //Comprobar si el correo existe
  const existeDia=await Cart.findOne({date});
  console.log('Dia ----'.green,date);
  console.log('existeDia----'.green,existeDia)
  if(existeDia){
    throw new Error('Ya se hay un arreglo-día guardado')
  }
}

const existeVentaId=async(id)=> {
  const existeVenta = await Cart.findById(id);
  if (!existeVenta){
    throw new Error('El id no existe en la base de datos')
  }
}

module.exports={
    esRoleValido, 
    existeUsuarioId,
    emailExiste,
    existeProducto,
    existeProductoPorID,
    coleccionesPermitidas,
    diaExiste,
    existeVentaId

}
