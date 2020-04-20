const Population = require('./population');
const ObstacleCourse = require("./ScreenLogic/obstacle_course");
const Dot = require('./ScreenLogic/dot');

class GA {

    constructor(poolSize) {
        this.poolSize = poolSize;
    }
    shouldTerminate(generationCount, maxGenerations) {
        return generationCount > maxGenerations;
    }

    initPopulation(DNALength) {
        return new Population( this.poolSize, DNALength );
    }

    evaluate(population, obstacles, target) {
        let totalFitness = 0;
        const matingPool = population.getMembers();
        const obstacleCourse = new ObstacleCourse( obstacles, target );

        matingPool.forEach((individual) => {
            totalFitness += this.calcFitness( individual, obstacleCourse );
        });

        console.log(matingPool);

        population.setTotalFitness( totalFitness );

    }

    calcFitness(individual, obstacleCourse) {
        const dot = new Dot( individual.dna, obstacleCourse );
        dot.run();
    }
}

module.exports = GA;