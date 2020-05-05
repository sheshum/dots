const { expect } = require("chai");
const Dot = require("../src/ga/ScreenLogic/dot");

describe("Dot", () => {
    it("should init Dot", () => {
        const dot = new Dot([]);
        expect(dot.dna.length).to.equal(0);
        const pos = { x: 100, y: 100 };
        expect(dot.pos).to.eql(pos);
        expect(dot.start).to.eql(pos);
        expect(dot.vel).to.eql({ x: 0, y: 0 });
    });
});