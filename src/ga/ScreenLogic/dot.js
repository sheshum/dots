const Vector2D = require('./vector');
const { randomNum } = require("../../libs/tools");
class Dot {
    constructor(dna, obstacleCourse) {
        this.obstacleCourse = obstacleCourse;
        this.pos = new Vector2D(randomNum(30, 180), randomNum(30, 180));
        this.vel = new Vector2D(0, 0);
        this.dna = dna;
        this.moves = [];
    }

    run() {
        this.dna.forEach(gene => {
            const direction = this.obstacleCourse.getDirection(gene);
            const vel = new Vector2D(direction.speeX, direction.speedY);
            
            // if (this.obstacleCourse.targetReached()) {
                // this.moves.push();
                // return;
                // }
                
            if (!this.obstacleCourse.checkColision(this.pos, vel)) {
                this.pos.add(vector);
                this.moves.push(this.pos);
            } else {
                this.moves.push(false);
            }
        });
    }
};

module.exports = Dot;