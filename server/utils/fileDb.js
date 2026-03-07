const fs = require("fs/promises");
const path = require("path");

async function readJson(relativePath) {
  const filePath = path.join(__dirname, "..", relativePath);
  const fileContents = await fs.readFile(filePath, "utf-8");
  return JSON.parse(fileContents);
}

async function writeJson(relativePath, data) {
  const filePath = path.join(__dirname, "..", relativePath);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = {
  readJson,
  writeJson,
};