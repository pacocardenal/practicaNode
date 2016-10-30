"use strict";

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
    const secreto = "paco76";

    console.log('User:', user, 'pass:', pass);

    if (typeof user === 'undefined' || typeof pass === 'undefined') {
        funcionLocalizacion(language, 'USER_NOT_FOUND', function (mensajeMostrarError) {
            console.log(mensajeMostrarError);
            res.json({success: false, error: mensajeMostrarError});
        });
    } else {
        console.log('Entra');
        pass = sha256(pass);
        console.log('Pass convertida: ', pass);

        Usuario.find({"nombre": user, "clave": pass})
            .then(function (usuario) {
                console.log(usuario, usuario[0].id, usuario[0].nombre);
                let userRecord = {id: usuario[0].id, nombre: usuario[0].nombre};
                console.log('User record: ', userRecord.id, userRecord.nombre);

                let token = jwt.sign({id: userRecord.id}, secreto, {
                    expiresIn: '2 days'
                });

                res.json({success: true, token: token});
            }).catch(function (err) {

            funcionLocalizacion(language, 'USER_NOT_FOUND', function (mensajeMostrarError) {
                console.log(mensajeMostrarError);
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
router.post('/', function (req, res, next) {

    var usuario = new Usuario(req.body);
    let language = req.query.language;

    console.log('user', usuario.nombre, usuario.clave, usuario.email);
    if (typeof usuario.clave === 'undefined' || typeof usuario.nombre === 'undefined' || typeof usuario.email === 'undefined') {
        res.json({success:false, error: 'Clave'});
    } else {
        usuario.clave = sha256(usuario.clave);

        usuario.save(function (err, usuarioGuardado) {
            if (err) {
                funcionLocalizacion(language, 'ERR_CREATE_USER', function (mensajeMostrarError) {
                    console.log(mensajeMostrarError);
                    res.json({success:false, error: mensajeMostrarError});
                });
            }
            res.json({success : true, usuario : usuarioGuardado});
        });
    }

});



module.exports = router;
