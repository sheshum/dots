const VELOCITY = 50;

const DIR_TYPES = ["N", "NE", "E", "ES", "S", "SW", "W", "NW"];
const directions = {
    "N": { speedX: 0, speedY: -VELOCITY },
    "NE": { speedX: VELOCITY, speedY: -VELOCITY },
    "E": { speedX: VELOCITY, speedY: 0 },
    "ES": { speedX: VELOCITY, speedY: VELOCITY },
    "S": { speedX: 0, speedY: VELOCITY },
    "SW": { speedX: -VELOCITY, speedY: VELOCITY },
    "W": { speedX: -VELOCITY, speedY: 0 },
    "NW": { speedX: -VELOCITY, speedY: -VELOCITY }
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

    checkColision(position, velocity) {
        const x = position.x + velocity.x;
        const y = position.y + velocity.y;
        if (colidesWithEdge(x, y) || colidesWithObstacle.call(this, x, y)) {
            return true;
        }
        return false;
    }
    

    targetReached(position) {
        const t = this.target;
        const halfWidth = t.w / 2;
        const halfHeight = t.h / 2 ;
        const centerX = t.x + halfWidth;
        const centerY = t.y + halfHeight;

        const diffX = Math.abs(centerX - position.x);
        const diffY = Math.abs(centerY - position.y);

        return (diffX <= halfWidth && diffY <= halfHeight);
    }

    getDirection(move) {
        const dirStr = DIR_TYPES[move];
        return directions[dirStr];
    }
};

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


function colidesWithObstacle(posX, posY) {
    var r = dotRadius;
    var colidesWith = this.obstacles.find(function(ob) {
        return (posX + r >= ob.x && posX - r <= (ob.x + ob.w)
            && posY + r >= ob.y && posY - r <= (ob.y + ob.h));
    });

    return colidesWith ? true : false;
}

module.exports = ObstacleCourse;