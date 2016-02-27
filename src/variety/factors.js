//
// パズル固有スクリプト部 因子の部屋版 factors.js
//
(function(pidlist, classbase){
	if(typeof module==='object' && module.exports){module.exports = [pidlist, classbase];}
	else{ pzpr.classmgr.makeCustom(pidlist, classbase);}
}(
['factors'], {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	mouseinput : function(){
		if(this.puzzle.playmode){
			if(this.mousestart){ this.inputqnum();}
		}
		else if(this.puzzle.editmode){
			if(this.mousestart || this.mousemove){
				if(this.btn==='left'){ this.inputborder();}
			}
			else if(this.mouseend && this.notInputted()){
				this.inputqnum();
			}
		}
	},

	inputqnum_main : function(cell){
		if(this.puzzle.editmode){
			cell = cell.room.top;
		}

		var max=cell.getmaxnum(), min=cell.getminnum();
		var num=(this.puzzle.editmode ? cell.qnum : cell.anum), val=-1;

		// playmode: subtypeは0以上、 qsにqsub値が入る
		// editmode: subtypeは-1固定、qsは常に0が入る
		if(this.btn==='left'){
			if     (num>=max){ val = -1;}
			else if(num===-1){ val = 1;}
			else{ val = num+1;}
		}
		else if(this.btn==='right'){
			if     (num===-1){ val = max;}
			else if(num<=min){ val = -1;}
			else{ val = num-1;}
		}
		cell.setNum(val);

		cell.draw();
	}
},

//---------------------------------------------------------
// キーボード入力系
KeyEvent:{
	enablemake : true,
	enableplay : true
},

//---------------------------------------------------------
// 盤面管理系
Cell:{
	disInputHatena : true,

	maxnum : function(){
		return this.puzzle.editmode?999999:Math.max(this.board.cols,this.board.rows);
	},

	setNum : function(val){
		if(val===0){ return;}
		if(this.puzzle.editmode){ this.setQnum(val);}else{ this.setAnum(val);}
	}
},

CellList:{
	getProduct : function(){
		var product = 1;
		for(var i=0,len=this.length;i<len;i++){
			var num = this[i].anum;
			product *= (num>0 ? num : 0);
		}
		return product;
	}
},

Board:{
	cols : 9,
	rows : 9,

	hasborder : 1
},

AreaRoomGraph:{
	enabled : true,
	hastop : true
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	gridcolor_type : "DLIGHT",

	paint : function(){
		this.drawBGCells();
		this.drawGrid();

		this.drawQuesNumbers_factors();
		this.drawAnswerNumbers();

		this.drawBorders();

		this.drawChassis();

		this.drawCursor();
	},

	drawAnswerNumbers : function(){
		var g = this.vinc('cell_anumber', 'auto');

		var clist = this.range.cells;
		for(var i=0;i<clist.length;i++){
			var cell = clist[i];
			var text = (cell.anum>=0 ? ""+cell.anum : "");
			g.vid = "cell_text_anum_"+cell.id;
			if(!!text){
				g.fillStyle = this.getNumberColor_anum(cell);
				this.disptext(text, cell.bx*this.bw, cell.by*this.bh);
			}
			else{ g.vhide();}
		}
	},
	drawQuesNumbers_factors : function(){
		var g = this.vinc('cell_qnumber', 'auto');

		g.fillStyle = this.fontcolor;
		var qnumoption = {
			ratio : [0.45, 0.45, 0.45, 0.45, 0.36, 0.30],
			position : this.TOPLEFT
		};
		var clist = this.range.cells;
		for(var i=0;i<clist.length;i++){
			var cell = clist[i];
			var text = (cell.qnum>=0 ? ""+cell.qnum : "");

			g.vid = "cell_text_qnum_"+cell.id;
			if(!!text){
				this.disptext(text, cell.bx*this.bw, cell.by*this.bh, qnumoption);
			}
			else{ g.vhide();}
		}
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	decodePzpr : function(type){
		this.decodeBorder();
		this.decodeRoomNumber16();
	},
	encodePzpr : function(type){
		this.encodeBorder();
		this.encodeRoomNumber16();
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		this.decodeBorderQues();
		this.decodeCellQnum();
		this.decodeCellAnumsub();
	},
	encodeData : function(){
		this.encodeBorderQues();
		this.encodeCellQnum();
		this.encodeCellAnumsub();
	}
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checklist : [
		"checkOtherAnsNumberInLine",
		"checkProductNumber",
		"checkNoAnumCell+"
	],

	checkOtherAnsNumberInLine : function(){
		this.checkRowsCols(this.isDifferentAnsNumberInClist, "nmDupRow");
	},
	checkNoAnumCell : function(){
		this.checkAllCell( function(cell){ return cell.anum===-1;}, "ceNoNum" );
	},

	checkProductNumber : function(){
		var rooms = this.board.roommgr.components;
		for(var r=0;r<rooms.length;r++){
			var room = rooms[r], clist = room.clist;
			var product = clist.getProduct();
			if(product === 0 || product === room.top.qnum){ continue;}
			
			this.failcode.add("nmProduct");
			if(this.checkOnly){ break;}
			clist.seterr(1);
		}
	}
},

FailCode:{
	nmProduct : ["ブロックの数字と数字の積が同じではありません。","A number of room is not equal to the product of these numbers."]
}
}));
