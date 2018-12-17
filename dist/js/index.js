"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request");
const fs = require("fs");
const webView = document.getElementById("webview");
const baseUrl = "https://global.inszoom.com/ZoomCMS/api/";
let efileFormData = [];
let e = document.getElementById("test") instanceof HTMLInputElement;
if (e === true) {
    document.getElementById("test").value = "test";
}
//#region API
var WebApi;
(function (WebApi) {
    class API {
        static getToken(orgId) {
            return new Promise((resolve, reject) => {
                request.post(`${baseUrl}Token/GetToken`, { json: { Id: orgId } }, (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        resolve(body);
                    }
                    else {
                        reject(response.statusMessage);
                    }
                });
            });
        }
        static getEFileFormData(efileFormDataDTO) {
            return new Promise((resolve, reject) => {
                const requestOptions = {
                    json: efileFormDataDTO,
                    headers: {
                        "Authorization": `Bearer ${efileFormDataDTO.jwtToken}`,
                        "OrgId": efileFormDataDTO.orgId,
                        "Content-Type": "application/json"
                    }
                };
                request.post(`${baseUrl}efile/GetDtoById`, requestOptions, (error, response, body) => {
                    if (!error && response.statusCode === 200) {
                        resolve(body);
                    }
                    else {
                        reject(response);
                    }
                });
            });
        }
    }
    WebApi.API = API;
})(WebApi || (WebApi = {}));
//#endregion
//#region WebView event listners
webView.addEventListener("did-start-loading", () => {
    const pageLoadStatus = document.getElementById("pageLoadStatus");
    pageLoadStatus.innerText = "Loading....";
});
webView.addEventListener("did-finish-load", () => __awaiter(this, void 0, void 0, function* () {
    const pageLoadStatus = document.getElementById("pageLoadStatus");
    pageLoadStatus.innerText = webView.getURL();
    if (!webView.isDevToolsOpened())
        webView.openDevTools();
    // const jwtToken: string = await WebApi.API.getToken("Oindem");
    // if (jwtToken !== null) {
    //     pageLoadStatus.innerText = jwtToken;
    //     try {
    //         efileFormData = await getEFileFormData(jwtToken);
    //     } catch (e) {
    //         console.log(e)
    //     }
    // }
    fs.readFile("dist/js/injected-code.js", "utf-8", (error, data) => {
        webView.executeJavaScript(data);
    });
}));
//#endregion
//#region Helper methods
function getEFileFormData(jwtToken) {
    return __awaiter(this, void 0, void 0, function* () {
        const dto = {
            name: "DS160",
            orgId: "Oindem",
            caseId: "KBABD17310-3",
            // recordKey: "OindemKBABD00205-1181216619432760",
            key: "FKBABD17310-3DS-16018725021418447",
            // loginId: "karthikeyan.mani@inszoom.com",
            formSequence: 1,
            jwtToken: jwtToken
        };
        const result = yield WebApi.API.getEFileFormData(dto);
        debugger;
        return result;
    });
}
//#endregion
