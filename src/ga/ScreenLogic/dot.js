const Vector2D = require('./vector');

class Dot {
    constructor(dna) {
        this.pos = new Vector2D(100, 100);
        this.start = new Vector2D(this.pos.x, this.pos.y);
        this.vel = new Vector2D(0, 0);
        this.dna = dna;
    }

    run(obstacleCourse) {
        const moves = [];
        this.dna.forEach(gene => {
            const vector = obstacleCourse.getVector(gene);
            // value from 0 - 50;
            const m = obstacleCourse.getVelocityM(this.pos, vector);

            this.vel.set(vector.vx * m * 5, vector.vy * m * 5);
            this.pos.addVector(this.vel);

            if (obstacleCourse.targetReached(this.pos)) {
                moves.push("T");
                return;
            }

            moves.push([vector.vx, vector.vy, m]);
        });

        return moves;
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