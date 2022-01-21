require("dotenv").config();
const express = require("express");
const cors = require('cors')
const connectToDB = require("./db");

//error handlers
const errorHandler = require("./errorHandlers/errorHandler");
const notFoundHandler = require("./errorHandlers/notFoundHandler");
const auth = require("./middleware/auth");

// import routers
const authRouter = require('./routes/authRoutes')
const todoRouter = require('./routes/todoRouter')

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json())


// cors middleware
app.use(cors())
// app.use((req, res, next) => {
//   res.setHeader('Acces-Control-Allow-Origin', '*')
//   res.setHeader('Acces-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
//   res.setHeader('Acces-Control-Allow-Methods', 'POST, GET, DELETE, PATCH')
//   next()
// })

app.use('/api/auth', authRouter)
app.use('/api/todo', auth, todoRouter)

app.use(notFoundHandler);
app.use(errorHandler);

const start = async () => {
  try {
    await connectToDB(process.env.MONGO_URI);
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (e) {
      console.log("Connection error.")
      console.log(e.message)
  }
};
start();
