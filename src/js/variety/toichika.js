//
// パズル固有スクリプト部 遠い誓い版 toichika.js v3.4.1
//
pzpr.classmgr.makeCustom(['toichika'], {
//---------------------------------------------------------
// マウス入力系
MouseEvent:{
	mouseinput : function(){
		if(this.owner.playmode){
			if(this.mousestart || this.mousemove){
				if     (this.btn.Left) { this.inputarrow_cell();}
				else if(this.btn.Right){ this.inputDot();}
			}
			else if(this.mouseend && this.notInputted()){ this.inputqnum();}
		}
		else if(this.owner.editmode){
			if(this.mousestart || this.mousemove){
				if(this.isBorderMode()){ this.inputborder();}
				else                   { this.inputarrow_cell();}
			}
			else if(this.mouseend && this.notInputted()){ this.inputqnum();}
		}
	},

	inputDot : function(){
		var cell = this.getcell();
		if(cell.isnull || cell===this.mouseCell || cell.qnum!==-1){ return;}

		if(this.inputData===null){ this.inputData=(cell.qsub===1?0:1);}
		
		cell.setAnum(-1);
		cell.setQsub(this.inputData===1?1:0);
		this.mouseCell = cell;
		cell.draw();
	}
},

//---------------------------------------------------------
// キーボード入力系
KeyEvent:{
	enablemake : true,
	enableplay : true,
	moveTarget : function(ca){
		if(ca.match(/shift/)){ return false;}
		return this.moveTCell(ca);
	},

	keyinput : function(ca){
		this.key_toichika(ca);
	},
	key_toichika : function(ca){
		if     (ca==='1'||ca==='w'||ca==='shift+up')   { ca='1';}
		else if(ca==='2'||ca==='s'||ca==='shift+right'){ ca='4';}
		else if(ca==='3'||ca==='z'||ca==='shift+down') { ca='2';}
		else if(ca==='4'||ca==='a'||ca==='shift+left') { ca='3';}
		else if(ca==='5'||ca==='q'||ca==='-')          { ca='s1';}
		else if(ca==='6'||ca==='e'||ca===' ')          { ca=' ';}
		this.key_inputqnum(ca);
	}
},

//---------------------------------------------------------
// 盤面管理系
Cell:{
	numberAsObject : true,

	maxnum : 4
},
Board:{
	hasborder : 1,

	getPairedArrowsInfo : function(){
		var ainfo=[], isarrow=[];
		for(var c=0;c<this.cellmax;c++){ isarrow[c]=this.cell[c].isNum();}
		for(var c=0;c<this.cellmax;c++){
			var cell0 = this.cell[c];
			if(cell0.noNum()){ continue;}
			var pos=cell0.getaddr(), dir=cell0.getNum();

			while(1){
				pos.movedir(dir,2);
				var cell = pos.getc();
				if(cell.isnull){ ainfo.push([cell0.id]); break;}
				if(!!isarrow[cell.id]){
					if(cell.getNum()!==[0,cell.DN,cell.UP,cell.RT,cell.LT][dir]){ ainfo.push([cell0.id]);}
					else{ ainfo.push([cell.id,cell0.id]);}
					break;
				}
			}
		}
		return ainfo;
	}
},
BoardExec:{
	adjustBoardData : function(key,d){
		this.adjustCellArrow(key,d);
	}
},

AreaRoomManager:{
	enabled : true
},

//---------------------------------------------------------
// 画像表示系
Graphic:{
	gridcolor_type : "LIGHT",
	dotcolor_type : "PINK",

	paint : function(){
		this.drawBGCells();
		this.drawGrid();
		this.drawBorders();

		this.drawDotCells(true);
		this.drawCellArrows();
		this.drawHatenas();

		this.drawChassis();

		this.drawCursor();
	}
},

//---------------------------------------------------------
// URLエンコード/デコード処理
Encode:{
	decodePzpr : function(type){
		this.decodeBorder();
		this.decode4Cell_toichika();
	},
	encodePzpr : function(type){
		this.encodeBorder();
		this.encode4Cell_toichika();
	},

	decode4Cell_toichika : function(){
		var c=0, i=0, bstr = this.outbstr, bd=this.owner.board;
		for(i=0;i<bstr.length;i++){
			var cell = bd.cell[c], ca = bstr.charAt(i);

			if(this.include(ca,"1","4")){ cell.qnum = parseInt(bstr.substr(i,1),10);}
			else if(ca==='.')           { cell.qnum = -2;}
			else                        { c += (parseInt(ca,36)-5);}

			c++;
			if(c>=bd.cellmax){ break;}
		}
		this.outbstr = bstr.substr(i);
	},
	encode4Cell_toichika : function(){
		var cm="", count=0, bd=this.owner.board;
		for(var c=0;c<bd.cellmax;c++){
			var pstr = "", val = bd.cell[c].qnum;

			if     (val===-2)        { pstr = ".";}
			else if(val>=1 && val<=4){ pstr = val.toString(10);}
			else{ count++;}

			if(count===0){ cm += pstr;}
			else if(pstr || count===31){ cm+=((4+count).toString(36)+pstr); count=0;}
		}
		if(count>0){ cm+=(4+count).toString(36);}

		this.outbstr += cm;
	}
},
//---------------------------------------------------------
FileIO:{
	decodeData : function(){
		this.decodeAreaRoom();
		this.decodeCellQnum();
		this.decodeCellAnumsub();
	},
	encodeData : function(){
		this.encodeAreaRoom();
		this.encodeCellQnum();
		this.encodeCellAnumsub();
	}
},

//---------------------------------------------------------
// 正解判定処理実行部
AnsCheck:{
	checklist : [
		["checkDoubleNumber",      "bkNumGe2"],
		["checkAdjacentCountries", "arAdjPair"],
		["checkDirectionOfArrow",  "arAlone"],
		["checkNoNumber",          "bkNoNum"]
	],

	getPairArrowInfo : function(){
		return (this._info.parrow = this._info.parrow || this.owner.board.getPairedArrowsInfo());
	},

	checkDirectionOfArrow : function(){
		var result = true;
		var ainfo = this.getPairArrowInfo();
		for(var i=0;i<ainfo.length;i++){
			if(ainfo[i].length===1){
				this.owner.board.cell[ainfo[i]].seterr(1);
				result = false;
			}
		}
		return result;
	},
	checkAdjacentCountries : function(){
		var rinfo = this.getRoomInfo(), ainfo = this.getPairArrowInfo();
		// 隣接エリア情報を取得して、形式を変換
		var sides=rinfo.getSideAreaInfo(), adjs=[];
		for(var r=1;r<=rinfo.max-1;r++){
			adjs[r]=[];
			for(var i=0;i<sides[r].length;i++){ adjs[r][sides[r][i]]=true;}
			for(var s=r+1;s<=rinfo.max;s++){ if(!adjs[r][s]){ adjs[r][s]=false;}}
		}

		// ここから実際の判定
		var result = true;
		for(var i=0;i<ainfo.length;i++){
			if(ainfo[i].length===1){ continue;}
			var r1 = rinfo.id[ainfo[i][0]], r2 = rinfo.id[ainfo[i][1]];
			if((r1<r2 ? adjs[r1][r2] : adjs[r2][r1])>0){
				rinfo.area[r1].clist.seterr(1);
				rinfo.area[r2].clist.seterr(1);
				result = false;
			}
		}
		return result;
	}
},

FailCode:{
	bkNoNum   : ["国に矢印が入っていません。","A country has no arrow."],
	bkNumGe2  : ["1つの国に2つ以上の矢印が入っています。","A country has plural arrows."],
	arAdjPair : ["辺を共有する国にペアとなる矢印が入っています。","There are paired arrows in adjacent countries."],
	arAlone   : ["矢印の先にペアとなる矢印がいません。","There is not paired arrow in the direction of an arrow."]
}
});
