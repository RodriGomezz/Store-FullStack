import express from "express";
import cors from "cors";
import router from "./router/router.js";
import("./config/db.js");

const app = express();
app.use(cors());
app.use(express.json());

app.use(router);

app.listen(process.env.PORT, () => {
  console.log("listen on port 3000");
});
