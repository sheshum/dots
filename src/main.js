const GA = require('./ga/ga');


const MAX_GENERATIONS = 50;
const POOL_SIZE = 300;
const DNA_LENGTH = 150;
const CROSS_OVER_RATE = 0.95;
const MUTATION_RATE = 0.02;
const ELITISM_COUNT = 3;

const obstacles = [
    { x: 200, y: 200, w: 50, h: 300 },
    { x: 400, y: 0, w: 100, h: 250 },
    { x: 600, y: 450 , w: 150, h: 200 },
    { x: 1000, y: 300, w: 400, h: 150 }
];

const target = { x: 1500, y: 400, w: 100, h: 150 };
function startGA() {
    console.log("Starting...")
    let generation = 1;
    const ga = new GA(POOL_SIZE, CROSS_OVER_RATE, MUTATION_RATE, ELITISM_COUNT);

    // Initialize population
    let population = ga.initPopulation( DNA_LENGTH );

    // Evaluate population

    ga.evaluate( population, obstacles, target );


    do {

        // Print fittest individual from population
        const charlieSheen = population.getFittest(0);
        console.log(`Generation: ${generation} \t||\t Best solution: ${charlieSheen.getFitness()} \t||\t Average: ${population.getAverageFitness()}`);

        // Apply crossover
        population = ga.selection( population );

        // Apply mutation
        population = ga.mutation( population );

        // Evaluate population
        ga.evaluate( population, obstacles, target );

        generation += 1;

    } while (ga.shouldTerminate(generation, MAX_GENERATIONS, population) === false)

    const charlieSheen = population.getFittest(0);
    console.log(`Generation: ${generation} \t||\t Best solution: ${charlieSheen.getFitness()} \t||\t Average: ${population.getAverageFitness()}`);

    return population;

}

module.exports = { startGA };