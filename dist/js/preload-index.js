"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.ipcRenderer.on("start-efile", (event, data) => {
    console.log(`Received Data: ${JSON.stringify(data)}`);
    data.forEach(d => {
        const correspondingField = document.getElementById(d.control_id);
        if (correspondingField instanceof HTMLInputElement) {
            correspondingField.value = d.Value;
        }
        else if (correspondingField instanceof HTMLSelectElement) {
            correspondingField.value = d.Value;
        }
    });
});
