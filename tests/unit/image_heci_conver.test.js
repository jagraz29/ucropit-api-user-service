require("dotenv").config();
import path from "path";
const { promisify } = require('util');
const fs = require('fs');
const convert = require('heic-convert');
describe("Convert Image", () => {
  it("Should Convert image heic to jpg", async() => {
    try {
      const inputBuffer = await promisify(fs.readFile)(path.join(process.cwd(), `/tests/files/image.heic`));
      const outputBuffer = await convert({
        buffer: inputBuffer,
        format: 'JPEG',
        quality: 1
      });
      await promisify(fs.writeFile)('./result.jpg', outputBuffer);
    } catch (error) {
      console.log(error);
    }
  }, 30000);
});
