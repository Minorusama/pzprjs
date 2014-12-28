//
// パズル固有スクリプト部 ペイントエリア版 paintarea.js v3.4.1
//
pzpr.classmgr.makeCustom(['paintarea'], {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	mouseinput : function(){
		if(this.owner.playmode){
			if(this.mousestart || this.mousemove){ this.inputtile();}
		}
		else if(this.owner.editmode){
			if(this.mousestart || this.mousemove){ this.inputborder();}
			else if(this.mouseend && this.notInputted()){ this.inputqnum();}
		}
	},
	inputRed : function(){ this.dispRed();}
},

//---------------------------------------------------------
// キーボード入力系
KeyEvent:{
	enablemake : true
},

//---------------------------------------------------------
// 盤面管理系
Cell:{
	maxnum : 4,
	minnum : 0
},
Board:{
	hasborder : 1
},

AreaShadeManager:{
	enabled : true
},
AreaRoomManager:{
	enabled : true
},

Flags:{
	use    : true,
	redblk : true
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	bgcellcolor_func : "qans1",

	bcolor_type : "GREEN",
	bbcolor : "rgb(127, 127, 127)",

	paint : function(){
		this.drawBGCells();
		this.drawGrid();
		this.drawShadedCells();

		this.drawNumbers();

		this.drawBorders();

		this.drawChassis();

		this.drawBoxBorders(true);

		this.drawTarget();
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	decodePzpr : function(type){
		this.decodeBorder();
		this.decodeNumber10();
	},
	encodePzpr : function(type){
		this.encodeBorder();
		this.encodeNumber10();
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		this.decodeAreaRoom();
		this.decodeCellQnum();
		this.decodeCellAns();
	},
	encodeData : function(){
		this.encodeAreaRoom();
		this.encodeCellQnum();
		this.encodeCellAns();
	}
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checklist : [
		["checkSameColorTile",  "bkMixed"],		// 問題チェック用
		["checkConnectShade",   "csDivide"],
		["check2x2ShadeCell",   "cs2x2", "", 1],
		["checkDir4ShadeCell",  "nmShadeNe"],
		["check2x2UnshadeCell", "cu2x2", "", 2]
	],

	checkDir4ShadeCell : function(){
		return this.checkDir4Cell(function(cell){ return cell.isShade();},0);
	},
	check2x2UnshadeCell : function(){
		return this.check2x2Block( function(cell){ return cell.isUnshade();} );
	}
},

FailCode:{
	cu2x2     : ["2x2の白マスのかたまりがあります。","There is a 2x2 block of unshaded cells."],
	nmShadeNe : ["数字の上下左右にある黒マスの数が間違っています。","The number is not equal to the number of shaded cells in four adjacent cells."]
}
});
