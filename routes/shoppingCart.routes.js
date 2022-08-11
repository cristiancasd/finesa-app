require('express-validator')

const { Router } = require("express");
const { check } = require('express-validator');
const { ventasGet, ventasPost } = require("../controllers/shoppingCart.controllers");
const { esRoleValido } = require('../helpers/db-validators');


const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jws');
const { tieneRole } = require('../middlewares/validar-roles');


const router=Router();



router.get('/',[
    validarJWT,
    tieneRole('ADMIN_ROLE','SALE_ROLE'),
    validarCampos
],
ventasGet);                 



router.post('/',[
    validarJWT,
    check('datePrueba', 'El date es obligatorio').not().isEmpty(),
    check('datePrueba', 'La fecha debe de ser tipo date').isDate(),
    check('arraySale', 'El vector es obligatorio').not().isEmpty(),
    check('date', 'El fecha es obligatorio').not().isEmpty(),
    check('time', 'El fecha es obligatorio').not().isEmpty(),
    check('rol').custom(esRoleValido),
    tieneRole('ADMIN_ROLE','SALE_ROLE'),
    validarCampos
] ,ventasPost );



module.exports= router