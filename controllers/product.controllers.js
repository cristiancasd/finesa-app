const { response } = require("express");
const Product = require('../models/product');


require('colors')


const ObtenerProductos=async (req, res=response) => {
    console.log('estoy en ObtenerProductos')
    const {limite=115, desde=0}=req.query;
    
    const query={productState:true};
    
    const[total, productos]=await Promise.all([
        Product.countDocuments(query),
        Product.find(query)
            .populate('userProduct','name')
            .skip(Number(desde))
            .limit(Number(limite))
    ]);

    res.json({
        total,
        productos
    })
}

// ObtenerProductoID por id- populate{}
const ObtenerProductoID=async(req, res=response) =>{
    const {id}=req.params;
    const producto=await Product.findById(id).populate('user','name')
    res.json(producto);
}

//actualizarProducto
const actualizarProducto =  async (req, res) =>{
    console.log('actualizarProducto')
    console.log('recibo el request ..',req.params)                                                     
    const {id}=req.params;                     //Obtengo el ID del enlace, ya está validado
    const {stateProduct, ...data}=req.body; //No podemos actualizar el esatado ni el usuario. Solo la categoría                                                          
    data.nameProduct=data.nameProduct.toUpperCase();     


    console.log('lo que guardo es  el request ..'.green,id, data, {new:true})     

    const producto=await Product.findByIdAndUpdate(id, data, {new:true});

    res.json(producto);

}

const actualizarProductoEstado =  async (req, res) =>{
    console.log('actualizarProductoEstado ',req)                     
    const {id, ...data}=req
    console.log('la data sería ',data)
    console.log('lo que guardo es NEW el request ..'.red,id, data, {new:true})   
    const producto=await Product.findByIdAndUpdate(id, data, {new:true});

    throw new Error('existente')
}

const crearProducto= async (req, res=response) => {


    
    let  {productState, user, nameProduct,  ...resto}=req.body
    
    nameProduct = nameProduct.toUpperCase();                   // Recibo nombre de la categoría
                   // Recibo nombre de la categoría
       
    console.log('Producto que quiero guardar'.green,nameProduct)


 
    const data={                                                            // Objeto con categoría y ID usuario
        nameProduct,
        ...resto,
        userProduct:req.user._id,
    }


    const producto=new Product(data);
    
    
    await producto.save();

    res.status(201).json(producto);
}

//borrar producto - estado:false
const ProductoDelete = async (req, res) =>{

    const {id} = req.params;
    
    const usuarioAutenticado=req.user;    
    const productoDeleted=await Product.findByIdAndUpdate(id,{productState:false}) 
    res.json({productoDeleted,usuarioAutenticado});
}

module.exports={
    ObtenerProductos,
    ObtenerProductoID,
    actualizarProducto,
    crearProducto,
    ProductoDelete,
    actualizarProductoEstado
}