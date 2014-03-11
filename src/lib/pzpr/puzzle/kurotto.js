/*! @license pzpr.js v3.4.0 (c) 2009-2014 sabo2, MIT license
 *   https://bitbucket.org/sabo2/pzprv3 */
pzpr.createCustoms("kurotto",{MouseEvent:{mouseinput:function(){this.owner.playmode?(this.mousestart||this.mousemove)&&this.inputcell():this.owner.editmode&&this.mousestart&&this.inputqnum()},inputRed:function(){this.dispRed()}},KeyEvent:{enablemake:!0},Cell:{numberIsWhite:!0,nummaxfunc:function(){var a=this.owner.board.qcols*this.owner.board.qrows-1;return 255>=a?a:255},minnum:0,checkComplete:function(a){if(!this.isValidNum())return!0;for(var b=0,c=[],d=this.getdir4clist(),e=0;e<d.length;e++){var f=a.getRoomID(d[e][0]);if(null!==f){for(var g=0;g<c.length;g++)if(c[g]===f){f=null;break}null!==f&&(b+=a.room[f].clist.length,c.push(f))}}return this.qnum===b}},AreaBlackManager:{enabled:!0},Flags:{use:!0},Graphic:{hideHatena:!0,initialize:function(){this.Common.prototype.initialize.call(this),this.gridcolor=this.gridcolor_DLIGHT,this.bcolor="silver",this.setBGCellColorFunc("qsub1"),this.fontsizeratio=.85,this.circleratio=[.45,.4]},setRange:function(a,b,c,d){var e=this.owner,f=e.board;e.getConfig("autocmp")&&(a=f.minbx-2,b=f.minby-2,c=f.maxbx+2,d=f.maxby+2),this.Common.prototype.setRange.call(this,a,b,c,d)},paint:function(){var a=this.owner,b=a.board;this.check_binfo=a.getConfig("autocmp")?b.getBCellInfo():null,this.drawDotCells(!1),this.drawGrid(),this.drawBlackCells(),this.drawCircles(),this.drawNumbers(),this.drawChassis(),this.drawTarget()},getCircleFillColor:function(a){if(a.isNum()){var b=!!this.check_binfo&&a.checkComplete(this.check_binfo);return b?this.bcolor:this.circledcolor}return null}},Encode:{decodePzpr:function(){this.decodeNumber16()},encodePzpr:function(){this.encodeNumber16()}},FileIO:{decodeData:function(){this.decodeCellQnum(),this.decodeCellAns()},encodeData:function(){this.encodeCellQnum(),this.encodeCellAns()}},AnsCheck:{checkAns:function(){return this.checkCellNumber_kurotto()?null:"nmSumSizeNe"},checkCellNumber_kurotto:function(){for(var a=!0,b=this.owner.board.getBCellInfo(),c=0;c<this.owner.board.cellmax;c++){var d=this.owner.board.cell[c];if(!d.checkComplete(b)){if(this.checkOnly)return!1;d.seterr(1),a=!1}}return a}},FailCode:{nmSumSizeNe:["隣り合う黒マスの個数の合計が数字と違います。","The number is not equal to sum of adjacent masses of black cells."]}});