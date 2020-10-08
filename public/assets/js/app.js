
var SETTINGS = {
    host: "http://localhost:5001",
    framerate: 10,
    dotRadius: 5,
    showOnlyFittest: false,
    grid: {
        showGrid: true,
        width: 50,
        numOfRows: 14,
        numOfColumns: 32
    },
    colors: {
        target: "#21ec8e",
        obstacle: "white",
        dot: "red",
        dotOnTarget: "blue",
        fittest: "#21ec8e",
        gridStroke: "gray"
    },
    ga: {
        maxGenerations: 50,
        startFrom: 30,
        poolSize: 100,
        maxSteps: 60,
        crossOverRate: 0.95,
        mutationRate: 0.02,
        elitismCount: 3
    }
};

var KEY_CODES = {
    Space: 32,
    F_Key: 102,
    G_Key: 103,
    S_Key: 115
};

var obstacles = [
    { x: 200, y: 200, w: 50, h: 300 },
    { x: 400, y: 0, w: 100, h: 250 },
    { x: 600, y: 450 , w: 150, h: 200 },
    { x: 1000, y: 300, w: 400, h: 150 }
];

var target = { x: 1550, y: 150, w: 50, h: 100 };

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
        return fetch(`${SETTINGS.host}/api/ga/generate`, {
            method: "post",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        }).then(function(response) {
            return response.json();
        }).then(function(data) {
            return data;
        }).catch(function(err) {
            console.log("sendGenerateData :: Error: ", err);
        });
    },

    getGenerationData(index) {
        return fetch(`${SETTINGS.host}/api/ga/results/${index}`)
            .then(function(response) {
                return response.json();
            })
            .then(function(data) {
                return data;
            })
            .catch(function(err) {
                console.log("getPopulationData :: Error: ", err);
            });
    }
}


var UI = {
    loader: null,
    btnGenerateData: null,
    btnRunSimulation: null,
    numOfGenerationsEl: null,
    numOfStepsEl: null,
    init(grid) {
        this.grid = grid;

        var canvas = document.getElementById("mycanvas");
        var ctx = canvas.getContext("2d");
        canvas.width = grid.gw;
        canvas.height = grid.gh;

        this.canvas = canvas;
        this.context = ctx;

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

    getCtx() {
        return this.context;
    },

    reset() {
        this.resetCounter();
        this.clearCanvas();
        this.btnGenerateData.removeAttribute("disabled");
    },

    clearCanvas() {
        if (this.context) {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    },

    drawGrid() {
        var ctx = this.getCtx();
        this.grid.draw(ctx);
    },

    fillRecangle(x, y, w, h, color) {
        var ctx = this.getCtx();
        ctx.fillStyle = color;
        ctx.fillRect(x, y, w, h);
    },

    fillCircle(x, y, radius, color) {
        var ctx = this.getCtx();
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, 2*Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    },

    toggleGrid() {
        this.grid.toggle();
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

function generateData() {
    UI.showLoader(true);
    UI.btnGenerateData.setAttribute("disabled", true);

    api.sendGenerateData().then(function() {
        UI.btnRunSimulation.removeAttribute("disabled");
        UI.showLoader(false);
    });
}

function startSimulation() {
    UI.showLoader(true);
   
    var index = SETTINGS.ga.startFrom - 1;
    return api.getGenerationData(index).then(function(rsp) {
        UI.showLoader(false);

        var generationData = rsp.data;
        UI.btnRunSimulation.setAttribute("disabled", true);
        Engine.buildCurrentGen(generationData);
        UI.updateGeneration(Engine.currentGenerationNo);
        Engine.animate();
    });
}

function getGeneration(index) {
    UI.showLoader(true);
    return api.getGenerationData(index).then(function(rsp) {
        UI.showLoader(false);

        var generationData = rsp.data;

        UI.btnRunSimulation.setAttribute("disabled", true);
        return generationData;
    });
}

function Grid(g, numOfRows, numOfColumns, showGrid) {
    this.g = g;
    this.numOfRows = numOfRows;
    this.numOfColumns = numOfColumns;
    this.gw = this.numOfColumns * this.g;
    this.gh = this.numOfRows * this.g;
    this.show = showGrid;

    this.toggle = function() {
        this.show = !this.show;
    },

    this.draw = function(ctx) {
        if (this.show) {
            ctx.strokeStyle = SETTINGS.colors.gridStroke;
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
}

function Vector2D(x, y) {
    this.x = x;
    this.y = y;
}

function Dot2D(dna) {
    this.dna = dna;
    this.pos = new Vector2D(100, 100);
    this.totalSteps = -1;
    this.step = 0;
    this.counter = 0;
    this.finished = false;
    this.color = SETTINGS.colors.dot;
    this.radius = SETTINGS.dotRadius;
    this.move = function(step, counter) {
        if (this.finished) {
            return;
        }
        
        if (this.targetReached === true) {
            this.finished = true;
            return;
        }

        var currentMove = dna[step];
        var targetReached = currentMove[3];

        // If target is reached in this move
        if (targetReached) {
            this.color = SETTINGS.colors.dotOnTarget;
            
        }

        // if this is the last frame of the move
        if (targetReached && this.m === counter) {
            this.targetReached = true;
        }
        this.vector = new Vector2D(currentMove[0], currentMove[1]);
        this.m = currentMove[2];


        var vx = 0;
        var vy = 0;

        // If should not move in this frame
        if (this.m !== 0 && counter <= this.m) {
            vx = this.vector.x * 5;
            vy = this.vector.y * 5;
        }
    
        this.pos.x += vx;
        this.pos.y += vy;
    }

    this.draw = function () {
        if (!this.finished) {
            UI.fillCircle(this.pos.x, this.pos.y, this.radius, this.color);
        }
    };
}

function RectComponent(x, y, w, h, color) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.color = color;

    this.draw = function() {
        UI.fillRecangle(this.x, this.y, this.w, this.h, this.color);
    }
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

    init(obstacles, target, maxGenerations, startFrom) {
        this.initialized = true;
        this.target = target;
        this.obstacles = obstacles;
        this.generation = [];

        this.maxGenerations = maxGenerations;
        this.currentGenerationNo = startFrom;
    },

    setupListeners() {
        window.onkeypress = this._onKeyPress.bind(this);
    },

    _onKeyPress(e) {
        var code = e.keyCode;
        if (code === KEY_CODES.G_Key) {
            if (this.running && !this.paused) {
                UI.toggleGrid();
            }
        } else if(code === KEY_CODES.S_Key) {
            if (this.running) {
                this.stopAnimation();
            } else {
                this.currentGenerationNo = 1;
                getGeneration(this.currentGenerationNo - 1).then(function(gen) {
                    this.buildCurrentGen(gen);
                    UI.updateGeneration(this.currentGenerationNo);
                    this.animate();
                }.bind(this));
            }
        } else if (code === KEY_CODES.Space) {
            this.paused = !this.paused;
        } else if (code === KEY_CODES.F_Key) {
            SETTINGS.showOnlyFittest = !SETTINGS.showOnlyFittest;
        }
    },

    buildCurrentGen(genData) {
        var gen = genData.map(function(moves) {
            return new Dot2D(moves);
        });

        // Set color for fittest individual
        gen[0].color = SETTINGS.colors.fittest;

        // Reverse so that the fittest is drawn last
        this.generation = gen.reverse();
    },

    _onFrame() {
        if (this.paused || this.loading) {
            return;
        }

        UI.clearCanvas();
        UI.drawGrid();

        this.target.draw();
        this.obstacles.forEach(function(ob) {
            ob.draw();
        });

        // Every 10 frames select new move
        if (this.counter > 10) {
            this.counter = 1;
            this.step += 1;
            UI.updateStep(this.step);
        }

        if (this.generation.length > 0 && this.step < SETTINGS.ga.maxSteps) {
            var last = this.generation.length - 1;
            this.generation.forEach(function(dot, index) {
                dot.move(this.step, this.counter);
                if (SETTINGS.showOnlyFittest) {
                    if (index === last) {
                        dot.draw();
                    }
                } else {
                    dot.draw();
                }
            }.bind(this));

            this.counter += 1;
        }

        if (this.step === SETTINGS.ga.maxSteps) {
            this.currentGenerationNo += 1;
            if (this.currentGenerationNo > this.maxGenerations) {
                this.stopAnimation();
            } else {
                this.counter = 1;
                this.step = 0;
                this.loading = true;
                getGeneration(this.currentGenerationNo - 1).then(function(gen) {
                    this.buildCurrentGen(gen);
                    UI.updateGeneration(this.currentGenerationNo);
                    this.loading = false;
                }.bind(this));
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
        UI.reset();
        this.running = false;
        this.paused = false;
        // this.generation = [];
    }
};

window.onload = function() {
    var grid = new Grid(
        SETTINGS.grid.width,
        SETTINGS.grid.numOfRows,
        SETTINGS.grid.numOfColumns,
        SETTINGS.grid.showGrid
    );
    UI.init(grid); 

    var t = new RectComponent(target.x, target.y, target.w, target.h, this.SETTINGS.colors.target);
    var obArr = obstacles.map(function(ob) {
        return new RectComponent(ob.x, ob.y, ob.w, ob.h, SETTINGS.colors.obstacle);
    });

    Engine.init(
        obArr,
        t,
        SETTINGS.ga.maxGenerations,
        SETTINGS.ga.startFrom
    );
    Engine.setupListeners();
}