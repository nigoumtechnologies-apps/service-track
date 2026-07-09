/*==================================================
 MotoFlow V2
 File : frontend/js/api.js
==================================================*/

const API = {

    url: "https://script.google.com/macros/s/AKfycbysNRmwcREJqGHW3zZcq2VpaS0clwiqpSv1TJvi2XZ1L2bAz2iyd1y723QO9yVjvB1wvw/exec",

    async getTodayJobCards(){

        const res = await fetch(
            this.url + "?action=today"
        );

        return await res.json();

    },

    async updateStatus(data){

        const params = new URLSearchParams({

            action:"updateStatus",

            jobCardID:data.jobCardID,

            status:data.status,

            supervisor:data.supervisor,

            mechanic:data.mechanic,

            serviceType:data.serviceType,

            actionBy:data.actionBy

        });

        const res = await fetch(

            this.url + "?" + params.toString()

        );

        return await res.json();

    }

};