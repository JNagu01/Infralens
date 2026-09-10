/* =========================================================
   INFRALENS
   PROJECTS PAGE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    const searchInput = document.getElementById("searchInput");

    const ministryFilter =
        document.getElementById("ministryFilter");

    const sectorFilter =
        document.getElementById("sectorFilter");

    const stateFilter =
        document.getElementById("stateFilter");

    const riskFilter =
        document.getElementById("riskFilter");

    const statusFilter =
        document.getElementById("statusFilter");

    const sortFilter =
        document.getElementById("sortFilter");

    const projectTable =
        document.getElementById("projectTable");

    const resultCount =
        document.getElementById("resultCount");

    const paginationTotal =
        document.getElementById("paginationTotal");

    const activeFilters =
        document.getElementById("activeFilters");


    /* =====================================================
       GET ROWS
    ===================================================== */

    function getRows() {

        return Array.from(
            projectTable.querySelectorAll(".project-row")
        );

    }


    /* =====================================================
       RISK ZONE
    ===================================================== */

    function getRiskZone(score) {

        score = Number(score);

        if (score >= 70) {
            return "high";
        }

        if (score >= 50) {
            return "medium";
        }

        return "low";

    }


    /* =====================================================
       FILTER PROJECTS
    ===================================================== */

    function filterProjects() {

        const search =
            searchInput.value.trim().toLowerCase();

        const ministry =
            ministryFilter.value.trim().toLowerCase();

        const sector =
            sectorFilter.value.trim().toLowerCase();

        const state =
            stateFilter.value.trim().toLowerCase();

        const risk =
            riskFilter.value.trim().toLowerCase();

        const status =
            statusFilter.value.trim().toLowerCase();


        let visibleCount = 0;


        getRows().forEach(row => {

            const name =
                (row.dataset.name || "").toLowerCase();

            const rowMinistry =
                (row.dataset.ministry || "").toLowerCase();

            const rowSector =
                (row.dataset.sector || "").toLowerCase();

            const rowState =
                (row.dataset.state || "").toLowerCase();

            const rowRisk =
                Number(row.dataset.risk || 0);

            const rowStatus =
                (row.dataset.status || "").toLowerCase();


            const searchMatch =
                !search ||
                name.includes(search) ||
                rowMinistry.includes(search) ||
                rowSector.includes(search) ||
                row.innerText.toLowerCase().includes(search);


            const ministryMatch =
                !ministry ||
                rowMinistry === ministry;


            const sectorMatch =
                !sector ||
                rowSector === sector;


            const stateMatch =
                !state ||
                rowState === state;


            const riskMatch =
                !risk ||
                getRiskZone(rowRisk) === risk;


            const statusMatch =
                !status ||
                rowStatus === status;


            const shouldShow =
                searchMatch &&
                ministryMatch &&
                sectorMatch &&
                stateMatch &&
                riskMatch &&
                statusMatch;


            if (shouldShow) {

                row.style.display = "";

                visibleCount++;

            } else {

                row.style.display = "none";

            }

        });


        resultCount.textContent =
            visibleCount;

        paginationTotal.textContent =
            visibleCount;


        updateActiveFilters();

    }


    /* =====================================================
       ACTIVE FILTER TAGS
    ===================================================== */

    function updateActiveFilters() {

        activeFilters.innerHTML = "";


        const filters = [];


        if (searchInput.value.trim()) {

            filters.push({
                label: "Search",
                value: searchInput.value.trim(),
                element: searchInput
            });

        }


        if (ministryFilter.value) {

            filters.push({
                label: "Ministry",
                value: ministryFilter.value,
                element: ministryFilter
            });

        }


        if (sectorFilter.value) {

            filters.push({
                label: "Sector",
                value: sectorFilter.value,
                element: sectorFilter
            });

        }


        if (stateFilter.value) {

            filters.push({
                label: "State",
                value: stateFilter.value,
                element: stateFilter
            });

        }


        if (riskFilter.value) {

            filters.push({
                label: "Risk",
                value: riskFilter.value,
                element: riskFilter
            });

        }


        if (statusFilter.value) {

            filters.push({
                label: "Status",
                value: statusFilter.value,
                element: statusFilter
            });

        }


        filters.forEach(filter => {

            const tag =
                document.createElement("span");


            tag.className =
                "inline-flex items-center gap-1 " +
                "px-2.5 py-1 rounded-full " +
                "bg-blue-50 text-[#15158A] " +
                "border border-blue-100 text-xs";


            const text =
                document.createElement("span");

            text.textContent =
                `${filter.label}: ${filter.value}`;


            const removeButton =
                document.createElement("button");

            removeButton.type = "button";

            removeButton.textContent = "×";

            removeButton.className =
                "font-bold ml-1 hover:text-red-600";


            removeButton.addEventListener(
                "click",
                () => {

                    filter.element.value = "";

                    filterProjects();

                }
            );


            tag.appendChild(text);

            tag.appendChild(removeButton);

            activeFilters.appendChild(tag);

        });

    }


    /* =====================================================
       CLEAR FILTERS
    ===================================================== */

    window.clearFilters = function () {

        searchInput.value = "";

        ministryFilter.value = "";

        sectorFilter.value = "";

        stateFilter.value = "";

        riskFilter.value = "";

        statusFilter.value = "";

        filterProjects();

    };


    /* =====================================================
       SUMMARY RISK BUTTON
    ===================================================== */

    window.setRiskFilter = function (risk) {

        if (risk === "all") {

            riskFilter.value = "";

        } else {

            riskFilter.value = risk;

        }


        filterProjects();

        scrollToProjects();

    };


    /* =====================================================
       SUMMARY STATUS BUTTON
    ===================================================== */

    window.setStatusFilter = function (status) {

        statusFilter.value = status;

        filterProjects();

        scrollToProjects();

    };


    /* =====================================================
       SCROLL TO PROJECT TABLE
    ===================================================== */

    function scrollToProjects() {

        const table =
            document.getElementById("projectTable");


        if (!table) {
            return;
        }


        table.closest("section")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

    }


    /* =====================================================
       SORT PROJECTS
    ===================================================== */

    function sortProjects() {

        const sortType =
            sortFilter.value;


        const rows =
            getRows();


        rows.sort((a, b) => {

            const riskA =
                Number(a.dataset.risk || 0);

            const riskB =
                Number(b.dataset.risk || 0);

            const costA =
                Number(a.dataset.cost || 0);

            const costB =
                Number(b.dataset.cost || 0);

            const progressA =
                Number(a.dataset.progress || 0);

            const progressB =
                Number(b.dataset.progress || 0);


            switch (sortType) {

                case "risk-desc":
                    return riskB - riskA;

                case "risk-asc":
                    return riskA - riskB;

                case "cost-desc":
                    return costB - costA;

                case "progress-desc":
                    return progressB - progressA;

                default:
                    return 0;

            }

        });


        rows.forEach(row => {

            projectTable.appendChild(row);

        });


        filterProjects();

    }


    /* =====================================================
       FILTER EVENTS
    ===================================================== */

    searchInput.addEventListener(
        "input",
        filterProjects
    );


    [
        ministryFilter,
        sectorFilter,
        stateFilter,
        riskFilter,
        statusFilter
    ].forEach(filter => {

        filter.addEventListener(
            "change",
            filterProjects
        );

    });


    /* =====================================================
       SORT EVENT
    ===================================================== */

    sortFilter.addEventListener(
        "change",
        sortProjects
    );


    /* =====================================================
       URL FILTER SUPPORT
    ===================================================== */

    function applyURLFilters() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const risk =
            params.get("risk");

        const status =
            params.get("status");

        const ministry =
            params.get("ministry");

        const sector =
            params.get("sector");

        const state =
            params.get("state");


        setSelectValue(
            riskFilter,
            risk
        );

        setSelectValue(
            statusFilter,
            status
        );

        setSelectValue(
            ministryFilter,
            ministry
        );

        setSelectValue(
            sectorFilter,
            sector
        );

        setSelectValue(
            stateFilter,
            state
        );

    }


    /* =====================================================
       CASE-INSENSITIVE SELECT
    ===================================================== */

    function setSelectValue(select, value) {

        if (!value) {
            return;
        }


        const target =
            value.trim().toLowerCase();


        const option =
            Array.from(select.options)
                .find(
                    item =>
                        item.value
                            .trim()
                            .toLowerCase() === target
                );


        if (option) {

            select.value =
                option.value;

        }

    }


    /* =====================================================
       INITIALIZE
    ===================================================== */

    applyURLFilters();

    sortProjects();

});