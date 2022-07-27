const { Schema, model } = require("mongoose");

const UserSchema = Schema({
    name:{
        type:String,
        required:[true, 'El nombre es obligatorio']    
    },
    email:{
        type:String,
        required:[true, 'El coreo es obligatorio'],
        unique:true  
    },
    password:{
        type:String,
        required:[true, 'La contraseña es obligatorio'],
    },
   
    rol:{
        type:String,
        required:true,
        enum:['ADMIN_ROLE','USER_ROLE',"SALE_ROLE"]
    },
    userState:{ 
        type:Boolean, 
        default:true
    },
    google:{
        type:Boolean,
        default: false
    }
    
});

//Ocultar la clave y la versión de la respuesta del backend
//retornamos es información si se necesita
UserSchema.methods.toJSON = function() {
    const {__v, password,_id, ...user}=this.toObject();      
    user.uid=_id;                                           
    return user;
}

module.exports=model('User',UserSchema);