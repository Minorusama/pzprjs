//
// パズル固有スクリプト部 カックル版 kakuru.js v3.3.2
//
Puzzles.kakuru = function(){ };
Puzzles.kakuru.prototype = {
	setting : function(){
		// グローバル変数の初期設定
		if(!k.qcols){ k.qcols = 7;}	// 盤面の横幅
		if(!k.qrows){ k.qrows = 7;}	// 盤面の縦幅
		k.irowake  = 0;		// 0:色分け設定無し 1:色分けしない 2:色分けする

		k.iscross  = 0;		// 1:盤面内側のCrossがあるパズル 2:外枠上を含めてCrossがあるパズル
		k.isborder = 0;		// 1:Border/Lineが操作可能なパズル 2:外枠上も操作可能なパズル
		k.isexcell = 0;		// 1:上・左側にセルを用意するパズル 2:四方にセルを用意するパズル

		k.isLineCross     = false;	// 線が交差するパズル
		k.isCenterLine    = false;	// マスの真ん中を通る線を回答として入力するパズル
		k.isborderAsLine  = false;	// 境界線をlineとして扱う
		k.hasroom         = false;	// いくつかの領域に分かれている/分けるパズル
		k.roomNumber      = false;	// 部屋の問題の数字が1つだけ入るパズル

		k.dispzero        = false;	// 0を表示するかどうか
		k.isDispHatena    = true;	// qnumが-2のときに？を表示する
		k.isAnsNumber     = true;	// 回答に数字を入力するパズル
		k.NumberWithMB    = false;	// 回答の数字と○×が入るパズル
		k.linkNumber      = false;	// 数字がひとつながりになるパズル

		k.BlackCell       = false;	// 黒マスを入力するパズル
		k.NumberIsWhite   = false;	// 数字のあるマスが黒マスにならないパズル
		k.RBBlackCell     = false;	// 連黒分断禁のパズル
		k.checkBlackCell  = false;	// 正答判定で黒マスの情報をチェックするパズル
		k.checkWhiteCell  = false;	// 正答判定で白マスの情報をチェックするパズル

		k.ispzprv3ONLY    = true;	// ぱずぷれアプレットには存在しないパズル
		k.isKanpenExist   = false;	// pencilbox/カンペンにあるパズル

		if(k.EDITOR){
			base.setExpression("　黒マスはQキーで入力できます。",
							   " Press 'Q' key to input black cell.");
		}
		else{
			base.setExpression("　マウスやキーボードで数字が入力できます。",
							   " It is available to input number by keybord or mouse");
		}
		base.setTitle("カックル","Kakuru");
		base.setFloatbgcolor("rgb(96, 255, 96)");
	},
	menufix : function(){ },

	//---------------------------------------------------------
	//入力系関数オーバーライド
	input_init : function(){
		// マウス入力系
		mv.mousedown = function(){ this.inputqnum_kakuru();};
		mv.mouseup = function(){ };
		mv.mousemove = function(){ };
		mv.inputqnum_kakuru = function(){
			var cc = this.cellid();
			if(cc===null || (bd.QuC(cc)==1 && cc==tc.getTCC())){ return;}
			this.inputqnum();
		};

		// キーボード入力系
		kc.keyinput = function(ca){
			if(this.moveTCell(ca)){ return;}
			this.key_inputqnum_kakuru(ca);
		};
		kc.key_inputqnum_kakuru = function(ca){
			var cc = tc.getTCC();

			if('0'<=ca && ca<='9'){
				if(bd.QuC(cc)===1){ return;}
				this.key_inputqnum(ca);
			}
			else if(ca==='-'){
				if(bd.QuC(cc)===1){ return;}
				bd.setNum(cc,(k.editmode?-2:-1));
			}
			else if(ca===' '){
				if(k.editmode){ bd.sQuC(cc,0);}
				bd.setNum(cc,-1);
			}
			else if(k.editmode && (ca==='q'||ca==='q1'||ca==='q2')){
				if(ca==='q'){ ca = (bd.QuC(cc)!==1?'q1':'q2');}
				if(ca==='q1'){
					bd.sQuC(cc, 1);
					bd.setNum(cc, -1);
				}
				else if(ca=='q2'){ bd.sQuC(cc, 0);}
			}
			else{ return;}
			this.prev=cc;
			pc.paintCell(cc);
		};

		if(k.EDITOR){
			kp.kpgenerate = function(mode){
				if(mode==1){
					this.inputcol('num','knumq1','q1','■');
					this.inputcol('num','knumq2','q2','□');
					this.inputcol('empty','','','');
					this.inputcol('empty','','','');
					this.insertrow();
				}
				this.inputcol('num','knum1','1','1');
				this.inputcol('num','knum2','2','2');
				this.inputcol('num','knum3','3','3');
				this.inputcol('num','knum4','4','4');
				this.insertrow();
				this.inputcol('num','knum5','5','5');
				this.inputcol('num','knum6','6','6');
				this.inputcol('num','knum7','7','7');
				this.inputcol('num','knum8','8','8');
				this.insertrow();
				this.inputcol('num','knum9','9','9');
				if(mode==1){ this.inputcol('num','knum0','0','0');}
				if(mode==1){ this.inputcol('num','knum_','-','?');}
				this.inputcol('num','knum.',' ',' ');
				this.insertrow();
			};
			kp.generate(kp.ORIGINAL, true, true);
			kp.kpinput = function(ca){
				kc.key_inputqnum_kakuru(ca);
			};
		}

		bd.nummaxfunc = function(cc){ return (k.editmode?44:9);};
	},

	//---------------------------------------------------------
	//画像表示系関数オーバーライド
	graphic_init : function(){
		pc.gridcolor = pc.gridcolor_LIGHT;

		pc.errbcolor1 = pc.errbcolor1_DARK;
		pc.errbcolor2 = "white";

		pc.paint = function(){
			this.drawBGCells();
			this.drawGrid();
			this.drawBlackCells();

			this.drawNumbers();

			this.drawChassis();

			this.drawCursor();
		};

		// オーバーライド drawBGCells用
		pc.setBGCellColor = function(cc){
			if     (bd.cell[cc].qnum !==-1){ g.fillStyle = "rgb(208, 208, 208)"; return true;}
			else if(bd.cell[cc].error=== 1){ g.fillStyle = this.errbcolor1;      return true;}
			return false;
		};
		// オーバーライド drawBlackCells用
		pc.setCellColor = function(cc){
			if(bd.cell[cc].ques===1){ g.fillStyle = this.cellcolor; return true;}
			return false;
		};
	},

	//---------------------------------------------------------
	// URLエンコード/デコード処理
	encode_init : function(){
		enc.pzlimport = function(type){
			this.decodeKakuru();
		};
		enc.pzlexport = function(type){
			this.encodeKakuru();
		};

		enc.decodeKakuru = function(){
			var cell=0, i=0, bstr = this.outbstr;
			for(i=0;i<bstr.length;i++){
				var ca = bstr.charAt(i), obj=bd.cell[cell];

				if     (ca==='+'){ obj.ques = 1;}
				else if(this.include(ca,"k","z")){ cell+=(parseInt(ca,36)-19);}
				else if(ca!=='.'){ obj.qnum = this.decval(ca);}

				cell++;
				if(cell>=bd.cellmax){ break;}
			}
			this.outbstr = bstr.substr(i);
		};
		enc.encodeKakuru = function(type){
			var cm="", count=0;
			for(var c=0;c<bd.cellmax;c++){
				var pstr="", obj=bd.cell[c];
				if     (obj.ques=== 1){ pstr = "+";}
				else if(obj.qnum!==-1){ pstr = this.encval(obj.qnum);}
				else{ count++;}

				if(count===0){ cm+=pstr;}
				else if(pstr || count===17){
					if(count===1){ cm+=("."+pstr);}
					else{ cm+=((count+18).toString(36)+pstr);}
					count=0;
				}
			}
			if(count===1){ cm+=".";}
			else if(count>1){ cm+=((count+18).toString(36));}

			this.outbstr += cm;
		};
		enc.decval = function(ca){
			if     (ca==='_')        { return -2;}
			else if(ca>='0'&&ca<='9'){ return parseInt(ca,36);}
			else if(ca>='a'&&ca<='j'){ return parseInt(ca,36);}
			else if(ca>='A'&&ca<='Z'){ return parseInt(ca,36)+10;}
			return "";
		};
		enc.encval = function(val){
			if     (val===-2)        { return "_";}
			else if(val>= 1&&val<=19){ return val.toString(36).toLowerCase();}
			else if(val>=20&&val<=45){ return (val-10).toString(36).toUpperCase();}
			return "0";
		};

		//---------------------------------------------------------
		fio.decodeData = function(){
			this.decodeCell( function(obj,ca){
				if     (ca==="b"){ obj.ques = 1;}
				else if(ca==="?"){ obj.qnum =-2;}
				else if(ca!=="."){ obj.qnum = parseInt(ca);}
			});
			this.decodeCell( function(obj,ca){
				if(ca!=="."&&ca!=="0"){ obj.anum = parseInt(ca);}
			});
		};
		fio.encodeData = function(){
			this.encodeCell( function(obj){
				if     (obj.ques=== 1){ return "b ";}
				else if(obj.qnum===-2){ return "? ";}
				else if(obj.qnum>=  0){ return ""+obj.qnum.toString()+" ";}
				else{ return ". ";}
			});
			this.encodeCell( function(obj){
				if(obj.ques===1||obj.qnum!==-1){ return ". ";}
				return (obj.anum!==-1 ? ""+obj.anum.toString()+" " : "0 ");
			});
		};
	},

	//---------------------------------------------------------
	// 正解判定処理実行部
	answer_init : function(){
		ans.checkAns = function(){

			if( !this.checkAroundPrenums() ){
				this.setAlert('初めから出ている数字の周りに同じ数字が入っています。','There are same numbers around the pre-numbered cell.'); return false;
			}

			if( !this.checkNumber() ){
				this.setAlert('初めから出ている数字の周りに入る数の合計が正しくありません。','A sum of numbers around the pre-numbered cell is incorrect.'); return false;
			}

			if( !this.checkAroundNumbers() ){
				this.setAlert('同じ数字がタテヨコナナメに隣接しています。','Same numbers is adjacent.'); return false;
			}

			if( !this.checkAllCell(function(c){ return (bd.QuC(c)===0 && bd.noNum(c));}) ){
				this.setAlert('何も入っていないマスがあります。','There is a empty cell.'); return false;
			}

			return true;
		};
		ans.check1st = function(){ return this.checkAllCell(function(c){ return (bd.QuC(c)===0 && bd.noNum(c));});};

		ans.checkAroundPrenums = function(type){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QuC(c)==1 || bd.QnC(c)<=0){ continue;}

				var bx=bd.cell[c].bx, by=bd.cell[c].by;
				var d={1:0,2:0,3:0,4:0,5:0,6:0,7:0,8:0,9:0};
				var clist=[c], clist0 = bd.cellinside(bx-2,by-2,bx+2,by+2);
				for(var i=0;i<clist0.length;i++){
					var cc = clist0[i];
					if(cc!==c && bd.cell[cc].ques===0 && bd.cell[cc].qnum===-1){
						var qa = bd.cell[cc].anum;
						if(qa>0){ d[qa]++; clist.push(cc);}
					}
				}
				for(var n=1;n<=9;n++){
					if(d[n]>1){
						if(this.inAutoCheck){ return false;}
						bd.sErC([c],1);
						for(i=0;i<clist.length;i++){ if(bd.AnC(clist[i])===n){ bd.sErC(clist[i],1);} }
						result = false;
					}
				}
			}
			return result;
		};
		ans.checkNumber = function(type){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				if(bd.QuC(c)==1 || bd.QnC(c)<=0){ continue;}

				var cnt=0, bx=bd.cell[c].bx, by=bd.cell[c].by;
				var clist=[c], clist0 = bd.cellinside(bx-2,by-2,bx+2,by+2);
				for(var i=0;i<clist0.length;i++){
					var cc = clist0[i];
					if(cc!==c && bd.cell[cc].ques===0 && bd.cell[cc].qnum===-1){
						var qa = bd.cell[cc].anum;
						if(qa>0){ cnt+=qa; clist.push(cc);}
						else    { cnt=bd.QnC(c); break;}
					}
				}
				if(bd.QnC(c)!==cnt){
					if(this.inAutoCheck){ return false;}
					bd.sErC(clist,1); result = false;
				}
			}
			return result;
		};
		ans.checkAroundNumbers = function(){
			var result = true;
			for(var c=0;c<bd.cellmax;c++){
				if(bd.AnC(c)<=0){ continue;}
				var bx = bd.cell[c].bx, by = bd.cell[c].by;
				var clist=[c], clist0 = bd.cellinside(bx,by,bx+2,by+2);
				clist0.push(bd.cnum(bx-2,by+2)); // 右・左下・下・右下の4箇所だけチェック
				for(var i=0;i<clist0.length;i++){
					var cc = clist0[i];
					if(cc!==null && cc!==c && bd.cell[c].anum===bd.cell[cc].anum){ clist.push(cc);}
				}
				if(clist.length>1){
					if(this.inAutoCheck){ return false;}
					bd.sErC(clist,1); result = false;
				}
			}
			return result;
		};
	}
};
