const { connect } = require("mongoose");

const options = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
};
const connectDB = () => {

  console.log("MongoDB URL:"+process.env.MONGO_URL);
  return connect(process.env.MONGO_URL, options);
};

module.exports = connectDB;
