require('express-validator')
const { Router } = require('express');
const { check } = require('express-validator');
const { cargarArchivo, actualizarImagen, mostrarImagen, actualizarImagenCloudinary, mostrarImagenCloudinary } = require('../controllers/upload.controllers');
const  {validarCampos}  =         require('../middlewares/validar-campos');
const { validarArchivoSubir } =   require('../middlewares/validar-archivo');
const { coleccionesPermitidas } = require('../helpers/db-validators');

const router=Router();

             //Ejecuto metodo que sube archivo         

router.put('/:coleccion/:id', [                              //Editar, recibo la colección y el ID
    check('id','El id debe de ser de mongo').isMongoId(),    //Valido ID mongo
    check('coleccion').custom(
        c=>coleccionesPermitidas(c,['products'])),//Valido si las colecciones son permitidas
    validarArchivoSubir,                                      //Valido archivo en el body
    validarCampos
    ],actualizarImagenCloudinary)


module.exports= router;