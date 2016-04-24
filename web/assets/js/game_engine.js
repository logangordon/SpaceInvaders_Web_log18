/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var GAME_HEIGHT = 480;
var GAME_WIDTH = 640;
var aliens;
var shots;
var ship;
var gameActive = false;
var gameClock;

function init(){
    $("#Status").text("Loading");
    
    $("#gamearea").width(GAME_WIDTH).height(GAME_HEIGHT);
        aliens = {
        table: $("#aliens"), // table DOM object
        getAliens: function(){return $(".alien");}, // array of aliens DOM objects
        tick: (function(){
            var timer = 100; // state variable, counts ticks
            return function(){
                timer++;
                if(timer >= 5 + aliens.getAliens().length){ // faster when fewer aliens
                    aliens.move();
                    timer = 0;
                }
            };
        })(), // immediately-invoked function object - hides timer state
        direction: 1, // 1 for rightwards, -1 for leftwards
        left: function(){ // boundary of left-most visible alien
            var acc = GAME_WIDTH;
            this.getAliens().each(function(){
                var left = $(this).data("left");
                if(left < acc){
                    acc = left;
                }
            });
            return acc;
        },
        right: function(){ // boundary of right-most visible alien
            var acc = 0;
            this.getAliens().each(function(){
                var right = $(this).data("left");
                if(right > acc){
                    acc = right;
                }
            });
            return acc + this.getAliens().data("width");
        },
        move: function(){ // aliens advance across the screen
            move(this.table, 10*this.direction, 0);
            if((this.direction===-1 && this.left() < 10) ||
                    (this.direction===1 && this.right() > GAME_WIDTH-10)){
                move(this.table, 0, 10);
                this.direction *= -1;
                checkGameOver();
            }
            this.getAliens().each(function(){ // update alien position attributes
                var alien = $(this);
                var pos = alien.offset();
                alien.data("left", pos.left);
                alien.data("top", pos.top);
            });
        }
    };

    ship = {
        ship: $("#ship"), // DOM object
        position: function(){ // returns midpoint for making shots
            var ship = this.ship;
            return {
                x: ship.data("left") + ship.data("width")/2,
                y: ship.data("top") + ship.data("height")/2
            };
        },
        direction: 0, // which direction to move next clock tick
        tick: function(){ // limit movement to once per clock tick
            move(this.ship, 10*this.direction, 0);
            this.direction = 0; // reset - no movement without input
        }
    };

    shots = {
        getShots: function(){return $(".shot");},
        tick: function(){ // move all shots every tick
            this.getShots().each(function(){
                var shot = $(this);
                move(shot, 0, -5);
                if(shot.data("top") < 10){
                    miss(shot);
                }
            });
            this.timer++;
            if(this.shoot && this.timer > 5){ // limit shots to once per 0.5 seconds
                this.pew(); // pew pew
                this.shoot = false;
                this.timer = 0;
            }
        },
        timer: 0, // rate-limiter for shots
        shoot: false, // input flag: if true, will attempt to shoot when allowed
        numShots: function(){
            return this.getShots().length;
        },
        fire: function(){
            if(this.numShots() < 10){ // limit number of active shots
               this.shoot = true;
            }
        },
        pew: function(){ // add new shot
            var newShot = $("<img src='assets/images/shot.gif' class='shot game-asset'>");
            $(document.body).append(newShot);
            newShot.data("height", newShot.height());
            newShot.data("width", newShot.width());
            place(newShot, ship.position().x, ship.position().y);
        }
    };
    
    aliens.table.empty(); // clear existing aliens
    var alienRow = $("<tr>");
    var alien = $("<td><img class='alien' src='assets/images/alien.gif'/></td>");
    for(var j = 0; j < 10; j++){
        alien.clone().appendTo(alienRow);
    }
    for(var i = 0; i < 4; i++){ // adding rows
        alienRow.clone().appendTo(aliens.table);
    }
    place(aliens.table, 10, 10);
    
    place(ship.ship, (GAME_WIDTH-ship.ship.width())/2, GAME_HEIGHT-ship.ship.height());
    
    $("#Status").text("PRESS ANY BUTTON TO BEGIN");
    
    $(".game-asset, .alien").each(function(){ // cache data for performance
        var asset = $(this);
        asset.data("width", asset.width());
        asset.data("height", asset.height());
    })
    
    gameClock = getGameClock(function(){
        aliens.tick();
        ship.tick();
        shots.tick();
        checkAliensShot();
    });
}

function getGameClock(tick){ // close that keeps track of timers
    var id;
    return {
        start: function(){
            id = window.setInterval(function(){
                tick();
            }, 100);
        },
        finish: function(){
            window.clearInterval(id);
        }
    };
}

function startGame(){
    $("#Status").text("");
    gameClock.start();
    gameActive = true;
}

function checkAliensShot(){
    shots.getShots().each(function(){
        var shot = $(this);
        aliens.getAliens().each(function(){
            var alien = $(this);
            if(collide(shot, alien)){
                shot.attr("data-dead", true);
                alien.attr("data-dead", true);
                trackScore(1);
            }
        });
    });
    $("[data-dead=true]").remove();
}

function miss(shot){
    shot.remove();
    trackScore(-1);
}

function trackScore(x){
    return;
}

function handleInput(event){
    if(!gameActive){
        startGame();
    } else {
        switch(event.which){
            case 37: // left
                ship.direction = -1;
                break;
            case 39: // right
                ship.direction = 1;
                break;
            case 32: // space
                shots.fire();
                break;
        }
    }
}

function collide(a, b){
    var al = a.data("left");
    var ar = al + a.data("width");
    var at = a.data("top");
    var ab = at + a.data("height");
    var bl = b.data("left");
    var br = bl + b.data("width");
    var bt = b.data("top");
    var bb = bt + b.data("height");
    return !(al > br || bl > ar || at > bb || bt > ab ||
            a.data("dead") || b.data("dead"));
}

function place(object, x, y){
    object.css({left: x+"px", top: y+"px"});
    object.data("left", x);
    object.data("top", y);
}

function move(object, x, y){
    place(object, object.data("left")+x, object.data("top")+y);
}

$(document).ready(function(){
    init();
    $(document).keydown(handleInput);
});