/*==================================================
 MotoFlow V3
 File : frontend/screens/today.js
==================================================*/

const Today = {

    jobs: [],
    searchText: "",
    statusFilter: "all",
    roleKey: "supervisor",
    selectedJobID: null,
    panelEventsBound: false,

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

        const searchJobs = this.getSearchJobs();
        const roleJobs = this.getRoleVisibleJobs(searchJobs);
        const totalCount = roleJobs.length;
        const filteredCount = this.getVisibleJobs().length;
        const counts = this.getStatusCounts(roleJobs);
        const role = this.getRole();

        document.getElementById("screen").innerHTML = `
            <div class="workshopScreen">
                <div class="workshopToolbar">
                    <div class="reportCard roleCard">
                        <div class="roleCardHeader">
                            <div>
                                <div class="roleCardLabel">Active Role</div>
                                <strong>${this.getRoleLabel(role)}</strong>
                            </div>
                            <span class="roleCardHint">Temporary selector</span>
                        </div>

                        <div class="roleSelector">
                            ${this.renderRoleButtons(role)}
                        </div>
                    </div>

                    <div class="todayActions">
                        ${this.renderTopActions(role)}
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

            <div id="jobPanelBackdrop" class="jobPanelBackdrop" onclick="Today.closeJobPanel()"></div>

            <aside id="jobPanel" class="jobPanel" aria-hidden="true">
                <div class="jobPanelHeader">
                    <div>
                        <div class="jobPanelKicker">Workshop Details</div>
                        <h2 class="jobPanelTitle" id="jobPanelTitle">Job Card</h2>
                    </div>
                    <button class="jobPanelClose" type="button" onclick="Today.closeJobPanel()">Close</button>
                </div>

                <div id="jobPanelBody" class="jobPanelBody"></div>

                        <div class="jobPanelFooter">
                    <button id="jobPanelAction" class="jobPanelAction" type="button" onclick="Today.submitStatusUpdate()">
                        Update Status
                    </button>
                    <button class="jobPanelSecondary" type="button" onclick="Today.closeJobPanel()">
                        Cancel
                    </button>
                </div>
            </aside>
        `;

        this.bindPanelEvents();
        this.updateView();
        this.syncJobPanel();

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
        const roleJobs = this.getRoleVisibleJobs(searchJobs);
        const visibleJobs = this.getVisibleJobs();
        const counts = this.getStatusCounts(roleJobs);
        const role = this.getRole();

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
        this.syncJobPanel();
        this.applyRolePermissions(role);

    },

    renderFilterButtons() {

        const searchJobs = this.getSearchJobs();
        const roleJobs = this.getRoleVisibleJobs(searchJobs);
        const counts = this.getStatusCounts(roleJobs);
        const totalCount = roleJobs.length;
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

        return this.getRoleVisibleJobs(this.getSearchJobs()).filter(job => {
            const status = this.getStatus(job);

            return this.statusFilter === "all" || status === this.statusFilter;
        });

    },

    getRoleVisibleJobs(jobs) {

        const role = this.getRole();

        if (role === "mechanic") {
            return (jobs || []).filter(job => this.getStatus(job) !== "new");
        }

        return jobs || [];

    },

    getRole() {

        const savedRole = localStorage.getItem("motoflow_role");
        const role = (savedRole || this.roleKey || "supervisor").toLowerCase();
        const allowedRoles = ["supervisor", "mechanic", "customercare", "owner"];

        if (allowedRoles.includes(role)) {
            this.roleKey = role;
            return role;
        }

        this.roleKey = "supervisor";
        localStorage.setItem("motoflow_role", this.roleKey);
        return this.roleKey;

    },

    getRoleLabel(role) {

        return {
            supervisor: "Supervisor",
            mechanic: "Mechanic",
            customercare: "Customer Care",
            owner: "Owner"
        }[role] || "Supervisor";

    },

    renderRoleButtons(activeRole) {

        const roles = [
            { key: "supervisor", label: "Supervisor" },
            { key: "mechanic", label: "Mechanic" },
            { key: "customercare", label: "Customer Care" },
            { key: "owner", label: "Owner" }
        ];

        return roles.map(role => `
            <button
                type="button"
                class="roleButton ${activeRole === role.key ? "active" : ""}"
                onclick="Today.setRole('${role.key}')">
                ${role.label}
            </button>
        `).join("");

    },

    setRole(roleKey) {

        this.roleKey = roleKey;
        localStorage.setItem("motoflow_role", roleKey);
        this.updateView();
        this.syncJobPanel();

    },

    renderTopActions(role) {

        if (role !== "supervisor") {
            return `
                <div class="roleReadOnlyNote">
                    Workshop actions are locked for this role.
                </div>
            `;
        }

        return `
            <button class="actionButton" onclick="Today.newJobCard()">
                + New Job Card
            </button>
            <button class="actionButton" onclick="Today.bulkUpload()">
                Bulk Upload
            </button>
        `;

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

    getNextActionForRole(job, role) {

        const statusKey = JobCard.getStatusInfo(job).key;

        const roleActionMap = {
            supervisor: {
                new: { label: "Assign", status: "Assigned" },
                assigned: { label: "Start", status: "Started" },
                started: { label: "Complete", status: "Completed" },
                completed: { label: "Deliver", status: "Delivered" },
                delivered: null
            },
            mechanic: {
                assigned: { label: "Start", status: "Started" },
                started: { label: "Complete", status: "Completed" },
                completed: null,
                delivered: null,
                new: null
            },
            customercare: {
                completed: { label: "Deliver", status: "Delivered" },
                delivered: null,
                new: null,
                assigned: null,
                started: null
            },
            owner: {
                new: null,
                assigned: null,
                started: null,
                completed: null,
                delivered: null
            }
        };

        const roleMap = roleActionMap[role] || roleActionMap.supervisor;

        return roleMap[statusKey] || null;

    },

    applyRolePermissions(role) {

        const actionButton = document.getElementById("jobPanelAction");
        const job = this.selectedJobID ? this.findJob(this.selectedJobID) : null;

        if (!actionButton || !job) {
            return;
        }

        const nextAction = this.getNextActionForRole(job, role);

        if (!nextAction) {
            actionButton.hidden = true;
            return;
        }

        actionButton.hidden = false;
        actionButton.textContent = nextAction.label;
        actionButton.dataset.nextStatus = nextAction.status;

    },

    getAllowedAction(job) {

        return this.getNextActionForRole(job, this.getRole());

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
        this.statusFilter = "all";
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

    },

    bindPanelEvents() {

        if (this.panelEventsBound) {
            return;
        }

        this.panelEventsBound = true;

        document.addEventListener("keydown", event => {
            if (event.key === "Escape" && this.selectedJobID) {
                this.closeJobPanel();
            }
        });

    },

    openJobPanel(jobCardID) {

        const job = this.findJob(jobCardID);

        if (!job) {
            return;
        }

        this.selectedJobID = jobCardID;
        this.syncJobPanel();

    },

    closeJobPanel() {

        this.selectedJobID = null;
        this.syncJobPanel();

    },

    syncJobPanel() {

        const backdrop = document.getElementById("jobPanelBackdrop");
        const panel = document.getElementById("jobPanel");
        const body = document.body;
        const job = this.selectedJobID ? this.findJob(this.selectedJobID) : null;

        if (!backdrop || !panel) {
            return;
        }

        const isOpen = !!job;

        backdrop.classList.toggle("open", isOpen);
        panel.classList.toggle("open", isOpen);
        panel.setAttribute("aria-hidden", isOpen ? "false" : "true");
        body.classList.toggle("panel-open", isOpen);

        if (!job) {
            return;
        }

        const jobPanelTitle = document.getElementById("jobPanelTitle");
        const jobPanelBody = document.getElementById("jobPanelBody");
        const jobPanelAction = document.getElementById("jobPanelAction");
        const nextAction = this.getAllowedAction(job);

        if (jobPanelTitle) {
            jobPanelTitle.textContent = `Job Card ${job.jobCardNo || "-"}`;
        }

        if (jobPanelBody) {
            jobPanelBody.innerHTML = this.renderJobPanelBody(job);
        }

        if (jobPanelAction) {
            if (nextAction) {
                jobPanelAction.hidden = false;
                jobPanelAction.textContent = nextAction.label;
                jobPanelAction.disabled = false;
                jobPanelAction.dataset.nextStatus = nextAction.status;
            } else {
                jobPanelAction.hidden = true;
                jobPanelAction.dataset.nextStatus = "";
            }
        }

    },

    renderJobPanelBody(job) {

        const statusInfo = JobCard.getStatusInfo(job);
        const nextAction = this.getAllowedAction(job);
        const overdueInfo = JobCard.getOverdueInfo(job);
        const timelineStages = JobCard.getTimelineStages(job);
        const role = this.getRole();
        const panelNote = nextAction
            ? `Next: ${nextAction.label}`
            : statusInfo.key === "delivered"
                ? "Vehicle Delivered"
                : role === "owner"
                    ? "Read only"
                    : "No available action";

        return `
            <div class="jobPanelSection">
                <div class="jobPanelGrid">
                    <div class="jobPanelField">
                        <span>Registration Number</span>
                        <strong>${this.escape(job.regNo || "-")}</strong>
                    </div>
                    <div class="jobPanelField">
                        <span>Model</span>
                        <strong>${this.escape(job.model || "-")}</strong>
                    </div>
                    <div class="jobPanelField">
                        <span>Service Type</span>
                        <strong>${this.escape(job.serviceType || "-")}</strong>
                    </div>
                    <div class="jobPanelField">
                        <span>Supervisor</span>
                        <strong>${this.escape(job.supervisor || "-")}</strong>
                    </div>
                    <div class="jobPanelField">
                        <span>Mechanic</span>
                        <strong>${this.escape(job.mechanic || "-")}</strong>
                    </div>
                    <div class="jobPanelField">
                        <span>Estimated Delivery</span>
                        <strong>${this.escape(JobCard.formatEstimatedDelivery(job.estimatedDelivery) || "-")}</strong>
                    </div>
                </div>
            </div>

                <div class="jobPanelSection">
                    <div class="jobPanelSectionTitle">Current Status</div>
                    <div class="jobPanelStatusRow">
                        <span class="jobPanelStatusBadge ${statusInfo.key}">${this.escape(statusInfo.label)}</span>
                    <span class="jobPanelStatusNote">${this.escape(panelNote)}</span>
                    </div>
                ${overdueInfo.html}
            </div>

            <div class="jobPanelSection">
                <div class="jobPanelSectionTitle">Timeline</div>
                <div class="jobTimeline">
                    ${timelineStages.map(stage => `
                        <div class="timelineItem ${stage.state}">
                            <div class="timelineMark">${stage.state === "completed" ? "✓" : "•"}</div>
                            <div class="timelineText">${stage.label}</div>
                        </div>
                    `).join("")}
                </div>
            </div>

            <div class="jobPanelSection">
                <div class="jobPanelSectionTitle">Remarks</div>
                <div class="jobPanelRemarks">
                    ${this.escape(job.remarks || "No remarks")}
                </div>
            </div>
        `;

    },

    async submitStatusUpdate() {

        const job = this.selectedJobID ? this.findJob(this.selectedJobID) : null;

        if (!job) {
            return;
        }

        const nextAction = this.getAllowedAction(job);

        if (!nextAction) {
            this.closeJobPanel();
            return;
        }

        const actionButton = document.getElementById("jobPanelAction");

        if (actionButton) {
            actionButton.disabled = true;
            actionButton.textContent = "Updating...";
        }

        try {

            const result = await API.updateStatus({
                jobCardID: job.jobCardID,
                status: nextAction.status,
                supervisor: job.supervisor,
                mechanic: job.mechanic,
                serviceType: job.serviceType,
                actionBy: "Workshop"
            });

            alert(result.message || "Status updated");

            if (result.success) {
                this.closeJobPanel();
                await this.refreshWorkshop();
            }

        } catch (err) {

            alert(err.message);

        } finally {

            if (actionButton) {
                const refreshedJob = this.selectedJobID ? this.findJob(this.selectedJobID) : null;
                const refreshedAction = refreshedJob ? this.getAllowedAction(refreshedJob) : null;
                actionButton.disabled = false;
                actionButton.textContent = refreshedAction ? refreshedAction.label : "Update Status";
            }

        }

    },

    async refreshWorkshop() {

        await this.render();

    },

    renderRoleButtons(role) {

        const roles = [
            { key: "supervisor", label: "Supervisor" },
            { key: "mechanic", label: "Mechanic" },
            { key: "customercare", label: "Customer Care" },
            { key: "owner", label: "Owner" }
        ];

        return roles.map(item => `
            <button type="button" class="roleButton ${role === item.key ? "active" : ""}" onclick="Today.setRole('${item.key}')">
                ${item.label}
            </button>
        `).join("");

    }

};
