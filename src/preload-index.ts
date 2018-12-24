import { ipcRenderer } from "electron"

ipcRenderer.on("start-efile", (data: EFileFieldDTO[]) => {
    data.forEach(d => {
        const correspondingField = document.getElementById(d.control_id);
        if (correspondingField instanceof HTMLInputElement) {
            (correspondingField as HTMLInputElement).value = d.Value;
        } else if (correspondingField instanceof HTMLSelectElement) {
            (correspondingField as HTMLSelectElement).value = d.Value;
        }
    });
});