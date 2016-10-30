
"use strict";

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
                    console.log('Borradas colecciones de base de datos');
                }

                console.log(Object.keys(initialJson.anuncios).length);
                var numeroElementosJson = Object.keys(initialJson.anuncios).length;
                console.log(parseFloat(initialJson.anuncios[0].precio));
                for (var i = 0; i < numeroElementosJson; i++) {
                    db.collection('anuncios').insert({
                        nombre: initialJson.anuncios[i].nombre,
                        venta: initialJson.anuncios[i].venta,
                        precio: parseFloat(initialJson.anuncios[i].precio),
                        foto: initialJson.anuncios[i].foto,
                        tags: initialJson.anuncios[i].tags
                    });
                }

                console.log('Cargado JSON en base de datos');
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
                    console.log('Borradas colecciones de base de datos');
                }

                var numeroElementosJson = Object.keys(initialJson.usuarios).length;
                console.log(numeroElementosJson);
                for (var i = 0; i < numeroElementosJson; i++) {
                    console.log(initialJson.usuarios[i].nombre);
                    db.collection('usuarios').insert({nombre : initialJson.usuarios[i].nombre, clave : initialJson.usuarios[i].clave, email : initialJson.usuarios[i].email});
                }

                console.log('Cargado JSON en base de datos');
                resolve(db);

                //db.close();

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

//  initialJson = fs.readFile(fichero, 'utf-8', function (err, data) {
//
//     if (err) {
//         console.log('Error', err);
//         return;
//     }
//
//     return (JSON.parse(data));
//
// });
//
// console.log(initialJson);

//     client.connect('mongodb://localhost:27017/nodepop', function(err, db) {
//         if (err) {
//             return console.log('Error', err);
//         }
//
//         // 1 - Carga de anuncios
//         db.collection('anuncios').find().toArray(function(err, docs) {
//             if (err) {
//                 return console.log('Error', err);
//             }
//             if (docs[0] !== 'undefined') {
//                 db.collection('anuncios').remove({});
//                 console.log('Borradas colecciones de base de datos');
//             }
//
//             console.log(Object.keys(initialJson.anuncios).length);
//             var numeroElementosJson = Object.keys(initialJson.anuncios).length;
//             console.log(parseFloat(initialJson.anuncios[0].precio));
//             for (var i = 0; i < numeroElementosJson; i++) {
//                 db.collection('anuncios').insert({nombre : initialJson.anuncios[i].nombre, venta : initialJson.anuncios[i].venta, precio : parseFloat(initialJson.anuncios[i].precio),  foto : initialJson.anuncios[i].foto, tags : initialJson.anuncios[i].tags});
//             }
//
//             console.log('Cargado JSON en base de datos');
//
//             //db.close();
//
//             // 2 - Carga de usuarios
//             db.collection('usuarios').find().toArray(function(err, docs) {
//                 if (err) {
//                     return console.log('Error', err);
//                 }
//                 if (docs[0] !== 'undefined') {
//                     db.collection('usuarios').remove({});
//                     console.log('Borradas colecciones de base de datos');
//                 }
//
//                 var numeroElementosJson = Object.keys(initialJson.usuarios).length;
//                 console.log(numeroElementosJson);
//                 for (var i = 0; i < numeroElementosJson; i++) {
//                     console.log(initialJson.usuarios[i].nombre);
//                     db.collection('usuarios').insert({nombre : initialJson.usuarios[i].nombre, clave : initialJson.usuarios[i].clave, email : initialJson.usuarios[i].email});
//                 }
//
//                 console.log('Cargado JSON en base de datos');
//
//                 //db.close();
//
//             });
//
//             //db.close();
//
//         });
//
//         //db.close();
//
//     });
//
// });