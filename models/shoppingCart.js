const {Schema,model}=require('mongoose');

const ShoppingSchema= Schema({
    date:{
        type:String,
        required:[true,'La fecha es obligatoria'],
    },

    time:{
        type:String,
        required:[true,'La Hora es obligatoria'],
    },

    arraySale:{
        type:Array,
        required:[true,'El vector es obligatorio'],
    },

    carState:{
        type:Boolean,
        default:true,
    },       
    
    userCart:{ 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required:true
    }
});

ShoppingSchema.methods.toJSON = function() {
    const { __v, _id, ...data  } = this.toObject();
    data.uid=_id
    return data;
}

module.exports=model('Cart', ShoppingSchema);