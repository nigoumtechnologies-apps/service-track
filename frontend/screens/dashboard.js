const Dashboard = {

    render() {

        document.getElementById("screen").innerHTML = `

<div class="dashboardGrid">

    <div class="statCard">

        <div class="statTitle">
            Today's Job Cards
        </div>

        <div class="statValue">
            18
        </div>

    </div>

    <div class="statCard">

        <div class="statTitle">
            Pending
        </div>

        <div class="statValue">
            6
        </div>

    </div>

    <div class="statCard">

        <div class="statTitle">
            Completed
        </div>

        <div class="statValue">
            10
        </div>

    </div>

    <div class="statCard">

        <div class="statTitle">
            Delivered
        </div>

        <div class="statValue">
            2
        </div>

    </div>

</div>

<div class="reportCard">

    <div class="reportTitle">

        Welcome to MotoFlow

    </div>

    <p>

        Vehicle Service Management System

    </p>

</div>

        `;

    }

};