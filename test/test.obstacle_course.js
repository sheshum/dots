const { expect } = require("chai");
const ObstacleCourse = require("../src/ga/ScreenLogic/obstacle_course");

const obstacles = [
    { x: 200, y: 200, w: 50, h: 300 },
    { x: 400, y: 0, w: 100, h: 250 },
    { x: 600, y: 450 , w: 150, h: 200 },
    { x: 1000, y: 300, w: 400, h: 150 }
];

const target = { x: 1550, y: 150, w: 50, h: 100 };


describe('ObstacleCourse', () => {
    it("should init class", () => {
        const obstacleCourse = new ObstacleCourse(obstacles, target);

        expect(obstacleCourse.obstacles).to.eql(obstacles);
        expect(obstacleCourse.target).to.eql(target);
    });

    it("should return that target is reached", () => {
        const obstacleCourse = new ObstacleCourse(obstacles, target);

        let pos = { x: 1570, y: 160 };
        let targetReached = obstacleCourse.targetReached(pos);
        expect(targetReached).to.equal(true);


        pos = { x: 1570, y: 150 };
        targetReached = obstacleCourse.targetReached(pos);
        expect(targetReached).to.equal(true);

        pos = { x: 1550, y: 160 };
        targetReached = obstacleCourse.targetReached(pos);
        expect(targetReached).to.equal(true);

        pos = { x: 1575, y: 200 };
        targetReached = obstacleCourse.targetReached(pos);
        expect(targetReached).to.equal(true);

        pos = { x: 1550, y: 250 };
        targetReached = obstacleCourse.targetReached(pos);
        expect(targetReached).to.equal(true);
    });

    it("#getVelocityM()", () => {
        const obstacleCourse = new ObstacleCourse(obstacles, target);
        const pos = { x: 350, y: 205 };
        const vector = { vx: 1, vy: -1 };

        const m = obstacleCourse.getVelocityM(pos, vector);
    });
})