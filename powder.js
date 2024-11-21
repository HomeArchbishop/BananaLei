 var Game = function(canvas,tip_area,point_area,playername) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    canvas.width = this.width;
    canvas.height = this.height;
    this.ctx = canvas.getContext('2d');

    this.getImg = function(src) {
        var img = new Image();
        img.src = src;
        return img;
    }

    this.config = {
        dead: false,
        gravity: 0.0826,
        object_speed: 0.97,
        festival_start_time: 0,
        is_festival: false,
        tip_start_time: 0,
        is_tip: false,
        is_track: false,
        player_img: {
            _stay_right: this.getImg(_stay_right),
            _run_right: this.getImg(_run_right),
            _stay_left: this.getImg(_stay_left),
            _run_left: this.getImg(_run_left)
        },
        object_deploy: [
            ["powder","_powder","good",826,826,1,1],
            ["oil","_oil","good",1.5,1.5,9,9],
            ["banana","_banana","good",1.2,1.2,13,13],
            ["water","_water","good",1.1,1.1,19,19],
            ["box","_box","harm",0.5,0.5,4,4],
            ["manhole","_manhole","harm",0.33333,0.33333,3,3],
            ["132","_132","harm",0.01,0.01,2,2]
        ],
        psb_arr: [],
        object_img: {
            _powder: this.getImg(_powder),
            _oil: this.getImg(_oil),
            _manhole: this.getImg(_manhole),
            _box: this.getImg(_box),
            _132: this.getImg(_132),
            _banana: this.getImg(_banana),
            _water: this.getImg(_water),
        }
        
    }

    this.key = {
        left: false,
        right: false,
        up: false,
        down: false
    };

    this.player = {
        name: playername,
        speed: 13.2,
        life: 3,
        point: 0,
        miss: 0,
        acquire_list: ["begin"],
        acquire: {banana:0,water:0,powder:0,oil:0,box:0,132:0,manhole:0},
        all_acquire: {banana:0,water:0,powder:0,oil:0,box:0,132:0,manhole:0},
        achievement: [],
        img: "_stay_right",
        loc: {
            x: 100,
            y: this.height * .7
        },
        
        vel: {
            x: 0,
            y: 0
        },
    };

    this.object = [];

    window.onkeydown = this.keydown.bind(this);
    window.onkeyup   = this.keyup.bind(this);

    
}

//
Game.prototype.tip = function(text,size) {
    size = size || '100px'
    this.config.tip_start_time = (new Date()).getTime();
    this.config.is_tip = true;
    tip_area.style.fontSize = size;
    tip_area.innerHTML = text;
}

Game.prototype.keydown = function (e) {

    var _this = this;

    switch (e.keyCode) {
    case 37:
        _this.key.left = true;
        break;
    case 38:
        _this.key.up = true;
        break;
    case 39:
        _this.key.right = true;
        break;
    case 40:
        _this.key.down = true;
        break;
    }
};

Game.prototype.keyup = function (e) {

    var _this = this;

    switch (e.keyCode) {
    case 37:
        _this.key.left = false;
        break;
    case 38:
        _this.key.up = false;
        break;
    case 39:
        _this.key.right = false;
        break;
    case 40:
        _this.key.down = false;
        break;
    }
};

Game.prototype.creatObject = function(json) {
    console.log(this.config.object_deploy[6][3])
    if(json[0]=='132'){
        console.log(json[3])
    }
    var obj = {};
    obj.type = json[2]; // harm good
    obj.point = json[3];
    obj.psb = json[5];
    obj.loc = {};
    obj.loc.x = Math.floor(Math.random() * (this.width - 70));
    obj.loc.y = 0;
    obj.vel = {
        x: 0,
        y: 0
    };
    obj.img = json[1];
    obj.name = json[0];
    return obj;
};

Game.prototype.getObject = function() {
    this.config.psb_arr = [];
    for(var index = 0;index < this.config.object_deploy.length;index++) {
        for(var time = 0;time < this.config.object_deploy[index][5];time++) {
            this.config.psb_arr.push(this.config.object_deploy[index]);
        }
    }
    return this.creatObject(this.config.psb_arr[Math.floor(Math.random() * this.config.psb_arr.length)]);
}

Game.prototype.die = function() {
    this.config.dead = true;
};

Game.prototype.festival = function(festival) {
    this.config.festival_start_time = (new Date()).getTime();
    this.config.is_festival = true;
    if(festival == 'banana_rain') {
        this.config.object_speed = 0.097;
        this.config.object_deploy[0][5] = 0;
        this.config.object_deploy[1][5] = 0;
        this.config.object_deploy[2][5] = 1;
        this.config.object_deploy[3][5] = 0;
        this.config.object_deploy[4][5] = 0;
        this.config.object_deploy[5][5] = 0;
        this.config.object_deploy[6][5] = 0;
    } else if(festival == 'powder_rain') {
        this.config.object_speed = 0.15;
        this.config.object_deploy[0][3] = 132;
        this.config.object_deploy[0][5] = 1;
        this.config.object_deploy[1][5] = 0;
        this.config.object_deploy[2][5] = 0;
        this.config.object_deploy[3][5] = 0;
        this.config.object_deploy[4][5] = 0;
        this.config.object_deploy[5][5] = 0;
        this.config.object_deploy[6][5] = 0;
    } else if(festival == 'box_rain') {
        this.config.object_speed = 0.8;
        this.config.object_deploy[4][3] = 0.99;
        this.config.object_deploy[0][5] = 0;
        this.config.object_deploy[1][5] = 0;
        this.config.object_deploy[2][5] = 0;
        this.config.object_deploy[3][5] = 0;
        this.config.object_deploy[4][5] = 1;
        this.config.object_deploy[5][5] = 0;
        this.config.object_deploy[6][5] = 0;
    } else if(festival == 'track') {
        this.config.object_speed = 0.2;
        this.config.object_deploy[0][5] = 2;
        this.config.object_deploy[1][5] = 33;
        this.config.object_deploy[2][5] = 34;
        this.config.object_deploy[3][5] = 35;
        this.config.object_deploy[4][5] = 5;
        this.config.object_deploy[5][5] = 4;
        this.config.object_deploy[6][5] = 1;
        Track();
    }
}

Game.prototype.update_player = function() {
    if (this.key.left) {
        this.player.vel.x = -this.player.speed;
        this.player.img = "_run_left";
    } else if (this.key.right) {
        this.player.vel.x = this.player.speed;
        this.player.img = "_run_right";
    } else {
        this.player.vel.x = 0;
        if(this.player.img == "_run_left" || this.player.img == "_stay_left") {
            this.player.img = "_stay_left";
        } else {
            this.player.img = "_stay_right";
        }
    }
    if(this.player.loc.x + this.player.vel.x < this.width  - 70 && this.player.loc.x + this.player.vel.x > 0) {
        this.player.loc.x += this.player.vel.x;
    }
    // console.log(this.player.loc.x, this.player.loc.y)
};

Game.prototype.update_object = function() {
    var rand = Math.random() * 1000;
    if(rand > this.config.object_speed * 1000) {
        var obj = this.getObject();
        this.object.push(obj);
    }
    for(var index = 0;index < this.object.length;index++) {
        var object = this.object[index];
        if(object.loc.y > this.height) {
            this.object.splice(index,1); 
            index++;
            if(object.type == 'good' && !this.config.is_festival) {
                this.player.miss++;
            }
        }
        object.vel.y += this.config.gravity;
        object.loc.y += object.vel.y;
        object.loc.x += object.vel.x;
    };
    //console.log(this.object[0].loc.y)
}

Game.prototype.update_game = function() {

    // canvas width & height
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    canvas.width = this.width;
    canvas.height = this.height;
    this.player.loc.y = this.height * .7
    // is die?
    if(this.player.life < 1) {
        this.die();
        return;
    }
    // touch object
    for(var index = 0;index < this.object.length;index++) {
        var object = this.object[index];
        if(object.loc.x - 70 <= this.player.loc.x 
            && this.player.loc.x <= object.loc.x + 70
            && object.loc.y <= this.player.loc.y
            && this.player.loc.y <= object.loc.y + 70
        ) {
            let ori_life = this.player.life;
            //132攻击为开根号
            if(object.name == '132') {
                this.player.life = Math.floor(sqrt(this.player.life))
            } else {
                this.player.life = object.type !== 'harm'? Math.ceil(this.player.life * object.point): Math.floor(this.player.life * object.point);
            }
            this.player.acquire_list.push(object.name);
            if(this.player.life - ori_life > 0) {
                point_area.innerHTML = "\+";
                point_area.innerHTML += this.player.life - ori_life;
            } else {
                point_area.innerHTML = this.player.life - ori_life;
            }
            this.player.all_acquire[object.name]++;
            if(!this.config.is_festival) {
                this.player.acquire[object.name]++;
            }
            this.object.splice(index,1); 
            index++;

        }
    };
    //console.log(this.config.object_deploy[6][3])

    // achievement
    if(!this.player.achievement.some(function(item){return item == '初饮开水'}) && this.player.acquire_list.some(function(item) {return item == "water"})){
        this.player.achievement.push('初饮开水');
        this.tip('Achieve 初饮开水',"50px");
    }
    var _this = this;
    if(!this.player.achievement.some(function(item){return item == '香蕉园主'}) && this.player.all_acquire.banana >= 10){
        this.player.achievement.push('香蕉园主');
        this.tip('Achieve 香蕉园主',"50px");
    }
    if(!this.player.achievement.some(function(item){return item == '奶粉世家'}) && this.player.all_acquire.powder >= 3) {
        this.player.achievement.push('奶粉世家');
        this.tip('Achieve 奶粉世家',"50px");
    }
    if(!this.player.achievement.some(function(item){return item == '开水馒头之春'}) && !this.player.acquire_list.slice(-3).some(function(item) {return item !== "water"})){
        this.player.achievement.push('开水馒头之春');
        this.tip('Achieve 开水馒头之春',"50px");
    }
    if(!this.player.achievement.some(function(item){return item == '合理避难'}) && this.player.all_acquire.manhole >= 5){
        this.player.achievement.push('合理避难');
        this.tip('Achieve 合理避难',"50px");
    }
    if(!this.player.achievement.some(function(item){return item == '油嘴滑舌'}) && this.player.all_acquire.oil >= 5){
        this.player.achievement.push('油嘴滑舌');
        this.tip('Achieve 油嘴滑舌',"50px");
    }
    if(!this.player.achievement.some(function(item){return item == '盒中洞天'}) && this.player.all_acquire.box >= 5){
        this.player.achievement.push('盒中洞天');
        this.tip('Achieve 盒中洞天',"50px");
    }
    //festival
    if(this.player.acquire.banana >= 10 && !this.config.is_festival) {
        this.festival('banana_rain');
        this.tip('BANANA FREE!');
        this.player.acquire.banana -= 10;
    }
    if(this.player.acquire.powder >= 3 && !this.config.is_festival) {
        this.festival('powder_rain');
        this.tip('MILK RAIN!')
        this.player.acquire.powder -= 3;
    }
    if(this.player.miss > 20 && !this.config.is_festival) {
        this.festival('track');
        this.tip('TRACK!')
        this.player.miss -= 20;
    }

    // reset festival
    if(this.config.festival_start_time + 5000 < (new Date()).getTime()) {
        this.config.object_speed = 0.97;
        this.config.object_deploy.forEach(item => {
            item[5] = item[6];
            item[3] = item[4];
        })
        Stop_track();
    }
    if(this.config.is_festival && this.config.festival_start_time + 5000 + (2 * this.height / this.config.gravity) ** .5 * 16.6 < (new Date()).getTime()) {
        this.config.is_festival = false;
        console.log('end')
    }
    //reset tip
    if(this.config.tip_start_time + 2000 < (new Date()).getTime()) {
        this.tip('');
        this.config.is_tip = false;
    }
    // win
    if(this.player.life == 'Infinity' || typeof(this.player.life) !== "number") {
        this.player.life = 1.79767*10**308;
        return;
    }
}


Game.prototype.draw_player = function() {
    this.ctx.fillStyle = '#333';
    this.ctx.drawImage(this.config.player_img[this.player.img], this.player.loc.x, this.player.loc.y);
};

Game.prototype.draw_object = function() {
    this.object.forEach(object => {
        if(object.type == "harm") {
            this.ctx.fillStyle = 'red';
        } else if(object.type == "good") {
            this.ctx.fillStyle = 'blue';
        }
        this.ctx.drawImage(this.config.object_img[object.img], object.loc.x, object.loc.y);
    });
};

Game.prototype.draw_game = function() {
    this.ctx.fillStyle = 'black';
    this.ctx.font = "30px 宋体"
    this.ctx.fillText("运动力：" + this.player.life, 10, 30);
    if(this.player.achievement.length) {
        this.ctx.font = "15px 宋体"
        this.ctx.fillText("成就：", 10, 60);
        for(var index = 0;index < this.player.achievement.length;index++){
            this.ctx.fillText(this.player.achievement[index], 10, 75 + 15 * index);    
        }
    }
};

Game.prototype.update = function() {
    if(this.config.dead) {
        return;
    }
    this.update_player();
    this.update_object();
    this.update_game();
};

Game.prototype.draw = function() {
    this.draw_player();
    this.draw_object();
    this.draw_game();
    if(this.config.dead) {
        this.ctx.fillStyle = "rgba(0,0,0,.7)"
        this.ctx.fillRect(this.width / 2 - 200,this.height / 2 -100, 400, 200);    
        this.ctx.fillStyle = "white";
        this.ctx.font = "40px 宋体"
        this.ctx.fillText("你失去了运动力，", this.width / 2 - 150,this.height / 2 - 20);    
        this.ctx.fillText("刷新再次投喂吧！", this.width / 2 - 150,this.height / 2 + 30);    
    }
};
