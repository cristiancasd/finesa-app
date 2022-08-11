require('express-validator')
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jws');
const { searchDB} = require('../controllers/search.controllers');
const { esAdminRole } = require('../middlewares/validar-roles');

const router=Router();

router.get('/:coleccion/:termino',
    [
    validarJWT,  
    esAdminRole,
    ],
    searchDB)

module.exports= router; 
