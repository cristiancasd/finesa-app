require('express-validator')

const { Router } = require("express");
const { check } = require('express-validator');
const { ventasGet, ventasPost ,actualizarVenta} = require("../controllers/shoppingCart.controllers");
const { esRoleValido, existeVentaId, existeUsuarioId, diaExiste } = require('../helpers/db-validators');


const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jws');
const { esAdminRole, tieneRole } = require('../middlewares/validar-roles');


const Role = require('../models/rol');

const router=Router();



router.get('/',[
    validarJWT,
    //check('rol').custom(esRoleValido),
    tieneRole('ADMIN_ROLE','SALE_ROLE')
],
ventasGet);                               //Solicitud para mostrar los usuarios


router.post('/',[
    validarJWT,
    check('arraySale', 'El vector es obligatorio').not().isEmpty(),
    check('date', 'El fecha es obligatorio').not().isEmpty(),
    check('time', 'El fecha es obligatorio').not().isEmpty(),
    //check('date').custom(diaExiste),
    check('rol').custom(esRoleValido),    //es lo mismo que lo de abajo
    tieneRole('ADMIN_ROLE','SALE_ROLE'),
    validarCampos
] ,ventasPost );



module.exports= router