const express = require("express");
const router = express.Router();

const { runGeneticAlgorithm } = require("./main");
const { getPopulationData } = require("./libs/dataHandler");


router.get("/ga/results/:id", (req, res) => {
    const populationIndex = parseInt(req.params.id);
    getPopulationData(populationIndex).then((response) => {
        res.status(200).send(response);
    });
});

router.post("/ga/generate", (req, res) => {
    return runGeneticAlgorithm(req.body).then((rsp) => {
        console.log("All done, returning response...");
        res.status(200).send(rsp);
    }).catch(err => {
        console.log(err);
        res.status(500).send("Internal error");
    });
});

module.exports = router;