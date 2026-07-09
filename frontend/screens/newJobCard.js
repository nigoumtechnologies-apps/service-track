/*==================================================
 MotoFlow V2.6
 File : frontend/screens/newJobCard.js
==================================================*/

const NewJobCard={

masters:null,

async render(){

    const res=await API.getMasters();

    if(!res.success){

        alert("Unable to load Master Data");

        return;

    }

    this.masters=res;

    let serviceOptions='<option value="">Select</option>';

    res.serviceTypes.forEach(x=>{

        serviceOptions+=`<option>${x}</option>`;

    });

    let supervisorOptions='<option value="">Select</option>';

    res.supervisors.forEach(x=>{

        supervisorOptions+=`<option>${x}</option>`;

    });

    let mechanicOptions='<option value="">Not Assigned</option>';

    res.mechanics.forEach(x=>{

        mechanicOptions+=`<option>${x}</option>`;

    });

document.getElementById("screen").innerHTML=`

<div class="reportCard">

<h2>New Job Card</h2>

<label>Job Card No *</label>
<input id="jcNo">

<label>Registration No *</label>
<input id="regNo" style="text-transform:uppercase">

<label>Model *</label>
<input id="model">

<label>Service Type *</label>

<select id="serviceType">

${serviceOptions}

</select>

<label>Supervisor *</label>

<select id="supervisor">

${supervisorOptions}

</select>

<label>Mechanic</label>

<select id="mechanic">

${mechanicOptions}

</select>

<label>Estimated Delivery</label>

<input
id="estDelivery"
type="datetime-local">

<label>Remarks</label>

<textarea
id="remarks"
rows="3"></textarea>

<br><br>

<div class="actionButtons">

<button
class="actionButton"
onclick="NewJobCard.save()">

Save

</button>

<button
class="actionButton"
onclick="Router.open('today')">

Cancel

</button>

</div>

</div>

`;

},

async save(){

const job={

jobCardNo:
document.getElementById("jcNo").value.trim(),

regNo:
document.getElementById("regNo").value.trim().toUpperCase(),

model:
document.getElementById("model").value.trim(),

serviceType:
document.getElementById("serviceType").value,

supervisor:
document.getElementById("supervisor").value,

mechanic:
document.getElementById("mechanic").value,

estimatedDelivery:
document.getElementById("estDelivery").value,

remarks:
document.getElementById("remarks").value.trim()

};

if(
!job.jobCardNo||
!job.regNo||
!job.model||
!job.serviceType||
!job.supervisor
){

alert("Please fill all mandatory fields.");

return;

}

const result=await API.saveJobCard(job);

alert(result.message);

if(result.success){

await Router.open("today");

}

}

};