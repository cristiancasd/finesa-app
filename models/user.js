const { Schema, model } = require("mongoose");

//Objetos con las caracteristicas del usuario
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
        enum:['ADMIN_ROLE','USER_ROLE',"VENTAS_ROLE"]
    },
    userState:{ //Cuando cree un usuario va a estar activado
        type:Boolean, 
        default:true// cuando se elimina el usuario pasa a false
    },
    google:{
        type:Boolean,
        default: false
    }
    
});

//Ocultar la clave y la versión de la respuesta del backend
//retornamos es información si se necesita
UserSchema.methods.toJSON = function() {
    const {__v, password,_id, ...user}=this.toObject();      //Retiramos el id , password, _v de la variable usuario
    user.uid=_id;                                            //renombro _id a uid
    return user;
}

//MOnggole por defecto coloca por defecto a la colección
//una S ... es decir será Usuarios
module.exports=model('User',UserSchema);