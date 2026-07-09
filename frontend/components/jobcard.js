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

        return `
            <div class="jobCard ${typeClass}" onclick="Router.open('jobDetails','${job.jobCardID}')">
                <div class="jobCardHeader">
                    <div class="jobCardHeadLeft">
                        <div class="jobCardLabel">Job Card No</div>
                        <div class="jobCardNumber">${this.escape(job.jobCardNo)}</div>
                    </div>
                    <div class="jobBadge">${this.escape(job.serviceType)}</div>
                </div>

                <div class="jobCardBody">
                    <div class="jobMetaGrid">
                        <div class="jobMetaItem">
                            <div class="label">Regn No</div>
                            <div class="value">${this.escape(job.regNo)}</div>
                        </div>
                        <div class="jobMetaItem">
                            <div class="label">Model</div>
                            <div class="value">${this.escape(job.model)}</div>
                        </div>
                        <div class="jobMetaItem">
                            <div class="label">Supervisor</div>
                            <div class="value">${this.escape(job.supervisor || "-")}</div>
                        </div>
                        <div class="jobMetaItem">
                            <div class="label">Mechanic</div>
                            <div class="value">${this.escape(job.mechanic || "-")}</div>
                        </div>
                    </div>
                </div>

                <div class="jobCardFooter">
                    <div class="jobStatusSummary">
                        <span class="jobStatusLabel">Current Status</span>
                        <strong>${this.escape(currentStatus)}</strong>
                    </div>

                    <div class="jobStatusPills">
                        <span class="statusPill ${job.assigned ? "done" : ""}">Assigned</span>
                        <span class="statusPill ${job.started ? "done" : ""}">Started</span>
                        <span class="statusPill ${job.completed ? "done" : ""}">Completed</span>
                        <span class="statusPill ${job.delivered ? "done" : ""}">Delivered</span>
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

        if (normalizedStatus === "assigned") {
            return "Assigned";
        }

        if (normalizedStatus === "started") {
            return "Started";
        }

        if (normalizedStatus === "completed") {
            return "Completed";
        }

        if (normalizedStatus === "delivered") {
            return "Delivered";
        }

        if (job.delivered) {
            return "Delivered";
        }

        if (job.completed) {
            return "Completed";
        }

        if (job.started) {
            return "Started";
        }

        return "Assigned";

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
