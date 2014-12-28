//
// パズル固有スクリプト部 ひとりにしてくれ hitori.js v3.4.1
//
pzpr.classmgr.makeCustom(['hitori'], {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	RBShadeCell : true,

	mouseinput : function(){
		if(this.owner.playmode){
			if(this.mousestart || this.mousemove){ this.inputcell();}
		}
		else if(this.owner.editmode){
			if(this.mousestart){ this.inputqnum();}
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
	disInputHatena : true,

	maxnum : function(){
		return Math.max(this.owner.board.qcols,this.owner.board.qrows);
	},

	posthook : {
		qnum : function(num){ this.owner.board.setInfoByCell(this); this.redDisp();},
		qans : function(num){ this.owner.board.setInfoByCell(this); this.redDisp();}
	},

	redDisp : function(){
		var puzzle = this.owner, bd = puzzle.board;
		if(puzzle.getConfig('autoerr')){
			puzzle.painter.paintRange(bd.minbx-1, this.by-1, bd.maxbx+1, this.by+1);
			puzzle.painter.paintRange(this.bx-1, bd.minby-1, this.bx+1, bd.maxby+1);
		}
	}
},
Board:{
	qcols : 8,
	qrows : 8
},

AreaUnshadeManager:{
	enabled : true
},

Flags:{
	use      : true,
	redblkrb : true
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	gridcolor_type : "LIGHT",
	bcolor_type : "GREEN",

	bgcellcolor_func : "qsub1",

	fontErrcolor : "red",
	fontShadecolor : "rgb(96,96,96)",

	paint : function(){
		this.drawBGCells();
		this.drawGrid();
		this.drawShadedCells();

		this.drawNumbers_hitori();

		this.drawChassis();

		this.drawTarget();
	},

	drawNumbers_hitori : function(){
		var puzzle=this.owner, bd=puzzle.board, chk=puzzle.checker;
		if(!bd.haserror && puzzle.getConfig('autoerr')){
			var pt = puzzle.CellList.prototype, seterr = pt.seterr;
			chk.inCheck = true;
			chk.checkOnly = false;
			pt.seterr = pt.setinfo;
			chk.checkRowsColsSameNumber();
			pt.seterr = seterr;
			chk.inCheck = false;

			var clist = this.range.cells;
			this.range.cells = bd.cell;
			this.drawNumbers();
			this.range.cells = clist;

			bd.cell.setinfo(0);
		}
		else{
			this.drawNumbers();
		}
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	decodePzpr : function(type){
		this.decodeHitori();
	},
	encodePzpr : function(type){
		this.encodeHitori();
	},

	decodeHitori : function(){
		var c=0, i=0, bstr = this.outbstr, bd = this.owner.board;
		for(i=0;i<bstr.length;i++){
			var cell = bd.cell[c], ca = bstr.charAt(i);

			if(this.include(ca,"0","9")||this.include(ca,"a","z"))
							 { cell.qnum = parseInt(ca,36);}
			else if(ca==='-'){ cell.qnum = parseInt(bstr.substr(i+1,2),36); i+=2;}
			else if(ca==='%'){ cell.qnum = -2;}

			c++;
			if(c>=bd.cellmax){ break;}
		}
		this.outbstr = bstr.substr(i);
	},
	encodeHitori : function(){
		var count=0, cm="", bd = this.owner.board;
		for(var c=0;c<bd.cellmax;c++){
			var pstr = "", qn= bd.cell[c].qnum;

			if     (qn===-2)       { pstr = "%";}
			else if(qn>= 0&&qn< 16){ pstr =       qn.toString(36);}
			else if(qn>=16&&qn<256){ pstr = "-" + qn.toString(36);}
			else{ count++;}

			if(count===0){ cm += pstr;}
			else{ cm+="."; count=0;}
		}
		if(count>0){ cm+=".";}

		this.outbstr += cm;
	},

	decodeKanpen : function(){
		this.owner.fio.decodeCellQnum_kanpen_hitori();
	},
	encodeKanpen : function(){
		this.owner.fio.encodeCellQnum_kanpen_hitori();
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		this.decodeCellQnum();
		this.decodeCellAns();
	},
	encodeData : function(){
		this.encodeCellQnum();
		this.encodeCellAns();
	},

	kanpenOpen : function(){
		this.decodeCellQnum_kanpen_hitori();
		this.decodeCellAns();
	},
	kanpenSave : function(){
		this.encodeCellQnum_kanpen_hitori();
		this.encodeCellAns();
	},

	decodeCellQnum_kanpen_hitori : function(){
		this.decodeCell( function(obj,ca){
			if(ca!=="0" && ca!=="."){ obj.qnum = parseInt(ca);}
		});
	},
	encodeCellQnum_kanpen_hitori : function(){
		this.encodeCell( function(obj){
			return ((obj.qnum>0)?(obj.qnum.toString() + " "):"0 ");
		});
	}
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checklist : [
		["checkAdjacentShadeCell",  "csAdjacent"],
		["checkConnectUnshadeRB",   "cuDivideRB"],
		["checkRowsColsSameNumber", "nmDupRow"]
	],

	checkRowsColsSameNumber : function(){
		return this.checkRowsCols(this.isDifferentNumberInClist_hitori, function(cell){ return cell.qnum;});
	},
	isDifferentNumberInClist_hitori : function(clist, numfunc){
		var clist2 = clist.filter(function(cell){ return (cell.isUnshade() && cell.isNum());});
		return this.isDifferentNumberInClist(clist2, numfunc);
	}
}
});
