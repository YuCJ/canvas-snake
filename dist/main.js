'use strict';var _createClass=function(){function defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||false;descriptor.configurable=true;if('value'in descriptor)descriptor.writable=true;Object.defineProperty(target,descriptor.key,descriptor)}}return function(Constructor,protoProps,staticProps){if(protoProps)defineProperties(Constructor.prototype,protoProps);if(staticProps)defineProperties(Constructor,staticProps);return Constructor}}();function _classCallCheck(instance,Constructor){if(!(instance instanceof Constructor)){throw new TypeError('Cannot call a class as a function')}}/* global Tone */var Vector=function(){function Vector(){var x=arguments.length>0&&arguments[0]!==undefined?arguments[0]:0;var y=arguments.length>1&&arguments[1]!==undefined?arguments[1]:0;_classCallCheck(this,Vector);this.x=x;this.y=y}_createClass(Vector,[{key:'add',value:function add(v){return new Vector(this.x+v.x,this.y+v.y)}},{key:'sub',value:function sub(v){return new Vector(this.x-v.x,this.y-v.y)}},{key:'mul',value:function mul(s){return new Vector(this.x*s,this.y*s)}},{key:'length',value:function length(){return Math.sqrt(Math.pow(this.x,2)+Math.pow(this.y,2))}},{key:'set',value:function set(x,y){this.x=x;this.y=y;return this}},{key:'isEqualTo',value:function isEqualTo(v){return this.x===v.x&&this.y===v.y}},{key:'clone',value:function clone(){return new Vector(this.x,this.y)}}]);return Vector}();var Snake=function(){function Snake(){_classCallCheck(this,Snake);this.body=[];this.maxLength=5;this.head=new Vector;this.speed=new Vector(1,0);this.direction='right'}_createClass(Snake,[{key:'update',value:function update(){var newHead=this.head.add(this.speed);this.body.push(this.head);this.head=newHead;while(this.body.length>this.maxLength){this.body.shift()}}},{key:'setDirection',value:function setDirection(dir){var target=void 0;switch(dir){case'up':target=new Vector(0,-1);break;case'down':target=new Vector(0,1);break;case'left':target=new Vector(-1,0);break;case'right':target=new Vector(1,0);break;default:break;}if(!target||target.isEqualTo(this.speed.mul(-1))){// do nothing
}else{this.speed=target}}},{key:'checkBoundary',value:function checkBoundary(xMax,yMax){var xInRange=this.head.x>=0&&this.head.x<xMax;var yInRange=this.head.y>=0&&this.head.y<yMax;return xInRange&&yInRange}}]);return Snake}();var Game=function(){function Game(){_classCallCheck(this,Game);this.start=false;this.boxSize=12;this.boxMargin=2;this.horiBoxes=40;this.vertiBoxes=40;this.speed=30;this.snake=null;this.foods=[]}_createClass(Game,[{key:'getBoxLocation',value:function getBoxLocation(x,y){return new Vector(x*this.boxSize+(x-1)*this.boxMargin,y*this.boxSize+(y-1)*this.boxMargin)}},{key:'drawBox',value:function drawBox(v,color){this.ctx.fillStyle=color;var boxLocation=this.getBoxLocation(v.x,v.y);this.ctx.fillRect(boxLocation.x,boxLocation.y,this.boxSize,this.boxSize)}},{key:'drawFoodEffect',value:function drawFoodEffect(x,y){var rMin=2;var rMax=100;var r=rMin;var position=this.getBoxLocation(x,y);var _this=this;var effect=function effect(){r+=1;_this.ctx.strokeStyle='rgba(255,0,0, '+(1-r/rMax)+')';_this.ctx.beginPath();_this.ctx.arc(position.x+_this.boxSize/2,position.y+_this.boxSize/2,r,0,Math.PI*2);_this.ctx.stroke();if(r<rMax){requestAnimationFrame(effect)}};requestAnimationFrame(effect)}},{key:'init',value:function init(){this.canvas=document.getElementById('canvas');this.ctx=this.canvas.getContext('2d');this.canvas.width=this.boxSize*this.horiBoxes+this.boxMargin*(this.horiBoxes-1);this.canvas.height=this.boxSize*this.vertiBoxes+this.boxMargin*(this.vertiBoxes-1);this.snake=new Snake;this.render();this.update();this.createFood()}},{key:'startGame',value:function startGame(){this.start=true;this.snake=new Snake;document.getElementById('panel').classList.add('hide');this.playSound('C#5',-10);this.playSound('E5',-10,200)}},{key:'endGame',value:function endGame(){this.start=false;document.getElementById('score').innerText='Score: '+(this.snake.maxLength-5)*10;document.getElementById('panel').classList.remove('hide');this.playSound('A3');this.playSound('E2',-10,100);this.playSound('A2',-10,300)}},{key:'createFood',value:function createFood(){var x=parseInt(Math.random()*this.vertiBoxes,10);var y=parseInt(Math.random()*this.horiBoxes,10);this.drawFoodEffect(x,y);this.foods.push(new Vector(x,y))}},{key:'render',value:function render(){var _this2=this;this.ctx.fillStyle='rgba(0,0,0,0.3)';this.ctx.fillRect(0,0,this.canvas.width,this.canvas.height);for(var x=0;x<this.horiBoxes;x+=1){for(var y=0;y<this.vertiBoxes;y+=1){this.drawBox(new Vector(x,y),'rgba(255,255,255,0.03)')}}this.foods.forEach(function(p){_this2.drawBox(p,'red')});this.snake.body.forEach(function(boxPos,i){_this2.drawBox(boxPos,'white')});requestAnimationFrame(function(){_this2.render()})}},{key:'update',value:function update(){var _this3=this;if(this.start){this.playSound('A2',-20);this.snake.update();this.foods.forEach(function(food,i){if(_this3.snake.head.isEqualTo(food)){_this3.snake.maxLength+=1;_this3.foods.splice(i,1);_this3.playSound('E5',-20);_this3.playSound('A5',-20,50);_this3.createFood()}});if(!this.snake.checkBoundary(this.horiBoxes,this.vertiBoxes)){console.log('\u649E\u7246\u310C');this.endGame()}this.snake.body.forEach(function(body){if(_this3.snake.head.isEqualTo(body)){console.log('\u5403\u81EA\u5DF1\u310C');_this3.endGame()}})}setTimeout(function(){_this3.update()},150)}},{key:'playSound',value:function playSound(note){var volume=arguments.length>1&&arguments[1]!==undefined?arguments[1]:-12;var when=arguments.length>2&&arguments[2]!==undefined?arguments[2]:0;setTimeout(function(){var synth=new Tone.Synth().toMaster();synth.volume.value=volume;synth.triggerAttackRelease(note,'8n')},when)}}]);return Game}();function handleLoad(){var game=new Game;game.init();window.addEventListener('keydown',function(evt){evt.preventDefault();var dir=evt.key.replace('Arrow','').toLowerCase();game.snake.setDirection(dir)});document.getElementById('start-game').addEventListener('click',function(evt){game.startGame()})}window.addEventListener('load',handleLoad);