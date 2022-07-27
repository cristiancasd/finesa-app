require('express-validator')
const { Router } = require('express');
const { check } = require('express-validator');
const { actualizarImagenCloudinary} = require('../controllers/upload.controllers');
const  {validarCampos}  =         require('../middlewares/validar-campos');
const { validarArchivoSubir } =   require('../middlewares/validar-archivo');
const { coleccionesPermitidas } = require('../helpers/db-validators');

const router=Router();


router.put('/:coleccion/:id', [                              
    check('id','El id debe de ser de mongo').isMongoId(),    
    check('coleccion').custom(
        c=>coleccionesPermitidas(c,['products'])),
    validarArchivoSubir,                                    
    validarCampos
    ],actualizarImagenCloudinary)


module.exports= router;