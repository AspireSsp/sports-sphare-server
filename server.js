const app = require('./app');
require("dotenv").config();
const connectDB = require('./config/DbConnection');


connectDB()
const port = process.env.PORT || 5000 ;


app.listen(port, ()=>{
    console.log(`server is running on port  ${port}`);
});




