const GA = require('./ga/ga');
const dataHandler = require("./libs/dataHandler");


const MAX_GENERATIONS = 50;
const POOL_SIZE = 100;
const DNA_LENGTH = 150;
const CROSS_OVER_RATE = 0.95;
const MUTATION_RATE = 0.02;
const ELITISM_COUNT = 3;

// const obstacles = [
//     { x: 200, y: 200, w: 50, h: 300 },
//     { x: 400, y: 0, w: 100, h: 250 },
//     { x: 600, y: 450 , w: 150, h: 200 },
//     { x: 1000, y: 300, w: 400, h: 150 }
// ];

// const target = { x: 1550, y: 150, w: 50, h: 100 };

async function startGA(params) {
    console.log("Starting...");

    const obstacles = params.obstacles;
    const target = params.target;
    const maxGenerations = params.maxGenerations || MAX_GENERATIONS;
    const poolSize = params.poolSize || POOL_SIZE;
    const dnaLength = params.dnaLength || DNA_LENGTH;
    const crossOverRate = params.crossOverRate || CROSS_OVER_RATE;
    const mutationRate = params.mutationRate || MUTATION_RATE;
    const elitismCount = params.elitismCount || ELITISM_COUNT;

    dataHandler.clearData();

    let generation = 1;
    const ga = new GA(poolSize, crossOverRate, mutationRate, elitismCount);

    let population = ga.initPopulation( dnaLength );
    ga.evaluate( population, obstacles, target );
    
    do {
        dataHandler.savePopulationData(population, generation);

        const charlieSheen = population.getFittest(0);
        console.log(`Generation: ${generation} \t||\t Best solution: ${charlieSheen.getFitness()} \t||\t Average: ${population.getAverageFitness()}`);

        population = ga.selection( population );
        population = ga.mutation( population );
        ga.evaluate( population, obstacles, target );
        
        generation += 1;

    } while (ga.shouldTerminate(generation, maxGenerations, population) === false)

    // const charlieSheen = population.getFittest(0);
    // console.log(`Generation: ${generation} \t||\t Best solution: ${charlieSheen.getFitness()} \t||\t Average: ${population.getAverageFitness()}`);

    return population;
}

module.exports = { startGA };