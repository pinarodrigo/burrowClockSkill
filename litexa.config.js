/*
 *  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *  Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 *  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

'use strict';

module.exports = {
    name: 'burrowClockSkill',
    deployments: {
        development: {
            module: '@litexa/deploy-aws',
            S3BucketName: 'litexa-skills',
            askProfile: 'pinanet',
            awsProfile: 'default',
            "lambdaConfiguration": {
                Runtime: "nodejs12.x"
            }
        }
    },
    extensionOptions: {}
};
