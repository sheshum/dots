const fs = require("fs");
const path = require("path");
const BSON = require("bson");

const filepathBSON = path.join(__dirname, "../../data", "data.bson");

/**
 * Deletes .bson file
 */
function clearData() {
    if (fs.existsSync(filepathBSON)) {
        fs.unlinkSync(filepathBSON);
        console.log(`File: ${filepathBSON} removed.`);
    }
    return;
}

function saveSerializedData(data) {
    const dataSerialized = BSON.serialize(data);
    fs.writeFileSync(filepathBSON, dataSerialized);
    return;
}

/**
 * Returns a specific generation
 * @param {number} populationIndex 
 */
async function getPopulationData(populationIndex) {
    const buff = fs.readFileSync(filepathBSON);
    const data = BSON.deserialize(buff);
    return { data: data[populationIndex], total: data.length };
}

module.exports = { clearData, getPopulationData, saveSerializedData };