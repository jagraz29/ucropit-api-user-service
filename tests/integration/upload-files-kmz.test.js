require("dotenv").config();
import mongoose from "mongoose";
import path from "path";
import request from "supertest";
import fs from "fs";

import { connect } from "./utils/server";
import models from "../../src/models";

const User = models.User;

mongoose.connect(process.env.DATABASE_URL_TEST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

let server;
let file;
let token;

describe("File Upload KMZ or KML Test", () => {
  beforeAll(async () => {
    try {
      server = connect(3003);
      file = fs.createReadStream(
        path.join(process.cwd(), `/tests/files/Potreros_El_Desvelo.kmz`)
      );

      await User.deleteMany({})
      const user = new User({
        _id: new mongoose.Types.ObjectId().toHexString(),
        firstName: "Test",
        lastName: "Test",
        phone: "23432432",
        email: "anibalfranciscocorrea@gmail.com",
      });

      await user.save();

      token = user.generateAuthToken();
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(async (done) => {
    try {
      await server.close(done);
      await User.deleteMany({});
    } catch (error) {
      console.log(error);
    }
  });

  it("Read content KMZ file and return Array name lot's ", async () => {
    try {
      const response = await request(server)
        .post(`/v1/lots/surfaces`)
        .set("Authorization", `Bearer ${token}`)
        .attach("files", file);

      expect(response.status).toEqual(200);
      expect(response.body).toEqual(expect.any(Array));
    } catch (error) {
      console.log(error);
    }
  });
});
