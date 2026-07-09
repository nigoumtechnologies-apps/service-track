/*==================================================
 MotoFlow V2.0
 File : frontend/screens/today.js
==================================================*/

const Today = {

    async render() {

        let html = `
        <div class="actionButtons">

            <button class="actionButton">
                + New Job Card
            </button>

            <button class="actionButton">
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

            const jobs = response.data;

            if (jobs.length === 0) {

                html += `
                <div class="reportCard">
                    No Job Cards Found
                </div>
                `;

            } else {

                jobs.forEach(job => {

                    html += JobCard.create(job);

                });

            }

        } catch (err) {

            html += `
            <div class="reportCard">

                API Connection Failed

                <br><br>

                ${err.message}

            </div>
            `;

        }

        html += `

        <div class="fab">

            <span class="material-symbols-outlined">

                add

            </span>

        </div>

        `;

        document.getElementById("screen").innerHTML = html;

    }

};