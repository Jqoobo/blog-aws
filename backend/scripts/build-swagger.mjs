import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";
import swaggerJsdoc from "swagger-jsdoc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: { title: "MERN Blog API", version: "1.0.0" },
    servers: [{ url: "http://localhost:2527" }],
  },
  apis: [path.join(__dirname, "../routes/**/*.ts"), path.join(__dirname, "../routes/**/*.js")],
};

const spec = swaggerJsdoc(options);
const outPath = path.join(__dirname, "../swagger.json");
fs.writeFileSync(outPath, JSON.stringify(spec, null, 2));
console.log("✅ swagger.json generated at", outPath);
