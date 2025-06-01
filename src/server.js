const dotenv = require("dotenv");
const app = require("./app");

dotenv.config();

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
  console.log(
    `Server is running in ${
      process.env.NODE_ENV || "developement"
    } mode on port ${PORT}`
  );
});

process.on("unhandledRejection", (err) => {
  console.log(`UNHANDLED REJECTION! 💥 Shutting down...`);
  console.error(err);
  console.log(err.name, err.message);

  // Close the server and exit the process
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});
