require("dotenv").config();
const express = require("express");
const app = express();
app.use(express.json());
const { connection } = require("./db");
const { notesRouter } = require("./routes/Notes.routes");
const { userRouter } = require("./routes/User.routes");
const { authenticate } = require("./middlewares/authenticate.middleware");
const cors = require("cors");
const swaggerJSdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

app.use(
  cors({
    origin: "*",
  })
);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Notes App",
      version: "1.0.0",
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSdoc(options);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.get("/", (req, res) => {
  res.send("WELCOME");
});

app.use("/users", userRouter);

app.use("/notes", authenticate, notesRouter);

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log("Can't connect to DB");
  }
  console.log(`Server running at ${process.env.PORT}`);
});
