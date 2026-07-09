const JobCard = {

    create(job){

        const typeClass = {

            "FSC":"fsc",

            "Paid Service":"paid",

            "General Repair":"repair"

        }[job.serviceType] || "";

        return `

<div class="jobCard ${typeClass}">

    <div class="jobTop">

        <div class="jobLeft">

            <div class="jobRow">

                <div>

                    <div class="label">JC No</div>
                    <div class="value">${job.jobCardNo}</div>

                </div>

                <div>

                    <div class="label">Regn No</div>
                    <div class="value">${job.regNo}</div>

                </div>

                <div>

                    <div class="label">Model</div>
                    <div class="value">${job.model}</div>

                </div>

            </div>

            <div class="jobRow">

                <div>

                    <div class="label">Service</div>
                    <div class="value">${job.serviceType}</div>

                </div>

                <div>

                    <div class="label">Supervisor</div>
                    <div class="value">${job.supervisor}</div>

                </div>

                <div>

                    <div class="label">Mechanic</div>
                    <div class="value">${job.mechanic}</div>

                </div>

            </div>

        </div>

        <div class="jobRight">

            <div class="statusList">

                <button class="statusButton ${job.assigned?'done':''}">
                    ✔ Assigned
                </button>

                <button class="statusButton ${job.started?'done':''}">
                    ▶ Started
                </button>

                <button class="statusButton ${job.completed?'done':''}">
                    ✓ Completed
                </button>

                <button class="statusButton ${job.delivered?'done':''}">
                    📦 Delivered
                </button>

            </div>

        </div>

    </div>

</div>

`;

    }

};