//module.exports = { something: 'value' };

(function() {
  'use strict';
  
  var LOGGING = true;
  var TESTING = true;
  
  var termRules = [
    'c*n1/(n2/n3) -> (c*n1*n3)/n2',
    'n1/(n2*n1) -> 1/n2',
    'c*n1/(n2*n1) -> c/n2',
    'n1/n2/n3 -> n1/(n2*n3)',
  ];
  
  var inputText, outputText, opNumber=1000;
  var origCountInput, origDepthInput, outputCountInput, outputDepthInput;
  // var history = [];
  
  document.addEventListener("DOMContentLoaded", function(event) { 
    if (!TESTING) {
      inputText = document.getElementById("inputText");
      outputText = document.getElementById("outputText");
      var simplifyBtn = document.getElementById("simplifyBtn");
      simplifyBtn.onclick = callSimplify;
      var rationalizeBtn = document.getElementById("rationalizeBtn");
      rationalizeBtn.onclick = callRationalize;
      var newSimplifyBtn = document.getElementById("newSimplifyBtn");
      newSimplifyBtn.onclick = callNewSimplify;
      var outputToInputBtn = document.getElementById("outputToInputBtn");
      outputToInputBtn.onclick = callOutputToInput;
      // var goBackBtn = document.getElementById("goBackBtn");
      // goBackBtn.onclick = callGoBack;
      
      origCountInput = document.getElementById("origCount");
      origDepthInput = document.getElementById("origDepth");
      outputCountInput = document.getElementById("outputCount");
      outputDepthInput = document.getElementById("outputDepth");
      }
  });
  
  
  function callSimplify() {
    var text = inputText.value;
    var origInfo = getInfo(text);
    updateInfo(origInfo, origCountInput, origDepthInput);
    var newRoot = math.simplify(text);
    var newInfo = getInfo(newRoot);
    updateInfo(newInfo, outputCountInput, outputDepthInput);
    outputText.value = newRoot;
    log(text, 'simplify', newRoot);
    // if (LOGGING) console.log('callRationalize: origInfo = ' + printInfo(origInfo) + ' newInfo = ' + printInfo(newInfo));
  }
  
  function callRationalize() {
    var text = inputText.value;
    var origInfo = getInfo(text);
    updateInfo(origInfo, origCountInput, origDepthInput);
    var newRoot = math.rationalize(text);
    var newInfo = getInfo(newRoot);
    updateInfo(newInfo, outputCountInput, outputDepthInput);
    outputText.value = newRoot;
    log(text, 'rationalize', newRoot);
    // if (LOGGING) console.log('callRationalize: origInfo = ' + printInfo(origInfo) + ' newInfo = ' + printInfo(newInfo));
  }

  function callOutputToInput() {
    var text = outputText.value;
    inputText.value = text;
    outputText.value = '';
    log(text, 'outputToInput', '');
  }
  
  // function callGoBack() {
  // }
  
  
  // function printInfo(infoObj) {
  //   return '{count:' + infoObj.count + ', depth:' + infoObj.depth + '}';
  // }
  // 
  // function valueInfo(infoObj) {
  //   // it may turn out to be better to add a weighting, for now just add them together
  //   return infoObj.count + infoObj.depth;
  // }
  
  function updateInfo(infoObj, countInput, depthInput) {
    countInput.value = infoObj.count;
    depthInput.value = infoObj.depth;
  }
  
  function getInfo(text) {
    var rootnode, count, depth;
    try {
      rootnode = (math.isNode(text)) ? text : math.parse(text);
      count = varCount(rootnode);
      depth = parseTreeDepth(rootnode);
    } catch(e) {
      if (LOGGING) console.log('cannot parse ' + text + ' parse err: ' + e);
    }
    return {count:count, depth:depth};
  }
  
  function callNewSimplify() {
    var text = inputText.value;
    var newText = newSimplify(text);
    outputText.value = newText;
    log(text, 'newSimplify', newText);
  }
  
  // more thorough than math.simplify
  function newSimplify(expr) {
    if (!expr) return '';
    // if (!expr) return new math.expression.node.SymbolNode('');  // or maybe return ''???
    
    // TODO if expr is an object, it must be a node
    if (typeof expr !== 'string') expr = expr.toString();
    
    var rootnode = math.rationalize(expr, {});
    var obj = maybeSimplify(rootnode);
    if (obj.count === 0) return finalSimplify(obj.rootnode);
    
    obj = maybeRationalize(obj.rootnode);
    if (obj.count === 0) return finalSimplify(obj.rootnode);
    
    // if numerator and denominator are both simple enough, try "term rules"
    if (isTerm(obj.resultObj.numerator) && isTerm(obj.resultObj.denominator)) {
      obj = maybeSimplify(obj.rootnode, termRules);
      if (obj.count === 0) return finalSimplify(obj.rootnode);
      
      obj = maybeRationalize(obj.rootnode);
      if (obj.count === 0) return finalSimplify(obj.rootnode);
      
      obj = maybeSimplify(obj.rootnode, termRules);
      if (obj.count === 0) return finalSimplify(obj.rootnode);
    }
    
    return finalSimplify(obj.rootnode);
  }
  
  function maybeSimplify(rootnode, rules) {
    var obj = {rootnode:rootnode};
    obj.count = varCount(rootnode);
    if (obj.count > 0) {
      var result = (rules) ? math.simplify(rootnode, rules) : math.simplify(rootnode);
      var newcount = varCount(result);
      // probably always true - TODO use existence of var(s) in num, denom to decide if we are getting better
      if (newcount <= obj.count) {
        obj.count = newcount;
        obj.rootnode = result;
      }
    }
    return obj;
  }

  function maybeRationalize(rootnode) {
    var obj = {rootnode:rootnode};
    obj.count = varCount(rootnode);   // could pass in obj vs rootnode and have this already
    if (obj.count > 0) {
      var resultObj = math.rationalize(rootnode, {}, true);
      var newcount = varCount(resultObj.expression);
      // probably always true - TODO use existence of var(s) in num, denom to decide if we are getting better
      if (newcount <= obj.count) {
        obj.count = newcount;
        obj.rootnode = resultObj.expression;
        obj.resultObj = resultObj;
      }
    }
    return obj;
  }

  // more thorough than math.simplify
  function finalSimplify(expr) {
    return math.rationalize(expr, {});
  }
  
  function parseTreeDepth(node) {
    var depth = 0;
    if (node) {
      if (typeof node === 'string') {
        // see if formula was passed rather than the node
        var f = node;
        try {
          node = math.parse(f);
        } catch (e) {
          if (LOGGING) console.log('cannot parse ' + f + ' err= ' + e);
        }
      }
      switch (node.type) {
        case 'ConstantNode':
          depth = 0;
          break;
        case 'SymbolNode':
          depth = 1;
          break;
        case 'ParenthesisNode':
          // this works because the content of the parens is the correct parse tree
          depth = parseTreeDepth(node.getContent());
          break;
        case 'FunctionNode':
          depth = adjustedDepthOfChildren(node.getContent(), 1);
          break;
        case 'OperatorNode':
          depth = adjustedDepthOfChildren(node, 2);
          break;
        default:
          break;
      }
    }
    return depth;
  }

  // minBranches is the min number of non-zero branches we require in order
  // to augment the depth by 1 for the operator itself
  function adjustedDepthOfChildren(node, minBranches) {
    var i, depth, max = 0, branches = 0, childnodes = node.args;
    for (i=0; i<childnodes.length; i++) {
      var child = childnodes[i];
      var childDepth = parseTreeDepth(child);
      if (childDepth > max) max = childDepth;
      if (childDepth > 0) branches++;
    }
    var maybeAddOne = (branches >= minBranches) ? 1 : 0;
    depth = (max === 0) ? 0 : max + maybeAddOne;
    return depth;
  }

  function varCount(node) {
    var count = 0;
    try {
      var resultObj = math.rationalize(node, {}, true);
      count = resultObj.variables.length;
    } catch (e) {
      var f = (math.isNode(node)) ? node.toString() : node;
      if (LOGGING) console.log('cannot parse ' + f + ' err= ' + e);
    }
    return count;
  }

  
  function log(text, operation, newText) {
    if (LOGGING) console.log('' + opNumber + '  ' + text + '  ---  ' + operation + '  --->  ' + newText);
    opNumber++;
  }

  // make sure this works when passed falsy node
  function isTerm(node) {
    var term = true;
    
    node.traverse(function(n) {
      if (n.type === 'OperatorNode') {
        if (n.op !== '*' && n.op !== '/') {
          term = false;
        }
      }
    });
    
    return term;
  }


  // function isTerm(node) {
  //   var term = !!node;
  // 
  //   if (node) {
  //     node.traverse(function(n) {
  //       if (node.type === 'OperatorNode') {
  //         if (node.op !== '*' && node.op !== '/') {
  //           term = false;
  //         }
  //       }
  //     });
  //   }
  // 
  //   return term;
  // }
  
}());