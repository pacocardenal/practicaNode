"use strict";

function cargarJsonLocalize(language, errorKey, callback) {
    let fs = require('fs');

    let fichero = '../JSON/localize.json';

    fs.readFile(fichero, 'utf-8', function (err, data) {

        if (err) {
            console.log('Error', err);
            return;
        }

        let jsonLocalize = JSON.parse(data);

        // Default error: Unknown error
        let mensajeDecodificado = "Unknown error";
        let jsonLocalizeLanguage;

        // Default language: English
        if (language === 'es') {
            jsonLocalizeLanguage = jsonLocalize.es;
        } else {
            jsonLocalizeLanguage = jsonLocalize.en;
        }

        for (let i = 0; i < Object.keys(jsonLocalizeLanguage).length; i ++) {
            if (jsonLocalizeLanguage[i].clave === errorKey) {
                mensajeDecodificado = jsonLocalizeLanguage[i].decodificacion;
            }
        }

        callback(mensajeDecodificado);
    });
}

function loadJsonLocalize(callback) {
    let fs = require('fs');

    let fichero = '../JSON/localize.json';

    fs.readFile(fichero, 'utf-8', function (err, data) {

        if (err) {
            console.log('Error', err);
            return;
        }

        let jsonLocalize = JSON.parse(data);

        callback(jsonLocalize);
    });
}

loadJsonLocalize(function (json) {
    console.log(json);
});


cargarJsonLocalize('es', 'PAGE_NOT_FOUND', function (mensajeMostrarError) {
   console.log(mensajeMostrarError);
});
