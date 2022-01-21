require("dotenv").config();
const User = require("./models/User");
const connectToDB = require("./db");
const Todo = require("./models/Todo");
connectToDB(process.env.MONGO_URI);

const deleteAll = async () => {
  try {
    console.log("Delete all users");
    await User.deleteMany({});
    await Todo.deleteMany({})
  } catch (e) {
    console.log(e);
  }
};

deleteAll();
