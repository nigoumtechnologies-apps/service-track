const Dashboard = {

    cachedJobs: [],

    async render(options = {}) {

        try {

            const jobs = await this.getJobs(options.forceRefresh === true);

            this.cachedJobs = Array.isArray(jobs) ? jobs.slice() : [];

            const metrics = this.getMetrics(this.cachedJobs);

            document.getElementById("screen").innerHTML = this.renderScreen(metrics);

        } catch (err) {

            document.getElementById("screen").innerHTML = `
                <div class="reportCard dashboardErrorCard">
                    <b>Dashboard Unavailable</b>
                    <br><br>
                    ${this.escape(err.message)}
                </div>
            `;

        }

    },

    async getJobs(forceRefresh = false) {

        if (!forceRefresh && typeof Today !== "undefined" && Array.isArray(Today.jobs) && Today.jobs.length > 0) {
            return Today.jobs.slice();
        }

        if (typeof Today !== "undefined" && typeof Today.loadJobs === "function") {
            return await Today.loadJobs(forceRefresh);
        }

        const response = await API.getTodayJobCards();

        if (!response.success) {
            return [];
        }

        return Array.isArray(response.data) ? response.data : [];

    },

    renderScreen(metrics) {

        const cards = [
            {
                key: "all",
                label: "Today's Job Cards",
                value: metrics.total,
                hint: "Open workshop",
                theme: "dashboardCard--primary"
            },
            {
                key: "new",
                label: "NEW",
                value: metrics.new,
                hint: "Awaiting assignment",
                theme: "dashboardCard--muted"
            },
            {
                key: "assigned",
                label: "ASSIGNED",
                value: metrics.assigned,
                hint: "Queued for work",
                theme: "dashboardCard--assigned"
            },
            {
                key: "started",
                label: "STARTED",
                value: metrics.started,
                hint: "In progress",
                theme: "dashboardCard--started"
            },
            {
                key: "completed",
                label: "COMPLETED",
                value: metrics.completed,
                hint: "Ready to deliver",
                theme: "dashboardCard--completed"
            },
            {
                key: "delivered",
                label: "DELIVERED",
                value: metrics.delivered,
                hint: "Vehicle released",
                theme: "dashboardCard--delivered"
            },
            {
                key: "all",
                label: "OVERDUE",
                value: metrics.overdue,
                hint: "Needs attention",
                theme: "dashboardCard--overdue"
            },
            {
                key: "delivered",
                label: "Today's Deliveries",
                value: metrics.todaysDeliveries,
                hint: "Closed today",
                theme: "dashboardCard--deliveries"
            },
            {
                key: "started",
                label: "Mechanics Working",
                value: metrics.mechanicsWorking,
                hint: "Active technicians",
                theme: "dashboardCard--working"
            },
            {
                key: "all",
                label: "Pending Jobs",
                value: metrics.pending,
                hint: "Not yet finished",
                theme: "dashboardCard--pending"
            },
            {
                key: "all",
                label: "Completion %",
                value: `${metrics.completionPercent}%`,
                hint: "Completed + delivered",
                theme: "dashboardCard--completion"
            },
            {
                key: "all",
                label: "Workshop Efficiency %",
                value: `${metrics.efficiencyPercent}%`,
                hint: "On-time performance",
                theme: "dashboardCard--efficiency"
            }
        ];

        return `
            <div class="dashboardScreen">
                <div class="dashboardHeader reportCard">
                    <div class="dashboardHeaderCopy">
                        <div class="dashboardEyebrow">Live Workshop Dashboard</div>
                        <h2 class="dashboardTitle">MotoFlow Operations</h2>
                        <p class="dashboardSubtitle">
                            Live values are calculated from the current workshop cache.
                        </p>
                    </div>
                    <div class="dashboardHeaderMeta">
                        <span class="dashboardMetaLabel">Last Updated</span>
                        <strong>${this.escape(metrics.updatedAt)}</strong>
                    </div>
                </div>

                <div class="dashboardGrid">
                    ${cards.map(card => this.renderCard(card)).join("")}
                </div>
            </div>
        `;

    },

    renderCard(card) {

        return `
            <button
                type="button"
                class="dashboardStatCard ${card.theme}"
                onclick="Dashboard.openWorkshop('${card.key}')">
                <div class="dashboardStatTop">
                    <span class="dashboardStatLabel">${this.escape(card.label)}</span>
                    <span class="dashboardStatArrow material-symbols-outlined">arrow_forward</span>
                </div>
                <div class="dashboardStatValue">${this.escape(card.value)}</div>
                <div class="dashboardStatHint">${this.escape(card.hint)}</div>
            </button>
        `;

    },

    getMetrics(jobs) {

        const summary = {
            total: 0,
            new: 0,
            assigned: 0,
            started: 0,
            completed: 0,
            delivered: 0,
            overdue: 0,
            todaysDeliveries: 0,
            mechanicsWorking: 0,
            pending: 0,
            completionPercent: 0,
            efficiencyPercent: 0,
            updatedAt: Utils.now()
        };

        const mechanicNames = new Set();

        (jobs || []).forEach(job => {

            const status = this.getStatus(job);
            const mechanic = (job.mechanic || "").toString().trim();
            const activeMechanic = mechanic && mechanic.toLowerCase() !== "not assigned";

            summary.total += 1;

            if (summary.hasOwnProperty(status)) {
                summary[status] += 1;
            }

            if (status === "delivered") {
                summary.todaysDeliveries += 1;
            }

            if (status === "new" || status === "assigned" || status === "started") {
                summary.pending += 1;
            }

            if (activeMechanic && (status === "assigned" || status === "started" || status === "completed")) {
                mechanicNames.add(mechanic);
            }

            if (this.isOverdue(job)) {
                summary.overdue += 1;
            }

        });

        summary.mechanicsWorking = mechanicNames.size;

        if (summary.total > 0) {
            summary.completionPercent = Math.round(((summary.completed + summary.delivered) / summary.total) * 100);
            summary.efficiencyPercent = Math.max(0, Math.round(((summary.total - summary.overdue) / summary.total) * 100));
        }

        return summary;

    },

    getStatus(job) {

        if (typeof Today !== "undefined" && typeof Today.getStatus === "function") {
            return Today.getStatus(job);
        }

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

        return "new";

    },

    isOverdue(job) {

        if (typeof JobCard !== "undefined" && typeof JobCard.getOverdueInfo === "function") {
            return !!JobCard.getOverdueInfo(job).html;
        }

        const deliveryDate = new Date(job.estimatedDelivery);

        if (!job.estimatedDelivery || Number.isNaN(deliveryDate.getTime())) {
            return false;
        }

        return this.getStatus(job) !== "delivered" && deliveryDate < new Date();

    },

    openWorkshop(filterKey) {

        if (typeof Today !== "undefined") {
            Today.searchText = "";
            Today.statusFilter = filterKey || "all";
        }

        Router.open("today");

    },

    isVisible() {

        return !!document.querySelector("#screen .dashboardScreen");

    },

    async sync() {

        if (!this.isVisible()) {
            return;
        }

        const jobs = typeof Today !== "undefined" && Array.isArray(Today.jobs)
            ? Today.jobs.slice()
            : this.cachedJobs.slice();

        this.cachedJobs = jobs;
        document.getElementById("screen").innerHTML = this.renderScreen(this.getMetrics(jobs));

    },

    escape(value) {

        return (value || "")
            .toString()
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/\"/g, "&quot;")
            .replace(/'/g, "&#39;");

    }

};
