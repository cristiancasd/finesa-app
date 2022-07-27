const { query } = require('express');
const Cart=require('../models/shoppingCart');
require('colors')


const ventasGet = async (req, res) =>{
    console.log('estoy en ventasGet')

    const{limite=5000, desde=0}=req.query;                 

    const [total,ventas] = await Promise.all([
        Cart.countDocuments({carState:true}),
        Cart.find({carState:true})                       
            
    ]);
 
    
    
    res.json({                                               
        total,
        ventas
    });
};

const ventasPost = async (req, res) =>{


    console.log('voy a crar un arreglo de ventas');    

    let {user, ...resto} = req.body    

    const data={    
        ...resto,
        userCart:req.user._id,
    }


    const venta= new Cart(data);   
    await venta.save();
    console.log('venta salvado');
    res.json({
        msg:'post API',
        venta
    });
    
} 


module.exports={
    ventasGet,
    ventasPost  ,
}