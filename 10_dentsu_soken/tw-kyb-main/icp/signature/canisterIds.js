const path = require("path");
const fs = require("fs");

function exportEnv(prefix) {
  try {
    localCanisters = require(path.join(
      __dirname,
      ".dfx",
      "local",
      "canister_ids.json"
    ));
  } catch (error) {
    console.log("No local canister_ids.json found. Continuing production");
  }
  try {
    prodCanisters = require(path.join(__dirname, "canister_ids.json"));
  } catch (error) {
    console.log("No production canister_ids.json found. Continuing with local");
  }

  const network =
    process.env.DFX_NETWORK ||
    (process.env.NODE_ENV === "production" ? "ic" : "local");
  process.env[`${prefix}DFX_NETWORK`] = network;

  console.info(`canisterIds: network=${network}`);
  console.info(`canisterIds: DFX_NETWORK=${process.env.DFX_NETWORK}`);

  canisters = network === "local" ? localCanisters : prodCanisters;

  for (const canister in canisters) {
    let key = `${prefix}${canister.toUpperCase()}_CANISTER_ID`;
    let value = canisters[canister][network];
    process.env[key] = value;
    console.log(`process.env[${key}] = ${value}`);
  }
}

module.exports = {
  exportEnv
}