require("dotenv").config();
import path from "path";
import request from "supertest";
import fs from "fs";

import { connect } from "./utils/server";

let server;
let file;

describe("File Upload KMZ or KML Test", () => {
  beforeAll(async () => {
    try {
      server = connect(3003);
      file = fs.createReadStream(
        path.join(process.cwd(), `/tests/files/Potreros_El_Desvelo.kmz`)
      );
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(async (done) => {
    try {
      await server.close(done);
    } catch (error) {
      console.log(error);
    }
  });

  it("Read content KMZ file and return Array name lot's ", async () => {
    try {
      const response = await request(server)
        .post(`/v1/lots/surfaces`)
        .attach("files", file);

        expect(response.status).toEqual(200)
        expect(response.body).toEqual(expect.any(Array))
    } catch (error) {
      console.log(error);
    }
  });
});
