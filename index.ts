import bodyParser from "body-parser";
import routes from "./app/routes";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import swaggerDocument from "./swagger.json";
import swaggerUi from "swagger-ui-express";
import { errorHandler } from "./app/common/helper/catch-error.helper";
import express from "express";

dotenv.config()

const app = express();
const PORT = process.env.PORT || 8000;

app.use(bodyParser.json());
app.use(cookieParser())
app.use(bodyParser.urlencoded({ extended: true }));

// Register the general error handler after all routes
app.use(errorHandler);

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/api", routes)

app.listen(PORT, () => { console.log(`Server PORT running on http://localhost:${PORT}`) }) 