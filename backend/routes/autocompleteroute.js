// routes/autocomplete.js
import express from "express";
import { getSuggestions } from "../services/autocompleteServices.js";

const router = express.Router();

// GET /api/autocomplete?prefix=some+text&k=5
router.get("/", (req, res) => {
  const prefix = req.query.prefix || "";
  const k = Math.min(parseInt(req.query.k) || 10, 50);
  if (!prefix.trim()) return res.json([]);
  const suggestions = getSuggestions(prefix, k);
  res.json(suggestions);
});

export default router;
