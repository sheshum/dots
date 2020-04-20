const GA = require('./ga/ga');


const POOL_SIZE = 20;
const MAX_GENERATIONS = 5;
const DNA_LENGTH = 10;
let generation = 1;

const obstacles = [
    { x: 200, y: 200, w: 50, h: 300 },
    { x: 400, y: 0, w: 100, h: 250 },
    { x: 600, y: 450 , w: 150, h: 200 },
    { x: 1000, y: 300, w: 400, h: 150 }
];

const target = { x: 1500, y: 400, w: 100, h: 150 };
function startGA() {
    const ga = new GA(POOL_SIZE);

    // Initialize population
    const population = ga.initPopulation( DNA_LENGTH );

    // Evaluate population

    ga.evaluate( population, obstacles, target );
    console.log(population);


    while(ga.shouldTerminate(generation, MAX_GENERATIONS) === false) {

        // Print fittest individual from population

        // Apply crossover


        // Apply mutation


        // Evaluate population


        generation += 1;
    }

    return population;

}

module.exports = { startGA };