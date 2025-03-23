export default class Alert {
    constructor() {
        this.path = "../json/alerts.json";
    }
    async getAlertData() {
        try {
            const res = await fetch(this.path);
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return await res.json();
        } catch (error) {
            // console.error("Error fetching alert data:", error);
            return null; // Return null on failure
        }
    }
    async createAlert() {
        const main = document.querySelector("main");
        const data = await this.getAlertData();
        if (!data || data.length === 0) {
            // console.log("json file is empty");
        } else {
            const alertSection = document.createElement("section");
            alertSection.classList.add("alert-list");
            data.forEach(alert => {
                let newAlert = document.createElement("p")
                newAlert.textContent = alert.message
                alertSection.appendChild(newAlert);
            })
            // Add styles to the alert safely based on the data in the json
            alertSection.style.backgroundColor = data.background;
            alertSection.style.border = data.border;
            alertSection.style.color = data.color;
            main.appendChild(alertSection);
        }
    }
}