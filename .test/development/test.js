var litexa = exports.litexa;
if (typeof(litexa) === 'undefined') { litexa = {}; }
if (typeof(litexa.modulesRoot) === 'undefined') { litexa.modulesRoot = process.cwd(); }
litexa.DEPLOY = {};

litexa.overridableFunctions = {
  generateDBKey: function(identity) {
    return `${identity.deviceId}`;
  }
};
  /*
   * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
   * SPDX-License-Identifier: Apache-2.0
   * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   */
var DBTypeWrapper, brightenColor, buildBuyInSkillProductDirective, buildCancelInSkillProductDirective, buildUpsellInSkillProductDirective, daysBetween, deepClone, diceCheck, diceRoll, escapeSpeech, fetchEntitlements, getProductByProductId, getProductByReferenceName, getReferenceNameByProductId, hexFromRGB, hoursBetween, inSkillProductBought, interpolateRGB, isActuallyANumber, minutesBetween, pickSayFragment, pickSayString, randomArrayItem, randomIndex, reportValueMetric, rgbFromHSL, rgbFromHex, shuffleArray,
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
      history[0] = value % 2;
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
      history[0] = value % 5;
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
  return value % count;
};

pickSayFragment = function(context, key, options) {
  var index;
  index = pickSayString(context, key, options.length);
  return options[index];
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
        value = new dbType();
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
    console.log(`buildBuyInSkillProductDirective(): in-skill product \"${referenceName}\" not found.`);
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
    console.log(`buildCancelInSkillProductDirective(): in-skill product \"${referenceName}\" not found.`);
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
    console.log(`buildUpsellInSkillProductDirective(): in-skill product \"${referenceName}\" not found.`);
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

/*
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */
litexa.gadgetAnimation = {
  // Gadget animations are for Echo Buttons right now
  // this is about animating the colors on the buttons
  // with the SetLight directive
  buildKey: function(color, duration, blend) {
    if (color[0] === '#') {
      // build the inner key structure of an
      // animation to pass into directive
      color = color.slice(1);
    }
    return {
      color: color.toUpperCase(),
      durationMs: duration,
      blend: blend != null ? blend : true
    };
  },
  animationFromArray: function(keyData) {
    var build, d, i, len, results;
    // build an animation array suitable to give
    // the directive function, from an array of
    // arrays of arguments to pass buildKey
    // e.g. [ ['FF0000',1000,true], ['00FFFF',2000,true] ]
    build = litexa.gadgetAnimation.buildKey;
    results = [];
    for (i = 0, len = keyData.length; i < len; i++) {
      d = keyData[i];
      results.push(build(d[0], d[1], d[2]));
    }
    return results;
  },
  singleColorDirective: function(targets, color, duration) {
    var animation;
    animation = [litexa.gadgetAnimation.buildKey(color, duration, false)];
    return litexa.gadgetAnimation.directive(targets, 1, animation, "none");
  },
  resetTriggersDirectives: function(targets) {
    return [litexa.gadgetAnimation.directive(targets, 1, [litexa.gadgetAnimation.buildKey("FFFFFF", 100, false)], "buttonDown"), litexa.gadgetAnimation.directive(targets, 1, [litexa.gadgetAnimation.buildKey("FFFFFF", 100, false)], "buttonUp")];
  },
  directive: function(targets, repeats, animation, trigger, delay) {
    return {
      // directive to animate Echo buttons
      type: "GadgetController.SetLight",
      version: 1,
      targetGadgets: targets,
      parameters: {
        triggerEvent: trigger != null ? trigger : "none",
        triggerEventTimeMs: delay != null ? delay : 0,
        animations: [
          {
            targetLights: ["1"],
            repeat: repeats,
            sequence: animation
          }
        ]
      }
    };
  }
};

// *** Initializer functions from loaded extensions
let extensionEvents = {};
let extensionRequests = {};
function initializeExtensionObjects(context){
  let ref = null;

};
litexa.extendedEventNames = [];
// END OF LIBRARY CODE

// version summary
const userAgent = "@litexa/core/0.7.1 Node/v10.16.0";

litexa.projectName = 'burrowClockSkill';
var __languages = {};
__languages['default'] = { enterState:{}, processIntents:{}, exitState:{}, dataTables:{} };
__languages['es-MX'] = { enterState:{}, processIntents:{}, exitState:{}, dataTables:{} };
litexa.sayMapping = {
};
var jsonSourceFiles = {}; 
jsonSourceFiles['package-lock.json'] = {
  "name": "burrowClockSkill",
  "version": "1.0.0",
  "lockfileVersion": 1,
  "requires": true,
  "dependencies": {
    "ajv": {
      "version": "6.11.0",
      "resolved": "https://registry.npmjs.org/ajv/-/ajv-6.11.0.tgz",
      "integrity": "sha512-nCprB/0syFYy9fVYU1ox1l2KN8S9I+tziH8D4zdZuLT3N6RMlGSGt5FSTpAiHB/Whv8Qs1cWHma1aMKZyaHRKA==",
      "requires": {
        "fast-deep-equal": "^3.1.1",
        "fast-json-stable-stringify": "^2.0.0",
        "json-schema-traverse": "^0.4.1",
        "uri-js": "^4.2.2"
      }
    },
    "asn1": {
      "version": "0.2.4",
      "resolved": "https://registry.npmjs.org/asn1/-/asn1-0.2.4.tgz",
      "integrity": "sha512-jxwzQpLQjSmWXgwaCZE9Nz+glAG01yF1QnWgbhGwHI5A6FRIEY6IVqtHhIepHqI7/kyEyQEagBC5mBEFlIYvdg==",
      "requires": {
        "safer-buffer": "~2.1.0"
      }
    },
    "assert-plus": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/assert-plus/-/assert-plus-1.0.0.tgz",
      "integrity": "sha1-8S4PPF13sLHN2RRpQuTpbB5N1SU="
    },
    "asynckit": {
      "version": "0.4.0",
      "resolved": "https://registry.npmjs.org/asynckit/-/asynckit-0.4.0.tgz",
      "integrity": "sha1-x57Zf380y48robyXkLzDZkdLS3k="
    },
    "aws-sign2": {
      "version": "0.7.0",
      "resolved": "https://registry.npmjs.org/aws-sign2/-/aws-sign2-0.7.0.tgz",
      "integrity": "sha1-tG6JCTSpWR8tL2+G1+ap8bP+dqg="
    },
    "aws4": {
      "version": "1.9.1",
      "resolved": "https://registry.npmjs.org/aws4/-/aws4-1.9.1.tgz",
      "integrity": "sha512-wMHVg2EOHaMRxbzgFJ9gtjOOCrI80OHLG14rxi28XwOW8ux6IiEbRCGGGqCtdAIg4FQCbW20k9RsT4y3gJlFug=="
    },
    "bcrypt-pbkdf": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/bcrypt-pbkdf/-/bcrypt-pbkdf-1.0.2.tgz",
      "integrity": "sha1-pDAdOJtqQ/m2f/PKEaP2Y342Dp4=",
      "requires": {
        "tweetnacl": "^0.14.3"
      }
    },
    "burrowClockSkill-lib": {
      "version": "file:../lib"
    },
    "caseless": {
      "version": "0.12.0",
      "resolved": "https://registry.npmjs.org/caseless/-/caseless-0.12.0.tgz",
      "integrity": "sha1-G2gcIf+EAzyCZUMJBolCDRhxUdw="
    },
    "combined-stream": {
      "version": "1.0.8",
      "resolved": "https://registry.npmjs.org/combined-stream/-/combined-stream-1.0.8.tgz",
      "integrity": "sha512-FQN4MRfuJeHf7cBbBMJFXhKSDq+2kAArBlmRBvcvFE5BB1HZKXtSFASDhdlz9zOYwxh8lDdnvmMOe/+5cdoEdg==",
      "requires": {
        "delayed-stream": "~1.0.0"
      }
    },
    "core-util-is": {
      "version": "1.0.2",
      "resolved": "https://registry.npmjs.org/core-util-is/-/core-util-is-1.0.2.tgz",
      "integrity": "sha1-tf1UIgqivFq1eqtxQMlAdUUDwac="
    },
    "dashdash": {
      "version": "1.14.1",
      "resolved": "https://registry.npmjs.org/dashdash/-/dashdash-1.14.1.tgz",
      "integrity": "sha1-hTz6D3y+L+1d4gMmuN1YEDX24vA=",
      "requires": {
        "assert-plus": "^1.0.0"
      }
    },
    "delayed-stream": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/delayed-stream/-/delayed-stream-1.0.0.tgz",
      "integrity": "sha1-3zrhmayt+31ECqrgsp4icrJOxhk="
    },
    "ecc-jsbn": {
      "version": "0.1.2",
      "resolved": "https://registry.npmjs.org/ecc-jsbn/-/ecc-jsbn-0.1.2.tgz",
      "integrity": "sha1-OoOpBOVDUyh4dMVkt1SThoSamMk=",
      "requires": {
        "jsbn": "~0.1.0",
        "safer-buffer": "^2.1.0"
      }
    },
    "extend": {
      "version": "3.0.2",
      "resolved": "https://registry.npmjs.org/extend/-/extend-3.0.2.tgz",
      "integrity": "sha512-fjquC59cD7CyW6urNXK0FBufkZcoiGG80wTuPujX590cB5Ttln20E2UB4S/WARVqhXffZl2LNgS+gQdPIIim/g=="
    },
    "extsprintf": {
      "version": "1.3.0",
      "resolved": "https://registry.npmjs.org/extsprintf/-/extsprintf-1.3.0.tgz",
      "integrity": "sha1-lpGEQOMEGnpBT4xS48V06zw+HgU="
    },
    "fast-deep-equal": {
      "version": "3.1.1",
      "resolved": "https://registry.npmjs.org/fast-deep-equal/-/fast-deep-equal-3.1.1.tgz",
      "integrity": "sha512-8UEa58QDLauDNfpbrX55Q9jrGHThw2ZMdOky5Gl1CDtVeJDPVrG4Jxx1N8jw2gkWaff5UUuX1KJd+9zGe2B+ZA=="
    },
    "fast-json-stable-stringify": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/fast-json-stable-stringify/-/fast-json-stable-stringify-2.1.0.tgz",
      "integrity": "sha512-lhd/wF+Lk98HZoTCtlVraHtfh5XYijIjalXck7saUtuanSDyLMxnHhSXEDJqHxD7msR8D0uCmqlkwjCV8xvwHw=="
    },
    "forever-agent": {
      "version": "0.6.1",
      "resolved": "https://registry.npmjs.org/forever-agent/-/forever-agent-0.6.1.tgz",
      "integrity": "sha1-+8cfDEGt6zf5bFd60e1C2P2sypE="
    },
    "form-data": {
      "version": "2.3.3",
      "resolved": "https://registry.npmjs.org/form-data/-/form-data-2.3.3.tgz",
      "integrity": "sha512-1lLKB2Mu3aGP1Q/2eCOx0fNbRMe7XdwktwOruhfqqd0rIJWwN4Dh+E3hrPSlDCXnSR7UtZ1N38rVXm+6+MEhJQ==",
      "requires": {
        "asynckit": "^0.4.0",
        "combined-stream": "^1.0.6",
        "mime-types": "^2.1.12"
      }
    },
    "getpass": {
      "version": "0.1.7",
      "resolved": "https://registry.npmjs.org/getpass/-/getpass-0.1.7.tgz",
      "integrity": "sha1-Xv+OPmhNVprkyysSgmBOi6YhSfo=",
      "requires": {
        "assert-plus": "^1.0.0"
      }
    },
    "har-schema": {
      "version": "2.0.0",
      "resolved": "https://registry.npmjs.org/har-schema/-/har-schema-2.0.0.tgz",
      "integrity": "sha1-qUwiJOvKwEeCoNkDVSHyRzW37JI="
    },
    "har-validator": {
      "version": "5.1.3",
      "resolved": "https://registry.npmjs.org/har-validator/-/har-validator-5.1.3.tgz",
      "integrity": "sha512-sNvOCzEQNr/qrvJgc3UG/kD4QtlHycrzwS+6mfTrrSq97BvaYcPZZI1ZSqGSPR73Cxn4LKTD4PttRwfU7jWq5g==",
      "requires": {
        "ajv": "^6.5.5",
        "har-schema": "^2.0.0"
      }
    },
    "http-signature": {
      "version": "1.2.0",
      "resolved": "https://registry.npmjs.org/http-signature/-/http-signature-1.2.0.tgz",
      "integrity": "sha1-muzZJRFHcvPZW2WmCruPfBj7rOE=",
      "requires": {
        "assert-plus": "^1.0.0",
        "jsprim": "^1.2.2",
        "sshpk": "^1.7.0"
      }
    },
    "is-typedarray": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/is-typedarray/-/is-typedarray-1.0.0.tgz",
      "integrity": "sha1-5HnICFjfDBsR3dppQPlgEfzaSpo="
    },
    "isstream": {
      "version": "0.1.2",
      "resolved": "https://registry.npmjs.org/isstream/-/isstream-0.1.2.tgz",
      "integrity": "sha1-R+Y/evVa+m+S4VAOaQ64uFKcCZo="
    },
    "jsbn": {
      "version": "0.1.1",
      "resolved": "https://registry.npmjs.org/jsbn/-/jsbn-0.1.1.tgz",
      "integrity": "sha1-peZUwuWi3rXyAdls77yoDA7y9RM="
    },
    "json-schema": {
      "version": "0.2.3",
      "resolved": "https://registry.npmjs.org/json-schema/-/json-schema-0.2.3.tgz",
      "integrity": "sha1-tIDIkuWaLwWVTOcnvT8qTogvnhM="
    },
    "json-schema-traverse": {
      "version": "0.4.1",
      "resolved": "https://registry.npmjs.org/json-schema-traverse/-/json-schema-traverse-0.4.1.tgz",
      "integrity": "sha512-xbbCH5dCYU5T8LcEhhuh7HJ88HXuW3qsI3Y0zOZFKfZEHcpWiHU/Jxzk629Brsab/mMiHQti9wMP+845RPe3Vg=="
    },
    "json-stringify-safe": {
      "version": "5.0.1",
      "resolved": "https://registry.npmjs.org/json-stringify-safe/-/json-stringify-safe-5.0.1.tgz",
      "integrity": "sha1-Epai1Y/UXxmg9s4B1lcB4sc1tus="
    },
    "jsprim": {
      "version": "1.4.1",
      "resolved": "https://registry.npmjs.org/jsprim/-/jsprim-1.4.1.tgz",
      "integrity": "sha1-MT5mvB5cwG5Di8G3SZwuXFastqI=",
      "requires": {
        "assert-plus": "1.0.0",
        "extsprintf": "1.3.0",
        "json-schema": "0.2.3",
        "verror": "1.10.0"
      }
    },
    "mime-db": {
      "version": "1.43.0",
      "resolved": "https://registry.npmjs.org/mime-db/-/mime-db-1.43.0.tgz",
      "integrity": "sha512-+5dsGEEovYbT8UY9yD7eE4XTc4UwJ1jBYlgaQQF38ENsKR3wj/8q8RFZrF9WIZpB2V1ArTVFUva8sAul1NzRzQ=="
    },
    "mime-types": {
      "version": "2.1.26",
      "resolved": "https://registry.npmjs.org/mime-types/-/mime-types-2.1.26.tgz",
      "integrity": "sha512-01paPWYgLrkqAyrlDorC1uDwl2p3qZT7yl806vW7DvDoxwXi46jsjFbg+WdwotBIk6/MbEhO/dh5aZ5sNj/dWQ==",
      "requires": {
        "mime-db": "1.43.0"
      }
    },
    "oauth-sign": {
      "version": "0.9.0",
      "resolved": "https://registry.npmjs.org/oauth-sign/-/oauth-sign-0.9.0.tgz",
      "integrity": "sha512-fexhUFFPTGV8ybAtSIGbV6gOkSv8UtRbDBnAyLQw4QPKkgNlsH2ByPGtMUqdWkos6YCRmAqViwgZrJc/mRDzZQ=="
    },
    "performance-now": {
      "version": "2.1.0",
      "resolved": "https://registry.npmjs.org/performance-now/-/performance-now-2.1.0.tgz",
      "integrity": "sha1-Ywn04OX6kT7BxpMHrjZLSzd8nns="
    },
    "psl": {
      "version": "1.7.0",
      "resolved": "https://registry.npmjs.org/psl/-/psl-1.7.0.tgz",
      "integrity": "sha512-5NsSEDv8zY70ScRnOTn7bK7eanl2MvFrOrS/R6x+dBt5g1ghnj9Zv90kO8GwT8gxcu2ANyFprnFYB85IogIJOQ=="
    },
    "punycode": {
      "version": "2.1.1",
      "resolved": "https://registry.npmjs.org/punycode/-/punycode-2.1.1.tgz",
      "integrity": "sha512-XRsRjdf+j5ml+y/6GKHPZbrF/8p2Yga0JPtdqTIY2Xe5ohJPD9saDJJLPvp9+NSBprVvevdXZybnj2cv8OEd0A=="
    },
    "qs": {
      "version": "6.5.2",
      "resolved": "https://registry.npmjs.org/qs/-/qs-6.5.2.tgz",
      "integrity": "sha512-N5ZAX4/LxJmF+7wN74pUD6qAh9/wnvdQcjq9TZjevvXzSUo7bfmw91saqMjzGS2xq91/odN2dW/WOl7qQHNDGA=="
    },
    "request": {
      "version": "2.88.0",
      "resolved": "https://registry.npmjs.org/request/-/request-2.88.0.tgz",
      "integrity": "sha512-NAqBSrijGLZdM0WZNsInLJpkJokL72XYjUpnB0iwsRgxh7dB6COrHnTBNwN0E+lHDAJzu7kLAkDeY08z2/A0hg==",
      "requires": {
        "aws-sign2": "~0.7.0",
        "aws4": "^1.8.0",
        "caseless": "~0.12.0",
        "combined-stream": "~1.0.6",
        "extend": "~3.0.2",
        "forever-agent": "~0.6.1",
        "form-data": "~2.3.2",
        "har-validator": "~5.1.0",
        "http-signature": "~1.2.0",
        "is-typedarray": "~1.0.0",
        "isstream": "~0.1.2",
        "json-stringify-safe": "~5.0.1",
        "mime-types": "~2.1.19",
        "oauth-sign": "~0.9.0",
        "performance-now": "^2.1.0",
        "qs": "~6.5.2",
        "safe-buffer": "^5.1.2",
        "tough-cookie": "~2.4.3",
        "tunnel-agent": "^0.6.0",
        "uuid": "^3.3.2"
      }
    },
    "safe-buffer": {
      "version": "5.2.0",
      "resolved": "https://registry.npmjs.org/safe-buffer/-/safe-buffer-5.2.0.tgz",
      "integrity": "sha512-fZEwUGbVl7kouZs1jCdMLdt95hdIv0ZeHg6L7qPeciMZhZ+/gdesW4wgTARkrFWEpspjEATAzUGPG8N2jJiwbg=="
    },
    "safer-buffer": {
      "version": "2.1.2",
      "resolved": "https://registry.npmjs.org/safer-buffer/-/safer-buffer-2.1.2.tgz",
      "integrity": "sha512-YZo3K82SD7Riyi0E1EQPojLz7kpepnSQI9IyPbHHg1XXXevb5dJI7tpyN2ADxGcQbHG7vcyRHk0cbwqcQriUtg=="
    },
    "sshpk": {
      "version": "1.16.1",
      "resolved": "https://registry.npmjs.org/sshpk/-/sshpk-1.16.1.tgz",
      "integrity": "sha512-HXXqVUq7+pcKeLqqZj6mHFUMvXtOJt1uoUx09pFW6011inTMxqI8BA8PM95myrIyyKwdnzjdFjLiE6KBPVtJIg==",
      "requires": {
        "asn1": "~0.2.3",
        "assert-plus": "^1.0.0",
        "bcrypt-pbkdf": "^1.0.0",
        "dashdash": "^1.12.0",
        "ecc-jsbn": "~0.1.1",
        "getpass": "^0.1.1",
        "jsbn": "~0.1.0",
        "safer-buffer": "^2.0.2",
        "tweetnacl": "~0.14.0"
      }
    },
    "tough-cookie": {
      "version": "2.4.3",
      "resolved": "https://registry.npmjs.org/tough-cookie/-/tough-cookie-2.4.3.tgz",
      "integrity": "sha512-Q5srk/4vDM54WJsJio3XNn6K2sCG+CQ8G5Wz6bZhRZoAe/+TxjWB/GlFAnYEbkYVlON9FMk/fE3h2RLpPXo4lQ==",
      "requires": {
        "psl": "^1.1.24",
        "punycode": "^1.4.1"
      },
      "dependencies": {
        "punycode": {
          "version": "1.4.1",
          "resolved": "https://registry.npmjs.org/punycode/-/punycode-1.4.1.tgz",
          "integrity": "sha1-wNWmOycYgArY4esPpSachN1BhF4="
        }
      }
    },
    "tunnel-agent": {
      "version": "0.6.0",
      "resolved": "https://registry.npmjs.org/tunnel-agent/-/tunnel-agent-0.6.0.tgz",
      "integrity": "sha1-J6XeoGs2sEoKmWZ3SykIaPD8QP0=",
      "requires": {
        "safe-buffer": "^5.0.1"
      }
    },
    "tweetnacl": {
      "version": "0.14.5",
      "resolved": "https://registry.npmjs.org/tweetnacl/-/tweetnacl-0.14.5.tgz",
      "integrity": "sha1-WuaBd/GS1EViadEIr6k/+HQ/T2Q="
    },
    "uri-js": {
      "version": "4.2.2",
      "resolved": "https://registry.npmjs.org/uri-js/-/uri-js-4.2.2.tgz",
      "integrity": "sha512-KY9Frmirql91X2Qgjry0Wd4Y+YTdrdZheS8TFwvkbLWf/G5KNJDCh6pKL5OZctEW4+0Baa5idK2ZQuELRwPznQ==",
      "requires": {
        "punycode": "^2.1.0"
      }
    },
    "uuid": {
      "version": "3.4.0",
      "resolved": "https://registry.npmjs.org/uuid/-/uuid-3.4.0.tgz",
      "integrity": "sha512-HjSDRw6gZE5JMggctHBcjVak08+KEVhSIiDzFnT9S9aegmp85S/bReBVTb4QTFaRNptJ9kuYaNhnbNEOkbKb/A=="
    },
    "verror": {
      "version": "1.10.0",
      "resolved": "https://registry.npmjs.org/verror/-/verror-1.10.0.tgz",
      "integrity": "sha1-OhBcoXBTr1XW4nDB+CiGguGNpAA=",
      "requires": {
        "assert-plus": "^1.0.0",
        "core-util-is": "1.0.2",
        "extsprintf": "^1.2.0"
      }
    }
  }
};
jsonSourceFiles['package.json'] = {
  "name": "burrowClockSkill",
  "version": "1.0.0",
  "main": "index.js",
  "scripts": {
    "clean": "npx rimraf ./node_modules && npm install",
    "deploy": "npm run clean && litexa deploy"
  },
  "dependencies": {
    "burrowClockSkill-lib": "file:../lib",
    "request": "^2.88.0"
  },
  "author": "Amazon",
  "license": "ISC"
};


__languages.default.jsonFiles = {
  'package-lock.json': jsonSourceFiles['package-lock.json'],
  'package.json': jsonSourceFiles['package.json']
};

__languages['es-MX'].jsonFiles = {
  'package-lock.json': jsonSourceFiles['package-lock.json'],
  'package.json': jsonSourceFiles['package.json']
};

  /*
   * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   * Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
   * SPDX-License-Identifier: Apache-2.0
   * ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   */
var enableStateTracing, getLanguage, handlerSteps, logStateTraces, loggingLevel, ref, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, shouldUniqueURLs,
  indexOf = [].indexOf;

// causes every request and response object to be written to the logs
loggingLevel = (ref = typeof process !== "undefined" && process !== null ? (ref1 = process.env) != null ? ref1.loggingLevel : void 0 : void 0) != null ? ref : null;

// when enabled, logs out every state transition when it happens, useful for tracing what
// order things happened in  when something goes wrong
logStateTraces = (ref2 = typeof process !== "undefined" && process !== null ? (ref3 = process.env) != null ? ref3.logStateTraces : void 0 : void 0) === 'true' || ref2 === true;

enableStateTracing = ((ref4 = typeof process !== "undefined" && process !== null ? (ref5 = process.env) != null ? ref5.enableStateTracing : void 0 : void 0) === 'true' || ref4 === true) || logStateTraces;

// hack for over aggressive Show caching
shouldUniqueURLs = (typeof process !== "undefined" && process !== null ? (ref6 = process.env) != null ? ref6.shouldUniqueURLs : void 0 : void 0) === 'true';

// assets root location is determined by an external variable
litexa.assetsRoot = (ref7 = typeof process !== "undefined" && process !== null ? (ref8 = process.env) != null ? ref8.assetsRoot : void 0 : void 0) != null ? ref7 : litexa.assetsRoot;

handlerSteps = {};

exports.handler = function(event, lambdaContext, callback) {
  var handlerContext;
  handlerContext = {
    originalEvent: event,
    litexa: litexa
  };
  // patch for testing support to be able to toggle this without
  // recreating the lambda
  if (event.__logStateTraces != null) {
    logStateTraces = event.__logStateTraces;
  }
  switch (loggingLevel) {
    case 'verbose':
      // when verbose logging, dump the whole event to the console
      // this is pretty quick, but it makes for massive logs
      exports.Logging.log("VERBOSE REQUEST " + JSON.stringify(event, null, 2));
      break;
    case 'terse':
      exports.Logging.log("VERBOSE REQUEST " + JSON.stringify(event.request, null, 2));
  }
  // patch when missing so downstream doesn't have to check
  if (event.session == null) {
    event.session = {};
  }
  if (event.session.attributes == null) {
    event.session.attributes = {};
  }
  return handlerSteps.extractIdentity(event, handlerContext).then(function() {
    return handlerSteps.checkFastExit(event, handlerContext);
  }).then(function(proceed) {
    if (!proceed) {
      return callback(null, {});
    }
    return handlerSteps.runConcurrencyLoop(event, handlerContext).then(async function(response) {
      var err, events, extensionName, promise;
      // if we have post process extensions, then run each one in series
      promise = Promise.resolve();
      for (extensionName in extensionEvents) {
        events = extensionEvents[extensionName];
        if (events.beforeFinalResponse != null) {
          try {
            await events.beforeFinalResponse(response);
          } catch (error) {
            err = error;
            exports.Logging.error(`Failed to execute the beforeFinalResponse event for extension ${extensionName}: ${err}`);
            throw err;
          }
        }
      }
      return response;
    }).then(function(response) {
      // if we're fully resolved here, we can return the final result
      if (loggingLevel) {
        exports.Logging.log("VERBOSE RESPONSE " + JSON.stringify(response, null, 2));
      }
      return callback(null, response);
    }).catch(function(err) {
      // otherwise, we've failed, so return as an error, without data
      return callback(err, null);
    });
  });
};

handlerSteps.extractIdentity = function(event, handlerContext) {
  return new Promise(function(resolve, reject) {
    var identity, ref10, ref11, ref12, ref13, ref14, ref9;
    // extract the info we consider to be the user's identity. Note
    // different events may provide this information in different places
    handlerContext.identity = identity = {};
    if (((ref9 = event.context) != null ? ref9.System : void 0) != null) {
      identity.requestAppId = (ref10 = event.context.System.application) != null ? ref10.applicationId : void 0;
      identity.userId = (ref11 = event.context.System.user) != null ? ref11.userId : void 0;
      identity.deviceId = (ref12 = event.context.System.device) != null ? ref12.deviceId : void 0;
    } else if (event.session != null) {
      identity.requestAppId = (ref13 = event.session.application) != null ? ref13.applicationId : void 0;
      identity.userId = (ref14 = event.session.user) != null ? ref14.userId : void 0;
      identity.deviceId = 'no-device';
    }
    return resolve();
  });
};

getLanguage = function(event) {
  var __language, lang, langCode, language;
  // work out the language, from the locale, if it exists
  language = 'default';
  if (event.request.locale != null) {
    lang = event.request.locale;
    langCode = lang.slice(0, 2);
    for (__language in __languages) {
      if ((lang.toLowerCase() === __language.toLowerCase()) || (langCode === __language)) {
        language = __language;
      }
    }
  }
  return language;
};

handlerSteps.checkFastExit = function(event, handlerContext) {
  var terminalEvent;
  // detect fast exit for valid events we don't route yet, or have no response to
  terminalEvent = false;
  switch (event.request.type) {
    case 'System.ExceptionEncountered':
      exports.Logging.error(`ERROR System.ExceptionEncountered: ${JSON.stringify(event.request)}`);
      terminalEvent = true;
      break;
    case 'SessionEndedRequest':
      terminalEvent = true;
  }
  if (!terminalEvent) {
    return true;
  }
  // this is an event that ends the session, but we may have code
  // that needs to cleanup on skill exist that result in a BD write
  return new Promise(function(resolve, reject) {
    var originalSessionAttributes, tryToClose;
    originalSessionAttributes = JSON.parse(JSON.stringify(event.session.attributes));
    tryToClose = function() {
      var dbKey;
      dbKey = litexa.overridableFunctions.generateDBKey(handlerContext.identity);
      return db.fetchDB({
        identity: handlerContext.identity,
        dbKey,
        sessionAttributes: originalSessionAttributes,
        fetchCallback: function(err, dbObject) {
          var language, ref10, ref11, ref9, stateContext;
          if (err != null) {
            return reject(err);
          }
          language = getLanguage(event);
          if (litexa.sessionTerminatingCallback != null) {
            stateContext = {
              now: (new Date((ref9 = event.request) != null ? ref9.timestamp : void 0)).getTime(),
              requestId: event.request.requestId,
              language: language,
              event: event,
              request: (ref10 = event != null ? event.request : void 0) != null ? ref10 : {},
              db: new DBTypeWrapper(dbObject, language),
              sessionAttributes: event != null ? (ref11 = event.session) != null ? ref11.attributes : void 0 : void 0
            };
            litexa.sessionTerminatingCallback(stateContext);
          }
          
          // all clear, we don't have anything active
          if (loggingLevel) {
            exports.Logging.log("VERBOSE Terminating input handler early");
          }
          // write back the object, to clear our memory
          return dbObject.finalize(function(err) {
            if (err != null) {
              return reject(err);
            }
            if (dbObject.repeatHandler) {
              return tryToClose();
            } else {
              return resolve(false);
            }
          });
        }
      });
    };
    return tryToClose();
  });
};

handlerSteps.runConcurrencyLoop = function(event, handlerContext) {
  // to solve for concurrency, we keep state in a database
  // and support retrying all the logic after this point
  // in the event that the database layer detects a collision
  return new Promise(async function(resolve, reject) {
    var language, numberOfTries, ref9, requestTimeStamp, runHandler;
    numberOfTries = 0;
    requestTimeStamp = (new Date((ref9 = event.request) != null ? ref9.timestamp : void 0)).getTime();
    language = getLanguage(event);
    litexa.language = language;
    handlerContext.identity.litexaLanguage = language;
    runHandler = function() {
      var dbKey, sessionAttributes;
      numberOfTries += 1;
      if (numberOfTries > 1) {
        exports.Logging.log(`CONCURRENCY LOOP iteration ${numberOfTries}, denied db write`);
      }
      dbKey = litexa.overridableFunctions.generateDBKey(handlerContext.identity);
      sessionAttributes = JSON.parse(JSON.stringify(event.session.attributes));
      return db.fetchDB({
        identity: handlerContext.identity,
        dbKey,
        sessionAttributes: sessionAttributes,
        fetchCallback: async function(err, dbObject) {
          var base, ref10, ref11, response, stateContext;
          try {
            // build the context object for the state machine
            stateContext = {
              say: [],
              reprompt: [],
              directives: [],
              shouldEndSession: false,
              now: requestTimeStamp,
              settings: {},
              traceHistory: [],
              requestId: event.request.requestId,
              language: language,
              event: event,
              request: (ref10 = event.request) != null ? ref10 : {},
              db: new DBTypeWrapper(dbObject, language),
              sessionAttributes: sessionAttributes
            };
            stateContext.settings = (ref11 = stateContext.db.read("__settings")) != null ? ref11 : {
              resetOnLaunch: true
            };
            if (!dbObject.isInitialized()) {
              dbObject.initialize();
              await (typeof (base = __languages[stateContext.language].enterState).initialize === "function" ? base.initialize(stateContext) : void 0);
            }
            await handlerSteps.parseRequestData(stateContext);
            await handlerSteps.initializeMonetization(stateContext, event);
            if (!stateContext.currentState && stateContext.handoffState) {
              await handlerSteps.enterLaunchHandoffState(stateContext);
            }
            await handlerSteps.routeIncomingIntent(stateContext);
            await handlerSteps.walkStates(stateContext);
            response = (await handlerSteps.createFinalResult(stateContext));
            if (event.__reportStateTrace) {
              response.__stateTrace = stateContext.traceHistory;
            }
            if (dbObject.repeatHandler) {
              // the db failed to save, repeat the whole process
              return (await runHandler());
            } else {
              return resolve(response);
            }
          } catch (error) {
            err = error;
            return reject(err);
          }
        }
      });
    };
    // kick off the first one
    return (await runHandler());
  });
};

handlerSteps.parseRequestData = function(stateContext) {
  var auth, extensionName, func, handled, incomingState, intent, isColdLaunch, name, obj, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, ref9, request, requests, value;
  request = stateContext.request;
  // this is litexa's dynamic request context, i.e. accesible from litexa as $something
  stateContext.slots = {
    request: request
  };
  stateContext.oldInSkillProducts = stateContext.inSkillProducts = (ref9 = stateContext.db.read("__inSkillProducts")) != null ? ref9 : {
    inSkillProducts: []
  };
  // note:
  // stateContext.handoffState  : who will handle the next intent
  // stateContext.handoffIntent : which intent will be delivered next
  // stateContext.currentState  : which state are we ALREADY in
  // stateContext.nextState     : which state is queued up to be transitioned into next
  stateContext.handoffState = null;
  stateContext.handoffIntent = false;
  stateContext.currentState = stateContext.db.read("__currentState");
  stateContext.nextState = null;
  if (request.type === 'LaunchRequest') {
    reportValueMetric('Launches');
  }
  switch (request.type) {
    case 'IntentRequest':
    case 'LaunchRequest':
      incomingState = stateContext.currentState;
      // don't have a current state? Then we're going to launch
      if (!incomingState) {
        incomingState = 'launch';
        stateContext.currentState = null;
      }
      // honor resetOnLaunch
      isColdLaunch = request.type === 'LaunchRequest' || ((ref10 = stateContext.event.session) != null ? ref10.new : void 0);
      if (stateContext.settings.resetOnLaunch && isColdLaunch) {
        incomingState = 'launch';
        stateContext.currentState = null;
      }
      if (request != null ? request.intent : void 0) {
        intent = request.intent;
        stateContext.intent = intent.name;
        if (intent.slots != null) {
          ref11 = intent.slots;
          for (name in ref11) {
            obj = ref11[name];
            stateContext.slots[name] = obj.value;
            auth = (ref12 = obj.resolutions) != null ? (ref13 = ref12.resolutionsPerAuthority) != null ? ref13[0] : void 0 : void 0;
            if ((auth != null) && ((ref14 = auth.status) != null ? ref14.code : void 0) === 'ER_SUCCESS_MATCH') {
              value = (ref15 = auth.values) != null ? (ref16 = ref15[0]) != null ? (ref17 = ref16.value) != null ? ref17.name : void 0 : void 0 : void 0;
              if (value != null) {
                stateContext.slots[name] = value;
              }
            }
          }
        }
        stateContext.handoffIntent = true;
        stateContext.handoffState = incomingState;
        stateContext.nextState = null;
      } else {
        stateContext.intent = null;
        stateContext.handoffIntent = false;
        stateContext.handoffState = null;
        stateContext.nextState = incomingState;
      }
      break;
    case 'Connections.Response':
      stateContext.intent = 'Connections.Response';
      stateContext.handoffIntent = true;
      // if we get this and we're not in progress,
      // then reroute to the launch state
      if (stateContext.currentState != null) {
        stateContext.handoffState = stateContext.currentState;
      } else {
        stateContext.nextState = 'launch';
        stateContext.handoffState = 'launch';
      }
      break;
    default:
      stateContext.intent = request.type;
      stateContext.handoffIntent = true;
      stateContext.handoffState = stateContext.currentState;
      stateContext.nextState = null;
      handled = false;
      for (extensionName in extensionRequests) {
        requests = extensionRequests[extensionName];
        if (request.type in requests) {
          handled = true;
          func = requests[request.type];
          if (typeof func === 'function') {
            func(request);
          }
        }
      }
      if (ref18 = request.type, indexOf.call(litexa.extendedEventNames, ref18) >= 0) {
        handled = true;
      }
      if (!handled) {
        throw new Error(`unrecognized event type: ${request.type}`);
      }
  }
  return initializeExtensionObjects(stateContext);
};

handlerSteps.initializeMonetization = function(stateContext, event) {
  var attributes, ref10, ref9;
  stateContext.monetization = stateContext.db.read("__monetization");
  if (stateContext.monetization == null) {
    stateContext.monetization = {
      fetchEntitlements: false,
      inSkillProducts: []
    };
    stateContext.db.write("__monetization", stateContext.monetization);
  }
  if ((ref9 = (ref10 = event.request) != null ? ref10.type : void 0) === 'Connections.Response' || ref9 === 'LaunchRequest') {
    attributes = event.session.attributes;
    // invalidate monetization cache
    stateContext.monetization.fetchEntitlements = true;
    stateContext.db.write("__monetization", stateContext.monetization);
  }
  return Promise.resolve();
};

handlerSteps.enterLaunchHandoffState = async function(stateContext) {
  var item, state;
  state = stateContext.handoffState;
  if (!(state in __languages[stateContext.language].enterState)) {
    throw new Error(`Entering an unknown state \`${state}\``);
  }
  await __languages[stateContext.language].enterState[state](stateContext);
  stateContext.currentState = stateContext.handoffState;
  if (enableStateTracing) {
    stateContext.traceHistory.push(stateContext.handoffState);
  }
  if (logStateTraces) {
    item = `enter (at launch) ${stateContext.handoffState}`;
    return exports.Logging.log("STATETRACE " + item);
  }
};

handlerSteps.routeIncomingIntent = async function(stateContext) {
  var base, i, item, j, name1;
  if (stateContext.nextState) {
    if (!(stateContext.nextState in __languages[stateContext.language].enterState)) {
      // we've been asked to execute a non existant state!
      // in order to have a chance at recovering, we have to drop state
      // which means when next we launch we'll start over

      // todo: reroute to launch anyway?
      await new Promise(function(resolve, reject) {
        stateContext.db.write("__currentState", null);
        return stateContext.db.finalize(function(err) {
          return reject(new Error(`Invalid state name \`${stateContext.nextState}\``));
        });
      });
    }
  }
// if we have an intent, handle it with the current state
// but if that handler sets a handoff, then following that
// and keep following them until we've actually handled it
  for (i = j = 0; j < 10; i = ++j) {
    if (!stateContext.handoffIntent) {
      return;
    }
    stateContext.handoffIntent = false;
    if (enableStateTracing) {
      item = `${stateContext.handoffState}:${stateContext.intent}`;
      stateContext.traceHistory.push(item);
    }
    if (logStateTraces) {
      item = `drain intent ${stateContext.intent} in ${stateContext.handoffState}`;
      exports.Logging.log("STATETRACE " + item);
    }
    await (typeof (base = __languages[stateContext.language].processIntents)[name1 = stateContext.handoffState] === "function" ? base[name1](stateContext) : void 0);
  }
  throw new Error("Intent handler recursion error, exceeded 10 steps");
};

handlerSteps.walkStates = async function(stateContext) {
  var MaximumTransitionCount, base, i, item, j, lastState, name1, nextState, ref9;
  // keep processing state transitions until we're done
  MaximumTransitionCount = 500;
  for (i = j = 0, ref9 = MaximumTransitionCount; (0 <= ref9 ? j < ref9 : j > ref9); i = 0 <= ref9 ? ++j : --j) {
    // prime the next transition
    nextState = stateContext.nextState;
    // stop if there isn't one
    if (!nextState) {
      return;
    }
    // run the exit handler if there is one
    lastState = stateContext.currentState;
    if (lastState != null) {
      await __languages[stateContext.language].exitState[lastState](stateContext);
    }
    // check in case the exit handler caused a redirection
    nextState = stateContext.nextState;
    if (!nextState) {
      return;
    }
    // the state transition resets the next transition state
    // and implies that we'll go back to opening the mic
    stateContext.nextState = null;
    stateContext.shouldEndSession = false;
    delete stateContext.shouldDropSession;
    stateContext.currentState = nextState;
    if (enableStateTracing) {
      stateContext.traceHistory.push(nextState);
    }
    if (logStateTraces) {
      item = `enter ${nextState}`;
      exports.Logging.log("STATETRACE " + item);
    }
    if (!(nextState in __languages[stateContext.language].enterState)) {
      throw new Error(`Transitioning to an unknown state \`${nextState}\``);
    }
    await __languages[stateContext.language].enterState[nextState](stateContext);
    if (stateContext.handoffIntent) {
      stateContext.handoffIntent = false;
      if (enableStateTracing) {
        stateContext.traceHistory.push(stateContext.handoffState);
      }
      if (logStateTraces) {
        item = `drain intent ${stateContext.intent} in ${stateContext.handoffState}`;
        exports.Logging.log("STATETRACE " + item);
      }
      await (typeof (base = __languages[stateContext.language].processIntents)[name1 = stateContext.handoffState] === "function" ? base[name1](stateContext) : void 0);
    }
  }
  exports.Logging.error(`States error: exceeded ${MaximumTransitionCount} transitions.`);
  if (enableStateTracing) {
    exports.Logging.error(`States visited: [${stateContext.traceHistory.join(' -> ')}]`);
  } else {
    exports.Logging.error("Set 'enableStateTracing' to get a history of which states were visited.");
  }
  throw new Error(`States error: exceeded ${MaximumTransitionCount} transitions. Check your logic for non-terminating loops.`);
};

handlerSteps.createFinalResult = async function(stateContext) {
  var card, content, d, err, events, extensionName, hasDisplay, joinSpeech, keep, parts, ref10, ref11, ref12, ref13, ref14, ref15, ref16, ref17, ref18, ref19, ref9, response, s, stripSSML, title, wrapper;
  stripSSML = function(line) {
    if (line == null) {
      return void 0;
    }
    line = line.replace(/<[^>]+>/g, '');
    return line.replace(/[ ]+/g, ' ');
  };
// invoke any 'afterStateMachine' extension events
  for (extensionName in extensionEvents) {
    events = extensionEvents[extensionName];
    try {
      await (typeof events.afterStateMachine === "function" ? events.afterStateMachine() : void 0);
    } catch (error) {
      err = error;
      exports.Logging.error(`Failed to execute afterStateMachine for extension ${extensionName}: ${err}`);
      throw err;
    }
  }
  hasDisplay = ((ref9 = stateContext.event.context) != null ? (ref10 = ref9.System) != null ? (ref11 = ref10.device) != null ? (ref12 = ref11.supportedInterfaces) != null ? ref12.Display : void 0 : void 0 : void 0 : void 0) != null;
  // start building the final response json object
  wrapper = {
    version: "1.0",
    sessionAttributes: stateContext.sessionAttributes,
    userAgent: userAgent, // this userAgent value is generated in project-info.coffee and injected in skill.coffee
    response: {
      shouldEndSession: stateContext.shouldEndSession
    }
  };
  response = wrapper.response;
  if (stateContext.shouldDropSession) {
    delete response.shouldEndSession;
  }
  // build outputSpeech and reprompt from the accumulators
  joinSpeech = function(arr, language = 'default') {
    var j, k, len, len1, line, mapping, ref13, ref14, result;
    if (!arr) {
      return '';
    }
    result = arr[0];
    ref13 = arr.slice(1);
    for (j = 0, len = ref13.length; j < len; j++) {
      line = ref13[j];
      // If the line starts with punctuation, don't add a space before.
      if (line.match(/^[?!:;,.]/)) {
        result += line;
      } else {
        result += ` ${line}`;
      }
    }
    result = result.replace(/(  )/g, ' ');
    if (litexa.sayMapping[language]) {
      ref14 = litexa.sayMapping[language];
      for (k = 0, len1 = ref14.length; k < len1; k++) {
        mapping = ref14[k];
        result = result.replace(mapping.from, mapping.to);
      }
    }
    return result;
  };
  if ((stateContext.say != null) && stateContext.say.length > 0) {
    response.outputSpeech = {
      type: "SSML",
      ssml: `<speak>${joinSpeech(stateContext.say, stateContext.language)}</speak>`,
      playBehavior: "REPLACE_ALL"
    };
  }
  if ((stateContext.reprompt != null) && stateContext.reprompt.length > 0) {
    response.reprompt = {
      outputSpeech: {
        type: "SSML",
        ssml: `<speak>${joinSpeech(stateContext.reprompt, stateContext.language)}</speak>`
      }
    };
  }
  if (stateContext.card != null) {
    card = stateContext.card;
    title = (ref13 = card.title) != null ? ref13 : "";
    content = (ref14 = card.content) != null ? ref14 : "";
    if (card.repeatSpeech && (stateContext.say != null)) {
      parts = (function() {
        var j, len, ref15, results;
        ref15 = stateContext.say;
        results = [];
        for (j = 0, len = ref15.length; j < len; j++) {
          s = ref15[j];
          results.push(stripSSML(s));
        }
        return results;
      })();
      content += parts.join('\n');
    }
    content = content != null ? content : "";
    response.card = {
      type: "Simple",
      title: title != null ? title : ""
    };
    response.card.title = response.card.title.trim();
    if (card.imageURLs != null) {
      response.card.type = "Standard";
      response.card.text = content != null ? content : "";
      response.card.image = {
        smallImageUrl: card.imageURLs.cardSmall,
        largeImageUrl: card.imageURLs.cardLarge
      };
      response.card.text = response.card.text.trim();
    } else {
      response.card.type = "Simple";
      response.card.content = content;
      response.card.content = response.card.content.trim();
    }
    keep = false;
    if (response.card.title.length > 0) {
      keep = true;
    }
    if (((ref15 = response.card.text) != null ? ref15.length : void 0) > 0) {
      keep = true;
    }
    if (((ref16 = response.card.content) != null ? ref16.length : void 0) > 0) {
      keep = true;
    }
    if (((ref17 = response.card.image) != null ? ref17.smallImageUrl : void 0) != null) {
      keep = true;
    }
    if (((ref18 = response.card.image) != null ? ref18.largeImageUrl : void 0) != null) {
      keep = true;
    }
    if (!keep) {
      delete response.card;
    }
  }
  if (stateContext.musicCommand != null) {
    stateContext.directives = (ref19 = stateContext.directives) != null ? ref19 : [];
    switch (stateContext.musicCommand.action) {
      case 'play':
        stateContext.directives.push({
          type: "AudioPlayer.Play",
          playBehavior: "REPLACE_ALL",
          audioItem: {
            stream: {
              url: stateContext.musicCommand.url,
              token: "no token",
              offsetInMilliseconds: 0
            }
          }
        });
        break;
      case 'stop':
        stateContext.directives.push({
          type: "AudioPlayer.Stop"
        });
    }
  }
  // store current state for next time, unless we're intentionally ending
  if (stateContext.shouldEndSession) {
    stateContext.currentState = null;
  }
  if (stateContext.currentState === null) {
    response.shouldEndSession = true;
  }
  stateContext.db.write("__currentState", stateContext.currentState);
  stateContext.db.write("__settings", stateContext.settings);
  // filter out any directives that were marked for removal
  stateContext.directives = (function() {
    var j, len, ref20, results;
    ref20 = stateContext.directives;
    results = [];
    for (j = 0, len = ref20.length; j < len; j++) {
      d = ref20[j];
      if (!(d != null ? d.DELETEME : void 0)) {
        results.push(d);
      }
    }
    return results;
  })();
  if ((stateContext.directives != null) && stateContext.directives.length > 0) {
    response.directives = stateContext.directives;
  }
  // last chance, see if the developer left a postprocessor to run here
  if (litexa.responsePostProcessor != null) {
    litexa.responsePostProcessor(wrapper, stateContext);
  }
  if (stateContext.shouldEndSession && (litexa.sessionTerminatingCallback != null)) {
    // we're about to quit, won't get session ended, 
    // so this counts as the very last moment in this session
    litexa.sessionTerminatingCallback(stateContext);
  }
  return (await new Promise(function(resolve, reject) {
    return stateContext.db.finalize(function(err, info) {
      if (err != null) {
        if (!db.repeatHandler) {
          reject(err);
        }
      }
      return resolve(wrapper);
    });
  }));
};

(function( __language ) {
var enterState = __language.enterState;
var processIntents = __language.processIntents;
var exitState = __language.exitState;
var dataTables = __language.dataTables;
var jsonFiles = __language.jsonFiles;
/*
 *  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *  Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 *  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

var {todayName, addNumbers, callLocalizar} = require('burrowClockSkill-lib');




__language.dbTypes = {

};
enterState.launch = async function(context) {
  if (context.db.read('name')) {
    context.say.push( ("Do you want me to locate " + escapeSpeech( context.db.read('name') ) + "?.").trim().replace(/ +/g,' ') );
    delete context.shouldEndSession;
    delete context.shouldDropSession;
    context.nextState = 'askForRelocate';
  }
  else {
    context.say.push( ("Whom do you want me to locate?").trim().replace(/ +/g,' ') );
    delete context.shouldEndSession;
    delete context.shouldDropSession;
    context.nextState = 'waitForName';
  }
};
processIntents.launch = async function(context, runOtherwise) {
  switch( context.intent ) {
    default: {
      if ( await processIntents.global(context, true) ) { return true; }
      break;
    }
  }
  return true;
};
exitState.launch = async function(context) {
};

enterState.global = async function(context) {
};
processIntents.global = async function(context, runOtherwise) {
  switch( context.intent ) {
    default: {
      if (!runOtherwise) { return false; }
      throw new Error('unhandled intent ' + context.intent + ' in state ' + context.handoffState);
      break;
    }
    case 'AMAZON.StopIntent': {
      context.nextState = null;
      context.handoffState = null;
      context.handoffIntent = null;
      delete context.shouldDropSession;
      context.shouldEndSession = true;
      break;
    }
    case 'AMAZON.CancelIntent': {
      context.nextState = null;
      context.handoffState = null;
      context.handoffIntent = null;
      delete context.shouldDropSession;
      context.shouldEndSession = true;
      break;
    }
    case 'AMAZON.StartOverIntent': {
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'launch';
      break;
    }
  }
  return true;
};
exitState.global = async function(context) {
};

enterState.askForRelocate = async function(context) {
};
processIntents.askForRelocate = async function(context, runOtherwise) {
  switch( context.intent ) {
    default: {
      if ( await processIntents.global(context, true) ) { return true; }
      break;
    }
    case 'AMAZON.YesIntent': {
      let speechToText = await callLocalizar(context.db.read('name'), context);
      context.say.push( ("Locating " + escapeSpeech( context.db.read('name') ) + ", " + escapeSpeech( (speechToText) ) + ".").trim().replace(/ +/g,' ') );
      context.card = {
        title: "Burrow Clock",
        content: escapeSpeech( (speechToText) ),
      };
      context.card.imageURLs = {
        cardSmall:  litexa.assetsRoot + "default/map.png" , 
        cardLarge:  litexa.assetsRoot + "default/map.png" , 
      };
      context.say.push( ("<break time='1s'/>").trim().replace(/ +/g,' ') );
      context.say.push( ("Do you want me to find someone else?").trim().replace(/ +/g,' ') );
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'askForAnother';
      break;
    }
    case 'AMAZON.NoIntent': {
      context.say.push( ("Whom do you want me to find?").trim().replace(/ +/g,' ') );
      context.reprompt.push( ("Just tell me a name").trim().replace(/ +/g,' ') );
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'waitForName';
      break;
    }
  }
  return true;
};
exitState.askForRelocate = async function(context) {
};

enterState.askForAnother = async function(context) {
};
processIntents.askForAnother = async function(context, runOtherwise) {
  switch( context.intent ) {
    default: {
      if ( await processIntents.global(context, true) ) { return true; }
      break;
    }
    case 'AMAZON.YesIntent': {
      context.say.push( ("Whom do you want me to find?").trim().replace(/ +/g,' ') );
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'waitForName';
      break;
    }
    case 'AMAZON.NoIntent': {
      context.say.push( ("ok").trim().replace(/ +/g,' ') );
      context.say.push( ("<break time='1s'/>").trim().replace(/ +/g,' ') );
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'goodbye';
      break;
    }
  }
  return true;
};
exitState.askForAnother = async function(context) {
};

enterState.waitForName = async function(context) {
};
processIntents.waitForName = async function(context, runOtherwise) {
  switch( context.intent ) {
    default: {
      if ( await processIntents.global(context, false) ) { return true; }
      context.say.push( ("Do you want me to find " + escapeSpeech( context.db.read('name') ) + "?.").trim().replace(/ +/g,' ') );
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'askForRelocate';
      break;
    }
    case 'FIND_NAME': {
      context.db.write('name', context.slots.name);
      let speechToText = await callLocalizar(context.db.read('name'), context);
      context.say.push( ("Locating " + escapeSpeech( context.db.read('name') ) + ", " + escapeSpeech( (speechToText) ) + ".").trim().replace(/ +/g,' ') );
      context.card = {
        title: "Burrow Clock",
        content: escapeSpeech( (speechToText) ),
      };
      context.card.imageURLs = {
        cardSmall:  litexa.assetsRoot + "default/map.png" , 
        cardLarge:  litexa.assetsRoot + "default/map.png" , 
      };
      context.say.push( ("<break time='1s'/>").trim().replace(/ +/g,' ') );
      context.say.push( ("Do you want me to find someone else?").trim().replace(/ +/g,' ') );
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'askForAnother';
      break;
    }
    case 'AMAZON.HelpIntent': {
      context.say.push( ("Just tell me the name of the person you want to find").trim().replace(/ +/g,' ') );
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'waitForName';
      break;
    }
  }
  return true;
};
exitState.waitForName = async function(context) {
};

enterState.goodbye = async function(context) {
  context.say.push( ("Bye!").trim().replace(/ +/g,' ') );
  context.nextState = null;
  context.handoffState = null;
  context.handoffIntent = null;
  delete context.shouldDropSession;
  context.shouldEndSession = true;
};
processIntents.goodbye = async function(context, runOtherwise) {
  switch( context.intent ) {
    default: {
      if ( await processIntents.global(context, true) ) { return true; }
      break;
    }
  }
  return true;
};
exitState.goodbye = async function(context) {
};

enterState.searchName = async function(context) {
};
processIntents.searchName = async function(context, runOtherwise) {
  switch( context.intent ) {
    default: {
      if ( await processIntents.global(context, true) ) { return true; }
      break;
    }
  }
  return true;
};
exitState.searchName = async function(context) {
};





})( __languages['default'] );


(function( __language ) {
var enterState = __language.enterState;
var processIntents = __language.processIntents;
var exitState = __language.exitState;
var dataTables = __language.dataTables;
var jsonFiles = __language.jsonFiles;
/*
 *  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 *  Copyright 2019 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: Apache-2.0
 *  ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
 */

var {todayName, addNumbers, callLocalizar} = require('burrowClockSkill-lib');




__language.dbTypes = {

};
enterState.launch = async function(context) {
  if (context.db.read('name')) {
    context.say.push( ("¿Quieres que localice a " + escapeSpeech( context.db.read('name') ) + "?.").trim().replace(/ +/g,' ') );
    delete context.shouldEndSession;
    delete context.shouldDropSession;
    context.nextState = 'askForRelocate';
  }
  else {
    context.say.push( ("¿A quién quieres que localice?").trim().replace(/ +/g,' ') );
    delete context.shouldEndSession;
    delete context.shouldDropSession;
    context.nextState = 'askForAnother';
  }
};
processIntents.launch = async function(context, runOtherwise) {
  switch( context.intent ) {
  }
  return true;
};
exitState.launch = async function(context) {
};

enterState.global = async function(context) {
};
processIntents.global = async function(context, runOtherwise) {
  switch( context.intent ) {
    default: {
      if (!runOtherwise) { return false; }
      throw new Error('unhandled intent ' + context.intent + ' in state ' + context.handoffState);
      break;
    }
    case 'AMAZON.StopIntent': {
      context.nextState = null;
      context.handoffState = null;
      context.handoffIntent = null;
      delete context.shouldDropSession;
      context.shouldEndSession = true;
      break;
    }
    case 'AMAZON.CancelIntent': {
      context.nextState = null;
      context.handoffState = null;
      context.handoffIntent = null;
      delete context.shouldDropSession;
      context.shouldEndSession = true;
      break;
    }
    case 'AMAZON.StartOverIntent': {
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'launch';
      break;
    }
  }
  return true;
};
exitState.global = async function(context) {
};

enterState.askForRelocate = async function(context) {
};
processIntents.askForRelocate = async function(context, runOtherwise) {
  switch( context.intent ) {
    case 'AMAZON.YesIntent': {
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'searchName';
      break;
    }
    case 'AMAZON.NoIntent': {
      context.say.push( ("¿A quién quieres que localice?").trim().replace(/ +/g,' ') );
      context.reprompt.push( ("Solo dime un nombre").trim().replace(/ +/g,' ') );
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'askForAnother';
      break;
    }
  }
  return true;
};
exitState.askForRelocate = async function(context) {
};

enterState.askForAnother = async function(context) {
};
processIntents.askForAnother = async function(context, runOtherwise) {
  switch( context.intent ) {
    case 'A_ANOTHERNAME': {
      context.db.write('name', context.slots.anotherName);
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'searchName';
      break;
    }
    case 'AMAZON.YesIntent': {
      context.say.push( ("<say-as interpret-as='interjection'>perfecto.</say-as>" + " ¿A quién quieres que localice?").trim().replace(/ +/g,' ') );
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'askForAnother';
      break;
    }
    case 'AMAZON.NoIntent': {
      context.say.push( ("<say-as interpret-as='interjection'>chido.</say-as>").trim().replace(/ +/g,' ') );
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'goodbye';
      break;
    }
    case 'AMAZON.HelpIntent': {
      context.say.push( ("<say-as interpret-as='interjection'>no hay problema.</say-as>").trim().replace(/ +/g,' ') );
      context.say.push( ("Solo dime el nombre de la persona que quieres localizar").trim().replace(/ +/g,' ') );
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'askForAnother';
      break;
    }
  }
  return true;
};
exitState.askForAnother = async function(context) {
};

enterState.waitForName = async function(context) {
};
processIntents.waitForName = async function(context, runOtherwise) {
  switch( context.intent ) {
    default: {
      if ( await processIntents.global(context, false) ) { return true; }
      context.say.push( ("Do you want me to find " + escapeSpeech( context.db.read('name') ) + "?.").trim().replace(/ +/g,' ') );
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'askForRelocate';
      break;
    }
    case 'FIND_NAME': {
      context.db.write('name', context.slots.name);
      let speechToText = await callLocalizar(context.db.read('name'), context);
      context.say.push( ("Locating " + escapeSpeech( context.db.read('name') ) + ", " + escapeSpeech( (speechToText) ) + ".").trim().replace(/ +/g,' ') );
      context.card = {
        title: "Burrow Clock",
        content: escapeSpeech( (speechToText) ),
      };
      context.card.imageURLs = {
        cardSmall:  litexa.assetsRoot + "default/map.png" , 
        cardLarge:  litexa.assetsRoot + "default/map.png" , 
      };
      context.say.push( ("<break time='1s'/>").trim().replace(/ +/g,' ') );
      context.say.push( ("Do you want me to find someone else?").trim().replace(/ +/g,' ') );
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'askForAnother';
      break;
    }
    case 'AMAZON.HelpIntent': {
      context.say.push( ("Just tell me the name of the person you want to find").trim().replace(/ +/g,' ') );
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'waitForName';
      break;
    }
  }
  return true;
};
exitState.waitForName = async function(context) {
};

enterState.goodbye = async function(context) {
  context.say.push( ("<say-as interpret-as='interjection'>nos vemos.</say-as>").trim().replace(/ +/g,' ') );
  context.nextState = null;
  context.handoffState = null;
  context.handoffIntent = null;
  delete context.shouldDropSession;
  context.shouldEndSession = true;
};
processIntents.goodbye = async function(context, runOtherwise) {
  switch( context.intent ) {
  }
  return true;
};
exitState.goodbye = async function(context) {
};

enterState.searchName = async function(context) {
  let speechToText = await callLocalizar(context.db.read('name'), context);
  context.say.push( ("<say-as interpret-as='interjection'>faltaba más.</say-as>").trim().replace(/ +/g,' ') );
  context.say.push( (escapeSpeech( (speechToText) ) + ".").trim().replace(/ +/g,' ') );
  context.card = {
    title: "Burrow Clock",
    content: escapeSpeech( (speechToText) ),
  };
  context.card.imageURLs = {
    cardSmall:  litexa.assetsRoot + "default/map.png" , 
    cardLarge:  litexa.assetsRoot + "default/map.png" , 
  };
  context.say.push( ("¿Quieres localizar a alguien más?").trim().replace(/ +/g,' ') );
  delete context.shouldEndSession;
  delete context.shouldDropSession;
  context.nextState = 'askForAnother';
};
processIntents.searchName = async function(context, runOtherwise) {
  switch( context.intent ) {
    case 'AMAZON.HelpIntent': {
      context.say.push( ("<say-as interpret-as='interjection'>no hay problema.</say-as>").trim().replace(/ +/g,' ') );
      context.say.push( ("Solo dime el nombre de la persona que quieres localizar").trim().replace(/ +/g,' ') );
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'askForAnother';
      break;
    }
    default: {
      if ( await processIntents.global(context, false) ) { return true; }
      context.say.push( ("¿Quieres que localice a " + escapeSpeech( context.db.read('name') ) + "?.").trim().replace(/ +/g,' ') );
      delete context.shouldEndSession;
      delete context.shouldDropSession;
      context.nextState = 'askForRelocate';
      break;
    }
  }
  return true;
};
exitState.searchName = async function(context) {
};





})( __languages['es-MX'] );

escapeSpeech = function(line) {
  return ("" + line).replace(/ /g, ' ');
}