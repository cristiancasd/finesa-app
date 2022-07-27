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

const ObtenerProductoID=async(req, res=response) =>{
    const {id}=req.params;
    const producto=await Product.findById(id).populate('user','nameProduct')
    res.json(producto);
}

const actualizarProducto =  async (req, res) =>{
    console.log('actualizarProducto')
    console.log('recibo el request ..',req.params)                                                     
    const {id}=req.params;                     
    const {stateProduct, ...data}=req.body;                                                 
    data.nameProduct=data.nameProduct.toUpperCase();     


    console.log('lo que guardo es  el request ..'.green,id, data, {new:true})     

    const producto=await Product.findByIdAndUpdate(id, data, {new:true});

    res.json(producto);

}


const crearProducto= async (req, res=response) => {


    
    let  {productState, user, nameProduct,  ...resto}=req.body
    
    nameProduct = nameProduct.toUpperCase();                  
                
       
    console.log('Producto que quiero guardar'.green,nameProduct)


 
    const data={  
        nameProduct,
        ...resto,
        userProduct:req.user._id,
    }


    const producto=new Product(data);
    
    
    await producto.save();

    res.status(201).json(producto);
}

const productoDelete = async (req, res) =>{

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
    productoDelete,
}