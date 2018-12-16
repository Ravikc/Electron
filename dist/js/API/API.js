"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
class API {
    constructor() { }
    getToken(orgId) {
        const url = "https://entdev.guisystems.com/ZoomCMS/api/efile/token/getToken";
        request.post(url, {
            json: { Id: orgId }
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                return body;
            }
        });
        return "";
    }
}
exports.API = API;
