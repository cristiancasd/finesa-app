const {Schema,model}=require('mongoose');

const ProductSchema= Schema({
    nameProduct:{
        type:String,
        required:[true,'el Nombre es obligatorio'],
        unique:true
    },
    productState:{
        type:Boolean,
        default:true,
    },    
    price:{
        type: Number,
        default:0
    },
    description:{
        type:String,
        default:""
    },
    available:{
        type:Boolean,
        default:true
    },
    img:{
        type:String,
        default:""
    },    
    
    userProduct:{ //Usuario que crea el producto
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }
});

ProductSchema.methods.toJSON = function() {
    const { __v, productState, ...data  } = this.toObject();
    return data;
}

module.exports=model('Product', ProductSchema);