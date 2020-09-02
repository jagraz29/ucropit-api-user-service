require("dotenv").config();

import mongoose from "mongoose";
import request from "supertest";
import models from "../../src/models";
import fs from "fs";
import FormData from "form-data";
import path from "path";
import { connect } from "./utils/server";

const Crop = models.Crop;
const Company = models.Company;
const Lot = models.Lot;
const User = models.User;

mongoose.connect(process.env.DATABASE_URL_TEST, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

let server;
let token;

describe("Crop Test", () => {
  beforeAll(async () => {
    try {
      server = connect(3002);
      await User.deleteMany({});
      const user = new User({
        _id: new mongoose.Types.ObjectId().toHexString(),
        firstName: "Test",
        lastName: "Test",
        phone: "23432432",
        email: "test@gmail.com",
      });

      await user.save();

      token = user.generateAuthToken();
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(async (done) => {
    try {
      await Company.deleteMany({});
      await Lot.deleteMany({});
      await Crop.deleteMany({});
      await User.deleteMany({});
      await server.close(done);
      await mongoose.connection.close();
    } catch (error) {
      console.log(error);
    }
  });

  it("Has a module Crop", () => {
    expect(Crop).toBeDefined();
  });

  it("Has a module Company", () => {
    expect(Company).toBeDefined();
  });

  it("Has a module Lot", () => {
    expect(Lot).toBeDefined();
  });

  it("Should be a create a new Crop", async () => {
    const form = new FormData();
    const data = {
      name: "Nombre del crop",
      pay: "12345",
      surface: "1232",
      dateCrop: "2020-08-25",
      dateHarvest: "2020-09-25",
      cropType: "5f43fb37edf3f712f72d9701",
      unitType: "5f43fb37edf3f712f72d96fc",
      lots: {
        names: ["Lote 2 - 55 has.", "Lote 3 - 45 has."],
        tag: "Los Yerbales",
      },
      company: {
        identifier: "20343629835",
        typePerson: "LEGAL_PERSON",
        name: "Nombre de la Empresa",
        address: "Address",
      },
    };

    try {
      const response = await request(server)
        .post(`/v1/crops`)
        .set("Authorization", `Bearer ${token}`)
        .field("data", JSON.stringify(data))
        .attach(
          "files",
          fs.createReadStream(
            path.join(process.cwd(), `/tests/files/Potreros_El_Desvelo.kmz`)
          )
        )
        .attach(
          "documents",
          fs.createReadStream(
            path.join(process.cwd(), `/tests/files/file1.pdf`)
          )
        )
        .attach(
          "documents",
          fs.createReadStream(
            path.join(process.cwd(), `/tests/files/file2.pdf`)
          )
        );

      // expect(response.body.status).toEqual("IN_PROGRESS");
      // expect(response.body.name).toEqual(data.name);
    } catch (error) {
      console.log(error);
    }
  });
});
