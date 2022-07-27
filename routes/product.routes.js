require('express-validator')
const { Router } = require('express');
const { check } = require('express-validator');
const { crearProducto, actualizarProducto, productoDelete, ObtenerProductos, ObtenerProductoID } = require('../controllers/product.controllers');
const { existeProducto, existeProductoPorID } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jws');
const { esAdminRole } = require('../middlewares/validar-roles');

const router=Router();

router.get('/',ObtenerProductos);


router.get('/:id',[
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorID),  
    validarCampos   
],
ObtenerProductoID); 



router.post('/',[
    validarJWT,  
    esAdminRole,  
    check('nameProduct','EL nombre es obligatorio').not().isEmpty(),
    check('nameProduct').custom(existeProducto),
    validarCampos
], crearProducto);

router.put('/:id',[
    validarJWT,  
    esAdminRole,  
    check('id','No es un ID válido').isMongoId(),
    check('id').custom(existeProductoPorID), 
    check('nameProduct','el nombre es obligatario').not().isEmpty(),
    validarCampos
],
actualizarProducto);


router.delete('/:id',[ 
    validarJWT,                                    
    esAdminRole,                                   
    check('id','No es un ID mongo válido').isMongoId(), 
    check('id').custom(existeProductoPorID),
    validarCampos                                    
],productoDelete);

module.exports= router;
