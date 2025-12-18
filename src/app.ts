import express from "express";
import route from "./routes/index.js";
import helmet from "helmet";
// import morgan from 'morgan';

const app = express();

app.use(helmet());

// app.use(morgan('dev'));
app.use(express.json());
app.use("/api/v1", route);

export default app;
