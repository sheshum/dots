const Vector2D = require('./vector');

class Dot {
    constructor(dna) {
        this.pos = new Vector2D(100, 100);
        this.start = new Vector2D(this.pos.x, this.pos.y);
        this.vel = new Vector2D(0, 0);
        this.dna = dna;
        this.target_reached = false;

        if (process.env.NODE_ENV === "test") {
            this.calculateDistance = calculateDistance;
        }
    }

    run(obstacleCourse) {
        const moves = [];
        this.dna.forEach(gene => {
            if (this.target_reached) {
                return;
            }
            const vector = obstacleCourse.getVector(gene);
            // value from 0 - 50;
            const m = obstacleCourse.getVelocityM(this.pos, vector);

            this.vel.set(vector.vx * m * 5, vector.vy * m * 5);
            this.pos.addVector(this.vel);

            if (obstacleCourse.targetReached(this.pos)) {
                this.target_reached = true;
            }
            
            moves.push([vector.vx, vector.vy, m, this.target_reached]);
        });

        return moves;
    }

    getScore(target) {
        if (this.target_reached) {
            return 1;
        }
        
        // const distanceFromStart = calculateDistance(target, this.start);
        const distanceFromFinish = calculateDistance(target, this.pos);

        // if (distanceFromFinish >= distanceFromStart) {
        //     return 0;
        // }

        // const score = (distanceFromStart - distanceFromFinish) / distanceFromStart;
        // return score;

        return 1 / distanceFromFinish;
    }
};

function calculateDistance(target, pos) {
    const a = pos.x - (target.x + target.w);
    const b = pos.y - (target.y + target.h / 2);
    const distance = Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));

    return distance;
}

module.exports = Dot;