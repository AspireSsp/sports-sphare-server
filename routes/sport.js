const express = require("express");
const { getSportDropdown, addSports } = require("../controller/sport");

const router = express.Router();

router.route("/dropdown").get(getSportDropdown);
router.route("/addSport").post(addSports);

module.exports = router; 
