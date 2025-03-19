"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const handler = async (_event, _context) => {
    const { body } = _event;
    console.log(body);
    console.log("Hello, Lambda 1!");
    return {
        statusCode: 200,
        body: process.env.CUSTOM_VAR,
    };
};
exports.handler = handler;
//# sourceMappingURL=index.js.map