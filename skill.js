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
            distributionCountries: ['US', 'MX'],
            distributionMode: 'PUBLIC',
            category: 'GAMES',
            testingInstructions: 'replace with testing instructions',
            locales: {
                'en-US': {
                    name: 'burrowClockSkill',
                    invocation: 'pineapple locator',
                    summary: 'replace with brief description, no longer than 120 characters',
                    description: 'Longer description, goes to the skill store. Line breaks are supported.',
                    examplePhrases: [
                        'Alexa, launch PineappleLocator',
                        'Alexa, open PineappleLocator',
                        'Alexa, play PineappleLocator',
                    ],
                    keywords: [
                        'game',
                        'fun'
                    ]
                },
                'es-MX': {
                    name: 'burrowClockSkill',
                    invocation: 'localiza niñas',
                    summary: 'Skill para localizar a las piñas',
                    description: 'Skill para localizar a las piñas',
                    examplePhrases: [
                        'Alexa, inicia LocalizadorPinas',
                        'Alexa, abre LocalizadorPinas'
                    ],
                    keywords: [
                        'juegos',
                        'diversión'
                    ]
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
