import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import { logger } from "./src/utils/logger.js";
import auth from "./src/modules/auth/route.js";
import {
  globalErrorHandler,
  routeNotFoundHandler,
} from "./src/middlewares/error.js";
import { respond } from "./src/utils/respond.js";
import { ConnectToDatabase } from "./src/utils/database.js";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import path from "path";
import { fileURLToPath } from 'url';

const app = express();
const port = process.env.PORT || 7000;

ConnectToDatabase();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  cors({ methods: ["POST", "PUT", "DELETE", "GET", "PATCH"], origin: "*" })
);

app.use(helmet());

app.get("/", (req, res) => {
  return respond(res, 200, "Ecommerce API is running..");
});

app.use("/v1/auth", auth);

// Set up __dirname for ES6 modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load Swagger YAML
const swaggerDocument = YAML.load(path.join(__dirname, "src/docs/api.yaml"));

// Swagger docs
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(routeNotFoundHandler);
app.use(globalErrorHandler);

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
