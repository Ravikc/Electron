import request = require("request");

const baseUrl: string = "https://global.inszoom.com/ZoomCMS/api/";

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

async function getToken(orgId: string): Promise<string> {
    const jwtToken: string = await WebApi.API.getToken("Oindem");
    return jwtToken;
}

async function onTokenGetSuccess(jwtToken: string) {
    alert("token success");
    const efileFormData: EFileFieldDTO[] = await getEFileFormData(jwtToken);
    StartEFile(efileFormData);
}

function onTokenGetFailure(value: any) {
    alert("token failed");
}

function StartEFile(efileFormData: EFileFieldDTO[]): void {
    alert("efile started");
    const currentPageUrl: string = document.URL;
    const fields: EFileFieldDTO[] = efileFormData.filter(field => field.page_url === currentPageUrl);
    fields.forEach(field => {
        console.log(`control_id: ${field.control_id}`);
        const correspondingElement = document.getElementById(field.control_id);
        if (correspondingElement != null && correspondingElement instanceof HTMLInputElement) {
            correspondingElement.value = field.Value;
        }
    });
}

//#endregion

WebApi.API.getToken("Oindem").then(onTokenGetSuccess, onTokenGetFailure);

console.log("Hellow world from injected code");

