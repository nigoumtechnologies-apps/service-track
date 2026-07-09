const Today = {

    render(){

        const jobs=[

            {

                jobCardNo:"JC25070001",

                regNo:"TN47AB1234",

                model:"Splendor+",

                serviceType:"FSC",

                supervisor:"Kumar",

                mechanic:"Ravi",

                assigned:true,

                started:false,

                completed:false,

                delivered:false

            },

            {

                jobCardNo:"JC25070002",

                regNo:"TN47CD5678",

                model:"HF Deluxe",

                serviceType:"Paid Service",

                supervisor:"Suresh",

                mechanic:"Arun",

                assigned:true,

                started:true,

                completed:false,

                delivered:false

            },

            {

                jobCardNo:"JC25070003",

                regNo:"TN47EF9876",

                model:"Xtreme",

                serviceType:"General Repair",

                supervisor:"Kumar",

                mechanic:"Bala",

                assigned:true,

                started:true,

                completed:true,

                delivered:false

            }

        ];

        let html=`

<div class="actionButtons">

<button class="actionButton">

+ New Job Card

</button>

<button class="actionButton">

Bulk Upload

</button>

</div>

`;

        jobs.forEach(j=>{

            html+=JobCard.create(j);

        });

        html+=`

<div class="fab">

<span class="material-symbols-outlined">

add

</span>

</div>

`;

        document.getElementById("screen").innerHTML=html;

    }

};