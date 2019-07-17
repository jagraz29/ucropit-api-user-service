require("dotenv").config()
import test from "ava"
import request from "supertest"

const cropId = 6

const app = request(`${process.env.BASE_URL}/v1`);

test.serial.cb('it will generate production stage', t => {
  app
    .get(`/api/productions/${cropId}`)
    .set('accept', 'json')
    .expect(200)
    .end((err, res) => {
      t.falsy(err, 'should not return an error')
      const bodyObj = JSON.parse(JSON.stringify(res.body))
      const providerResponse = bodyObj.provider
      t.falsy(bodyObj.error, 'should not return true')
      t.deepEqual(bodyObj.code, 200)
      t.deepEqual(bodyObj.provider, providerResponse)
      t.end()
    })
})