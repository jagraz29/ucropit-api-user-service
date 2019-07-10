'use strict'

const OpenTimestamps = require('javascript-opentimestamps')
const { toHexString } = require('../helpers')

class Stamp {

  /**
   * Stamp hash in opentimestampt
   * 
   * @param {string} hash 
   * @return {string} fileOts hex representation
   */
  static async stampHash(hash) {
    const buff = Buffer.from(hash, 'hex');
    const ops = new OpenTimestamps.Ops.OpSHA256()
    const detached = OpenTimestamps.DetachedTimestampFile.fromHash(ops, buff)

    await OpenTimestamps.stamp(detached);
    const fileOts = detached.serializeToBytes();

    return Promise.resolve(
      toHexString(fileOts)
    )
  }
}

module.exports = Stamp