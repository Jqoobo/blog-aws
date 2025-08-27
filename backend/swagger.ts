import fs from "node:fs";
import path from "node:path";
import swaggerUi from "swagger-ui-express";

const swaggerPath = path.join(__dirname, "swagger.json");
const swaggerDoc = JSON.parse(fs.readFileSync(swaggerPath, "utf-8"));

export const serveSwagger = swaggerUi.serve;
export const setupSwagger = swaggerUi.setup(swaggerDoc, { explorer: true });
