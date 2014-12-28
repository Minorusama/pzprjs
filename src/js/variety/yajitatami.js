//
// パズル固有スクリプト部 ヤジタタミ版 yajitatami.js v3.4.1
//
pzpr.classmgr.makeCustom(['yajitatami'], {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	mouseinput : function(){
		if(this.owner.playmode){
			if(this.mousestart || this.mousemove){
				if(this.btn.Left && this.isBorderMode()){ this.inputborder();}
				else{ this.inputQsubLine();}
			}
		}
		else if(this.owner.editmode){
			if(this.mousestart || this.mousemove){
				if(this.isBorderMode()){ this.inputborder();}
				else                   { this.inputdirec();}
			}
			else if(this.mouseend && this.notInputted()){
				this.inputqnum();
			}
		}
	}
},

//---------------------------------------------------------
// キーボード入力系
KeyEvent:{
	enablemake : true,
	moveTarget : function(ca){
		if(ca.match(/shift/)){ return false;}
		return this.moveTCell(ca);
	},

	keyinput : function(ca){
		if(this.key_inputdirec(ca)){ return;}
		this.key_inputqnum(ca);
	}
},

//---------------------------------------------------------
// 盤面管理系
Board:{
	qcols : 8,
	qrows : 8,

	hasborder : 1
},

AreaRoomManager:{
	enabled : true
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	gridcolor_type : "DLIGHT",

	bordercolor_func : "qans",

	paint : function(){
		this.drawBGCells();
		this.drawDashedGrid();
		this.drawQansBorders();
		this.drawQuesBorders();

		this.drawArrowNumbers();

		this.drawBorderQsubs();

		this.drawChassis();

		this.drawTarget();
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	decodePzpr : function(type){
		this.decodeArrowNumber16();
		this.decodeBorder();
	},
	encodePzpr : function(type){
		this.encodeArrowNumber16();
		this.encodeBorder_if_exist();
	},

	encodeBorder_if_exist : function(){
		for(var id=0;id<this.owner.board.bdmax;id++){
			if(this.owner.board.border[id].ques===1){ this.encodeBorder(); break;}
		}
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		this.decodeCellDirecQnum();
		this.decodeBorderQues();
		this.decodeBorderAns();
	},
	encodeData : function(){
		this.encodeCellDirecQnum();
		this.encodeBorderQues();
		this.encodeBorderAns();
	}
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checklist : [
		["checkBorderCross",        "bdCross"],
		["checkArrowNumber_border", "arNoAdjBd"],
		["checkTatamiLength",       "bkSize1"],
		["checkArrowNumber_tatami", "anTatamiNe"],
		["checkTatamiSize",         "bkSizeNe"],
		["checkTatamiBreadth",      "bkWidthGt1"]
	],

	checkTatamiLength : function(){
		return this.checkAllArea(this.getRoomInfo(), function(w,h,a,n){ return (a>1);});
	},
	checkTatamiSize : function(){
		return this.checkAllArea(this.getRoomInfo(), function(w,h,a,n){ return (n<0||n===a);});
	},
	checkTatamiBreadth : function(){
		return this.checkAllArea(this.getRoomInfo(), function(w,h,a,n){ return (w===1||h===1);});
	},

	checkArrowNumber_tatami : function(){
		var result = true, bd = this.owner.board;
		for(var c=0;c<bd.cellmax;c++){
			var cell = bd.cell[c];
			if(!cell.isValidNum()){ continue;}

			var bx = cell.bx, by = cell.by, dir = cell.qdir, blist;
			if     (dir===cell.UP){ blist = bd.borderinside(bx,bd.minby,bx,by);}
			else if(dir===cell.DN){ blist = bd.borderinside(bx,by,bx,bd.maxby);}
			else if(dir===cell.LT){ blist = bd.borderinside(bd.minbx,by,bx,by);}
			else if(dir===cell.RT){ blist = bd.borderinside(bx,by,bd.maxbx,by);}
			else{ continue;}

			var count = blist.filter(function(border){ return border.isBorder();}).length;
			if(cell.qnum!==count){
				if(this.checkOnly){ return false;}
				cell.seterr(1);
				result = false;
			}
		}
		return result;
	},

	checkArrowNumber_border : function(){
		var result = true, bd = this.owner.board;
		for(var c=0;c<bd.cellmax;c++){
			var cell = bd.cell[c], dir = cell.qdir;
			if(!cell.isValidNum() || !dir){ continue;}

			if(!cell.getaddr().movedir(dir,1).getb().isBorder()){
				if(this.checkOnly){ return false;}
				cell.seterr(1);
				result = false;
			}
		}
		return result;
	}
},

FailCode:{
	bkSizeNe   : ["数字とタタミの大きさが違います。","The size of tatami and the number written in Tatami is different."],
	bkSize1    : ["長さが１マスのタタミがあります。","The length of the tatami is one."],
	anTatamiNe : ["矢印の方向にあるタタミの数が正しくありません。","The number of tatamis are not correct."],
	arNoAdjBd  : ["矢印の方向に境界線がありません。","There is no border in front of the arrowed number."]
}
});
