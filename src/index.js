const express = require("express");
const helmet = require("helmet");
const compression = require("compression");
const log = require("./data/log");
const swagger = require("./middleware/swagger");
const cors = require("./middleware/cors");
const logMiddleware = require("./middleware/log");
const errors = require("./middleware/errors");
const config = require("./config");
const routes = require("./routes");

const start = async () => {
  try {
    const swaggerMiddleware = await swagger;
    const app = express();

    app.use(logMiddleware.logger());
    app.use(helmet());
    app.use(cors.simple());
    app.use(compression());
    app.use(swaggerMiddleware.swaggerMetadata());
    app.use(swaggerMiddleware.swaggerValidator());
    routes.forEach(registerRoute => registerRoute(app));
    app.use(logMiddleware.errorLogger());
    app.use(errors.handleErrors());

    app.listen(config.server.port, () => {
      log.info(`Listening on http://localhost:${config.server.port}`);
    });
  } catch (error) {
    log.error(`Initialization error: ${error}`);
  }
};

start();
