'use strict';

var mongodb = require('mongodb');
var client = mongodb.MongoClient;

var fs = require('fs');

function cargarDatos(fichero) {
    return new Promise(function (resolve, reject) {
        fs.readFile(fichero, 'utf-8', function (err, data) {

            if (err) {
                console.log('Error', err);
                reject(err);
            }

            resolve(JSON.parse(data));
        });
    });
}

function conectarBD(fichero) {
    return new Promise(function (resolve, reject) {
        client.connect('mongodb://localhost:27017/nodepop', function(err, db) {
            if (err) {
                console.log('Error', err);
                reject(err);
            }

            resolve(fichero, db);
        });
    });
}

function cargarAnuncios(initialJson) {
    return new Promise(function (resolve, reject) {

        client.connect('mongodb://localhost:27017/nodepop', function (err, db) {
            if (err) {
                console.log('Error', err);
                reject(err);
            }

            db.collection('anuncios').find().toArray(function (err, docs) {

                if (err) {
                    console.log('Error', err);
                    reject(err);
                }

                if (docs[0] !== 'undefined') {
                    db.collection('anuncios').remove({});
                }

                var numeroElementosJson = Object.keys(initialJson.anuncios).length;

                for (var i = 0; i < numeroElementosJson; i++) {
                    db.collection('anuncios').insert({
                        nombre: initialJson.anuncios[i].nombre,
                        venta: initialJson.anuncios[i].venta,
                        precio: parseFloat(initialJson.anuncios[i].precio),
                        foto: initialJson.anuncios[i].foto,
                        tags: initialJson.anuncios[i].tags
                    });
                }

                resolve(initialJson);
            });
        });
    });
}

function cargarUsuarios(initialJson) {
    return new Promise(function (resolve, reject) {

        client.connect('mongodb://localhost:27017/nodepop', function (err, db) {
            if (err) {
                console.log('Error', err);
                reject(err);
            }

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

                resolve(db);

            });
        });
    });
}

function cerrarBD(bd) {
    return new Promise(function (resolve, reject) {
       bd.close(function (err) {
           if (err) {
               reject(err);
           }

           resolve(bd.s.databaseName);
       });
    });
}

var fichero = __dirname + '/JSON/anuncios.json';

cargarDatos(fichero)
    .then(conectarBD)
    .then(cargarAnuncios)
    .then(cargarUsuarios)
    .then(cerrarBD)
    .then(function (BDIniciada) {
        console.log('La base de datos', BDIniciada, 'se ha iniciado correctamente.');
    })
    .catch(function(err) {
        console.log(err);
    });