/* test_kakuru.js */

ui.debug.addDebugData('kakuru', {
	url : '5/5/3.a+4+mD.S.bm+g+A.3',
	failcheck : [
		['nqAroundDup',  "pzprv3/kakuru/5/5/3 . 10 b 4 /b . . . . /23 . 38 . 11 /. . . . b /16 b 20 . 3 /. 0 . . . /. 0 0 2 2 /. 0 . 0 . /0 0 0 0 . /. . . 0 . /"],
		['nqAroundSumNe',"pzprv3/kakuru/5/5/3 . 10 b 4 /b . . . . /23 . 38 . 11 /. . . . b /16 b 20 . 3 /. 1 . . . /. 2 5 3 1 /. 0 . 0 . /0 0 0 0 . /. . . 0 . /"],
		['nmAround',     "pzprv3/kakuru/5/5/3 . 10 b 4 /b . . . . /23 . . . 11 /. . . . b /16 b 20 . 3 /. 1 . . . /. 2 4 3 1 /. 0 3 0 . /0 0 0 0 . /. . . 0 . /"],
		['ceEmpty',      "pzprv3/kakuru/5/5/3 . 10 b 4 /b . . . . /23 . 38 . 11 /. . . . b /16 b 20 . 3 /. 2 . . . /. 1 4 3 1 /. 0 . 5 . /0 0 0 2 . /. . . 1 . /"],
		[null,           "pzprv3/kakuru/5/5/3 . 10 b 4 /b . . . . /23 . 38 . 11 /. . . . b /16 b 20 . 3 /. 2 . . . /. 1 4 3 1 /. 6 . 5 . /7 9 8 2 . /. . . 1 . /"]
	]
});
