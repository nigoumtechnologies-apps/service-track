const Router={

    open(screen){

        switch(screen){

            case "dashboard":

                Dashboard.render();

                break;

            case "today":

                Today.render();

                break;

            case "previous":

                Previous.render();

                break;

            case "mechanic":

                Mechanic.render();

                break;

            case "reports":

                Reports.render();

                break;

        }

    }

};