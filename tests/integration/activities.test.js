require("dotenv").config();

import mongoose from "mongoose";
import request from "supertest";
import models from "../../src/models";
import fs from "fs";
import path from "path";
import { connect } from "./utils/server";

const User = models.User;
const Activity = models.Activity;
const DocumentFile = models.FileDocument;

mongoose.connect(process.env.DATABASE_URL_TEST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

let server;
let token;

describe("Activity Test", () => {
  beforeAll(async () => {
    try {
      server = connect(3004);
      await User.deleteMany({});
      const user = new User({
        _id: new mongoose.Types.ObjectId().toHexString(),
        firstName: "Test",
        lastName: "Test",
        phone: "23432432",
        email: "test1@gmail.com",
      });

      await user.save();

      token = user.generateAuthToken();
    } catch (error) {
      console.log(error);
    }
  });

  beforeEach(async () => {
    try {
      await User.deleteMany({});
      const user = new User({
        _id: new mongoose.Types.ObjectId().toHexString(),
        firstName: "Test",
        lastName: "Test",
        phone: "23432432",
        email: "test1@gmail.com",
      });

      await user.save();

      token = user.generateAuthToken();
    } catch (error) {
      console.log(error);
    }
  })

  afterAll(async (done) => {
    try {
      await Activity.deleteMany({});
      await User.deleteMany({});
      await DocumentFile.deleteMany({});
      await server.close(done);
      await mongoose.connection.close();
    } catch (error) {
      console.log(error);
    }
  });

  it("Has a module Activity", () => {
    expect(Activity).toBeDefined();
  });

  it("Has a module Activity", () => {
    expect(DocumentFile).toBeDefined();
  });

  it("Should be a create a new Activity Agreement", async () => {
    const data = {
      name: "Un nombre de actividad",
      dateStart: "2020-08-25",
      dateEnd: "2020-09-25",
      surface: "2321",
      type: "5f564279fbef5726dc35305f",
      crop: "5f564279fbef5726dc35305d",
      lots: ["5f564279fbef5726dc353060"],
      evidence: [
        {
          name: "Nombre de la evidencia",
          description: "Descripcion de la evidencia",
          date: "2020-09-25"
        }
      ]
    };

    try {
      const response = await request(server)
        .post(`/v1/activities`)
        .set("Authorization", `Bearer ${token}`)
        .field("data", JSON.stringify(data))
        .attach(
          "documents",
          fs.createReadStream(
            path.join(process.cwd(), `/tests/files/file1.pdf`)
          )
        )
      
      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual("PLANNED");
    } catch (error) {
      console.log(error);
    }
  });
});
