import app from "./app.js";
import env from "./config/env.js";

const server = app.listen(env.port, () => {
  console.log(`Server is running on port ${env.port}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${env.port} is already in use`);
  } else {
    console.error("Server failed to start:", error);
  }

  process.exit(1);
});

export default server;
