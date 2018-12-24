"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
function startEFile(efileFormData) {
    alert("efile started");
    efileFormData.forEach(field => {
        console.log(`control_id: ${field.control_id}`);
        const correspondingElement = document.getElementById(field.control_id);
        if (correspondingElement != null && correspondingElement instanceof HTMLInputElement) {
            correspondingElement.value = field.Value;
        }
    });
}
electron_1.ipcRenderer.on("start-efile", (data) => {
    startEFile(data);
});
