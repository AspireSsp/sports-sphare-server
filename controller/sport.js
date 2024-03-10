const Sport = require("../models/sports");

exports.addSports = async (req, res) => {
  try {
    const { name } = req.body;
    const sportExist = await Sport.findOne({ name: name });
    if (sportExist) {
      return res.status(422).json({ message: "sport is available" });
    }
    const sport = new Sport({
      name,
    });
    const newSport = await sport.save();
    res.status(200).json({ success: true, message: "success", newSport });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSportDropdown = async (req, res) => {
  try {
    const sports = await Sport.find({}, { _id: 1, name: 1 });
    console.log(sports);
    res.status(200).json({ success: true, sports });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
