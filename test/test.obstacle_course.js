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

        const pos1 = { x: 1570, y: 160 };
        let targetReached = obstacleCourse.targetReached(pos1);
        expect(targetReached).to.equal(true);


        const pos2 = { x: 1570, y: 150 };
        targetReached = obstacleCourse.targetReached(pos2);
        expect(targetReached).to.equal(true);

        const pos3 = { x: 1550, y: 160 };
        targetReached = obstacleCourse.targetReached(pos3);
        expect(targetReached).to.equal(true);
    });
})