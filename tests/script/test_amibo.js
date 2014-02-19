/* test_amibo.js */

ui.debug.addDebugData('amibo', {
	url : '5/5/2c4a.c3f.3f',
	failcheck : [
		['nmLineGt1',   "pzprv3/amibo/5/5/2 . . . 4 /. # - - . /3 l . . . /. l # 3 . /. . . . . /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
		['lbLoop',      "pzprv3/amibo/5/5/2 - - . 4 /. # . . l /3 + - - + /. l # 3 l /- + - - + /0 0 -1 -1 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /0 0 0 0 0 /"],
		['lbLenGt',     "pzprv3/amibo/5/5/2 - + . 4 /. # l . l /3 - - - + /. . # 3 l /. . . . l /0 0 -1 -1 /-1 0 0 0 /0 0 0 0 /0 0 0 0 /0 0 0 0 /-1 -1 0 0 0 /0 0 -1 0 0 /0 0 -1 0 0 /0 0 0 0 0 /"],
		['lbNotCrossEq',"pzprv3/amibo/5/5/2 - + . 4 /. # l . l /3 - - . l /. . # 3 l /. . . . l /0 0 -1 -1 /-1 0 0 0 /0 0 0 -1 /0 0 0 0 /0 0 0 0 /-1 -1 0 0 0 /-1 0 -1 0 0 /-1 0 -1 0 0 /-1 0 0 0 0 /"],
		['lbLenLt',     "pzprv3/amibo/5/5/2 - + l 4 /. # l + + /3 - - + l /. . # 3 . /. . . . . /0 0 -1 -1 /-1 0 0 0 /0 0 0 -1 /0 0 -1 -1 /0 0 0 0 /-1 -1 0 0 0 /-1 0 -1 0 0 /-1 0 -1 0 0 /-1 0 0 -1 0 /"],
		['nmIsolate',   "pzprv3/amibo/5/5/2 - + l 4 /. # l l l /3 - - + l /. . # 3 l /. - - - + /0 0 -1 -1 /-1 0 0 0 /0 0 0 -1 /0 0 -1 -1 /-1 0 0 0 /-1 -1 0 0 0 /-1 0 -1 0 0 /-1 0 -1 0 0 /-1 0 0 -1 0 /"],
		['lbDivide',    "pzprv3/amibo/5/5/2 - + l 4 /. # + + l /3 - - + l /- + # 3 l /. + - - + /0 0 -1 -1 /-1 0 0 0 /0 0 0 -1 /0 0 -1 -1 /-1 0 0 0 /-1 -1 0 0 0 /-1 0 -1 0 0 /-1 0 -1 0 0 /-1 0 0 -1 0 /"],
		[null,          "pzprv3/amibo/5/5/2 - + l 4 /. # + + + /3 - - + l /- + # 3 l /. + - - + /0 0 -1 -1 /-1 0 0 0 /0 0 0 -1 /0 0 -1 -1 /-1 0 0 0 /-1 -1 0 0 0 /-1 0 -1 0 0 /-1 0 -1 0 0 /-1 0 0 -1 0 /"]
	]
});
