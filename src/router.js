const express = require("express");
const router = express.Router();

const { startGA } = require("./main");

router.get("/ga/results", (_req, res) => {
    const p = startGA();
    res.status(200).send(p);
});


module.exports = router;