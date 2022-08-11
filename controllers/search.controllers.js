
const { response } = require("express");
const Cart=require('../models/shoppingCart');

const ObjectId = require('mongoose').Types.ObjectId;

const coleccionesPermitidas=['shoppingcart'];

const searchShoppingCart=async(req, res=response)=>{

    let{start='1000-10-10', end='5000-10-10', userCart=''}=req.query; 
    
    //Creo las fechas
    if (start!='1000-10-10')   start=new Date(start);
    if (end  !='5000-10-10')   end  =new Date(end);
    
    //Validaciones
    if (start=='Invalid Date' || end=='Invalid Date') return res.status(400).json({
        msg:'Fechas incorrectas'
    })
    if (!ObjectId.isValid(userCart) && userCart!='') return res.status(400).json({
        msg:'No es un mongo id para el usuario'
    })
    
    //  Busqueda Fechas y usuarios  
    if (userCart!=""||start!='1000-10-10'||end !='5000-10-10'){
        let cartDay=[];
        (userCart=="")
            ?  cartDay=await Cart.find({"datePrueba" :{"$gte" : start, "$lte" : end}})
            :  cartDay=await Cart.find({                 
                $or: [{"datePrueba" :{"$gte" : start, "$lte" : end}}],                
                $and: [{carState:true},{"userCart" : userCart}]
            });
                
                /*  //Otra manera de hacerlo
                $and:
                    [
                        {"datePrueba" :{"$gte" : start, "$lte" : end}},
                        {"userCart" : userCart}
                    ]
                    */
                //}        
        
        return res.json({
            total:(cartDay) ? cartDay.length : 0,
            results:(cartDay) ? [cartDay] : []
        })
    } 
    
    console.log('NO HAY PARAMETROS usuario, fecha de inicio o fin')
    
    //Todo ... buscar por nombre de producto dentro de arreglo arraySale
    let{buscar=''}=req.query; 
    console.log('buscar ',buscar)
    const regex = new RegExp(buscar,'i');    
    const cartDay=await Cart.find({
        $or: [{date:regex}], //varias opciones de busqueda
        //$or: [{arraySale: [{'pedido':{regex}            
        //    }]}], //varias opciones de busqueda
        $and: [{carState:true}]
    });
    //console.log(cartDay)
    res.json({
        total: cartDay.length,       
        results:cartDay
    })
}



const searchDB=async (req,res=response)=>{   
    
    const {coleccion,termino}=req.params;
    console.log('la coleccion es .. ',coleccion)
    if (!coleccionesPermitidas.includes(coleccion)){
        return res.status(400).json({
            msg: `Las colecciones permitidas son: ${coleccionesPermitidas}`
        })
    }
    switch(coleccion){       

        case 'shoppingcart':
            searchShoppingCart(req,res)
        break;

        default:
            return res.status(400).json({
                msg: `No está definido el caso`
            })
    }
}
module.exports={
    searchDB,
}