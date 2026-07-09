/*==================================================
 MotoFlow V2.1
 File : frontend/components/JobCard.js
==================================================*/

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
                    <div class="value">${job.supervisor || ""}</div>
                </div>

                <div>
                    <div class="label">Mechanic</div>
                    <div class="value">${job.mechanic || ""}</div>
                </div>

            </div>

        </div>

        <div class="jobRight">

            <div class="statusList">

<button
class="statusButton ${job.assigned?'done':''}"
onclick="JobCard.updateStatus('${job.jobCardID}','ASSIGNED',this)">
✔ Assigned
</button>

<button
class="statusButton ${job.started?'done':''}"
onclick="JobCard.updateStatus(
'${job.jobCardID}',
'STARTED',
'${job.supervisor}',
'${job.mechanic}',
'${job.serviceType}',
this
)">
▶ Started
</button>

<button
class="statusButton ${job.completed?'done':''}"
onclick="JobCard.updateStatus('${job.jobCardID}','COMPLETED',this)">
✓ Completed
</button>

<button
class="statusButton ${job.delivered?'done':''}"
onclick="JobCard.updateStatus('${job.jobCardID}','DELIVERED',this)">
📦 Delivered
</button>

            </div>

        </div>

    </div>

</div>

`;

    },

    async updateStatus(
    jobCardID,
    status,
    supervisor,
    mechanic,
    serviceType,
    button
){

        button.disabled=true;

        button.innerHTML="Saving...";

        try{

            const result = await API.updateStatus({

                jobCardID:jobCardID,

                status:status,

                supervisor:"supervisor",

                mechanic:"mechanic",

                serviceType:"serviceType",

                actionBy:"Supervisor"

            });

            if(result.success){

                await Today.render();

            }else{

                alert(result.message);

            }

        }catch(err){

            alert(err.message);

        }

    }

};