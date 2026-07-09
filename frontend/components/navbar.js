const Navbar = {

    render() {

        document.getElementById("navbar").innerHTML = `

        <div class="bottomNav">

            <button class="navButton active"
                onclick="Router.open('dashboard')">

                <span class="material-symbols-outlined">
                    dashboard
                </span>

                Dashboard

            </button>

            <button class="navButton"
                onclick="Router.open('today')">

                <span class="material-symbols-outlined">
                    today
                </span>

                Today

            </button>

            <button class="navButton"
                onclick="Router.open('mechanic')">

                <span class="material-symbols-outlined">
                    engineering
                </span>

                Mechanic

            </button>

            <button class="navButton"
                onclick="Router.open('reports')">

                <span class="material-symbols-outlined">
                    assessment
                </span>

                Reports

            </button>

        </div>

        `;

    }

};