function Acquire(item,num) {
    var index = 0;
    for(var i = 0;i < game.config.object_deploy.length;i++) {
        if(game.config.object_deploy[i][0] == item) {
            index = i;
        }
    }
    for(;num > 0;num--) {
        game.object.push(game.creatObject(game.config.object_deploy[index]));
    }
    return;
}

function Track() {
    game.config.is_trail = true;
    Track_loop();
}
function Stop_track() {
    game.config.is_trail = false;
}
var Track_loop = function() {
    game.object.forEach(object => {
        object.vel.x = (game.player.loc.x - object.loc.x) * 0.01;
    });
    if(game.config.is_trail){
        window.requestAnimFrame(Track_loop);
    }
};
//game.player.acquire.banana =10