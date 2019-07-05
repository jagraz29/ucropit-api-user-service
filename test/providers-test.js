import test from 'ava';
import request from 'supertest';

const app = request("http://localhost:3001/v1")

test.serial.cb('It should get a one provider when exist provider', t => {
    app.get(`/api/providers/${2}`)
    .expect(200)
    .expect('Content-Type', /json/)
    .end((err, res) => {
        t.falsy(err, 'should not return an error')
        let body = JSON.stringify(res.body)
        const bodyObj = JSON.parse(body);
        const provider = bodyObj.provider;
        t.falsy(bodyObj.error, 'should not return true');
        t.deepEqual(bodyObj.provider, provider);
        t.end();
    })
});


