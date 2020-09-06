/*
 *  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *  Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 *  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

'use strict';

module.exports = {
    manifest: {
        publishingInformation: {
            isAvailableWorldwide: false,
            distributionCountries: ['MX', 'DE'],
            distributionMode: 'PUBLIC',
            category: 'GAMES',
            testingInstructions: 'replace with testing instructions',
            locales: {
                'en-US': {
                    name: 'Burrow Clock Skill',
                    invocation: 'family locator',
                    summary: 'Skill to locate family members',
                    description: 'This skill allows you to locate family members using the owntracks app to push their location information',
                    examplePhrases: [
                        'Alexa, family locator',
                        'Alexa, open family locator'
                    ],
                    keywords: [
                        'game',
                        'fun'
                    ],
                    "smallIconUri": "https://s3.amazonaws.com/litexa-skills/burrowClockSkill/development/default/icon-108.png",
                    "largeIconUri": "https://s3.amazonaws.com/litexa-skills/burrowClockSkill/development/default/icon-512.png"          
                },
                'es-MX': {
                    name: 'Burrow Clock Skill',
                    invocation: 'localiza familia',
                    summary: 'Skill para localizar a los Piña',
                    description: 'Skill para localizar a miembros de la familia que usen el apps de Owntracks para subir su posición geográfica',
                    examplePhrases: [
                        'Alexa, localiza familia'
                    ],
                    keywords: [
                        'juegos',
                        'diversión'
                    ],
                    "smallIconUri": "https://s3.amazonaws.com/litexa-skills/burrowClockSkill/development/default/icon-108.png",
                    "largeIconUri": "https://s3.amazonaws.com/litexa-skills/burrowClockSkill/development/default/icon-512.png"          
                }
            }
        },
        privacyAndCompliance: {
            allowsPurchases: false,
            usesPersonalInfo: false,
            isChildDirected: false,
            isExportCompliant: true,
            containsAds: false,
            locales: {
                'en-US': {
                    privacyPolicyUrl: 'https://www.example.com/privacy.html',
                    termsOfUseUrl: 'https://www.example.com/terms.html'
                },
                'es-MX': {
                    privacyPolicyUrl: 'https://www.example.com/es-MX/privacy.html',
                    termsOfUseUrl: 'https://www.example.com/es-MX/terms.html'
                }
            }
        }
    }
};
