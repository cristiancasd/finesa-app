require('express-validator')
const { Router } = require("express");
const { check } = require('express-validator');
const { usersGet, userPost, usersDelete } = require('../controllers/users.controllers');
const { esRoleValido, emailExiste, existeUsuarioId } = require('../helpers/db-validators');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jws');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');


const router=Router();

router.get('/', usersGet);                               //Solicitud para mostrar los usuarios

router.post('/',[
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email','El correo no es valido').isEmail(),
    check('email').custom(emailExiste), 
    check('password', 'El password debe tener mínimo 5 caracteres').isLength(6,100),
    check('rol').custom(esRoleValido),    //es lo mismo que lo de abajo
    validarCampos
] ,userPost );


router.delete('/:id',[ 
    validarJWT,                                      //Es la primera que se valida, que el token sea correcto
    tieneRole('ADMIN_ROLE'),                         //Escoger el rol permitido
    check('id','No es un ID válido').isMongoId(),    //Revisa que sea un tipo mongo, no revisa si existe en mongo
    check('id').custom(existeUsuarioId),
    validarCampos                                    //No continua a la ruta si hay un error en los checks
],usersDelete);


module.exports= router