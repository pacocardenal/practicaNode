'use strict';

var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Anuncio = mongoose.model('Anuncio');

var funcionLocalizacion = require('../../lib/cargaLocalizacion');

var jwtAuth = require('../../lib/jwtAuth');

// json web token auth
router.use(jwtAuth());

// 1 - Listar anuncios
router.get('/', function (req, res) {

    var tag = req.query.tag;
    var venta = req.query.venta;
    var nombre = req.query.nombre;
    var precio = req.query.precio;
    var start = parseInt(req.query.start) || 0;
    var limit = parseInt(req.query.limit) || null;
    var sort = req.query.sort || null;
    var includeTotal = req.query.includeTotal;
    var language = req.query.language;

    var filter = {};

    if (typeof venta !== 'undefined') {
        filter.venta = venta;
    }

    if (typeof tag !== 'undefined') {
        filter.tags =  tag;
    }

    if (typeof precio !== 'undefined') {
        var range = precio.search('-');
        var length = precio.length - 1;

        if (range === 0) {
            filter.precio = {'$lte': precio.substr(1)};
        } else if (range === length) {
            filter.precio = {'$gte': precio.substr(0, length)};
        } else if (range === -1) {
            filter.precio = precio;
        } else {
            var rangoMenor = precio.substr(0, range);
            var rangoMayor = precio.substr(range + 1, length);
            filter.precio = {'$gte' : rangoMenor, '$lte' : rangoMayor};
        }
    }

    if (typeof nombre !== 'undefined') {
        filter.nombre = new RegExp('^' + nombre, 'i');
    }

    Anuncio.find(filter).skip(start).limit(limit).sort(sort)
        .then(function (anuncios) {
            res.json({success : true, anuncios : anuncios});
        }).catch(function () {
            funcionLocalizacion(language, 'ITEM_NOT_FOUND', function (mensajeMostrarError) {
                res.json({success:false, error: mensajeMostrarError});
            });
    });

});

// 2 - Crear anuncios
// router.post('/', function (req, res, next) {
//
//     var anuncio = new Anuncio(req.body);
//
//     anuncio.save(function (err, anuncioGuardado) {
//         if (err) {
//             return next(err);
//         }
//         res.json({success : true, anuncio : anuncioGuardado});
//     });
//
// });

module.exports = router;
