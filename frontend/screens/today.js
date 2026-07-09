/*==================================================
 MotoFlow V2.1
 File : frontend/screens/today.js
==================================================*/

const Today = {

    jobs: [],

    async render() {

        let html = `

        <div class="actionButtons">

            <button class="actionButton" onclick="Today.newJobCard()">
                + New Job Card
            </button>

            <button class="actionButton" onclick="Today.bulkUpload()">
                Bulk Upload
            </button>

        </div>

        `;

        try {

            const response = await API.getTodayJobCards();

            if (!response.success) {

                html += `
                <div class="reportCard">

                    Unable to load Job Cards

                </div>
                `;

                document.getElementById("screen").innerHTML = html;
                return;

            }

            this.jobs = response.data;

            if (this.jobs.length === 0) {

                html += `
                <div class="reportCard">

                    No Job Cards Found

                </div>
                `;

            } else {

                this.jobs.forEach(job => {

                    html += JobCard.create(job);

                });

            }

        } catch (err) {

            html += `
            <div class="reportCard">

                <b>API Connection Failed</b>

                <br><br>

                ${err.message}

            </div>
            `;

        }

        html += `

        <div class="fab" onclick="Today.newJobCard()">

            <span class="material-symbols-outlined">

                add

            </span>

        </div>

        `;

        document.getElementById("screen").innerHTML = html;

    },

    refresh(){

        this.render();

    },

    findJob(jobCardID){

        return this.jobs.find(j => j.jobCardID === jobCardID);

    },

   newJobCard(){

    NewJobCard.render();

    },

    bulkUpload(){

        alert("STEP-046 : Bulk Upload Screen");

    }

};