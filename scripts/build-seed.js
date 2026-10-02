const { execSync } = require("node:child_process");

if (process.env.XROVIA_SEED_TEST_DATA === "true") {
  execSync("npm run db:seed", { stdio: "inherit" });
}
