import express from "express";
import morgan from "morgan";

export const app = express()

const middlewares = [morgan(':method :url :status :res[content-length] - :response-time ms')]

app.use(...middlewares)
