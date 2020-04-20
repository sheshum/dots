const Dot = require('./individual');


class Population {
    constructor(poolSize, DNALength) {
        this.totalFitness = -1;
        this.matingPool = randomMatingPool( poolSize, DNALength );
    }

    getTotalFitness() {
        return this.totalFitness;
    }

    setTotalFitness(totalFitness) {
        this.totalFitness = totalFitness;
    }

    getMembers() {
        return this.matingPool;
    }
};

function randomMatingPool(poolSize, DNALength) {
    return new Array(poolSize).fill(null).map(() => {
        const dot = new Dot(DNALength);
        return dot;
    });
}

module.exports = Population;