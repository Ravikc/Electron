import { WebviewTag } from "electron"
import request = require("request");
import fs = require("fs");
import { resolve } from "path";

const webView: WebviewTag = document.getElementById("webview") as WebviewTag;
const baseUrl: string = "https://global.inszoom.com/ZoomCMS/api/";
let efileFormData: EFileFieldDTO[] = [];

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

webView.addEventListener("dom-ready", () => {
    if (!webView.isDevToolsOpened()) {
        webView.openDevTools();
    }
    
    console.log("webview dom ready");

    const pageLoadStatus: HTMLParagraphElement = document.getElementById("pageLoadStatus") as HTMLParagraphElement;
    pageLoadStatus.innerText = webView.getURL();

    if (efileFormData != null && efileFormData.length > 0) {
        const efileDataForThisPage = efileFormData.filter(d => d.Page_URL === webView.getURL());
        debugger;
        console.log(`sending start-efile message with data: ${efileDataForThisPage}`);
        webView.send("start-efile", efileDataForThisPage);
    }
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
    return result;
}

async function loadEFileData(): Promise<EFileFieldDTO[]> {
    return new Promise<EFileFieldDTO[]>(async (resolve, reject) => {
        const jwtToken: string = await WebApi.API.getToken("Oindem");
        if (jwtToken !== null) {
            try {
                const efileFormDTO = await getEFileFormData(jwtToken);
                resolve(efileFormDTO);
            }
            catch (e) {
                console.log(e);
                reject(e);
            }
        }
    });
}

//#endregion

//#region Events for this page

document.addEventListener("DOMContentLoaded", async () => {
    efileFormData = await loadEFileData();
    console.log("EFile Data Loaded");
})

//#endregion