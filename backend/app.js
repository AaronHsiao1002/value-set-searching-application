import express from "express";
import fs from "fs";
import csv from "csv-parser";
import {
  getValueSets,
  getValueSet,
  getValueSetsByName,
  getValueSetByMedicationName,
} from "./database.js";

const app = express();

app.use(express.static("public"));

app.get("/api/value-sets", async (req, res) => {
  const valueSets = await getValueSets();
  res.send(valueSets);
});

app.get("/api/value-sets/:id", async (req, res) => {
  const id = req.params.id;
  const valueSets = await getValueSet(id);
  res.send(valueSets);
});

app.get("/api/value-sets/name/:name", async (req, res) => {
  const name = decodeURI(req.params.name)
    .toString()
    .replace(/~~pct~~/g, "%");
  const valueSets = await getValueSetsByName(name);
  res.send(valueSets);
});

app.get("/api/value-sets/medication-name/:name", async (req, res) => {
  const name = decodeURI(req.params.name)
    .toString()
    .replace(/~~pct~~/g, "%");
  const valueSets = await getValueSetByMedicationName(name);
  res.send(valueSets);
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
