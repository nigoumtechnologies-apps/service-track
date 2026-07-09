/*==================================================
 MotoFlow V2.5
 File : frontend/js/api.js
==================================================*/

const API={

url:"https://script.google.com/macros/s/AKfycbysNRmwcREJqGHW3zZcq2VpaS0clwiqpSv1TJvi2XZ1L2bAz2iyd1y723QO9yVjvB1wvw/exec",

async getTodayJobCards(){

const res=await fetch(
this.url+"?action=today"
);

return await res.json();

},

async getMasters(){

const res=await fetch(
this.url+"?action=masters"
);

return await res.json();

},

async saveJobCard(data){

const params=new URLSearchParams({

action:"saveJobCard",

jobCardNo:data.jobCardNo,

regNo:data.regNo,

model:data.model,

serviceType:data.serviceType,

supervisor:data.supervisor,

mechanic:data.mechanic,

estimatedDelivery:data.estimatedDelivery,

remarks:data.remarks

});

const res=await fetch(

this.url+"?"+params.toString()

);

return await res.json();

},

async updateStatus(data){

const params=new URLSearchParams({

action:"updateStatus",

jobCardID:data.jobCardID,

status:data.status,

supervisor:data.supervisor,

mechanic:data.mechanic,

serviceType:data.serviceType,

actionBy:data.actionBy

});

const res=await fetch(

this.url+"?"+params.toString()

);

return await res.json();

}

};