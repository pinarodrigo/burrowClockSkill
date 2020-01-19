/*
 *  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *  Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 *  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

'use strict';

Test.expect("Utils", function() {
  Test.equal(typeof (todayName()), 'string');
  Test.check(function() {
    return addNumbers(1, 2, 3) === 6;
  });

  return Test.report(`today is ${todayName()}`);
});

Test.expect("Web Service", function() {
  Test.check(function() {
    return callLocalizar("regina") !== '';
  });
  return callLocalizar("regina") !== ''
});

Test.expect("Web Service", function() {
  Test.check(function() {
    return callLocalizar("victoria") !== '';
  });
  return callLocalizar("victoria") !== ''
});

