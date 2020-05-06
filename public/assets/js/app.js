var GEN;
var HOST = "http://localhost:5001";
var simData;

var ctx;
var canvas;


var SETTINGS = {
    framerate: 20,
    showGrid: false,
    ga: {
        maxGenerations: 5,
        poolSize: 100,
        maxSteps: 20,
        crossOverRate: 0.95,
        mutationRate: 0.02,
        elitismCount: 3
    }
};

var obstacles = [
    { x: 200, y: 200, w: 50, h: 300 },
    { x: 400, y: 0, w: 100, h: 250 },
    { x: 600, y: 450 , w: 150, h: 200 },
    { x: 1000, y: 300, w: 400, h: 150 }
];

var target = { x: 1550, y: 150, w: 50, h: 100 };

var UI = {
    loader: null,
    btnGenerateData: null,
    btnRunSimulation: null,
    numOfGenerationsEl: null,
    numOfStepsEl: null,
    init() {
        canvas = document.getElementById("mycanvas");
        ctx = canvas.getContext("2d");
        canvas.width = gw;
        canvas.height = gh;

        this.loader = document.getElementsByClassName("loader")[0];
        this.numOfGenerationsEl = document.getElementById("ga-no-generations");
        this.numOfStepsEl = document.getElementById("ga-no-steps");
        this.btnGenerateData = document.getElementById("ga-btn-generate");
        this.btnRunSimulation = document.getElementById("ga-btn-run");

        // var left = canvas.width - 300;
        // this.ga_counter.style.left = left + "px";
        this.btnRunSimulation.setAttribute("disabled", true);

        this.updateGeneration("__");
        this.updateStep("__");
    },

    reset() {
        this.resetCounter();
        this.btnGenerateData.removeAttribute("disabled");
    },

    resetCounter() {
        this.updateStep("__");
        this.updateGeneration("__");
    },

    updateGeneration(generation) {
        this.numOfGenerationsEl.innerHTML = `Generation: ${generation} / ${SETTINGS.ga.maxGenerations}`;
    },

    updateStep(step) {
        this.numOfStepsEl.innerHTML = `Step: ${step} / ${SETTINGS.ga.maxSteps}`;
    },

    showLoader(show) {
        if (this.loader) {
            if (show) {
                this.loader.classList.remove("hidden");
            } else {
                this.loader.classList.add("hidden");
            }
        }
    }
}

var api = {
    sendGenerateData() {
        var data = {
            obstacles: obstacles,
            target: target,
            maxGenerations: SETTINGS.ga.maxGenerations,
            poolSize: SETTINGS.ga.poolSize,
            dnaLength: SETTINGS.ga.maxSteps,
            crossOverRate: SETTINGS.ga.crossOverRate,
            mutationRate: SETTINGS.ga.mutationRate,
            elitismCount: SETTINGS.ga.elitismCount
        };
        return fetch(`${HOST}/api/ga/generate`, {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
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
    UI.showLoader(true);
    UI.btnGenerateData.setAttribute("disabled", true);
    api.sendGenerateData().then(function(_data) {
        UI.btnRunSimulation.removeAttribute("disabled");
        UI.showLoader(false);
    });
}

function startSimulation() {
    UI.showLoader(true);
    return api.getAllResults().then(function(data) {
        UI.showLoader(false);

        simData = data;
        // var firstGenData = data[data.length - 1];
        // var generation = firstGenData.map(function(moves) {
        //     return new Dot2(moves);
        // });

        UI.btnRunSimulation.setAttribute("disabled", true);
        Engine.buildCurrentGen();
        Engine.animate();
    }).catch(function(err) {
        console.log(err);
    });
}





var NUM_OF_DOTS = 100;
var VELOCITY = 5;
var velocityIncrement = 10;

// var DIR_TYPES = ["N", "NE", "E", "ES", "S", "SW", "W", "NW"];
// var directions = {
//     "N": { speedX: 0, speedY: -VELOCITY },
//     "NE": { speedX: VELOCITY, speedY: -VELOCITY },
//     "E": { speedX: VELOCITY, speedY: 0 },
//     "ES": { speedX: VELOCITY, speedY: VELOCITY },
//     "S": { speedX: 0, speedY: VELOCITY },
//     "SW": { speedX: -VELOCITY, speedY: VELOCITY },
//     "W": { speedX: -VELOCITY, speedY: 0 },
//     "NW": { speedX: -VELOCITY, speedY: -VELOCITY }
// };

var KEY_CODES = {
    Space: 32,
    G_Key: 103,
    S_Key: 115
};

var dotRadius = 5;
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
        // return new Dot(random(30, 180), random(30, 180));
        return new Dot(100, 100);
    });

    return smart_dots;
}

function Grid(g, numOfRows, numOfColumns) {
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
    this.pos = new Vector2D(100, 100);
    this.totalSteps = -1;
    this.step = 0;
    this.counter = 0;
    this.finished = false;
    this.color = "red";
    this.move = function(step, counter) {

        if (this.finished === true) {
            return;
        }

        var currentMove = dna[step];
        var targetReached = currentMove[3];

        // If target is reached in this move and this is the last frame
        if (targetReached && this.m === counter) {
            this.targetReached = true;
            this.color = "blue";
        }
        this.vector = { vx: currentMove[0], vy: currentMove[1] };
        this.m = currentMove[2];


        var vx;
        var vy;

        // If should not move in this frame
        if (this.m === 0 || counter > this.m) {
            vx = 0;
            vy = 0;
        } else {
            vx = this.vector.vx * 5;
            vy = this.vector.vy * 5;
        }
    
        this.pos.x += vx;
        this.pos.y += vy;
    }

    this.draw =  function drawDot() {
        if (!this.finished) {
            ctx.beginPath();
            ctx.arc(this.pos.x, this.pos.y, dotRadius, 0, 2*Math.PI);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        if (this.targetReached) {
            this.finished = true;
        }
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

var Engine = {
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

        this.currentGenerationNo = 1;
    },

    setupListeners() {
        window.onkeypress = function(e) {
            var code = e.keyCode;
            if (code === KEY_CODES.G_Key) {
                this.toggleGrid();
            } else if(code === KEY_CODES.S_Key) {
                if (this.running) {
                    this.stopAnimation();
                } else {
                    this.buildCurrentGen();
                    this.animate();
                }
            } else if (code === KEY_CODES.Space) {
                this.paused = !this.paused;
            }
        }.bind(this);
    },

    clearCanvas() {
        if (this.context) {
            this.context.clearRect(0, 0, gw, gh);
        }
    },

    toggleGrid() {
        if (this.running && !this.paused) {
            SETTINGS.showGrid = !SETTINGS.showGrid;
        }
    },

    buildCurrentGen() {
        var index = this.currentGenerationNo - 1;
        var gen = simData[index].map(function(moves) {
            return new Dot2(moves);
        });

        this.generation = gen;
        UI.updateGeneration(this.currentGenerationNo);
    },

    _onFrame() {
        if (this.paused) {
            return;
        }
        this.clearCanvas();

        if (SETTINGS.showGrid) { 
            this.grid.draw();
        }

        drawTarget(target);
        drawObstacles();

        // Every 10 frames select new move
        if (this.counter > 10) {
            this.counter = 1;
            this.step += 1;
            UI.updateStep(this.step);
        }

        if (this.generation.length > 0 && this.step < SETTINGS.ga.maxSteps) {
            this.generation.forEach(function(dot) {
                dot.move(this.step, this.counter);
                dot.draw();
            }.bind(this));

            this.counter += 1;
        }

        if (this.step === SETTINGS.ga.maxSteps) {
            this.currentGenerationNo += 1;
            if (this.currentGenerationNo === SETTINGS.ga.maxGenerations) {
                this.stopAnimation();
            } else {
                this.counter = 1;
                this.step = 0;
                this.buildCurrentGen();

            }
        }

    },

    animate() {
        this.counter = 1;
        this.step = 0;
        this.running = true;
        this.interval = setInterval(this._onFrame.bind(this), SETTINGS.framerate);
    },

    stopAnimation() {
        clearInterval(this.interval);
        this.clearCanvas();
        UI.reset();
        this.running = false;
        this.paused = false;
        this.generation = [];
    }
};

window.onload = function() {
    UI.init(); 

    var grid = new Grid(g, numOfRows, numOfColumns, gw, gh);

    Engine.init(canvas, ctx, grid, obstacles, []);
    Engine.setupListeners();
}