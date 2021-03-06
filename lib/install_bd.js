'use strict';

var mongodb = require('mongodb');
var client = mongodb.MongoClient;

var fs = require('fs');

var fichero = __dirname + '/JSON/anuncios.json';

fs.readFile(fichero, 'utf-8', function (err, data) {

    if (err) {
        console.log('Error', err);
        return;
    }

    var initialJson = JSON.parse(data);

    client.connect('mongodb://localhost:27017/nodepop', function(err, db) {
        if (err) {
            return console.log('Error', err);
        }

        // 1 - Carga de anuncios
        db.collection('anuncios').find().toArray(function(err, docs) {
            if (err) {
                return console.log('Error', err);
            }
            if (docs[0] !== 'undefined') {
                db.collection('anuncios').remove({});
            }

            var numeroElementosJson = Object.keys(initialJson.anuncios).length;

            for (var i = 0; i < numeroElementosJson; i++) {
                db.collection('anuncios').insert({nombre : initialJson.anuncios[i].nombre, venta : initialJson.anuncios[i].venta, precio : parseFloat(initialJson.anuncios[i].precio),  foto : initialJson.anuncios[i].foto, tags : initialJson.anuncios[i].tags});
            }

            // 2 - Carga de usuarios
            db.collection('usuarios').find().toArray(function(err, docs) {
                if (err) {
                    return console.log('Error', err);
                }
                if (docs[0] !== 'undefined') {
                    db.collection('usuarios').remove({});
                }

                var numeroElementosJson = Object.keys(initialJson.usuarios).length;

                for (var i = 0; i < numeroElementosJson; i++) {
                    db.collection('usuarios').insert({nombre : initialJson.usuarios[i].nombre, clave : initialJson.usuarios[i].clave, email : initialJson.usuarios[i].email});
                }

                console.log("Iniciada BD");

            });

        });

    });

});