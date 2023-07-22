(function test_mathIIFE() {
'use strict';
var DEBUG = true;
if (DEBUG) console.log('load of test/spec/test_math.js');
var expect = chai.expect;

math.config({number: 'BigNumber'});

/*
function safeParse(expr) {
	var node = null;
	
	if (expr && expr.isNode) {
		node = expr;
	} else if (typeof expr === 'string') {
		try {
			node = math.parse(expr);
		} catch (e) {
			if (DEBUG) console.log('cannot parse ' + expr + ' err= ' + e);
		}
	}
	
	// else return null
	return node;
}

// expected is a string, actual a string or a Node
function checkExpressions(actual, expected) {
  if (expected === '') return (actual === ''); // special case
  
  const actualNode = (actual); // returns null if can't parse
  const actualStr = (actualNode) ? actualNode.toString({parenthesis: 'all'}) : '';
  if (actualStr === expected) {
    expect(actualStr).to.equal(expected);
  } else {
    const expectedNode = safeParse(expected);
    const expectedStr = (expectedNode) ? expectedNode.toString({parenthesis: 'all'}) : '';
    expect(actualStr).to.deep.equal(expectedStr);
  }
}
*/


suite('Testing Math Library', function() {
  setup(function() {
  });
  
  // suite('Testing simplify with exactFractions:false', function() {
	// 	var simplifyDecimalTestsArray = [
  //     {f:'a + b', result:'a + b'},
  //     {f:'1.24851660412094e+5 - 4994.927591367 + -(30005.072408633 + p0 + (3111035201068343/4503599627370496 * p0) + 55552.5) + 1.75148339587906e+5 + 5186 + -888', result:'0'},
	// 	];
  //   simplifyDecimalTestsArray.forEach(function(aTest) { 
  //     aTest.testName = '' + aTest.f + ' -> ' + aTest.result; 
  //   });
	// 	simplifyDecimalTestsArray.forEach(function(aTest) {
	// 		test(aTest.testName, function() {
  //       var actual, expected;
  //       try {
  //         var r = math.parse(aTest.f);
  //         var rootNode = math.simplify(r, {}, {exactFractions: false});
  //         actual = rootNode.toString();
  //         expected = math.parse(aTest.result).toString();
  //       } catch (e) {
  //         alert('oops');
  //       }
	// 			expect(actual).to.equal(expected);
	// 		});
	// 	});
	// });


/*
  suite('Testing new simplify', function() {
		var newSimplifyTestsArray = [
      // {f:'(5 * p0 ^ 2 + p0) / p0', result:'(5 * p0 + 1)'},
      {f:'(a + 9 * a ^ 2) * 1152 / (1.152 * a)', result:'(9000 * a + 1000)'},
      {f:'(p0 + 9.000000000000001e-4 * p0 ^ 2) * 1.152921504606847e+18 / (1.152921504606847e+15 * p0)', result:'(9.000000000000001e-1 * p0 + 1000)'},
      {f:'2 * (p0 + 5 * p0 * p0) / (2 * p0)', result:'(5 * p0 + 1)'},
      {f:'', result:''},
      {f:'-4', result:'-4'},
      {f:'3.14', result:'3.14'},
      {f:'p0/(p0/3)', result:'3'},
      {f:'2*p0/(p0/3)', result:'6'},
      {f:'x+x+x+y', result:'3 * x + y'},
      {f:'6*p0/(2.5*p0)', result:'2.4'},
      {f:'k*(a*k+b)/(k*k*k*k)', result:'(a*k+b)/k^3'},      
      {f:'k*(a*k+b)/k^4', result:'(a*k+b)/k^3'},      
      {f:'p0/(0.5*p0)', result:'2'},
      {f:'(x + 10) + (0.5*x + 5)', result:'1.5 * x + 15'},
		];
    newSimplifyTestsArray.forEach(function(aTest) { 
      aTest.testName = '' + aTest.f + ' -> ' + aTest.result; 
    });
		newSimplifyTestsArray.forEach(function(aTest) {
			test(aTest.testName, function() {
        var result = math.simplify(aTest.f);
        checkExpressions(result, aTest.result);
			});
		});
	});
*/

  suite('Testing derivative', function() {
		var derivativeTestsArray = [
      {f:'x^2', result:'2*x'},
      {f:'(x + 20000) * math.bignumber(1.0376293541461623e+19) / (math.bignumber(1.152921504606847e+15) * (x + 20000))', result:'0'},
		];
    derivativeTestsArray.forEach(function(aTest) { 
      aTest.testName = '' + aTest.f + ' -> ' + aTest.result; 
    });
		derivativeTestsArray.forEach(function(aTest) {
			test(aTest.testName, function() {
				var derivNode = math.derivative(aTest.f, 'x');
        var actual = derivNode.toString();
        var expected = math.parse(aTest.result).toString();
				expect(actual).to.equal(expected);
			});
		});
	});


  suite('Testing simplify', function() {
		var simplifyTestsArray = [
      {f:'1.1529215046068e+18 / 1.1529215046068e+15', result:'1000'},
      {f:'1.15292150460684e+18 / 1.15292150460684e+15', result:'1000'},
      {f:'((((((((((1)) + ((0)))) * ((x + 2))) + (((x + 1)) * ((((1)) + ((0))))))) * ((x + 3))) - ((((x + 1) * (x + 2))) * ((((1)) + ((0)))))) / (((x + 3)) ^ (2)))', result:'1000'},
      {f:'a + b', result:'a + b'},
      {f:'a - (b - c)', result:'a - b + c'},
      // {f:'a - (b + c)', result:'a - b - c'},   // need an option to prefer a - b - c over a - b + -c
      {f:'(x * 1 + 3) + (x * 2 + 6)', result:'3 * x + 9'},
      {f:'x / (x / 2)', result:'2'},
      {f:'2 * v20*v20*3 / v20 / v20', result:'6'},
      {f:'2 * v20*v20*3 / (v20^2)', result:'6'},
      {f:'2 * v20^2 / v20 / v20', result:'2'},
      {f:'2 * v20^2 / (v20 * v20)', result:'2'},
      {f:'2 * v20^2 / (v20^2)', result:'2'},
      {f:'k*(a*k+b)/k^4', result:'(a*k+b)/k^3'},
      // {f:'(p0 + 9.000000000000001e-4 * p0 ^ 2) * 1.152921504606847e+18 / (1.152921504606847e+15 * p0)', result:'(1 + 9.000000000000001e-4 * p0) * 1000'},
//      result:'1000 + 9.000000000000001e-1 * p0'},
      // {f:'(a*k^2+b*k)/k^4', result:'(a*k+b)/k^3'},
//      {f:'(-(20400 + x) - ((28800 + 1.411764705882353 * x) + (37400 + 1.8333333333333333 * x) + (90045 + 4.413970588235294 * x) + (13000 + 0.6372549019607843 * x) + (19800 + 0.9705882352941176 * x)) + 274720) * 3 / 4', result:'N * x + M'},
		];
    simplifyTestsArray.forEach(function(aTest) { 
      aTest.testName = '' + aTest.f + ' -> ' + aTest.result; 
    });
		simplifyTestsArray.forEach(function(aTest) {
			test(aTest.testName, function() {
        // var rules = [
        //   'n1/(n2/n3) -> (n1*n3)/n2',
        //   'n1/n2/n3 -> n1/(n2*n3)',
        //   '(1/n1)^c1 -> n1^-c1',
        //   'n1*c1^c2 + n2*c1 -> c1*(n1*c1^(c2-1) + n2)',
        //   '1/(n1^c1) * (n1^c1) -> 1',
        // ];
        var r = math.simplify.rules;
        if (r.indexOf('n1/(n2/n3) -> (n1*n3)/n2') === -1) r.push('n1/(n2/n3) -> (n1*n3)/n2');     // fixes x / (x / 2)
        if (r.indexOf('(1/n1)^c1 -> n1^-c1') === -1) r.push('(1/n1)^c1 -> n1^-c1');     // fixes 2 * v20^2 / v20 / v20
        if (r.indexOf('(n1 + c1*n1^2)*c2/(c3*n1) -> (1 + c1*n1)*c2/c3') === -1) r.push('(n1 + c1*n1^2)*c2/(c3*n1) -> (1 + c1*n1)*c2/c3');
        // r.push(rules[3]);
        // r.push(rules[4]);
				var rootNode = math.simplify(aTest.f, r);
        var actual = rootNode.toString();
        var expected = math.parse(aTest.result).toString();
				expect(actual).to.equal(expected);
			});
		});
	});
  
}); // Testing Math Library

})();
