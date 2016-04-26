/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

// Global variables
var GAME_HEIGHT;
var GAME_WIDTH;
var aliens;
var shots;
var ship;
var gameActive = false;
var gameClock;
var endBoundary;

/** 
 * Sets up all game state, called on page load and game reset
 * @author Logan Gordon
 */
function init(){
    status("LOADING");
    
    GAME_HEIGHT = $(document).height();
    GAME_WIDTH = $(document).width();
    
    aliens = {
        table: $("#aliens"), // table DOM object
        getAliens: function(){ // array of alien <img> tags
            return $(".alien");
        }, 
        tick: (function(){
            var timer = 100; // state variable, counts ticks
            return function(){
                timer++;
                if(timer >= 5 + aliens.getAliens().length/2){ // faster when fewer aliens
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
        move: function(){ // advances aliens across the screen
            move(this.table, 10*this.direction, 0);
            if((this.direction===-1 && this.left() <= 10) || // change direction
                    (this.direction===1 && this.right() >= GAME_WIDTH-10)){
                move(this.table, 0, 10);
                this.direction *= -1;
            }
            this.getAliens().each(function(){ // update position attributes
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
        getShots: function(){ // array of active projectile DOM objects
            return $(".shot");
        },
        tick: function(){ 
            this.getShots().each(function(){ // move all shots every tick
                var shot = $(this);
                move(shot, 0, -5);
                if(shot.data("top") <= 0){
                    miss(shot);
                }
            });
            this.timer++;
            if(this.shoot && this.timer > 10){ // limit firing to one per second
                this.pew(); // pew pew
                this.shoot = false;
                this.timer = 0;
            }
        },
        timer: 0, // rate-limiter for shots
        shoot: false, // input flag: if true, will attempt to shoot when allowed
        numShots: function(){ // number of active shots
            return this.getShots().length;
        },
        fire: function(){ // enqueues shot for next clock tick
            if(this.numShots() < 10){ // limit number of active shots
               this.shoot = true;
            }
        },
        pew: function(){ // creates new projectile object
            var newShot = $("<img src='assets/images/shot.gif' class='shot game-asset'>");
            $(document.body).append(newShot);
            newShot.data("height", newShot.height()); // initialize cached data
            newShot.data("width", newShot.width());
            var x = ship.position().x;
            var y = ship.position().y - 20;
            place(newShot, x, y);
        }
    };
    
    // set up new table of aliens
    aliens.table.empty(); // clear existing aliens
    var alienRow = $("<tr>");
    var alien = $("<td><img class='alien' src='assets/images/alien.gif'/></td>");
    for(var j = 0; j < 11; j++){ // add aliens to row
        alien.clone().appendTo(alienRow);
    }
    for(var i = 0; i < 5; i++){ // add rows to table
        alienRow.clone().appendTo(aliens.table);
    }
    place(aliens.table, 10, 10);
    
    // place ship
    place(ship.ship, (GAME_WIDTH-ship.ship.width())/2, GAME_HEIGHT-ship.ship.height()-5);
    
    status("PRESS ANY BUTTON TO BEGIN");
    
    $(".game-asset, .alien").each(function(){ // cache data for performance
        var asset = $(this);
        asset.data("width", asset.width());
        asset.data("height", asset.height());
    });
    
    // aliens getting this far means game end
    endBoundary = GAME_HEIGHT - 10 - aliens.getAliens().data("height");
    
    // one timer object drives all game logic
    gameClock = getGameClock(function(){
        aliens.tick();
        ship.tick();
        shots.tick();
        checkAliensShot();
        checkGameOver();
    });
}

/**
 * Factory pattern: Each game needs a new timer object
 * @param {function} tick function called every game clock tick
 * @returns Object with start() and finish() methods to start and clear clock
 */
function getGameClock(tick){
    var id;
    return {
        start: function(){
            id = window.setInterval(function(){
                tick();
            }, 100); // state update 10x per second
        },
        finish: function(){
            window.clearInterval(id);
        }
    };
}

/**
 * Puts game into active state
 */
function startGame(){ // when user hits a button to begin the game
    status(); // clear status message
    gameClock.start();
    gameActive = true;
}

/**
 * Checks game-end conditions and signals win or loss
 */
function checkGameOver(){
    if(aliens.getAliens().length === 0){ // all aliens dead!
        gameOver("You win!");
    }
    if(aliens.getAliens().last().data("top") >= endBoundary){ // aliens advanced
        gameOver("You lose!");
    }    
}

$(document).unload(gameOver); // browser closed

/**
 * Halts game action, records final score, displays high score
 * @param {String} message displayed to user
 */
function gameOver(message){ // handles game end
    $.getJSON("ws_readscores", function(scores){ // display score
        var currentScore = scores.currentScore;
        var highestScore = scores.highScore;
        var message = "Your score: " + currentScore+"\n";
        message += "Highest score: " + highestScore;
        alert(message);
        init();
    });
    
    // game state updates
    gameActive = false;
    gameClock.finish();
    status(message);
}

/**
 * Checks for collision between bullets & aliens and removes elements
 */
function checkAliensShot(){
    shots.getShots().each(function(){
        var shot = $(this); // jQuery wrapper over DOM object
        aliens.getAliens().each(function(){
            var alien = $(this); // jQuery wrapper over DOM objects
            if(collide(shot, alien)){
                shot.attr("data-dead", true); // flag to prevent multiple hits
                alien.attr("data-dead", true);
                trackScore(1);
            }
        });
    });
    $("[data-dead=true]").remove(); // clear dead elements
}

/**
 * Records score and removes bullet element
 * @param {shot} shot
 */
function miss(shot){
    shot.remove();
    trackScore(-1);
}

/**
 * Logs hit or miss scores to database
 * @param {int} x score: 1 for hit, -1 for miss
 */
function trackScore(x){
    $.post("ws_savescore?score="+x);
}

/**
 * Displatches keyboard input
 * @param {event} event contains keypress information
 */
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

/**
 * Checks if two elements overlap, using cached data values for performance
 * @param {jQuery} a DOM object
 * @param {jQuery} b DOM object
 * @returns {Boolean} true if elements overlap
 */
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
            a.data("dead") || b.data("dead")); // skips flagged objects
}

/**
 * Repositions object parameter using absolute coordinates
 * @param {jQuery} object to be placed
 * @param {int} x coordinate in pixels
 * @param {int} y coordinate in pixels
 */
function place(object, x, y){
    object.css({left: x+"px", top: y+"px"});
    object.data("left", x);
    object.data("top", y);
}

/**
 * Repositions object parameter using relative coordinates
 * @param {jQuery} object
 * @param {int} x coordinate in pixels
 * @param {int} y coordinate in pixels
 */
function move(object, x, y){
    place(object, object.data("left")+x, object.data("top")+y);
}

/**
 * Updates status message
 * @param {string} message to display
 */
function status(message){
    $("#Status").text(message || "");
}

// Initializes game status and input dispatcher
$(document).ready(function(){
    init();
    $(document).keydown(handleInput);
});