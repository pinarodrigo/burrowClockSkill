var litexa = {};
  /*
   * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
   * SPDX-License-Identifier: Apache-2.0
   * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   */
var DBTypeWrapper, brightenColor, buildBuyInSkillProductDirective, buildCancelInSkillProductDirective, buildUpsellInSkillProductDirective, daysBetween, deepClone, diceCheck, diceRoll, escapeSpeech, fetchEntitlements, getProductByProductId, getProductByReferenceName, getReferenceNameByProductId, hexFromRGB, hoursBetween, inSkillProductBought, interpolateRGB, isActuallyANumber, minutesBetween, pickSayString, randomArrayItem, randomIndex, reportValueMetric, rgbFromHSL, rgbFromHex, shuffleArray,
  indexOf = [].indexOf;

randomIndex = function(count) {
  return Math.floor(Math.random() * count);
};

shuffleArray = function(array) {
  var a, b, i, j, n, ref, shuffled;
  shuffled = (function() {
    var len, n, results;
    results = [];
    for (n = 0, len = array.length; n < len; n++) {
      a = array[n];
      results.push(a);
    }
    return results;
  })();
  for (i = n = 0, ref = shuffled.length; (0 <= ref ? n < ref : n > ref); i = 0 <= ref ? ++n : --n) {
    j = i + Math.floor(Math.random() * (shuffled.length - i));
    a = shuffled[i];
    b = shuffled[j];
    shuffled[i] = b;
    shuffled[j] = a;
  }
  return shuffled;
};

randomArrayItem = function(array) {
  return array[randomIndex(array.length)];
};

diceRoll = function(sides) {
  // produce a number between 1 and sides, inclusive
  sides = sides != null ? sides : 6;
  return 1 + Math.floor(Math.random() * sides);
};

diceCheck = function(number, sides) {
  return diceRoll(sides) <= number;
};

escapeSpeech = function(line) {
  if (line == null) {
    return "";
  }
  return "" + line;
};

deepClone = function(thing) {
  return JSON.parse(JSON.stringify(thing));
};

isActuallyANumber = function(data) {
  return !isNaN(parseInt(data));
};

pickSayString = function(context, key, count) {
  var cap, history, i, n, ref, ref1, ref2, sayData, value;
  sayData = (ref = context.db.read('__sayHistory')) != null ? ref : [];
  history = (ref1 = sayData[key]) != null ? ref1 : [];
  value = 0;
  switch (false) {
    case count !== 2:
      // with two, we can only toggle anyway
      if (history[0] != null) {
        value = 1 - history[0];
      } else {
        value = randomIndex(2);
      }
      history[0] = value;
      break;
    case !(count < 5):
      // until 4, the pattern below is a little
      // over constrained, producing a repeating
      // set rather than a random sequence,
      // so we only guarantee
      // no adjacent repetition instead
      value = randomIndex(count);
      if (value === history[0]) {
        value = (value + 1) % count;
      }
      history[0] = value;
      break;
    default:
      // otherwise, guarantee we'll see at least
      // half the remaining options before repeating
      // one, up to a capped history of 8, beyond which
      // it's likely too difficult to detect repetition.
      value = randomIndex(count);
      for (i = n = 0, ref2 = count; (0 <= ref2 ? n < ref2 : n > ref2); i = 0 <= ref2 ? ++n : --n) {
        if (indexOf.call(history, value) < 0) {
          break;
        }
        value = (value + 1) % count;
      }
      history.unshift(value);
      cap = Math.min(8, count / 2);
      history = history.slice(0, cap);
  }
  sayData[key] = history;
  context.db.write('__sayHistory', sayData);
  return value;
};

exports.DataTablePrototype = {
  pickRandomIndex: function() {
    return randomIndex(this.length);
  },
  find: function(key, value) {
    var idx, n, ref, row;
    idx = this.keys[key];
    if (idx == null) {
      return null;
    }
    for (row = n = 0, ref = length; (0 <= ref ? n < ref : n > ref); row = 0 <= ref ? ++n : --n) {
      if (this[row][idx] === value) {
        return row;
      }
    }
    return null;
  }
};

exports.Logging = {
  log: function() {
    return console.log.apply(null, arguments);
  },
  error: function() {
    return console.error.apply(null, arguments);
  }
};

minutesBetween = function(before, now) {
  if (!((before != null) && (now != null))) {
    return 999999;
  }
  return Math.floor(Math.abs(now - before) / (60 * 1000));
};

hoursBetween = function(before, now) {
  if (!((before != null) && (now != null))) {
    return 999999;
  }
  return Math.floor(Math.abs(now - before) / (60 * 60 * 1000));
};

daysBetween = function(before, now) {
  if (!((before != null) && (now != null))) {
    return 999999;
  }
  now = (new Date(now)).setHours(0, 0, 0, 0);
  before = (new Date(before)).setHours(0, 0, 0, 0);
  return Math.floor(Math.abs(now - before) / (24 * 60 * 60 * 1000));
};

Math.clamp = function(min, max, x) {
  return Math.min(Math.max(min, x), max);
};

rgbFromHex = function(hex) {
  var read;
  if ((hex != null ? hex.length : void 0) == null) {
    return [0, 0, 0];
  }
  if (hex.indexOf('0x') === 0) {
    hex = hex.slice(2);
  }
  if (hex.indexOf('#') === 0) {
    hex = hex.slice(1);
  }
  switch (hex.length) {
    case 3:
      read = function(v) {
        v = parseInt(v, 16);
        return v + 16 * v;
      };
      return [read(hex[0]), read(hex[1]), read(hex[2])];
    case 6:
      return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
    default:
      return [0, 0, 0];
  }
};

hexFromRGB = function(rgb) {
  var b, g, r;
  r = Math.clamp(0, 255, Math.floor(rgb[0])).toString(16);
  g = Math.clamp(0, 255, Math.floor(rgb[1])).toString(16);
  b = Math.clamp(0, 255, Math.floor(rgb[2])).toString(16);
  if (r.length < 2) {
    r = "0" + r;
  }
  if (g.length < 2) {
    g = "0" + g;
  }
  if (b.length < 2) {
    b = "0" + b;
  }
  return r + g + b;
};

rgbFromHSL = function(hsl) {
  var c, h, l, m, s, x;
  h = (hsl[0] % 360 + 360) % 360;
  s = Math.clamp(0.0, 1.0, hsl[1]);
  l = Math.clamp(0.0, 1.0, hsl[2]);
  h /= 60.0;
  c = (1.0 - Math.abs(2.0 * l - 1.0)) * s;
  x = c * (1.0 - Math.abs(h % 2.0 - 1.0));
  m = l - 0.5 * c;
  c += m;
  x += m;
  m = Math.floor(m * 255);
  c = Math.floor(c * 255);
  x = Math.floor(x * 255);
  switch (Math.floor(h)) {
    case 0:
      return [c, x, m];
    case 1:
      return [x, c, m];
    case 2:
      return [m, c, x];
    case 3:
      return [m, x, c];
    case 4:
      return [x, m, c];
    default:
      return [c, m, x];
  }
};

brightenColor = function(c, percent) {
  var isHex;
  isHex = false;
  if (!Array.isArray(c)) {
    c = rgbFromHex(c);
    isHex = true;
  }
  c = interpolateRGB(c, [255, 255, 255], percent / 100.0);
  if (isHex) {
    return hexFromRGB(c);
  }
  return c;
};

interpolateRGB = function(c1, c2, l) {
  var b, g, r;
  [r, g, b] = c1;
  r += (c2[0] - r) * l;
  g += (c2[1] - g) * l;
  b += (c2[2] - b) * l;
  return [r.toFixed(0), g.toFixed(0), b.toFixed(0)];
};

reportValueMetric = function(metricType, value, unit) {
  var params;
  params = {
    MetricData: [],
    Namespace: 'Litexa'
  };
  params.MetricData.push({
    MetricName: metricType,
    Dimensions: [
      {
        Name: 'project',
        Value: litexa.projectName
      }
    ],
    StorageResolution: 60,
    Timestamp: new Date().toISOString(),
    Unit: unit != null ? unit : 'None',
    Value: value != null ? value : 1
  });
  //console.log "reporting metric #{JSON.stringify(params)}"
  if (typeof cloudWatch === "undefined" || cloudWatch === null) {
    return;
  }
  return cloudWatch.putMetricData(params, function(err, data) {
    if (err != null) {
      return console.error(`Cloudwatch metrics write fail ${err}`);
    }
  });
};

litexa.extensions = {
  postProcessors: [],
  extendedEvents: {},
  load: function(location, name) {
    var fullPath, handler, k, lib, ref, results, testing, v;
    // during testing, this might already be in the shared context, skip it if so
    if (name in litexa.extensions) {
      return;
    }
    //console.log ("skipping extension load, already loaded")
    testing = litexa.localTesting ? "(test mode)" : "";
    //console.log "loading extension #{location}/#{name} #{testing}"
    fullPath = `${litexa.modulesRoot}/${location}/${name}/litexa.extension`;
    lib = litexa.extensions[name] = require(fullPath);
    if (lib.loadPostProcessor != null) {
      handler = lib.loadPostProcessor(litexa.localTesting);
      if (handler != null) {
        //console.log "installing post processor for extension #{name}"
        handler.extensionName = name;
        litexa.extensions.postProcessors.push(handler);
      }
    }
    if (lib.events != null) {
      ref = lib.events(false);
      results = [];
      for (k in ref) {
        v = ref[k];
        //console.log "registering extended event #{k}"
        results.push(litexa.extensions.extendedEvents[k] = v);
      }
      return results;
    }
  },
  finishedLoading: function() {
    var a, b, count, guard, len, len1, len2, len3, n, node, o, p, pp, processors, q, ready, ref, ref1, sorted, t, tag, u;
    // sort the postProcessors by their actions
    processors = litexa.extensions.postProcessors;
    count = processors.length;
// identify dependencies
    for (n = 0, len = processors.length; n < len; n++) {
      a = processors[n];
      a.dependencies = [];
      if (a.consumesTags == null) {
        continue;
      }
      ref = a.consumesTags;
      for (o = 0, len1 = ref.length; o < len1; o++) {
        tag = ref[o];
        for (q = 0, len2 = processors.length; q < len2; q++) {
          b = processors[q];
          if (!(b !== a)) {
            continue;
          }
          if (b.producesTags == null) {
            continue;
          }
          if (indexOf.call(b.producesTags, tag) >= 0) {
            a.dependencies.push(b);
          }
        }
      }
    }
    ready = (function() {
      var len3, results, t;
      results = [];
      for (t = 0, len3 = processors.length; t < len3; t++) {
        a = processors[t];
        if (a.dependencies.length === 0) {
          results.push(a);
        }
      }
      return results;
    })();
    processors = (function() {
      var len3, results, t;
      results = [];
      for (t = 0, len3 = processors.length; t < len3; t++) {
        p = processors[t];
        if (p.dependencies.length > 0) {
          results.push(p);
        }
      }
      return results;
    })();
    sorted = [];
    for (guard = t = 0, ref1 = count; (0 <= ref1 ? t < ref1 : t > ref1); guard = 0 <= ref1 ? ++t : --t) {
      if (ready.length === 0) {
        break;
      }
      node = ready.pop();
      for (u = 0, len3 = processors.length; u < len3; u++) {
        p = processors[u];
        p.dependencies = (function() {
          var len4, ref2, results, w;
          ref2 = p.dependencies;
          results = [];
          for (w = 0, len4 = ref2.length; w < len4; w++) {
            pp = ref2[w];
            if (pp !== node) {
              results.push(pp);
            }
          }
          return results;
        })();
        if (p.dependencies.length === 0) {
          ready.push(p);
        }
      }
      processors = (function() {
        var len4, results, w;
        results = [];
        for (w = 0, len4 = processors.length; w < len4; w++) {
          p = processors[w];
          if (p.dependencies.length > 0) {
            results.push(p);
          }
        }
        return results;
      })();
      sorted.push(node);
    }
    if (sorted.length !== count) {
      throw new Error("Failed to sort postprocessors by dependency");
    }
    return litexa.extensions.postProcessors = sorted;
  }
};

DBTypeWrapper = class DBTypeWrapper {
  constructor(db, language) {
    this.db = db;
    this.language = language;
    this.cache = {};
  }

  read(name) {
    var dbType, value;
    if (name in this.cache) {
      return this.cache[name];
    }
    dbType = __languages[this.language].dbTypes[name];
    value = this.db.read(name);
    if ((dbType != null ? dbType.prototype : void 0) != null) {
      // if this is a typed variable, and it appears
      // the type is a constructible, e.g. a Class
      if (value != null) {
        // patch the prototype if it exists
        Object.setPrototypeOf(value, dbType.prototype);
      } else {
        // or construct a new instance
        value = new dbType;
        this.db.write(name, value);
      }
    } else if ((dbType != null ? dbType.Prepare : void 0) != null) {
      // otherwise if it's typed and it provides a
      // wrapping Prepare function
      if (value == null) {
        if (dbType.Initialize != null) {
          // optionally invoke an initialize
          value = dbType.Initialize();
        } else {
          // otherwise assume we start from an
          // empty object
          value = {};
        }
        this.db.write(name, value);
      }
      // wrap the cached object, whatever it is
      // the function wants to return. Note it's
      // still the input value object that gets saved
      // to the database either way!
      value = dbType.Prepare(value);
    }
    this.cache[name] = value;
    return value;
  }

  write(name, value) {
    var dbType;
    // clear out the cache on any writes
    delete this.cache[name];
    dbType = __languages[this.language].dbTypes[name];
    if (dbType != null) {
      // for typed objects, we can only replace with
      // another object, OR clear out the object and
      // let initialization happen again on the next
      // read, whenever that happens
      if (value == null) {
        return this.db.write(name, null);
      } else if (typeof value === 'object') {
        return this.db.write(name, value);
      } else {
        throw new Error(`@${name} is a typed variable, you can only assign an object or null to it.`);
      }
    } else {
      return this.db.write(name, value);
    }
  }

  finalize(cb) {
    return this.db.finalize(cb);
  }

};

// Monetization
inSkillProductBought = async function(stateContext, referenceName) {
  var isp;
  isp = (await getProductByReferenceName(stateContext, referenceName));
  return (isp != null ? isp.entitled : void 0) === 'ENTITLED';
};

getProductByReferenceName = async function(stateContext, referenceName) {
  var len, n, p, ref;
  if (stateContext.monetization.fetchEntitlements) {
    await fetchEntitlements(stateContext);
  }
  ref = stateContext.monetization.inSkillProducts;
  for (n = 0, len = ref.length; n < len; n++) {
    p = ref[n];
    if (p.referenceName === referenceName) {
      return p;
    }
  }
  return null;
};

getProductByProductId = async function(stateContext, productId) {
  var len, n, p, ref;
  if (stateContext.monetization.fetchEntitlements) {
    await fetchEntitlements(stateContext);
  }
  ref = stateContext.monetization.inSkillProducts;
  for (n = 0, len = ref.length; n < len; n++) {
    p = ref[n];
    if (p.productId === productId) {
      return p;
    }
  }
  return null;
};

buildBuyInSkillProductDirective = async function(stateContext, referenceName) {
  var isp;
  isp = (await getProductByReferenceName(stateContext, referenceName));
  if (isp == null) {
    console.log(`buildBuyInSkillProductDirective(): in-skill product "${referenceName}" not found.`);
    return;
  }
  stateContext.directives.push({
    "type": "Connections.SendRequest",
    "name": "Buy",
    "payload": {
      "InSkillProduct": {
        "productId": isp.productId
      }
    },
    "token": "bearer " + stateContext.event.context.System.apiAccessToken
  });
  return stateContext.shouldEndSession = true;
};

fetchEntitlements = function(stateContext, ignoreCache = false) {
  if (!stateContext.monetization.fetchEntitlements && !ignoreCache) {
    return Promise.resolve();
  }
  return new Promise(function(resolve, reject) {
    var apiEndpoint, apiPath, https, options, req, token;
    try {
      https = require('https');
    } catch (error) {
      console.log("skipping fetchEntitlements, no https present");
      reject();
    }
    if (!stateContext.event.context.System.apiEndpoint) {
      // If there's no API endpoint this is an offline test.
      resolve();
    }
    // endpoint is region-specific:
    // e.g. https://api.amazonalexa.com vs. https://api.eu.amazonalexa.com
    apiEndpoint = stateContext.event.context.System.apiEndpoint;
    apiEndpoint = apiEndpoint.replace("https://", "");
    apiPath = "/v1/users/~current/skills/~current/inSkillProducts";
    token = "bearer " + stateContext.event.context.System.apiAccessToken;
    options = {
      host: apiEndpoint,
      path: apiPath,
      method: 'GET',
      headers: {
        "Content-Type": 'application/json',
        "Accept-Language": stateContext.request.locale,
        "Authorization": token
      }
    };
    req = https.get(options, (res) => {
      var returnData;
      res.setEncoding("utf8");
      if (res.statusCode !== 200) {
        reject();
      }
      returnData = "";
      res.on('data', (chunk) => {
        return returnData += chunk;
      });
      return res.on('end', () => {
        var ref;
        console.log(`fetchEntitlements() returned: ${returnData}`);
        stateContext.monetization.inSkillProducts = (ref = JSON.parse(returnData).inSkillProducts) != null ? ref : [];
        stateContext.monetization.fetchEntitlements = false;
        stateContext.db.write("__monetization", stateContext.monetization);
        return resolve();
      });
    });
    return req.on('error', function(e) {
      console.log(`Error while querying inSkillProducts: ${e}`);
      return reject(e);
    });
  });
};

getReferenceNameByProductId = function(stateContext, productId) {
  var len, n, p, ref;
  ref = stateContext.monetization.inSkillProducts;
  for (n = 0, len = ref.length; n < len; n++) {
    p = ref[n];
    if (p.productId === productId) {
      return p.referenceName;
    }
  }
  return null;
};

buildCancelInSkillProductDirective = async(stateContext, referenceName) => {
  var isp;
  isp = (await getProductByReferenceName(stateContext, referenceName));
  if (isp == null) {
    console.log(`buildCancelInSkillProductDirective(): in-skill product "${referenceName}" not found.`);
    return;
  }
  stateContext.directives.push({
    "type": "Connections.SendRequest",
    "name": "Cancel",
    "payload": {
      "InSkillProduct": {
        "productId": isp.productId
      }
    },
    "token": "bearer " + stateContext.event.context.System.apiAccessToken
  });
  return stateContext.shouldEndSession = true;
};

buildUpsellInSkillProductDirective = async(stateContext, referenceName, upsellMessage = '') => {
  var isp;
  isp = (await getProductByReferenceName(stateContext, referenceName));
  if (isp == null) {
    console.log(`buildUpsellInSkillProductDirective(): in-skill product "${referenceName}" not found.`);
    return;
  }
  stateContext.directives.push({
    "type": "Connections.SendRequest",
    "name": "Upsell",
    "payload": {
      "InSkillProduct": {
        "productId": isp.productId
      },
      "upsellMessage": upsellMessage
    },
    "token": "bearer " + stateContext.event.context.System.apiAccessToken
  });
  return stateContext.shouldEndSession = true;
};

// *** Initializer functions from loaded extensions
let extensionEvents = {};
let extensionRequests = {};
function initializeExtensionObjects(context){
  let ref = null;

};var jsonFiles = {};
jsonFiles['package-lock.json'] = {"name":"burrowClockSkill","version":"1.0.0","lockfileVersion":1,"requires":true,"dependencies":{"ajv":{"version":"6.11.0","resolved":"https://registry.npmjs.org/ajv/-/ajv-6.11.0.tgz","integrity":"sha512-nCprB/0syFYy9fVYU1ox1l2KN8S9I+tziH8D4zdZuLT3N6RMlGSGt5FSTpAiHB/Whv8Qs1cWHma1aMKZyaHRKA==","requires":{"fast-deep-equal":"^3.1.1","fast-json-stable-stringify":"^2.0.0","json-schema-traverse":"^0.4.1","uri-js":"^4.2.2"}},"asn1":{"version":"0.2.4","resolved":"https://registry.npmjs.org/asn1/-/asn1-0.2.4.tgz","integrity":"sha512-jxwzQpLQjSmWXgwaCZE9Nz+glAG01yF1QnWgbhGwHI5A6FRIEY6IVqtHhIepHqI7/kyEyQEagBC5mBEFlIYvdg==","requires":{"safer-buffer":"~2.1.0"}},"assert-plus":{"version":"1.0.0","resolved":"https://registry.npmjs.org/assert-plus/-/assert-plus-1.0.0.tgz","integrity":"sha1-8S4PPF13sLHN2RRpQuTpbB5N1SU="},"asynckit":{"version":"0.4.0","resolved":"https://registry.npmjs.org/asynckit/-/asynckit-0.4.0.tgz","integrity":"sha1-x57Zf380y48robyXkLzDZkdLS3k="},"aws-sign2":{"version":"0.7.0","resolved":"https://registry.npmjs.org/aws-sign2/-/aws-sign2-0.7.0.tgz","integrity":"sha1-tG6JCTSpWR8tL2+G1+ap8bP+dqg="},"aws4":{"version":"1.9.1","resolved":"https://registry.npmjs.org/aws4/-/aws4-1.9.1.tgz","integrity":"sha512-wMHVg2EOHaMRxbzgFJ9gtjOOCrI80OHLG14rxi28XwOW8ux6IiEbRCGGGqCtdAIg4FQCbW20k9RsT4y3gJlFug=="},"bcrypt-pbkdf":{"version":"1.0.2","resolved":"https://registry.npmjs.org/bcrypt-pbkdf/-/bcrypt-pbkdf-1.0.2.tgz","integrity":"sha1-pDAdOJtqQ/m2f/PKEaP2Y342Dp4=","requires":{"tweetnacl":"^0.14.3"}},"burrowClockSkill-lib":{"version":"file:../lib","requires":{"fetch":"^1.1.0","pino":"5.10.6","pino-pretty":"2.5.0"}},"caseless":{"version":"0.12.0","resolved":"https://registry.npmjs.org/caseless/-/caseless-0.12.0.tgz","integrity":"sha1-G2gcIf+EAzyCZUMJBolCDRhxUdw="},"combined-stream":{"version":"1.0.8","resolved":"https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.8.tgz","integrity":"sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==","requires":{"delayed-stream":"~1.0.0"}},"core-util-is":{"version":"1.0.2","resolved":"https://registry.npmjs.org/core-util-is/-/core-util-is-1.0.2.tgz","integrity":"sha1-tf1UIgqivFq1eqtxQMlAdUUDwac="},"dashdash":{"version":"1.14.1","resolved":"https://registry.npmjs.org/dashdash/-/dashdash-1.14.1.tgz","integrity":"sha1-hTz6D3y+L+1d4gMmuN1YEDX24vA=","requires":{"assert-plus":"^1.0.0"}},"delayed-stream":{"version":"1.0.0","resolved":"https://registry.npmjs.org/delayed-stream/-/delayed-stream-1.0.0.tgz","integrity":"sha1-3zrhmayt+31ECqrgsp4icrJOxhk="},"ecc-jsbn":{"version":"0.1.2","resolved":"https://registry.npmjs.org/ecc-jsbn/-/ecc-jsbn-0.1.2.tgz","integrity":"sha1-OoOpBOVDUyh4dMVkt1SThoSamMk=","requires":{"jsbn":"~0.1.0","safer-buffer":"^2.1.0"}},"extend":{"version":"3.0.2","resolved":"https://registry.npmjs.org/extend/-/extend-3.0.2.tgz","integrity":"sha512-fjquC59cD7CyW6urNXK0FBufkZcoiGG80wTuPujX590cB5Ttln20E2UB4S/WARVqhXffZl2LNgS+gQdPIIim/g=="},"extsprintf":{"version":"1.3.0","resolved":"https://registry.npmjs.org/extsprintf/-/extsprintf-1.3.0.tgz","integrity":"sha1-lpGEQOMEGnpBT4xS48V06zw+HgU="},"fast-deep-equal":{"version":"3.1.1","resolved":"https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.1.tgz","integrity":"sha512-8UEa58QDLauDNfpbrX55Q9jrGHThw2ZMdOky5Gl1CDtVeJDPVrG4Jxx1N8jw2gkWaff5UUuX1KJd+9zGe2B+ZA=="},"fast-json-stable-stringify":{"version":"2.1.0","resolved":"https://registry.npmjs.org/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz","integrity":"sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw=="},"forever-agent":{"version":"0.6.1","resolved":"https://registry.npmjs.org/forever-agent/-/forever-agent-0.6.1.tgz","integrity":"sha1-+8cfDEGt6zf5bFd60e1C2P2sypE="},"form-data":{"version":"2.3.3","resolved":"https://registry.npmjs.org/form-data/-/form-data-2.3.3.tgz","integrity":"sha512-1lLKB2Mu3aGP1Q/2eCOx0fNbRMe7XdwktwOruhfqqd0rIJWwN4Dh+E3hrPSlDCXnSR7UtZ1N38rVXm+6+MEhJQ==","requires":{"asynckit":"^0.4.0","combined-stream":"^1.0.6","mime-types":"^2.1.12"}},"getpass":{"version":"0.1.7","resolved":"https://registry.npmjs.org/getpass/-/getpass-0.1.7.tgz","integrity":"sha1-Xv+OPmhNVprkyysSgmBOi6YhSfo=","requires":{"assert-plus":"^1.0.0"}},"har-schema":{"version":"2.0.0","resolved":"https://registry.npmjs.org/har-schema/-/har-schema-2.0.0.tgz","integrity":"sha1-qUwiJOvKwEeCoNkDVSHyRzW37JI="},"har-validator":{"version":"5.1.3","resolved":"https://registry.npmjs.org/har-validator/-/har-validator-5.1.3.tgz","integrity":"sha512-sNvOCzEQNr/qrvJgc3UG/kD4QtlHycrzwS+6mfTrrSq97BvaYcPZZI1ZSqGSPR73Cxn4LKTD4PttRwfU7jWq5g==","requires":{"ajv":"^6.5.5","har-schema":"^2.0.0"}},"http-signature":{"version":"1.2.0","resolved":"https://registry.npmjs.org/http-signature/-/http-signature-1.2.0.tgz","integrity":"sha1-muzZJRFHcvPZW2WmCruPfBj7rOE=","requires":{"assert-plus":"^1.0.0","jsprim":"^1.2.2","sshpk":"^1.7.0"}},"is-typedarray":{"version":"1.0.0","resolved":"https://registry.npmjs.org/is-typedarray/-/is-typedarray-1.0.0.tgz","integrity":"sha1-5HnICFjfDBsR3dppQPlgEfzaSpo="},"isstream":{"version":"0.1.2","resolved":"https://registry.npmjs.org/isstream/-/isstream-0.1.2.tgz","integrity":"sha1-R+Y/evVa+m+S4VAOaQ64uFKcCZo="},"jsbn":{"version":"0.1.1","resolved":"https://registry.npmjs.org/jsbn/-/jsbn-0.1.1.tgz","integrity":"sha1-peZUwuWi3rXyAdls77yoDA7y9RM="},"json-schema":{"version":"0.2.3","resolved":"https://registry.npmjs.org/json-schema/-/json-schema-0.2.3.tgz","integrity":"sha1-tIDIkuWaLwWVTOcnvT8qTogvnhM="},"json-schema-traverse":{"version":"0.4.1","resolved":"https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz","integrity":"sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg=="},"json-stringify-safe":{"version":"5.0.1","resolved":"https://registry.npmjs.org/json-stringify-safe/-/json-stringify-safe-5.0.1.tgz","integrity":"sha1-Epai1Y/UXxmg9s4B1lcB4sc1tus="},"jsprim":{"version":"1.4.1","resolved":"https://registry.npmjs.org/jsprim/-/jsprim-1.4.1.tgz","integrity":"sha1-MT5mvB5cwG5Di8G3SZwuXFastqI=","requires":{"assert-plus":"1.0.0","extsprintf":"1.3.0","json-schema":"0.2.3","verror":"1.10.0"}},"mime-db":{"version":"1.43.0","resolved":"https://registry.npmjs.org/mime-db/-/mime-db-1.43.0.tgz","integrity":"sha512-+5dsGEEovYbT8UY9yD7eE4XTc4UwJ1jBYlgaQQF38ENsKR3wj/8q8RFZrF9WIZpB2V1ArTVFUva8sAul1NzRzQ=="},"mime-types":{"version":"2.1.26","resolved":"https://registry.npmjs.org/mime-types/-/mime-types-2.1.26.tgz","integrity":"sha512-01paPWYgLrkqAyrlDorC1uDwl2p3qZT7yl806vW7DvDoxwXi46jsjFbg+WdwotBIk6/MbEhO/dh5aZ5sNj/dWQ==","requires":{"mime-db":"1.43.0"}},"oauth-sign":{"version":"0.9.0","resolved":"https://registry.npmjs.org/oauth-sign/-/oauth-sign-0.9.0.tgz","integrity":"sha512-fexhUFFPTGV8ybAtSIGbV6gOkSv8UtRbDBnAyLQw4QPKkgNlsH2ByPGtMUqdWkos6YCRmAqViwgZrJc/mRDzZQ=="},"performance-now":{"version":"2.1.0","resolved":"https://registry.npmjs.org/performance-now/-/performance-now-2.1.0.tgz","integrity":"sha1-Ywn04OX6kT7BxpMHrjZLSzd8nns="},"psl":{"version":"1.7.0","resolved":"https://registry.npmjs.org/psl/-/psl-1.7.0.tgz","integrity":"sha512-5NsSEDv8zY70ScRnOTn7bK7eanl2MvFrOrS/R6x+dBt5g1ghnj9Zv90kO8GwT8gxcu2ANyFprnFYB85IogIJOQ=="},"punycode":{"version":"2.1.1","resolved":"https://registry.npmjs.org/punycode/-/punycode-2.1.1.tgz","integrity":"sha512-XRsRjdf+j5ml+y/6GKHPZbrF/8p2Yga0JPtdqTIY2Xe5ohJPD9saDJJLPvp9+NSBprVvevdXZybnj2cv8OEd0A=="},"qs":{"version":"6.5.2","resolved":"https://registry.npmjs.org/qs/-/qs-6.5.2.tgz","integrity":"sha512-N5ZAX4/LxJmF+7wN74pUD6qAh9/wnvdQcjq9TZjevvXzSUo7bfmw91saqMjzGS2xq91/odN2dW/WOl7qQHNDGA=="},"request":{"version":"2.88.0","resolved":"https://registry.npmjs.org/request/-/request-2.88.0.tgz","integrity":"sha512-NAqBSrijGLZdM0WZNsInLJpkJokL72XYjUpnB0iwsRgxh7dB6COrHnTBNwN0E+lHDAJzu7kLAkDeY08z2/A0hg==","requires":{"aws-sign2":"~0.7.0","aws4":"^1.8.0","caseless":"~0.12.0","combined-stream":"~1.0.6","extend":"~3.0.2","forever-agent":"~0.6.1","form-data":"~2.3.2","har-validator":"~5.1.0","http-signature":"~1.2.0","is-typedarray":"~1.0.0","isstream":"~0.1.2","json-stringify-safe":"~5.0.1","mime-types":"~2.1.19","oauth-sign":"~0.9.0","performance-now":"^2.1.0","qs":"~6.5.2","safe-buffer":"^5.1.2","tough-cookie":"~2.4.3","tunnel-agent":"^0.6.0","uuid":"^3.3.2"}},"safe-buffer":{"version":"5.2.0","resolved":"https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.0.tgz","integrity":"sha512-fZEwUGbVl7kouZs1jCdMLdt95hdIv0ZeHg6L7qPeciMZhZ+/gdesW4wgTARkrFWEpspjEATAzUGPG8N2jJiwbg=="},"safer-buffer":{"version":"2.1.2","resolved":"https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz","integrity":"sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg=="},"sshpk":{"version":"1.16.1","resolved":"https://registry.npmjs.org/sshpk/-/sshpk-1.16.1.tgz","integrity":"sha512-HXXqVUq7+pcKeLqqZj6mHFUMvXtOJt1uoUx09pFW6011inTMxqI8BA8PM95myrIyyKwdnzjdFjLiE6KBPVtJIg==","requires":{"asn1":"~0.2.3","assert-plus":"^1.0.0","bcrypt-pbkdf":"^1.0.0","dashdash":"^1.12.0","ecc-jsbn":"~0.1.1","getpass":"^0.1.1","jsbn":"~0.1.0","safer-buffer":"^2.0.2","tweetnacl":"~0.14.0"}},"tough-cookie":{"version":"2.4.3","resolved":"https://registry.npmjs.org/tough-cookie/-/tough-cookie-2.4.3.tgz","integrity":"sha512-Q5srk/4vDM54WJsJio3XNn6K2sCG+CQ8G5Wz6bZhRZoAe/+TxjWB/GlFAnYEbkYVlON9FMk/fE3h2RLpPXo4lQ==","requires":{"psl":"^1.1.24","punycode":"^1.4.1"},"dependencies":{"punycode":{"version":"1.4.1","resolved":"https://registry.npmjs.org/punycode/-/punycode-1.4.1.tgz","integrity":"sha1-wNWmOycYgArY4esPpSachN1BhF4="}}},"tunnel-agent":{"version":"0.6.0","resolved":"https://registry.npmjs.org/tunnel-agent/-/tunnel-agent-0.6.0.tgz","integrity":"sha1-J6XeoGs2sEoKmWZ3SykIaPD8QP0=","requires":{"safe-buffer":"^5.0.1"}},"tweetnacl":{"version":"0.14.5","resolved":"https://registry.npmjs.org/tweetnacl/-/tweetnacl-0.14.5.tgz","integrity":"sha1-WuaBd/GS1EViadEIr6k/+HQ/T2Q="},"uri-js":{"version":"4.2.2","resolved":"https://registry.npmjs.org/uri-js/-/uri-js-4.2.2.tgz","integrity":"sha512-KY9Frmirql91X2Qgjry0Wd4Y+YTdrdZheS8TFwvkbLWf/G5KNJDCh6pKL5OZctEW4+0Baa5idK2ZQuELRwPznQ==","requires":{"punycode":"^2.1.0"}},"uuid":{"version":"3.4.0","resolved":"https://registry.npmjs.org/uuid/-/uuid-3.4.0.tgz","integrity":"sha512-HjSDRw6gZE5JMggctHBcjVak08+KEVhSIiDzFnT9S9aegmp85S/bReBVTb4QTFaRNptJ9kuYaNhnbNEOkbKb/A=="},"verror":{"version":"1.10.0","resolved":"https://registry.npmjs.org/verror/-/verror-1.10.0.tgz","integrity":"sha1-OhBcoXBTr1XW4nDB+CiGguGNpAA=","requires":{"assert-plus":"^1.0.0","core-util-is":"1.0.2","extsprintf":"^1.2.0"}}}};
jsonFiles['package.json'] = {"name":"burrowClockSkill","version":"1.0.0","main":"index.js","scripts":{"clean":"npx rimraf ./node_modules && npm install","deploy":"npm run clean && litexa deploy"},"dependencies":{"burrowClockSkill-lib":"file:../lib","request":"^2.88.0"},"author":"Amazon","license":"ISC"};
/*
 *  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *  Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 *  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

var {todayName, addNumbers, callLocalizar} = require('burrowClockSkill-lib');




