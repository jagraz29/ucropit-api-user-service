require("dotenv").config()
import test from "ava";
import request from "supertest";

const Provider = require("../src/models").providers;

const app = request(`${process.env.BASE_URL}/v1`);

const provider = {
  name: "Una razon social",
  status: "Sugerido",
  phone: "23232",
  cellphone: "32323",
  email: "email@email.com",
  address: "Una direccion de prueba",
  city: "Una ciudad",
  estate: "Un estado",
  country: "Un Pais",
  postal_code: "322",
  taxid: "232323233",
  cbu: "23232323232323",
  workplace: "Oficina"
};

const providerUpdate = {
  name: "Una razon social update",
  status: "Sugerido",
  phone: "23232",
  cellphone: "32323",
  email: "email4@email.com",
  address: "Una direccion de prueba",
  city: "Una ciudad",
  estate: "Un estado",
  country: "Un Pais",
  postal_code: "322",
  taxid: "232323233",
  cbu: "23232323232323",
  workplace: "Oficina"
};

const providerDelete = {
  name: "Una razon social deleted",
  status: "Sugerido",
  phone: "23232",
  cellphone: "32323",
  email: "email1@email.com",
  address: "Una direccion de prueba",
  city: "Una ciudad",
  estate: "Un estado",
  country: "Un Pais",
  postal_code: "322",
  taxid: "232323233",
  cbu: "23232323232323",
  workplace: "Oficina"
};

let idDelete = null;
let idUpdate = null;

/**
 * Se crea los presents para los test.
 */
test.before("presets", async t => {
  const providerDeleteObj = await Provider.create(providerDelete);
  const providerUpdateObj = await Provider.create(providerUpdate);
  idDelete = providerDeleteObj.get("id");
  idUpdate = providerUpdateObj.get("id");
});

/**
 * Se limpia las pruebas creadas en la BD.
 */
test.after("cleanup", async t => {
  const provider = await Provider.findOne({
    where: { name: "Una razon social" }
  });
  const providerUpdated = await Provider.findOne({ where: { id: idUpdate } });
  await provider.destroy();
  await providerUpdated.destroy();
});

test.serial.cb("It should be a create one provider", t => {
  app
    .post(`/api/providers`)
    .send(provider)
    .set("accept", "json")
    .expect(201)
    .end((err, res) => {
      t.falsy(err, "should not return an error");
      const bodyObj = JSON.parse(JSON.stringify(res.body));
      const providerResponse = bodyObj.provider;
      t.falsy(bodyObj.error, "should not return true");
      t.deepEqual(bodyObj.code, 201);
      t.deepEqual(bodyObj.provider, providerResponse);
      t.end();
    });
});

test.serial.cb("It should get a one provider when exist provider", t => {
  app
    .get(`/api/providers/${1}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .end((err, res) => {
      t.falsy(err, "should not return an error");
      let body = JSON.stringify(res.body);
      const bodyObj = JSON.parse(body);
      const provider = bodyObj.provider;
      t.falsy(bodyObj.error, "should not return true");
      t.deepEqual(bodyObj.provider, provider);
      t.end();
    });
});

test.serial.cb("It should get an error 404 when send id not exist", t => {
  app
    .get(`/api/providers/${100}`)
    .expect(404)
    .expect("Content-Type", /json/)
    .end((err, res) => {
      const bodyObj = JSON.parse(JSON.stringify(res.body));
      t.falsy(err, "Should not return an error");
      t.truthy(bodyObj.error, "Should be true because have error true");
      t.deepEqual(bodyObj.code, 404);
      t.deepEqual(bodyObj.message, "El recurso no existe");
      t.end();
    });
});

test.serial.cb("It should update a provider", t => {
  app
    .put(`/api/providers/${idUpdate}`)
    .send({ status: "Completo", name: "Nombre test" })
    .set("accept", "json")
    .expect(200)
    .end((err, res) => {
      const bodyObj = JSON.parse(JSON.stringify(res.body));
      t.falsy(err, "Should not return an error");
      t.falsy(bodyObj.error, "Should not return an error");
      t.deepEqual(bodyObj.code, 200);
      t.deepEqual(bodyObj.provider.name, "Nombre test");
      t.deepEqual(bodyObj.provider.status, "Completo");
      t.end();
    });
});

test.serial.cb("It should delete a provider when to send id", t => {
  app
    .delete(`/api/providers/${idDelete}`)
    .expect(200)
    .expect("Content-Type", /json/)
    .end((err, res) => {
      const bodyObj = JSON.parse(JSON.stringify(res.body));
      const providerDelete = bodyObj.provider;
      t.falsy(err, "Should not return an error");
      t.falsy(bodyObj.error, "Should not return an error");
      t.deepEqual(bodyObj.code, 200);
      t.deepEqual(bodyObj.provider, providerDelete);
      t.end();
    });
});
