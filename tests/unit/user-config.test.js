require("dotenv").config();
import mongoose from 'mongoose'
import models, { connectDb } from '../../src/models'

import  UserConfigService from "../../src/services/UserConfigService"

const UserConfig = models.UserConfig;

describe("Config User Test", () => {
  beforeAll(async () => {
    try {
      await connectDb();
      await UserConfig.deleteMany({});
    } catch (error) {
      console.log(error);
    }
  });

  afterAll(async (done) => {
    try {
      await UserConfig.deleteMany({})
    } catch (error) {
      console.log(error)
    }
  });

  it("Has a module UserConfig", () => {
    expect(UserConfig).toBeDefined()
  })

  it("Should be a create a new UserConfig with a UserConfigService", async () => {
    const config = {}

    const configUser = await UserConfigService.create(config)

    expect(configUser.fromInvitation).toEqual(false)
    expect(configUser.hasPin).toEqual(false)
  });

  it("Should be a update UserConfig with a UserConfigService", async () => {
    const config = {
      hasPin: true,
      fromInvitation: true,
      user: new mongoose.Types.ObjectId().toHexString(),
    }

    await UserConfigService.update(config)

    const configUser = await UserConfig.findOne({user: config.user})

    expect(configUser.hasPin).toEqual(config.hasPin)
    expect(configUser.fromInvitation).toEqual(config.fromInvitation)
  })
});
