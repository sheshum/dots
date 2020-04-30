const Vector2D = require('./vector');

class Dot {
    constructor(dna, obstacleCourse) {
        this.obstacleCourse = obstacleCourse;
        this.pos = new Vector2D(100, 100);
        this.start = new Vector2D(this.pos.x, this.pos.y);
        this.vel = new Vector2D(0, 0);
        this.dna = dna;
        this.moves = [];
    }

    run() {
        this.dna.forEach(gene => {
            if (this.obstacleCourse.targetReached(this.pos)) {
                this.moves.push(false);
                return;
            }
            
            const direction = this.obstacleCourse.getDirection(gene);
            const vel = new Vector2D(direction.speedX, direction.speedY);

            if (this.obstacleCourse.checkColision(this.pos, vel)) {
                this.vel.set(0, 0);
            } else {
                this.vel.set(vel.x, vel.y);
            }
            this.pos.addVector(this.vel);
            this.moves.push(gene);
        });
    }

    getScore(target) {
        const distanceFromStart = calculateDistance(target, this.start);
        const distanceFromFinish = calculateDistance(target, this.pos);

        if (distanceFromFinish >= distanceFromStart) {
            return 0;
        } else if (distanceFromFinish === 0) {
            return 1;
        } 
        const score = (distanceFromStart - distanceFromFinish) / distanceFromStart;
        return score;
    }
};

function calculateDistance(target, pos) {
    const a = pos.x - target.x;
    const b = pos.y - target.y;
    const distance = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    return parseFloat(distance.toFixed(4));
}

module.exports = Dot;