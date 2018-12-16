import request = require("request");


export class API {

	constructor() { }

	getToken(orgId: string): string {
		const url: string = "https://entdev.guisystems.com/ZoomCMS/api/efile/token/getToken";
		request.post(
			url,
			{
				json: { Id: orgId }
			},
			(error, response, body) => {
				if (!error && response.statusCode == 200) {
					return body;
				}
			}
		);

		return "";
	}
}
