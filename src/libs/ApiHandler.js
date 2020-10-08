const _ = require("lodash");

function ExpressContext(req, res, next) {
    this.req = req;
    this.res = res;
    this.next = next;
}

/**
 * 
 * @param {Function} procesor 
 */
function ApiHandler(procesor) {
    if (typeof procesor !== "function") {
        throw Error("Invalid argument. Processor must be a function.");
    }

    this._processor = procesor;
}

ApiHandler.factory = function(processor) {
    return new ApiHandler(processor);
}

ApiHandler.prototype.onProcess = function(express) {

}



ApiHandler.prototype.buildData = function(req) {
    return _.extend({}, req.query, req.body, req.params);
}


ApiHandler.prototype.middleware = function() {
    const onRequest = _onRequest.bind(this);
    return function(req, res, next) {
        const expressContext = new ExpressContext(req, res, next);

        const onSuccess = _onSuccess.bind(expressContext);
        onRequest(expressContext, onSuccess);
    }
}

function _onSuccess(result) {
    return this.next(null, result);
}

function _onRequest(express, onSuccess) {
    const context = { _express: express };
    const data = this.buildData(express.req);
    return this._processor.call(context, data).then(onSuccess);
} 

ApiHandler.register = function(procesor) {
    const handler = ApiHandler.factory(procesor);
    return handler.middleware();
}

module.exports = ApiHandler;