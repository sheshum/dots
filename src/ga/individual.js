const { randomNum } = require("../libs/tools");

class Individual {
    constructor(DNALength) {
        this.fitness = -1;
        this.dna = new Array(DNALength).fill(null).map(() => randomNum(0, 7));
    }

    getFitness() {
        return this.fitness;
    }


    setFitness(fitness) {
        this.fitness = fitness;
    }
};

module.exports = Individual;