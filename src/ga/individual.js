const { randomNum } = require("../libs/tools");

class Individual {
    constructor(DNALength) {
        this.fitness = -1;
        if (DNALength) {
            this.dna = new Array(DNALength).fill(null).map(() => randomNum(0, 7));
        } else {
            // TODO: check do I need this, OPTIMIZE ()!!!
            // 
            // this.dna = new Array(DNALength).fill(null)
            // 
            this.dna = [];
        }
    }

    dnaLength() {
        return this.dna.length;
    }

    getGene(offset) {
        return this.dna[offset];
    }

    setGene(gene, offset) {
        this.dna[offset] = gene;
    }

    getMoves() {
        return this.moves;
    }

    setMoves(moves) {
        this.moves = moves;
    }

    getFitness() {
        return this.fitness;
    }

    setFitness(fitness) {
        this.fitness = fitness;
    }
};

module.exports = Individual;