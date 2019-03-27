(function() {
  'use strict';
  
  var inputText, outputText;
  
  document.addEventListener("DOMContentLoaded", function(event) { 
    var simplifyBtn = document.getElementById("simplifyBtn");
    simplifyBtn.onclick = callJavascriptFunction;
    inputText = document.getElementById("inputText");
    outputText = document.getElementById("outputText");
  });
  
  
  function callJavascriptFunction() {
    var text = inputText.value;
    
    var newText = math.rationalize(text);
//    var newText = math.simplify(text);
    outputText.value = newText;
    
    // alert(newText);
  }
  
}());