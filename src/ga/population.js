const Dot = require('./individual');


class Population {
    constructor(poolSize, DNALength, empty = false) {
        this.totalFitness = -1;
        this.averageFitness = -1;
        this.populationSize = poolSize;
        if (empty) {
            this.matingPool = [];
        } else {
            this.matingPool = randomMatingPool( poolSize, DNALength );
        }
    }

    size() {
        return this.matingPool.length;
    }

    getIndividuals() {
        return this.matingPool;
    }

    addIndividual(individual) {
        this.matingPool.push(individual);
    }

    getTotalFitness() {
        return this.totalFitness;
    }

    setTotalFitness(totalFitness) {
        this.totalFitness = totalFitness;
    }

    getAverageFitness() {
        return this.averageFitness;
    }


    setAverageFitness(averageFitness) {
        this.averageFitness = averageFitness;
    }

    getMembers() {
        return this.matingPool;
    }

    getFittest(offset) {
        this.matingPool.sort((o1, o2) => {
            if(o1.getFitness() > o2.getFitness()) {
                return -1;
            } else if (o1.getFitness() < o2.getFitness()) {
                return 1;
            }
            return 0;
        });

        return this.matingPool[offset];
    }
};

function randomMatingPool(poolSize, DNALength) {
    return new Array(poolSize).fill(null).map(() => {
        const dot = new Dot(DNALength);
        return dot;
    });
}

module.exports = Population;