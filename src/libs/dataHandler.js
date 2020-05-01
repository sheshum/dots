const fs = require("fs");
const path = require("path");

const filepath = path.join(__dirname, "../../data", "data.json");
function _saveData(generation, firstGen = false) {
    if (firstGen) {
        const data = [generation];
        fs.writeFileSync(filepath, JSON.stringify(data));
        return;
    }

    const buff = fs.readFileSync(filepath);
    const data = JSON.parse(buff);
    data.push(generation);

    fs.writeFileSync(filepath, JSON.stringify(data));
}

function clearData() {
    if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        console.log(`File: ${filepath} removed.`);
    }
    return;
}

function savePopulationData(population, generation) {
    const firstGen = (generation === 1);

    const matingPool = population.getIndividuals();

    const populationData = [];
    matingPool.forEach(dot => {
        const moves = dot.getMoves();
        populationData.push(moves);
    });

    _saveData(populationData, firstGen);
}

async function getResults() {
    const buff = fs.readFileSync(filepath);
    const data = JSON.parse(buff);
    return data;
}

module.exports = { savePopulationData, clearData, getResults };