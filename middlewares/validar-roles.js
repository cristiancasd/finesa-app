const esAdminRole = (req,res,next)=>{
    if (!req.user){
        return res.status(500).json({
            msg: 'Se quiere verificar el rol sin el token'
        })
    }
    const {rol,name}=req.user;
    if (rol!=='ADMIN_ROLE'){
        return res.status(401).json({
            msg: ('El usuario no es es administador' )
        })
    }
    req.user;
    next();
}


const tieneRole = (...roles)=>{                            
    return(req,res,next)=>{                                 
        if (!req.user){
            return res.status(500).json({
                msg: 'Se quiere verificar el rol sin el token'
            })
        }
        if(!roles.includes(req.user.rol)){
            return res.status(401).json({
                msg:`El Role ${req.user.rol} no es autorizado, debe de de ser ${roles} `
            })
        }
        next()
    }
}
module.exports={
    esAdminRole,
    tieneRole
}


