require('express-validator')
const { Router } = require("express");
const { check } = require('express-validator');
const { login, googleSignIn,renovarToken  } = require("../controllers/auth.controllers");
const { validarJWT } = require("../middlewares/validar-jws");
const { validarCampos} = require("../middlewares/validar-campos");

const router=Router();

router.get('/', validarJWT,renovarToken)
 
router.post('/login',[ 
    check('email','El correo no es valido').isEmail(),
    check('password', 'El password es obligatorio').not().isEmpty(),      
    validarCampos
] ,login );
                                          
router.post('/google',[
    check('id_token','id_token de google es necesario').not().isEmpty(),
     validarCampos
], googleSignIn) 

module.exports= router