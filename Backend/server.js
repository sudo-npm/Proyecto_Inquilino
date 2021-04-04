const app = require("./app");
const http = require("http");
const { normalizePort } = require("./utils");

/**
 * Event listener for HTTP server "error" event.
 */
function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  console.log("Server listening on " + bind);
}

// Get port from environment and store in Express.
const port = normalizePort(process.env.SERVER_PORT || "3000");
app.set("port", port);

// Create HTTP server.
const server = http.createServer(app);

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);
