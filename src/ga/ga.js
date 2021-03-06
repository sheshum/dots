const Population = require('./population');
const Individual = require('./individual');
const ObstacleCourse = require("./ScreenLogic/obstacle_course");
const Dot = require('./ScreenLogic/dot');
const { randomNum } = require("../libs/tools");


class GA {
    constructor(poolSize, crossOverRate, mutationRate, elitismCount) {
        this.poolSize = poolSize;
        this.crossOverRate = crossOverRate;
        this.mutationRate = mutationRate;
        this.elitismCount = elitismCount;
    }
    shouldTerminate(generationCount, maxGenerations, population) {
        // if (population.getFittest(0).getFitness() === 1) {
        //     return true;
        // }
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
            totalFitness += calcFitness( individual, obstacleCourse );
            // calcFitness( individual, obstacleCourse );
        });

        // normalizeFitness( matingPool );
        // totalFitness = calculateTotalFitness(matingPool);

        const fittest = population.getFittest(0);
        fittest.markAsFittest();
        population.setTotalFitness( totalFitness );
        const avg = totalFitness / population.size();
        // population.setAverageFitness( parseFloat(avg.toFixed(4)) );

        population.logPopulationFitness();
        population.setAverageFitness( avg );
    }

    selection(population) {
        const nextGeneration = new Population(population.size(), null, true);
        for (let i = 0; i < population.size(); i++) {
            const parent1 = population.getFittest(i);

            const rnd = Math.random();
            if (i > this.elitismCount && this.crossOverRate > rnd) {
                const parent2 = selectParent(population);
                const offspring = new Individual(parent1.DNALength);
                for (let j = 0; j < parent1.dnaLength(); j++) {
                    let gene;
                    if (0.5 > Math.random()) {
                        gene = parent1.getGene(j);
                    } else {
                        gene = parent2.getGene(j);
                    }

                    offspring.setGene(gene, j);
                }

                nextGeneration.addIndividual(offspring);
            } else {
                nextGeneration.addIndividual(parent1);
            }
        }

        return nextGeneration;
    }

    mutation(population) {
        const mutatedPopulation = new Population(population.size(), null, true);
        
        const matingPool = population.getIndividuals();
        for (let i = 0; i < matingPool.length; i++) {
            const individual = matingPool[i];
            for (let j = 0; j < individual.dnaLength(); j++) {
                if (this.mutation > Math.random()) {
                    const currentGene = individual.getGene(j);
                    const rndGene = getRndGene(currentGene);
                    individual.setGene(rndGene, j);
                }
            }

            mutatedPopulation.addIndividual(individual);
        }
        return mutatedPopulation;
    }
}

function getRndGene(currentGene) {
    const rndGene = randomNum(0, 7);
    if (rndGene !== currentGene) {
        return rndGene;
    }

    return getRndGene(currentGene);
}

function selectParent(population) {
    const totalFitness = population.getTotalFitness();

    const rouletteWheelPosition = Math.random() * totalFitness;
    const matingPool = population.getIndividuals();
    const size = population.size();
    let spinWheel = 0;
    for (let i = 0; i < size; i++) {
        spinWheel += matingPool[i].getFitness();
        if (spinWheel >= rouletteWheelPosition) {
            return matingPool[i];
        }
    }

    return matingPool[size - 1];
}

function calcFitness(individual, obstacleCourse) {
    const dot = new Dot( individual.dna );

    const moves = dot.run( obstacleCourse );
    individual.setMoves( moves );

    const fitness = dot.getScore( obstacleCourse.target, moves, individual.dnaLength() );
    individual.setFitness( fitness );

    return fitness;
}

function calculateTotalFitness(matingPool) {
    const totalFitness = matingPool.reduce((initial, individual) => {
        return initial + individual.getFitness();
    }, 0);

    return totalFitness;
}

function normalizeFitness(matingPool) {
    const fitnessArr = matingPool.map((i) => i.getFitness());
    fitnessArr.sort((a, b) => a > b);

    const min = fitnessArr[0];
    const max = fitnessArr[fitnessArr.length - 1];

    matingPool.forEach((individual) => {
        const fitness = individual.getFitness();
        const normalized = normalize(min, max, fitness);
        individual.setFitness(1 - normalized);
    });
}

function normalize(min, max, val) {
    return ((val - min) / (max - min));
}



module.exports = GA;