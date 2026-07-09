const API = {

    WEBAPP: "https://script.google.com/macros/s/AKfycbysNRmwcREJqGHW3zZcq2VpaS0clwiqpSv1TJvi2XZ1L2bAz2iyd1y723QO9yVjvB1wvw/exec",

    async get(action) {

        const response = await fetch(
            this.WEBAPP + "?action=" + action
        );

        return await response.json();

    },

    async getTodayJobCards() {

        return await this.get("today");

    }

};