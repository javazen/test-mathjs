(function() {
  'use strict';
  
  var LOGGING = true;
  
  var termRules = [
    'c*n1/(n2/n3) -> (c*n1*n3)/n2',
    'n1/(n2*n1) -> 1/n2',
    'c*n1/(n2*n1) -> c/n2',
    'n1/n2/n3 -> n1/(n2*n3)',
  ];
  
  var inputText, outputText, opNumber=1000;
  
  document.addEventListener("DOMContentLoaded", function(event) { 
    inputText = document.getElementById("inputText");
    outputText = document.getElementById("outputText");
    var simplifyBtn = document.getElementById("simplifyBtn");
    simplifyBtn.onclick = callSimplify;
    var rationalizeBtn = document.getElementById("rationalizeBtn");
    rationalizeBtn.onclick = callRationalize;
    var newSimplifyBtn = document.getElementById("newSimplifyBtn");
    newSimplifyBtn.onclick = callNewSimplify;
  });
  
  
  function callSimplify() {
    var text = inputText.value;
    var newText = math.simplify(text);
    outputText.value = newText;
    log(text, 'simplify', newText);
  }
  
  function callRationalize() {
    var text = inputText.value;
    var newText = math.rationalize(text);
    outputText.value = newText;
    log(text, 'rationalize', newText);
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
  
  function varCount(node) {
    var resultObj = math.rationalize(node, {}, true);
    var count = resultObj.variables.length;
    return count;
  }
  
  function log(text, operation, newText) {
    if (LOGGING) console.log('' + opNumber + '  ' + text + '  ---  ' + operation + '  --->  ' + newText);
    opNumber++;
  }

  function isTerm(node) {
    var term = !!node;
    
    if (node) {
      node.traverse(function(n) {
        if (node.type === 'OperatorNode') {
          if (node.op !== '*' && node.op !== '/') {
            term = false;
          }
        }
      });
    }
    
    return term;
  }
  
}());