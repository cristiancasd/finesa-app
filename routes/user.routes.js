require('express-validator')
const { Router } = require("express");
const { check } = require('express-validator');
const { usersGet, userPost, usersDelete } = require('../controllers/users.controllers');
const { esRoleValido, emailExiste, existeUsuarioId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jws');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');


const router=Router();

router.get('/',[
    validarJWT,  
    tieneRole('ADMIN_ROLE','SALE_ROLE'),   
    validarCampos                    
 ], usersGet);                               

router.post('/',[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email','El correo no es valido').isEmail(),
    check('email').custom(emailExiste), 
    check('password', 'El password debe tener mínimo 5 caracteres').isLength(6,100),
    check('rol').custom(esRoleValido),    
    validarCampos
] ,userPost );


router.delete('/:id',[ 
    validarJWT,                                      
    esAdminRole,                       
    check('id','No es un ID válido').isMongoId(),    
    check('id').custom(existeUsuarioId),
    validarCampos                                   
],usersDelete);


module.exports= router