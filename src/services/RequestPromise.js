"use strict";

const requestPromise = require("request-promise-native");

class RequestPromise {
  constructor(path, method, data = {}, headers = {}) {
    this.path = path;
    this.method = method;
    this.data = data;
    this.headers = headers;
  }

  async send() {
    const result = await requestPromise(this.buildOption());
    return result;
  }

  buildOption() {
    if (this.method === "GET") {
      return {
        method: this.method,
        url: this.path
      };
    }

    return {
        method: this.method,
        body: this.data,
        url: this.path,
        headers: this.headers
    };
  }
}

module.exports = RequestPromise;
