import express from "express";
import authRouter from "./src/routes/auth";
import postRouter from "./src/routes/notes";
// const authRouter = require("./src/routes/auth");
import cors from "cors";
import { Authorize } from "./src/middlewares/auth.middleware";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/auth", authRouter);
app.use("/post", Authorize, postRouter);

app.use(express.urlencoded({ extended: false }));

app.get("/", (_req, res) => {
  res.json({
    status: "OK",
  });
});
app.listen(PORT, () =>
  console.log(`Server is started on http://localhost:${PORT}`)
);
