import morgan from "morgan";
import logger from "../utils/logger.js";

// Define the format: 'dev' is colorful, 'combined' is standard Apache format
const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {
    stream: {
      // Configure Morgan to use Winston's 'http' level
      write: (message) => logger.http(message.trim()),
    },
  }
);

export default morganMiddleware;
