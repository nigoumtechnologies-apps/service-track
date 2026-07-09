/*==================================================
 MotoFlow V3
 File : frontend/components/jobcard.js
==================================================*/

const JobCard = {

    create(job) {

        const typeClass = {
            FSC: "fsc",
            "Paid Service": "paid",
            "General Repair": "repair"
        }[job.serviceType] || "";

        const currentStatus = this.getCurrentStatus(job);
        const estimatedDelivery = this.formatEstimatedDelivery(job.estimatedDelivery);

        return `
            <div class="jobCard ${typeClass}" data-job-id="${this.escape(job.jobCardID)}" onclick="Router.open('jobDetails', this.dataset.jobId)">
                <div class="jobCardHeader">
                    <div class="jobCardHeadLeft">
                        <div class="jobCardLabel">Job Card</div>
                        <div class="jobCardNumber">${this.escape(job.jobCardNo)}</div>
                    </div>
                    <div class="jobBadge">${this.escape(job.serviceType || "-")}</div>
                </div>

                <div class="jobCardBody">
                    <div class="jobMetaGrid">
                        <div class="jobMetaItem">
                            <div class="label">Registration</div>
                            <div class="value">${this.escape(job.regNo || "-")}</div>
                        </div>
                        <div class="jobMetaItem">
                            <div class="label">Model</div>
                            <div class="value">${this.escape(job.model || "-")}</div>
                        </div>
                        <div class="jobMetaItem">
                            <div class="label">Service Type</div>
                            <div class="value">${this.escape(job.serviceType || "-")}</div>
                        </div>
                        <div class="jobMetaItem">
                            <div class="label">Supervisor</div>
                            <div class="value">${this.escape(job.supervisor || "-")}</div>
                        </div>
                        <div class="jobMetaItem">
                            <div class="label">Mechanic</div>
                            <div class="value">${this.escape(job.mechanic || "-")}</div>
                        </div>
                        <div class="jobMetaItem">
                            <div class="label">Estimated Delivery</div>
                            <div class="value">${this.escape(estimatedDelivery || "-")}</div>
                        </div>
                    </div>
                </div>

                <div class="jobCardFooter">
                    <div class="jobStatusSummary">
                        <div>
                            <span class="jobStatusLabel">Current Status</span>
                            <strong>${this.escape(currentStatus)}</strong>
                        </div>
                        <div class="jobStatusTag ${currentStatus.toLowerCase()}">${this.escape(currentStatus)}</div>
                    </div>

                    <div class="jobStatusPills">
                        <span class="statusPill ${this.isDone(job, "new") ? "done" : ""}">New</span>
                        <span class="statusPill ${this.isDone(job, "assigned") ? "done" : ""}">Assigned</span>
                        <span class="statusPill ${this.isDone(job, "started") ? "done" : ""}">Started</span>
                        <span class="statusPill ${this.isDone(job, "completed") ? "done" : ""}">Completed</span>
                        <span class="statusPill ${this.isDone(job, "delivered") ? "done" : ""}">Delivered</span>
                    </div>
                </div>
            </div>
        `;

    },

    getCurrentStatus(job) {

        const normalizedStatus = (job.status || "")
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "");

        if (job.delivered || normalizedStatus === "delivered") {
            return "Delivered";
        }

        if (job.completed || normalizedStatus === "completed") {
            return "Completed";
        }

        if (job.started || normalizedStatus === "started") {
            return "Started";
        }

        if (job.assigned || normalizedStatus === "assigned") {
            return "Assigned";
        }

        return normalizedStatus === "new" ? "New" : "New";

    },

    isDone(job, state) {

        const normalizedStatus = (job.status || "")
            .toString()
            .trim()
            .toLowerCase()
            .replace(/\s+/g, "");

        switch (state) {
            case "new":
                return !normalizedStatus && !job.assigned && !job.started && !job.completed && !job.delivered;
            case "assigned":
                return job.assigned || normalizedStatus === "assigned";
            case "started":
                return job.started || normalizedStatus === "started";
            case "completed":
                return job.completed || normalizedStatus === "completed";
            case "delivered":
                return job.delivered || normalizedStatus === "delivered";
            default:
                return false;
        }

    },

    formatEstimatedDelivery(value) {

        if (!value) {
            return "";
        }

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return value;
        }

        return date.toLocaleString([], {
            dateStyle: "medium",
            timeStyle: "short"
        });

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
