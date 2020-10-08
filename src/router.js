const express = require("express");
const router = express.Router();
const ApiHandler = require("./libs/ApiHandler");

const { runGeneticAlgorithm } = require("./main");
const { getPopulationData } = require("./libs/dataHandler");


router.get("/ga/results/:id", (req, res) => {
    const populationIndex = parseInt(req.params.id);
    getPopulationData(populationIndex).then((response) => {
        res.status(200).send(response);
    })
    .catch(err => {
        console.log(err);
        res.status(500).send("Internal error");
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

async function foo(params) {
    console.log("FOO: ", params);
    return { success: true };
}

router.get("/ga/testhandler", ApiHandler.register(foo));

module.exports = router;