const { expect } = require("chai");
const Dot = require("../src/ga/ScreenLogic/dot");

const target = { x: 1550, y: 150, w: 50, h: 100 };

describe("Dot", () => {
    it("should init Dot", () => {
        const dot = new Dot([]);
        expect(dot.dna.length).to.equal(0);
        const pos = { x: 100, y: 100 };
        expect(dot.pos).to.eql(pos);
        expect(dot.start).to.eql(pos);
        expect(dot.vel).to.eql({ x: 0, y: 0 });
    });

    it("should calculate distance", () => {
        const dot = new Dot([]);

        const pos1 = { x: 1400, y: 300 };
        const distance1 = dot.calculateDistance(target, pos1);
        expect(typeof distance1 === "number").to.equal(true);

        const pos2 = { x: 1400, y: 150 };
        const distance2 = dot.calculateDistance(target, pos2);
        expect(typeof distance2 === "number").to.equal(true);
        expect(distance2).lessThan(distance1);


        const pos3 = { x: 1600, y: 200 };
        const distance3 = dot.calculateDistance(target, pos3);
        expect(typeof distance3 === "number").to.equal(true);
        expect(distance3).equal(0);
    });

    it("should calculate score", () => {
        const dot = new Dot([]);
        dot.target_reached = true;

        let score = dot.getScore(null);
        expect(score).to.equal(1);

        dot.target_reached = false;

        let pos = { x: 1400, y: 300 };
        dot.pos = pos;

        let distance = dot.calculateDistance(target, dot.pos);
        const distanceFromStart = dot.calculateDistance(target, { x: 100, y: 100});
        score = dot.getScore(target);
        console.log(distance);
        console.log(distanceFromStart);
        console.log(score);
        expect(score).greaterThan(0).lessThan(1);
        expect(distance).lessThan(distanceFromStart);

        pos = { x: 50, y: 50 };
        dot.pos = pos;
        distance = dot.calculateDistance(target, dot.pos);
        expect(distance).greaterThan(distanceFromStart);


        // expect(score).to.equal(1 / distance);

    });
});