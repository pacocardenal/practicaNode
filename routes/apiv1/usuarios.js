'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Usuario = mongoose.model('Usuario');

var sha256 = require('sha256');

var jwt = require('jsonwebtoken');
var funcionLocalizacion = require('../../lib/cargaLocalizacion');

router.post('/authenticate', function (req, res) {
    let user = req.body.user;
    let pass = req.body.pass;
    let language = req.query.language;
    const secreto = 'paco76';

    if (typeof user === 'undefined' || typeof pass === 'undefined') {
        funcionLocalizacion(language, 'USER_NOT_FOUND', function (mensajeMostrarError) {
            res.json({success: false, error: mensajeMostrarError});
        });
    } else {
        pass = sha256(pass);

        Usuario.find({'nombre': user, 'clave': pass})
            .then(function (usuario) {
                let userRecord = {id: usuario[0].id, nombre: usuario[0].nombre};

                let token = jwt.sign({id: userRecord.id}, secreto, {
                    expiresIn: '2 days'
                });

                res.json({success: true, token: token});
            }).catch(function () {

            funcionLocalizacion(language, 'USER_NOT_FOUND', function (mensajeMostrarError) {
                res.json({success: false, error: mensajeMostrarError});
            });

        });
    }

});

// 1 - Listar usuarios
// router.get('/', function (req, res, next) {
//
//     Usuario.find()
//         .then(function (usuarios) {
//             res.json({success : true, usuarios : usuarios});
//         }).catch(next);
//
// });

// 2 - Crear usuarios
router.post('/', function (req, res) {

    var usuario = new Usuario(req.body);
    let language = req.query.language;

    if (typeof usuario.clave === 'undefined' || typeof usuario.nombre === 'undefined' || typeof usuario.email === 'undefined') {
        //res.json({success:false, error: 'Clave'});
        funcionLocalizacion(language, 'ERR_LOGIN_USER', function (mensajeMostrarError) {
            res.json({success:false, error: mensajeMostrarError});
        });
    } else {
        usuario.clave = sha256(usuario.clave);

        usuario.save(function (err, usuarioGuardado) {
            if (err) {
                funcionLocalizacion(language, 'ERR_LOGIN_USER', function (mensajeMostrarError) {
                    res.json({success:false, error: mensajeMostrarError});
                });
            }
            res.json({success : true, usuario : usuarioGuardado});
        });
    }

});



module.exports = router;
