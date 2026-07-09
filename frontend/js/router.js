/*==================================================
 MotoFlow V2.0
 File : frontend/js/router.js
==================================================*/

const Router = {

    async open(screen){

        document.getElementById("screen").innerHTML = `
            <div style="
                padding:80px;
                text-align:center;
                font-size:18px;
                color:#1565C0;
            ">
                Loading...
            </div>
        `;

        switch(screen){

            case "dashboard":

                await Dashboard.render();
                break;

            case "today":

                await Today.render();
                break;

            case "previous":

                if(typeof Previous!=="undefined")
                    await Previous.render();
                break;

            case "mechanic":

                if(typeof Mechanic!=="undefined")
                    await Mechanic.render();
                break;

            case "reports":

                if(typeof Reports!=="undefined")
                    await Reports.render();
                break;

        }

    }

};