import express from "express";
import { recommend } from "../controller/recommendation.js";
const recommendRouter=express.Router();

recommendRouter.post("/hotel",recommend);

export default recommendRouter;
