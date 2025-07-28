import express from "express";
import { addToLikedMovies, getLikedMovies, removeFromLikedMovies } from "../controllers/user.controller.js";

const router= express.Router();

router.post("/add", addToLikedMovies);
router.get("/liked/:email", getLikedMovies)
router.put("/delete",removeFromLikedMovies)
export default router;