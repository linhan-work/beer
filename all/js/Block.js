
function Block( dom ){
	this.dom = dom; //dom
	this.parentW = this.dom.parentNode.clientWidth;
	this.parentH = this.dom.parentNode.clientHeight;
	this.scale = 1.58; //黑块 宽高比
	this.h = parseInt(this.parentW/4*this.scale);
	this.top = -this.h;
	this.speed = 2; //速度
	this.maxSpeed = 26; //最大速度
	this.timer = null; //定时器
	this.state = true; //游戏判断
	this.sum = 0; //分数
}

Block.prototype.init = function(){

	var _t = this;

	_t.zsy();
	_t.mark();

	var clickEvent = "ontouchstart" in document.documentElement ? "touchstart" : "click";

	_t.dom.addEventListener(clickEvent,function(e){

		if(!_t.state){
			return false;
		}
		e = e || window.event;
		var target = e.target ||e.srcElement;
		if(target.className.indexOf('block')!=-1){
			_t.sum++;
			_t.getEleByClassName("mark")[0].innerHTML = _t.sum;
			target.className = 'cell';
		}else{
			_t.state = false;
			clearInterval(_t.timer);
			_t.end();
			return false;
		}
	});
}

//创建一行，，，
Block.prototype.addRow = function(){

	var oRow = document.createElement('div');
	oRow.className = 'row';
	oRow.style.height = this.h + 'px';

	var cells = ['cell','cell','cell','cell'];
	var s = Math.floor(Math.random()*4);
	cells[s] = "cell block";
	var oCell = null;

	for (var i=0; i<4; i++) {
		oCell = document.createElement('div');
		oCell.className = cells[i];
		oRow.appendChild( oCell );
	}

	var fChild = this.dom.firstChild;
	if( fChild == null ){
		this.dom.appendChild(oRow);
	}else{
		this.dom.insertBefore(oRow , fChild);
	}
}


//删除一行，，，
Block.prototype.delRow = function(){
	this.dom.removeChild( this.dom.childNodes[ this.dom.childNodes.length-1 ] );
}


//判断什么时候拉回top 什么时候提升速度，，，什么时候停止
Block.prototype.judge = function(){

	var _t = this;

	if(_t.top >= 0){
		_t.top = -this.h;
		_t.dom.style.top = _t.top +'px';
		_t.addRow();
	}

	var rows = _t.getEleByClassName('row','div',_t.dom);
	for (var i=0; i<rows.length; i++) {
		if (rows[i].offsetTop >= _t.parentH +_t.h) {
			_t.delRow();
		}
	}

	_t.speed = (parseInt(_t.sum/5)+1)*2; //根据点的白块总数提升速度
	if( _t.speed >=_t.maxSpeed ){ _t.speed = _t.maxSpeed; } //最大速度 

	var blocks = _t.getEleByClassName('block','div',_t.dom);
	for (var j=0; j<blocks.length; j++){
		if ( blocks[j].offsetTop >= _t.parentH ){
			_t.state = false;
			clearInterval(_t.timer);
			_t.end();
		}
	}
}

Block.prototype.getEleByClassName =  function(className,tagName,context){
	context = context || document;
	tagName = tagName || '*';
	if(document.getElementsByClassName) {
		return context.getElementsByClassName(className);
	} else {
		var el = new Array();
		var aEle = context.getElementsByTagName(tagName);
		var re=new RegExp('\\b'+className+'\\b', 'i');
 		var i=0;
 		for(i=0;i<aEle.length;i++)
		{
			if(re.test(aEle[i].className))
			{
				aResult.push(aEle[i]);
			}
		}
		return aResult;
	}
}

//移动
Block.prototype.move = function(){
	this.top += this.speed;
	this.dom.style.top = this.top +'px';
}

//分数
Block.prototype.mark = function(){
	var oMark = document.createElement("div");
	oMark.className = "mark";
	oMark.innerHTML = this.sum;
	this.dom.parentNode.appendChild(oMark);
}

//元素自适应
Block.prototype.zsy = function(){
	var _t = this;
	if("ontouchstart" in document.documentElement){
		_t.dom.parentNode.className = "ph-main";
	}
}

//游戏开始
Block.prototype.start = function(){

	var _t = this;

	for( var i=0; i<4; i++ ){
		_t.addRow();
	}

	_t.timer = setInterval(function(){
		_t.move();
		_t.judge();
	},30);
}
//更改排行
//function change(sco){
//	var score1 = document.getElementById("score_1");
//	var score2 = document.getElementById('score_2');
//	var score3 = document.getElementById('score_3');
//	if(sco>parseInt(score3.innerHTML)){
//		score3.innerHTML=sco;
//	} else if(sco>parseInt(score2.innerHTML)){
//		score2.innerHTML=sco;
//	} else if(sco>parseInt(score1.innerHTML)){
//		score1.innerHTML=sco;
//	}
//}
//游戏结束  
Block.prototype.end = function(){
	var _t = this;

	if( !document.getElementById("againMask") ){
		var againMask = document.createElement('div');
		againMask.className = 'again-mask';
		againMask.id = 'againMask';
		againMask.innerHTML =
		'<h1>Game over</h1><h2 id="againSum">分数：'+_t.sum+'</h2><span id="againStart">重新开始</span>';
		
		_t.dom.parentNode.appendChild(againMask);
		
	}else{
		var againMask = document.getElementById("againMask");
		againMask.style.display = "block";
		var againSum = document.getElementById("againSum");
		againSum.innerHTML = "分数："+_t.sum;
	}

	var againStart = document.getElementById("againStart");
	againStart.onclick = function(){
		_t.again();
		againMask.style.display = "none";
		return false;
	}
}

//游戏重来
Block.prototype.again = function(){
	this.parentW = this.dom.parentNode.clientWidth;
	this.parentH = this.dom.parentNode.clientHeight;
	this.scale = 1.58; //黑块 宽高比
	this.h = parseInt(this.parentW/4*this.scale);
	this.top = -this.h;
	this.speed = 2; //速度
	this.timer = null; //定时器
	this.state = true; //游戏判断
	this.sum = 0; //分数


	var _t = this;
	_t.dom.innerHTML = "";
	_t.getEleByClassName('mark','div')[0].innerHTML = _t.sum;
	_t.start();
}