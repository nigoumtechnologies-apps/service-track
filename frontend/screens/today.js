/*==================================================
 MotoFlow V3
 File : frontend/screens/today.js
==================================================*/

const Today = {

    jobs: [],
    searchText: "",
    statusFilter: "all",

    async render() {

        try {

            const response = await API.getTodayJobCards();

            if (!response.success) {

                this.jobs = [];

                document.getElementById("screen").innerHTML = `
                    <div class="reportCard">
                        Unable to load Job Cards
                    </div>
                `;

                return;

            }

            this.jobs = Array.isArray(response.data) ? response.data : [];
            this.renderScreen();

        } catch (err) {

            this.jobs = [];

            document.getElementById("screen").innerHTML = `
                <div class="reportCard">
                    <b>API Connection Failed</b>
                    <br><br>
                    ${err.message}
                </div>
            `;

        }

    },

    renderScreen() {

        const totalCount = this.jobs.length;
        const counts = this.getStatusCounts();

        document.getElementById("screen").innerHTML = `
            <div class="todayToolbar">
                <div class="actionButtons todayActions">
                    <button class="actionButton" onclick="Today.newJobCard()">
                        + New Job Card
                    </button>
                    <button class="actionButton" onclick="Today.bulkUpload()">
                        Bulk Upload
                    </button>
                </div>

                <div class="reportCard todaySummary">
                    <div class="todayCounter">
                        <span class="todayCounterLabel">Live Counter</span>
                        <strong id="todayCounterLabel">${this.getCounterLabel()}</strong>
                    </div>
                    <div class="todayCounterMeta" id="todayCounterMeta">
                        <span>${counts.assigned} assigned</span>
                        <span>${counts.started} started</span>
                        <span>${counts.completed} completed</span>
                        <span>${counts.delivered} delivered</span>
                    </div>
                    <div class="todayCounterMeta todayCounterMetaTotal">
                        <span>${totalCount} total job cards</span>
                    </div>
                </div>

                <div class="reportCard todaySearchCard">
                    <input
                        id="jobSearch"
                        type="text"
                        placeholder="Search Job Card / Registration / Model / Supervisor"
                        value="${this.escape(this.searchText)}"
                        oninput="Today.search(this.value)"
                        class="todaySearchInput">
                </div>

                <div class="todayFilterBar" id="todayFilterBar">
                    ${this.renderFilterButtons()}
                </div>
            </div>

            <div id="jobList" class="todayList"></div>

            <div class="fab" onclick="Today.newJobCard()">
                <span class="material-symbols-outlined">
                    add
                </span>
            </div>
        `;

        this.updateView();

    },

    updateView() {

        const jobList = document.getElementById("jobList");
        const counterLabel = document.getElementById("todayCounterLabel");
        const counterMeta = document.getElementById("todayCounterMeta");
        const filterBar = document.getElementById("todayFilterBar");

        if (!jobList || !counterLabel || !counterMeta || !filterBar) {
            return;
        }

        const visibleJobs = this.getVisibleJobs();
        const counts = this.getStatusCounts();

        counterLabel.textContent = this.getCounterLabel();
        counterMeta.innerHTML = `
            <span>${counts.assigned} assigned</span>
            <span>${counts.started} started</span>
            <span>${counts.completed} completed</span>
            <span>${counts.delivered} delivered</span>
        `;

        filterBar.querySelectorAll(".filterButton").forEach(button => {
            button.classList.toggle("active", button.dataset.filter === this.statusFilter);
        });

        if (visibleJobs.length === 0) {
            jobList.innerHTML = `
                <div class="reportCard todayEmptyState">
                    No Job Cards Found
                </div>
            `;
            return;
        }

        jobList.innerHTML = visibleJobs.map(job => JobCard.create(job)).join("");

    },

    renderFilterButtons() {

        const counts = this.getStatusCounts();
        const totalCount = this.jobs.length;
        const filters = [
            { key: "all", label: "All", count: totalCount },
            { key: "assigned", label: "Assigned", count: counts.assigned },
            { key: "started", label: "Started", count: counts.started },
            { key: "completed", label: "Completed", count: counts.completed },
            { key: "delivered", label: "Delivered", count: counts.delivered }
        ];

        return filters.map(filter => `
            <button
                type="button"
                class="filterButton ${this.statusFilter === filter.key ? "active" : ""}"
                data-filter="${filter.key}"
                onclick="Today.setFilter('${filter.key}')">
                <span>${filter.label}</span>
                <strong>${filter.count}</strong>
            </button>
        `).join("");

    },

    getVisibleJobs() {

        const searchValue = this.searchText.trim().toUpperCase();

        return this.jobs.filter(job => {
            const status = this.getStatus(job);
            const regNo = (job.regNo || "").toUpperCase();
            const jobCardNo = (job.jobCardNo || "").toUpperCase();
            const model = (job.model || "").toUpperCase();
            const supervisor = (job.supervisor || "").toUpperCase();
            const mechanic = (job.mechanic || "").toUpperCase();

            const matchesSearch =
                searchValue === "" ||
                regNo.includes(searchValue) ||
                jobCardNo.includes(searchValue) ||
                model.includes(searchValue) ||
                supervisor.includes(searchValue) ||
                mechanic.includes(searchValue);

            const matchesStatus =
                this.statusFilter === "all" ||
                status === this.statusFilter;

            return matchesSearch && matchesStatus;
        });

    },

    getStatusCounts() {

        const counts = {
            assigned: 0,
            started: 0,
            completed: 0,
            delivered: 0
        };

        this.jobs.forEach(job => {
            const status = this.getStatus(job);

            if (counts.hasOwnProperty(status)) {
                counts[status] += 1;
            }
        });

        return counts;

    },

    getStatus(job) {

        const normalizedStatus = (job.status || "")
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "");

        if (normalizedStatus === "assigned") {
            return "assigned";
        }

        if (normalizedStatus === "started") {
            return "started";
        }

        if (normalizedStatus === "completed") {
            return "completed";
        }

        if (normalizedStatus === "delivered") {
            return "delivered";
        }

        if (job.delivered) {
            return "delivered";
        }

        if (job.completed) {
            return "completed";
        }

        if (job.started) {
            return "started";
        }

        return "assigned";

    },

    getCounterLabel() {

        const visibleCount = this.getVisibleJobs().length;
        const totalCount = this.jobs.length;

        if (this.searchText || this.statusFilter !== "all") {
            return `Showing ${visibleCount} of ${totalCount}`;
        }

        return `${totalCount} Job Cards`;

    },

    escape(value) {

        return (value || "")
            .toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");

    },

    findJob(jobCardID) {

        return this.jobs.find(job => job.jobCardID === jobCardID);

    },

    newJobCard() {

        NewJobCard.render();

    },

    bulkUpload() {

        alert("STEP-046 : Bulk Upload Screen");

    },

    search(text) {

        this.searchText = text || "";
        this.updateView();

    },

    setFilter(filter) {

        this.statusFilter = filter;
        this.updateView();

    }

};
