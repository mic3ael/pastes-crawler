'use strict';

class ServerError extends Error {
  constructor(msg = 'Server Error', status) {
    super(msg);
    this.status = status;
  }
  get status() {
    return this._status;
  }
  set status(code) {
    this._status = code;
  }
}

exports.ServerError = ServerError;
