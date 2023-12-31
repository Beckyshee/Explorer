import express, { json } from "express";
import cors from "cors";

import { Express } from "express";
import dotenv from "dotenv";
import { testConnection } from "./configs/sqlConfig";


dotenv.config();
const port = process.env.PORT || 5200;
const app = express();
app.use(json());
app.use(cors());

app.use("/user", );
app.use("/tour", );
app.use("/bookimg", );

app.listen(port, () => {
  console.log(`Talky running on port ${port}`);

  testConnection();
});
