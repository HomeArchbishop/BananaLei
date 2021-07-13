// 选择器
function $id(id) {
    return document.getElementById(id);
}

// code
var canvas = $id('canvas');
var tip_area = $id('tip');
var point_area = $id('point');
var ctx = canvas.getContext('2d');
var game = new Game(canvas,tip_area,point_area,'lsw');

console.log(game);


window.requestAnimFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
        return window.setTimeout(callback, 1000 / 60);
    };

var Loop = function() {
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    game.update();
    game.draw();
    
    window.requestAnimFrame(Loop);

};
//Loop();

// plantform
var system = { 
    win: false, 
    mac: false, 
    xll: false, 
    ipad:false 
}; 
var p = navigator.platform; 
system.win = p.indexOf("Win") == 0; 
system.mac = p.indexOf("Mac") == 0; 
system.x11 = (p == "X11") || (p.indexOf("Linux") == 0); 
system.ipad = (navigator.userAgent.match(/iPad/i) != null)?true:false; 
if (system.win || system.mac || system.xll) {
    //Loop();
} else {
    //alert('ii')
    var mo = function(e) {e.preventDefault();};
    document.addEventListener("touchmove",mo,{passive:false});//禁止页面滑动
    //手指接触屏幕
    document.addEventListener("touchstart", function(e){
        var startx = e.touches[0].pageX;
        if(startx < game.width / 2) {
            game.key.left = true;
            game.key.right = false;  
        } else {
            game.key.left = false;
            game.key.right = true;  
        }
    }, false);
    document.addEventListener("touchend",function(e) {
        game.key.right = false;
        game.key.left = false;
    }, false);
    //Loop();
}

ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    game.draw();    
function Game_begin() {
    
    Loop();
}