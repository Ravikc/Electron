import { WebviewTag } from "electron"
import request = require("request");
import fs = require("fs");

const webView: WebviewTag = document.getElementById("webview") as WebviewTag;
const baseUrl: string = "https://global.inszoom.com/ZoomCMS/api/";
let efileFormData: EFileFieldDTO[] = [];

let e = document.getElementById("test") instanceof HTMLInputElement;
if (e === true) {
    (document.getElementById("test") as HTMLInputElement).value = "test";
}

//#region API

namespace WebApi {
    export class API {
        static getToken(orgId: string): Promise<string> {
            return new Promise<string>((resolve, reject) => {
                request.post(
                    `${baseUrl}Token/GetToken`,
                    { json: { Id: orgId } },
                    (error, response, body) => {
                        if (!error && response.statusCode === 200) {
                            resolve(body);
                        } else {
                            reject(response.statusMessage);
                        }
                    }
                )
            });
        }

        static getEFileFormData(efileFormDataDTO: EFileFormDataDTO): Promise<EFileFieldDTO[]> {
            return new Promise<EFileFieldDTO[]>((resolve, reject) => {
                const requestOptions = {
                    json: efileFormDataDTO,
                    headers: {
                        "Authorization": `Bearer ${efileFormDataDTO.jwtToken}`,
                        "OrgId": efileFormDataDTO.orgId,
                        "Content-Type": "application/json"
                    }
                };

                request.post(
                    `${baseUrl}efile/GetDtoById`,
                    requestOptions,
                    (error, response, body) => {
                        if (!error && response.statusCode === 200) {
                            resolve(body);
                        } else {
                            reject(response);
                        }
                    }
                );              
            });
        }
    }
}

//#endregion

//#region WebView event listners


webView.addEventListener("did-start-loading", () => {
    const pageLoadStatus: HTMLParagraphElement = document.getElementById("pageLoadStatus") as HTMLParagraphElement;
    pageLoadStatus.innerText = "Loading....";
});

webView.addEventListener("did-finish-load", async () => {
    const pageLoadStatus: HTMLParagraphElement = document.getElementById("pageLoadStatus") as HTMLParagraphElement;
    pageLoadStatus.innerText = webView.getURL();
   
    if (!webView.isDevToolsOpened()) webView.openDevTools();

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

});

//#endregion

//#region Helper methods

async function getEFileFormData(jwtToken: string): Promise<EFileFieldDTO[]> {
    const dto: EFileFormDataDTO = {
        name: "DS160",
        orgId: "Oindem",
        caseId: "KBABD17310-3",
        // recordKey: "OindemKBABD00205-1181216619432760",
        key: "FKBABD17310-3DS-16018725021418447",
        // loginId: "karthikeyan.mani@inszoom.com",
        formSequence: 1,
        jwtToken: jwtToken
    };


    const result: EFileFieldDTO[] = await WebApi.API.getEFileFormData(dto);
    debugger;
    return result;   
}

//#endregion

