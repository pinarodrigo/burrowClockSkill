/*
 *  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *  Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 *  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

'use strict';

let { inspect } = require('util');
let logger = require('./logger');
const https = require('request');

const webService = "https://t7bes9gh71.execute-api.eu-central-1.amazonaws.com/dev/locate/";

const ORDERED_DAYS_OF_WEEK = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
];

function todayName(date = new Date()) {
    const day = date.getDay();
    return ORDERED_DAYS_OF_WEEK[day];
}

// helper methods
function httpGet(url, options) {
    return new Promise(function (resolve, reject) {
        let response = '';

        //console.log(url)
        https(url, options, (err, res, body) => {
            if (err) {
                console.log("Error retrieving data");
                reject(new Error("Error retrieving"));
            }
            response += body.poi;
            response += ",";
            response += body.distance;

            resolve(response);
        });
    });
}

async function callLocalizar(nombre) {
    var options = { json: true };
    let speechText = '';
    let url = webService + nombre;
    let location = await httpGet(url, options);
    let elements = location.split(',');
    let poi = elements[0];
    let distance = elements[1];

    if (poi !== 'undefined' && poi == "") {
        let distanceInMeters = distance * 1000;
        speechText = nombre + " está a " + Math.round(distanceInMeters) + " metros de la casa";
    } else {
        speechText = nombre + " está en " + poi;
    }
    if (poi == 'undefined') {
        speechText = "No pude localizar a " + nombre;
    }


    //console.log('Response for Alexa: ' + speechText);   

    return speechText;
}

function addNumbers(...numbers) {
    console.log(`the arguments are ${inspect(numbers)}`);
    return Array.from(numbers).reduce((accumulator, number) => accumulator + number, 0);
}

module.exports = {
    todayName,
    addNumbers,
    callLocalizar
};

