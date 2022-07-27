const { response } = require("express");


const validarArchivoSubir=(req,res=response, next)=>{
    
    console.log('Estoy en validarArchivoSubir')
    if (!req.files || Object.keys(req.files).length === 0 || !req.files.archivo) {
        
        res.status(400).json({msg:'No hay archivos que subir-validarArchivoSubir'});
        console.log('retorno por error')
      
    }

  
        const nombreCortado = req.files.archivo.name.split('.'); 
        const extension = nombreCortado[nombreCortado.length-1] 
        const extensionesValidas=['png','jpg','jpeg','gif']
        
        if(!extensionesValidas.includes(extension)){
            res.status(400).json({msg:`La extensión ${extension} no es permitida, debe ser: ${extensionesValidas}`});
            return;
        }   
    
    
        



    next()
}
module.exports={
    validarArchivoSubir
}