const mongoose = require("mongoose");

const sportSchema = new mongoose.Schema({
  name: {
    type:String
  },
});
const Sport = mongoose.model('sport',sportSchema);
module.exports=Sport;