var GEN;
var HOST = "http://localhost:5001";



function showLoader(show) {
    var loader = document.getElementsByClassName("loader")[0];
    if (show) {
        loader.classList.remove("hidden");
    } else {
        loader.classList.add("hidden");
    }
}

var api = {
    sendGenerateData() {
        
        console.log("Generate data...");
        return fetch(`${HOST}/api/ga/generate`, {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data: "somedata" })
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            return data;
        }).catch(function(err) {
            console.log("Error: ", err);
        });
    },

    getAllResults() {
        return fetch(`${HOST}/api/ga/results`)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                return data;
            })
            .catch(function(err) {
                console.log("Error: ", err);
            });
    }
}

function generateData() {
    showLoader(true);
    api.sendGenerateData().then(function(_data) {
        showLoader(false);
    });
}

function startSimulation() {
    showLoader(true);
    return api.getAllResults().then(function(data) {
        showLoader(false);

        var firstGenData = data[0];
        var generation = firstGenData.map(function(moves) {
            return new Dot2(moves);
        });
        Main.generation = generation;
    }).catch(function(err) {
        console.log(err);
    })
}


var obstacles = [
    { x: 200, y: 200, w: 50, h: 300 },
    { x: 400, y: 0, w: 100, h: 250 },
    { x: 600, y: 450 , w: 150, h: 200 },
    { x: 1000, y: 300, w: 400, h: 150 }
];

var target = { x: 1550, y: 150, w: 50, h: 100 };


var NUM_OF_DOTS = 100;
var FRAMERATE = 10;
var VELOCITY = 5;
var velocityIncrement = 10;

var DIR_TYPES = ["N", "NE", "E", "ES", "S", "SW", "W", "NW"];
var directions = {
    "N": { speedX: 0, speedY: -VELOCITY },
    "NE": { speedX: VELOCITY, speedY: -VELOCITY },
    "E": { speedX: VELOCITY, speedY: 0 },
    "ES": { speedX: VELOCITY, speedY: VELOCITY },
    "S": { speedX: 0, speedY: VELOCITY },
    "SW": { speedX: -VELOCITY, speedY: VELOCITY },
    "W": { speedX: -VELOCITY, speedY: 0 },
    "NW": { speedX: -VELOCITY, speedY: -VELOCITY }
};

var KEY_CODES = {
    G: 103,
    Space: 32
};

var ctx;
var canvas;

var dotRadius = 5;
var showGrid = true;


var g = 50;
var numOfRows = 14;
var numOfColumns = 32;
var gw = numOfColumns * g; // 1600
var gh = numOfRows *g; // 700

function random(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateDots() {
    var smart_dots = new Array(NUM_OF_DOTS).fill(null).map(function() {
        return new Dot(random(30, 180), random(30, 180));
    });

    return smart_dots;
}

function Grid(g, numOfRows, numOfColumns, gw, gh) {
    this.g = g;
    this.numOfRows = numOfRows;
    this.numOfColumns = numOfColumns;
    this.gw = this.numOfColumns * this.g;
    this.gh = this.numOfRows * this.g;

    this.draw = function() {
        ctx.strokeStyle = "gray";
        ctx.lineWidth = 0.5;

        // Horizontal lines
        for (var i = 0; i < this.numOfRows; i++) {
            ctx.beginPath();
            ctx.moveTo(0, this.g * i);
            ctx.lineTo(this.gw, this.g * i);
            ctx.stroke();
        }

        // Vertical lines
        for (var j = 1; j < this.numOfColumns; j++) {
            ctx.beginPath();
            ctx.moveTo(this.g * j, 0);
            ctx.lineTo(this.g * j, this.gh);
            ctx.stroke();
        }
    }
}

function Vector2D(x, y) {
    this.x = x;
    this.y = y;
}

function Dot2(dna) {
    this.dna = dna;
    this.pos = { x: 100, y: 100 }
    this.step = 0;
    this.counter = 0;
    this.finished = false;
    this.move = function() {
        if (this.finished) {
            return;
        }
        if (!this.vel) {
            var nextMove = dna[this.step];
            if (nextMove === false) {
                return;
            }
            this.vel = nextMove;
        }

        // Change direction every 10 frames
        if (this.counter === velocityIncrement) {
            this.counter = 0;
            this.step += 1;
            var nextMove = dna[this.step];
            if (nextMove === false) {
                return;
            }

            if (typeof nextMove === "undefined") {
                this.finished = true;
                return;
            }

            this.vel = nextMove;
        }

        var vx, vy;

        if (this.vel.vx === 0) {
            vx = 0;
        } else {
            vx = this.vel.vx / velocityIncrement;
        }

        if (this.vel.vy === 0) {
            vy = 0;
        } else {
            vy = this.vel.vy / velocityIncrement;
        }

        this.pos.x += vx;
        this.pos.y += vy;

        this.counter += 1;

    }

    this.draw =  function drawDot() {
        if (!this.finished) {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, dotRadius, 0, 2*Math.PI);
            ctx.fillStyle = "red";
            ctx.fill();
        }
    };
}


function Dot(startX, startY) {
    this.vector = new Vector2D(startX, startY);
    this.counter = 0;
    this.move =  function moveDot() {
        if (!this.direction) {
            var dirType = getRandomDirection();
            this.direction = directions[dirType];
        }

        // Change direction every 10 steps
        if (this.counter === 10) {
            this.counter = 0;
            var dirType = getRandomDirection();
            this.direction = directions[dirType];
        }

        var newPosX = this.vector.x + this.direction.speedX;
        var newPosY = this.vector.y + this.direction.speedY;

        if (!willColide(newPosX, newPosY) && !isEdge(newPosX, newPosY)) {
            this.vector.x = newPosX;
            this.vector.y = newPosY;
        }

        this.counter++;
    };

    this.draw =  function drawDot() {
        ctx.beginPath();
        ctx.arc(this.vector.x, this.vector.y, dotRadius, 0, 2*Math.PI);
        ctx.fillStyle = "red";
        ctx.fill();
    };
}


function drawObstacles() {
    ctx.fillStyle = "white";
    obstacles.forEach(function(ob) {
        ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
    });
}

function drawTarget(ob) {
    ctx.fillStyle = "#21ec8e";
    ctx.fillRect(ob.x, ob.y, ob.w, ob.h);
}


function getRandomDirection() {
    var rnd = Math.floor(Math.random() * Math.floor(7) + 1);
    return DIR_TYPES[rnd];
}


function isEdge(posX, posY) {
    var r = dotRadius;
    if (posX - r >= 0 && posX + r <= canvas.width) {
        if (posY - r >= 0 && posY + r <= canvas.height) {
            return false;
        }
    }

    return true;
}

function willColide(posX, posY) {
    var r = dotRadius;

    var colidesWith = obstacles.find(function(ob) {
        return (posX + r >= ob.x && posX - r <= (ob.x + ob.w)
            && posY + r >= ob.y && posY - r <= (ob.y + ob.h));
    });

    return colidesWith ? true : false;
}

function setupListeners() {
    window.onkeypress = function(e) {
        var code = e.keyCode;
        if (code === KEY_CODES.G) {
            showGrid = !showGrid;
        } else if (code === KEY_CODES.Space) {
            if (Main.running) {
                Main.pause();
            } else {
                Main.animate();
            }
        }
    }
}


var Main = {
    initialized: false,
    running: false,
    canvas: null,
    context: null,
    grid: null,
    obstacles: null,
    generation: null,

    interval: null,

    init(canvas, ctx, grid, obstacles, generation) {
        this.initialized = true;

        this.canvas = canvas;
        this.context = ctx;
        this.grid = grid;
        this.obstacles = obstacles;
        this.generation = generation;
    },

    clearCanvas() {
        if (this.context) {
            this.context.clearRect(0, 0, gw, gh);
        }
    },

    _onFrame() {
        this.clearCanvas();
        if (showGrid) { 
            this.grid.draw();
        }
        drawTarget(target);
        drawObstacles();

        this.generation.forEach(function(dot) {
            dot.move();
            dot.draw();
        });
    },

    animate() {
        this.running = true;
        this.interval = setInterval(this._onFrame.bind(this), FRAMERATE);
    },

    pause() {
        this.running = false;
        clearInterval(this.interval);
    }
};

window.onload = function() {
    canvas = document.getElementById("mycanvas");
    ctx = canvas.getContext("2d");
    canvas.width = gw;
    canvas.height = gh;

    var generation = generateDots();
    var grid = new Grid(g, numOfRows, numOfColumns, gw, gh);

    Main.init(canvas, ctx, grid, obstacles, []);
    setupListeners();
    Main.animate();
}