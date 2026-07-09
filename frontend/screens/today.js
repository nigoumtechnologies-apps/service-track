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
        const searchJobs = this.getSearchJobs();
        const filteredCount = this.getVisibleJobs().length;
        const counts = this.getStatusCounts(searchJobs);

        document.getElementById("screen").innerHTML = `
            <div class="workshopScreen">
                <div class="workshopToolbar">
                    <div class="actionButtons todayActions">
                        <button class="actionButton" onclick="Today.newJobCard()">
                            + New Job Card
                        </button>
                        <button class="actionButton" onclick="Today.bulkUpload()">
                            Bulk Upload
                        </button>
                    </div>

                    <div class="reportCard workshopCounterCard">
                        <div class="workshopCounter">
                            <div class="counterBlock">
                                <span class="counterLabel">Today's Jobs</span>
                                <strong>${totalCount}</strong>
                            </div>
                            <div class="counterDivider"></div>
                            <div class="counterBlock">
                                <span class="counterLabel">Filtered</span>
                                <strong id="todayFilteredCount">${filteredCount}</strong>
                            </div>
                        </div>
                        <div class="todayCounterMeta" id="todayCounterMeta">
                            <span>${counts.new} new</span>
                            <span>${counts.assigned} assigned</span>
                            <span>${counts.started} started</span>
                            <span>${counts.completed} completed</span>
                            <span>${counts.delivered} delivered</span>
                        </div>
                    </div>

                    <div class="reportCard todaySearchCard">
                        <div class="todaySearchWrap">
                        <input
                            id="jobSearch"
                            type="text"
                            placeholder="Search Job Card / Registration / Model / Supervisor / Mechanic"
                            value="${this.escape(this.searchText)}"
                            oninput="Today.search(this.value)"
                            class="todaySearchInput">
                            <button type="button" class="searchClearButton" onclick="Today.clearSearch()">
                                Clear
                            </button>
                        </div>
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
            </div>
        `;

        this.updateView();

    },

    updateView() {

        const jobList = document.getElementById("jobList");
        const filteredCount = document.getElementById("todayFilteredCount");
        const counterMeta = document.getElementById("todayCounterMeta");
        const filterBar = document.getElementById("todayFilterBar");

        if (!jobList || !filteredCount || !counterMeta || !filterBar) {
            return;
        }

        const searchJobs = this.getSearchJobs();
        const visibleJobs = this.getVisibleJobs();
        const counts = this.getStatusCounts(searchJobs);

        filteredCount.textContent = visibleJobs.length;
        counterMeta.innerHTML = `
            <span>${counts.new} new</span>
            <span>${counts.assigned} assigned</span>
            <span>${counts.started} started</span>
            <span>${counts.completed} completed</span>
            <span>${counts.delivered} delivered</span>
        `;

        filterBar.querySelectorAll(".filterChip").forEach(button => {
            button.classList.toggle("active", button.dataset.filter === this.statusFilter);
            if (counts.hasOwnProperty(button.dataset.filter)) {
                const countNode = button.querySelector("strong");
                if (countNode) {
                    countNode.textContent = counts[button.dataset.filter];
                }
            }
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

        const counts = this.getStatusCounts(this.getSearchJobs());
        const totalCount = this.jobs.length;
        const filters = [
            { key: "all", label: "ALL", count: totalCount },
            { key: "new", label: "NEW", count: counts.new },
            { key: "assigned", label: "ASSIGNED", count: counts.assigned },
            { key: "started", label: "STARTED", count: counts.started },
            { key: "completed", label: "COMPLETED", count: counts.completed },
            { key: "delivered", label: "DELIVERED", count: counts.delivered }
        ];

        return filters.map(filter => `
            <button
                type="button"
                class="filterChip ${this.statusFilter === filter.key ? "active" : ""}"
                data-filter="${filter.key}"
                onclick="Today.setFilter('${filter.key}')">
                <span>${filter.label}</span>
                <strong>${filter.count}</strong>
            </button>
        `).join("");

    },

    getSearchJobs() {

        const searchValue = this.searchText.trim().toUpperCase();

        if (searchValue === "") {
            return this.jobs.slice();
        }

        return this.jobs.filter(job => {
            const regNo = (job.regNo || "").toUpperCase();
            const jobCardNo = (job.jobCardNo || "").toUpperCase();
            const model = (job.model || "").toUpperCase();
            const supervisor = (job.supervisor || "").toUpperCase();
            const mechanic = (job.mechanic || "").toUpperCase();

            return (
                regNo.includes(searchValue) ||
                jobCardNo.includes(searchValue) ||
                model.includes(searchValue) ||
                supervisor.includes(searchValue) ||
                mechanic.includes(searchValue)
            );
        });

    },

    getVisibleJobs() {

        return this.getSearchJobs().filter(job => {
            const status = this.getStatus(job);

            return this.statusFilter === "all" || status === this.statusFilter;
        });

    },

    getStatusCounts(jobs) {

        const counts = {
            new: 0,
            assigned: 0,
            started: 0,
            completed: 0,
            delivered: 0
        };

        (jobs || this.jobs).forEach(job => {
            const status = this.getStatus(job);

            if (counts.hasOwnProperty(status)) {
                counts[status] += 1;
            }
        });

        return counts;

    },

    getStatus(job) {

        const rawStatus = (job.status || "")
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "");

        if (job.delivered || rawStatus === "delivered") {
            return "delivered";
        }

        if (job.completed || rawStatus === "completed") {
            return "completed";
        }

        if (job.started || rawStatus === "started") {
            return "started";
        }

        if (job.assigned || rawStatus === "assigned") {
            return "assigned";
        }

        if (rawStatus === "new") {
            return "new";
        }

        return "new";

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

    clearSearch() {

        this.searchText = "";
        const input = document.getElementById("jobSearch");
        if (input) {
            input.value = "";
        }
        this.updateView();

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
