const Vector2D = require('./vector');

const multiplier = 5;
const DIRECTION_KEYS = ["N", "NE", "E", "ES", "S", "SW", "W", "NW"];
const VECTORS = {
    "N": { vx: 0, vy: -1 },
    "NE": { vx: 1, vy: -1 },
    "E": { vx: 1, vy: 0 },
    "ES": { vx: 1, vy: 1 },
    "S": { vx: 0, vy: 1 },
    "SW": { vx: -1, vy: 1 },
    "W": { vx: -1, vy: 0 },
    "NW": { vx: -1, vy: -1 }
};

const dotRadius = 5;

const canvas = {
    WIDTH: 1600,
    HEIGHT: 700
}

class ObstacleCourse {
    constructor(obstacles, target) {
        this.target = target;
        this.obstacles = obstacles;
    }

    targetReached(position) {
        const t = this.target;
        const halfWidth = t.w / 2;
        const halfHeight = t.h / 2 ;
        const centerX = t.x + halfWidth;
        const centerY = t.y + halfHeight;

        const diffX = Math.abs(centerX - position.x);
        const diffY = Math.abs(centerY - position.y);

        // return (posX >= t.x && posX <= (t.x + t.w)
        //     && posY >= t.y && posY <= (t.y + t.h));

        return (diffX <= halfWidth && diffY <= halfHeight);
    }

    getVector(move) {
        const directionKey = DIRECTION_KEYS[move];
        const vector = VECTORS[directionKey];
        return vector;
    }

    getVelocityM(currentPosition, vector) {
        let m = 0;
        for (let i = 1; i <= 10; i++) {
            let vx = vector.vx * (5 * i);
            let vy = vector.vy * (5 * i);
            if (checkColision(currentPosition, vx, vy, this.obstacles)) {
                break;
            }

            m = i;
        }

        return m;
    }
};

function checkColision(position, vx, vy, obstacles) {
    const x = position.x + vx;
    const y = position.y + vy;
    if (colidesWithEdge(x, y) || colidesWithObstacle(obstacles, x, y)) {
        return true;
    }
    return false;
}

function colidesWithEdge(posX, posY) {
    const r = dotRadius;
    const leftEdge = posX - r;
    const rightEdge = posX + r;
    const topEdge = posY - r;
    const bottomEdge = posY + r;

    if (leftEdge < 0 || rightEdge > canvas.WIDTH
        || topEdge < 0 || bottomEdge > canvas.HEIGHT) {
        return true;
    }

    return false;
}


function colidesWithObstacle(obstacles, posX, posY) {
    var r = dotRadius;
    var colidesWith = obstacles.find(function(ob) {
        return (posX + r > ob.x && posX - r < (ob.x + ob.w)
            && posY + r > ob.y && posY - r < (ob.y + ob.h));
    });

    return colidesWith ? true : false;
}

module.exports = ObstacleCourse;