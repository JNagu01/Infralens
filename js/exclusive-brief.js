document.addEventListener("DOMContentLoaded", () => {

    // =========================================================
    // PROJECT DATA
    // =========================================================

    const projects = [
        {
            id: "INF-001",
            name: "Eastern Highway Development",
            ministry: "Road Transport & Highways",
            sector: "Roads & Highways",
            risk: 91,
            riskLevel: "High",
            status: "Delayed",
            cost: 42500,
            revisedCost: 47200,
            expenditure: 28700,
            progress: 62,
            weatherDelay: true,
        },
        {
            id: "INF-002",
            name: "National Rail Corridor",
            ministry: "Railways",
            sector: "Railways",
            risk: 87,
            riskLevel: "High",
            status: "Ongoing",
            cost: 31800,
            revisedCost: 34400,
            expenditure: 21800,
            progress: 74,
            weatherDelay: false
        },
        {
            id: "INF-004",
            name: "Integrated Mining Project",
            ministry: "Coal",
            sector: "Coal & Mining",
            risk: 81,
            riskLevel: "High",
            status: "Delayed",
            cost: 9400,
            revisedCost: 10800,
            expenditure: 6900,
            progress: 55,
            weatherDelay: true
        },
        {
            id: "INF-006",
            name: "Western Freight Rail Link",
            ministry: "Railways",
            sector: "Railways",
            risk: 78,
            riskLevel: "High",
            status: "Ongoing",
            cost: 24600,
            revisedCost: 26900,
            expenditure: 17100,
            progress: 57,
            weatherDelay: true
        },
        {
            id: "INF-007",
            name: "Central Coal Logistics Project",
            ministry: "Coal",
            sector: "Coal & Mining",
            risk: 74,
            riskLevel: "High",
            status: "Ongoing",
            cost: 16900,
            revisedCost: 18200,
            expenditure: 11100,
            progress: 61,
            weatherDelay: false
        },
        {
            id: "INF-008",
            name: "North-South Highway Corridor",
            ministry: "Road Transport & Highways",
            sector: "Roads & Highways",
            risk: 68,
            riskLevel: "Medium",
            status: "Ongoing",
            cost: 13800,
            revisedCost: 14700,
            expenditure: 9200,
            progress: 69,
            weatherDelay: false
        },
        {
            id: "INF-009",
            name: "Eastern Coal Development Project",
            ministry: "Coal",
            sector: "Coal & Mining",
            risk: 61,
            riskLevel: "Medium",
            status: "Ongoing",
            cost: 8200,
            revisedCost: 8600,
            expenditure: 5600,
            progress: 66,
            weatherDelay: false
        }
    ];


    // =========================================================
    // ELEMENTS
    // =========================================================

    const searchInput = document.getElementById("searchInput");
    const ministryFilter = document.getElementById("ministryFilter");
    const sectorFilter = document.getElementById("sectorFilter");
    const riskFilter = document.getElementById("riskFilter");
    const statusFilter = document.getElementById("statusFilter");

    const generateBriefButton =
        document.getElementById("generateBrief");

    const clearFiltersButton =
        document.getElementById("clearFilters");

    const downloadButton =
        document.getElementById("downloadBrief");

    const scopeMessage =
        document.getElementById("scopeMessage");

    const briefScope =
        document.getElementById("briefScope");

    const generatedDate =
        document.getElementById("generatedDate");

    const projectCount =
        document.getElementById("projectCount");

    const projectCountDetail =
        document.getElementById("projectCountDetail");

    const highRiskCount =
        document.getElementById("highRiskCount");

    const highRiskDetail =
        document.getElementById("highRiskDetail");

    const totalCost =
        document.getElementById("totalCost");

    const totalCostDetail =
        document.getElementById("totalCostDetail");

    const revisedCost =
        document.getElementById("revisedCost");

    const costIncrease =
        document.getElementById("costIncrease");

    const costOverrun =
        document.getElementById("costOverrun");

    const expenditure =
        document.getElementById("expenditure");

    const expenditureDetail =
        document.getElementById("expenditureDetail");

    const weatherDelayToggle =
    document.getElementById("weatherDelayToggle");

    const riskMixTitle =
    document.getElementById("riskMixTitle");

    const riskMixDescription =
    document.getElementById("riskMixDescription"); 
        
    const riskProjectList =
        document.getElementById("riskProjectList");

    const keyObservation =
        document.getElementById("keyObservation");


    // =========================================================
    // CHART COLORS
    // =========================================================

    const chartColors = {
        primary: "#15158A",
        secondary: "#18A5DC",
        neutral: "#64748B",
        high: "#DC2626",
        medium: "#F59E0B",
        low: "#16A34A"
    };


    // =========================================================
    // CHART VARIABLES
    // =========================================================

    let projectDistributionChart = null;
    let sectorPieChart = null;
    let riskMixChart = null;
    let timeRiskChart = null;
    let riskExposureChart = null;
    let costDistributionChart = null;
    let costComparisonChart = null;
    let expenditureProgressChart = null;
    let topRiskChart = null;


    // =========================================================
    // FORMAT
    // =========================================================

    function formatCrore(value) {

        if (value >= 100000) {
            return `₹${(value / 100000).toFixed(2)}L Cr`;
        }

        if (value >= 1000) {
            return `₹${(value / 1000).toFixed(2)}K Cr`;
        }

        return `₹${value.toLocaleString("en-IN")} Cr`;
    }


    // =========================================================
    // FILTER PROJECTS
    // =========================================================

    function getFilteredProjects() {

        const search =
            searchInput.value.trim().toLowerCase();

        return projects.filter(project => {

            const searchMatch =
                !search ||
                project.id.toLowerCase().includes(search) ||
                project.name.toLowerCase().includes(search);

            const ministryMatch =
                !ministryFilter.value ||
                project.ministry === ministryFilter.value;

            const sectorMatch =
                !sectorFilter.value ||
                project.sector === sectorFilter.value;

            const riskMatch =
                !riskFilter.value ||
                project.riskLevel === riskFilter.value;

            const statusMatch =
                !statusFilter.value ||
                project.status === statusFilter.value;

            return (
                searchMatch &&
                ministryMatch &&
                sectorMatch &&
                riskMatch &&
                statusMatch
            );
        });
    }


    // =========================================================
    // SCOPE TEXT
    // =========================================================

    function getScopeText() {

        const parts = [];

        if (searchInput.value.trim()) {
            parts.push(
                `Search: ${searchInput.value.trim()}`
            );
        }

        if (ministryFilter.value) {
            parts.push(ministryFilter.value);
        }

        if (sectorFilter.value) {
            parts.push(sectorFilter.value);
        }

        if (riskFilter.value) {
            parts.push(`${riskFilter.value} Risk`);
        }

        if (statusFilter.value) {
            parts.push(statusFilter.value);
        }

        return parts.length
            ? parts.join(" · ")
            : "All Projects";
    }


    // =========================================================
    // DESTROY CHARTS
    // =========================================================

    function destroyCharts() {

        const charts = [
            projectDistributionChart,
            sectorPieChart,
            riskMixChart,
            timeRiskChart,
            riskExposureChart,
            costDistributionChart,
            costComparisonChart,
            expenditureProgressChart,
            topRiskChart
        ];

        charts.forEach(chart => {

            if (chart) {
                chart.destroy();
            }

        });

        projectDistributionChart = null;
        sectorPieChart = null;
        riskMixChart = null;
        timeRiskChart = null;
        riskExposureChart = null;
        costDistributionChart = null;
        costComparisonChart = null;
        expenditureProgressChart = null;
        topRiskChart = null;
    }


    // =========================================================
    // CREATE CHARTS
    // =========================================================

    function createCharts(filtered) {

        destroyCharts();


        // -----------------------------------------------------
        // SECTOR COUNTS
        // -----------------------------------------------------

        const roads =
            filtered.filter(
                p => p.sector === "Roads & Highways"
            ).length;

        const railways =
            filtered.filter(
                p => p.sector === "Railways"
            ).length;

        const coal =
            filtered.filter(
                p => p.sector === "Coal & Mining"
            ).length;


        // -----------------------------------------------------
        // 1. PROJECT DISTRIBUTION BAR
        // -----------------------------------------------------

        const projectCanvas =
            document.getElementById(
                "projectDistributionChart"
            );

        if (projectCanvas) {

            projectDistributionChart =
                new Chart(projectCanvas, {

                    type: "bar",

                    data: {
                        labels: [
                            "Roads & Highways",
                            "Railways",
                            "Coal & Mining"
                        ],

                        datasets: [{
                            label: "Projects",

                            data: [
                                roads,
                                railways,
                                coal
                            ],

                            backgroundColor: [
                                chartColors.primary,
                                chartColors.secondary,
                                chartColors.neutral
                            ],

                            borderColor: [
                                chartColors.primary,
                                chartColors.secondary,
                                chartColors.neutral
                            ],

                            borderWidth: 1,
                            borderRadius: 6
                        }]
                    },

                    options: {

                        responsive: true,
                        maintainAspectRatio: false,

                        plugins: {
                            legend: {
                                display: false
                            }
                        },

                        scales: {

                            y: {
                                beginAtZero: true,

                                ticks: {
                                    precision: 0
                                }
                            }
                        }
                    }
                });
        }


        // -----------------------------------------------------
        // 2. SECTOR PIE CHART
        // -----------------------------------------------------

        const sectorPieCanvas =
            document.getElementById(
                "sectorPieChart"
            );

        if (sectorPieCanvas) {

            sectorPieChart =
                new Chart(sectorPieCanvas, {

                    type: "pie",

                    data: {

                        labels: [
                            "Roads & Highways",
                            "Railways",
                            "Coal & Mining"
                        ],

                        datasets: [{

                            label: "Projects",

                            data: [
                                roads,
                                railways,
                                coal
                            ],

                            backgroundColor: [
                                chartColors.primary,
                                chartColors.secondary,
                                chartColors.neutral
                            ],

                            borderColor: "#FFFFFF",
                            borderWidth: 3,

                            hoverOffset: 8
                        }]
                    },

                    options: {

                        responsive: true,
                        maintainAspectRatio: false,

                        plugins: {

                            legend: {
                                position: "bottom"
                            }
                        }
                    }
                });
        }


        // -----------------------------------------------------
        // 3. RISK MIX PIE CHART
        // -----------------------------------------------------

        const highRisk =
            filtered.filter(
                p => p.riskLevel === "High"
            ).length;

        const mediumRisk =
            filtered.filter(
                p => p.riskLevel === "Medium"
            ).length;

        const lowRisk =
            filtered.filter(
                p => p.riskLevel === "Low"
            ).length;


const riskPieCanvas =
    document.getElementById("riskMixChart");

const showWeatherDelay =
    weatherDelayToggle &&
    weatherDelayToggle.checked;

let riskLabels;
let riskData;
let riskColors;

if (showWeatherDelay) {

    const weatherDelayed =
        filtered.filter(
            p => p.weatherDelay === true
        ).length;

    const otherProjects =
        filtered.length - weatherDelayed;

    riskLabels = [
        "Weather Delayed",
        "Other Projects"
    ];

    riskData = [
        weatherDelayed,
        otherProjects
    ];

    riskColors = [
        chartColors.high,
        chartColors.neutral
    ];

    if (riskMixTitle) {
        riskMixTitle.textContent =
            "Weather-related delay exposure";
    }

    if (riskMixDescription) {
        riskMixDescription.textContent =
            "Projects affected by weather-related delays.";
    }

} else {

    riskLabels = [
        "High Risk",
        "Medium Risk",
        "Low Risk"
    ];

    riskData = [
        highRisk,
        mediumRisk,
        lowRisk
    ];

    riskColors = [
        chartColors.high,
        chartColors.medium,
        chartColors.low
    ];

    if (riskMixTitle) {
        riskMixTitle.textContent =
            "Risk-level composition";
    }

    if (riskMixDescription) {
        riskMixDescription.textContent =
            "Distribution of selected projects by AI risk category.";
    }
}

if (riskPieCanvas) {

    riskMixChart =
        new Chart(riskPieCanvas, {

            type: "pie",

            data: {

                labels: riskLabels,

                datasets: [{
                    data: riskData,

                    backgroundColor: riskColors,

                    borderColor: "#FFFFFF",
                    borderWidth: 3,
                    hoverOffset: 8
                }]
            },

            options: {
                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }
            }
        });
}
// -----------------------------------------------------
// TIME RISK / DELAY PIE CHART
// -----------------------------------------------------

const delayedProjects =
    filtered.filter(
        p => p.status === "Delayed"
    ).length;

const ongoingProjects =
    filtered.filter(
        p => p.status === "Ongoing"
    ).length;

const timeRiskCanvas =
    document.getElementById("timeRiskChart");

if (timeRiskCanvas) {

    timeRiskChart =
        new Chart(timeRiskCanvas, {

            type: "pie",

            data: {

                labels: [
                    "Delayed",
                    "Ongoing"
                ],

                datasets: [{

                    data: [
                        delayedProjects,
                        ongoingProjects
                    ],

                    backgroundColor: [
                        chartColors.high,
                        chartColors.primary
                    ],

                    borderColor: "#FFFFFF",
                    borderWidth: 3,
                    hoverOffset: 8

                }]
            },

            options: {

                responsive: true,
                maintainAspectRatio: false,

                plugins: {
                    legend: {
                        position: "bottom"
                    }
                }

            }

        });
}
        // -----------------------------------------------------
        // 4. RISK EXPOSURE BAR
        // -----------------------------------------------------

        const highRiskCost =
            filtered
                .filter(p => p.riskLevel === "High")
                .reduce(
                    (sum, p) => sum + p.revisedCost,
                    0
                );

        const mediumRiskCost =
            filtered
                .filter(p => p.riskLevel === "Medium")
                .reduce(
                    (sum, p) => sum + p.revisedCost,
                    0
                );

        const lowRiskCost =
            filtered
                .filter(p => p.riskLevel === "Low")
                .reduce(
                    (sum, p) => sum + p.revisedCost,
                    0
                );


        const riskExposureCanvas =
            document.getElementById(
                "riskExposureChart"
            );

        if (riskExposureCanvas) {

            riskExposureChart =
                new Chart(
                    riskExposureCanvas,
                    {

                        type: "bar",

                        data: {

                            labels: [
                                "High Risk",
                                "Medium Risk",
                                "Low Risk"
                            ],

                            datasets: [{

                                label:
                                    "Revised Cost (₹ Cr)",

                                data: [
                                    highRiskCost,
                                    mediumRiskCost,
                                    lowRiskCost
                                ],

                                backgroundColor: [
                                    chartColors.high,
                                    chartColors.medium,
                                    chartColors.secondary
                                ],

                                borderRadius: 6
                            }]
                        },

                        options: {

                            responsive: true,
                            maintainAspectRatio: false,

                            plugins: {

                                legend: {
                                    display: false
                                },

                                tooltip: {

                                    callbacks: {

                                        label: function(context) {

                                            return (
                                                " " +
                                                formatCrore(
                                                    context.raw
                                                )
                                            );
                                        }
                                    }
                                }
                            },

                            scales: {

                                y: {

                                    beginAtZero: true,

                                    ticks: {

                                        callback:
                                            function(value) {

                                                return (
                                                    "₹" +
                                                    (
                                                        value / 1000
                                                    ).toFixed(0) +
                                                    "K"
                                                );
                                            }
                                    }
                                }
                            }
                        }
                    }
                );
        }


        // -----------------------------------------------------
        // 5. COST DISTRIBUTION BAR
        // -----------------------------------------------------

        const roadsCost =
            filtered
                .filter(
                    p => p.sector === "Roads & Highways"
                )
                .reduce(
                    (sum, p) => sum + p.cost,
                    0
                );

        const railwayCost =
            filtered
                .filter(
                    p => p.sector === "Railways"
                )
                .reduce(
                    (sum, p) => sum + p.cost,
                    0
                );

        const coalCost =
            filtered
                .filter(
                    p => p.sector === "Coal & Mining"
                )
                .reduce(
                    (sum, p) => sum + p.cost,
                    0
                );


        const costDistributionCanvas =
            document.getElementById(
                "costDistributionChart"
            );

        if (costDistributionCanvas) {

            costDistributionChart =
                new Chart(
                    costDistributionCanvas,
                    {

                        type: "bar",

                        data: {

                            labels: [
                                "Roads & Highways",
                                "Railways",
                                "Coal & Mining"
                            ],

                            datasets: [{

                                label:
                                    "Original Cost (₹ Cr)",

                                data: [
                                    roadsCost,
                                    railwayCost,
                                    coalCost
                                ],

                                backgroundColor: [
                                    chartColors.primary,
                                    chartColors.secondary,
                                    chartColors.neutral
                                ],

                                borderRadius: 6
                            }]
                        },

                        options: {

                            responsive: true,
                            maintainAspectRatio: false,

                            plugins: {

                                legend: {
                                    display: false
                                },

                                tooltip: {

                                    callbacks: {

                                        label:
                                            function(context) {

                                                return (
                                                    " " +
                                                    formatCrore(
                                                        context.raw
                                                    )
                                                );
                                            }
                                    }
                                }
                            },

                            scales: {

                                y: {

                                    beginAtZero: true,

                                    ticks: {

                                        callback:
                                            function(value) {

                                                return (
                                                    "₹" +
                                                    (
                                                        value / 1000
                                                    ).toFixed(0) +
                                                    "K"
                                                );
                                            }
                                    }
                                }
                            }
                        }
                    }
                );
        }


        // -----------------------------------------------------
        // 6. ORIGINAL VS REVISED COST
        // -----------------------------------------------------

        const totalOriginalCost =
            filtered.reduce(
                (sum, p) => sum + p.cost,
                0
            );

        const totalRevisedCost =
            filtered.reduce(
                (sum, p) => sum + p.revisedCost,
                0
            );


        const costComparisonCanvas =
            document.getElementById(
                "costComparisonChart"
            );

        if (costComparisonCanvas) {

            costComparisonChart =
                new Chart(
                    costComparisonCanvas,
                    {

                        type: "bar",

                        data: {

                            labels: [
                                "Original Approved",
                                "Revised Cost"
                            ],

                            datasets: [{

                                label:
                                    "Cost (₹ Cr)",

                                data: [
                                    totalOriginalCost,
                                    totalRevisedCost
                                ],

                                backgroundColor: [
                                    chartColors.primary,
                                    chartColors.high
                                ],

                                borderRadius: 6
                            }]
                        },

                        options: {

                            responsive: true,
                            maintainAspectRatio: false,

                            plugins: {

                                legend: {
                                    display: false
                                },

                                tooltip: {

                                    callbacks: {

                                        label:
                                            function(context) {

                                                return (
                                                    " " +
                                                    formatCrore(
                                                        context.raw
                                                    )
                                                );
                                            }
                                    }
                                }
                            },

                            scales: {

                                y: {

                                    beginAtZero: true,

                                    ticks: {

                                        callback:
                                            function(value) {

                                                return (
                                                    "₹" +
                                                    (
                                                        value / 1000
                                                    ).toFixed(0) +
                                                    "K"
                                                );
                                            }
                                    }
                                }
                            }
                        }
                    }
                );
        }


        // -----------------------------------------------------
        // 7. FINANCIAL VS PHYSICAL PROGRESS
        // -----------------------------------------------------

        const totalExpenditure =
            filtered.reduce(
                (sum, p) => sum + p.expenditure,
                0
            );

        const averagePhysicalProgress =
            filtered.length
                ? filtered.reduce(
                    (sum, p) => sum + p.progress,
                    0
                ) / filtered.length
                : 0;

        const expenditurePercentage =
            totalRevisedCost
                ? (
                    totalExpenditure /
                    totalRevisedCost
                ) * 100
                : 0;


        const expenditureProgressCanvas =
            document.getElementById(
                "expenditureProgressChart"
            );

        if (expenditureProgressCanvas) {

            expenditureProgressChart =
                new Chart(
                    expenditureProgressCanvas,
                    {

                        type: "bar",

                        data: {

                            labels: [
                                "Financial Progress",
                                "Physical Progress"
                            ],

                            datasets: [{

                                label: "Progress (%)",

                                data: [
                                    Number(
                                        expenditurePercentage.toFixed(1)
                                    ),
                                    Number(
                                        averagePhysicalProgress.toFixed(1)
                                    )
                                ],

                                backgroundColor: [
                                    chartColors.secondary,
                                    chartColors.primary
                                ],

                                borderRadius: 6
                            }]
                        },

                        options: {

                            responsive: true,
                            maintainAspectRatio: false,

                            plugins: {

                                legend: {
                                    display: false
                                }
                            },

                            scales: {

                                y: {

                                    beginAtZero: true,
                                    max: 100,

                                    ticks: {

                                        callback:
                                            value =>
                                                `${value}%`
                                    }
                                }
                            }
                        }
                    }
                );
        }


        // -----------------------------------------------------
        // 8. TOP RISK PROJECTS
        // -----------------------------------------------------

        const topRiskProjects =
            [...filtered]
                .sort(
                    (a, b) => b.risk - a.risk
                )
                .slice(0, 5);


        const topRiskCanvas =
            document.getElementById(
                "topRiskChart"
            );

        if (topRiskCanvas) {

            topRiskChart =
                new Chart(
                    topRiskCanvas,
                    {

                        type: "bar",

                        data: {

                            labels:
                                topRiskProjects.map(
                                    p => p.id
                                ),

                            datasets: [{

                                label:
                                    "AI Risk Score",

                                data:
                                    topRiskProjects.map(
                                        p => p.risk
                                    ),

                                backgroundColor:
                                    topRiskProjects.map(
                                        p => {

                                            if (p.risk >= 80) {
                                                return chartColors.high;
                                            }

                                            if (p.risk >= 70) {
                                                return chartColors.medium;
                                            }

                                            return chartColors.low;
                                        }
                                    ),

                                borderRadius: 6
                            }]
                        },

                        options: {

                            indexAxis: "y",

                            responsive: true,
                            maintainAspectRatio: false,

                            plugins: {

                                legend: {
                                    display: false
                                }
                            },

                            scales: {

                                x: {

                                    beginAtZero: true,
                                    max: 100,

                                    ticks: {

                                        callback:
                                            value =>
                                                `${value}`
                                    }
                                }
                            }
                        }
                    }
                );
        }
    }
    // =========================================================
    // GENERATE BRIEF
    // =========================================================

    function generateBrief() {

        const filtered =
            getFilteredProjects();


        if (!filtered.length) {

            alert(
                "No projects match the selected filters."
            );

            return;
        }


        // =====================================================
        // CALCULATIONS
        // =====================================================

        const count =
            filtered.length;

        const highRisk =
            filtered.filter(
                p => p.riskLevel === "High"
            ).length;

        const mediumRisk =
            filtered.filter(
                p => p.riskLevel === "Medium"
            ).length;

        const lowRisk =
            filtered.filter(
                p => p.riskLevel === "Low"
            ).length;


        const originalCost =
            filtered.reduce(
                (sum, p) => sum + p.cost,
                0
            );

        const revised =
            filtered.reduce(
                (sum, p) => sum + p.revisedCost,
                0
            );

        const spent =
            filtered.reduce(
                (sum, p) => sum + p.expenditure,
                0
            );


        const increase =
            revised - originalCost;


        const overrun =
            originalCost
                ? (increase / originalCost) * 100
                : 0;


        const expenditurePercentage =
            revised
                ? (spent / revised) * 100
                : 0;


        const averageRisk =
            count
                ? filtered.reduce(
                    (sum, p) => sum + p.risk,
                    0
                ) / count
                : 0;


        const averagePhysicalProgress =
            count
                ? filtered.reduce(
                    (sum, p) => sum + p.progress,
                    0
                ) / count
                : 0;


        // =====================================================
        // UPDATE PROJECT COUNT
        // =====================================================

        projectCount.textContent =
            count;


        projectCountDetail.textContent =
            `${count} project${count !== 1 ? "s are" : " is"} included in the selected monitoring scope.`;


        // =====================================================
        // UPDATE HIGH RISK
        // =====================================================

if (highRiskCount) {
    highRiskCount.textContent = highRisk;
}

if (highRiskDetail) {
    highRiskDetail.textContent =
        `${highRisk} of ${count} selected project${count !== 1 ? "s" : ""} (${((highRisk / count) * 100).toFixed(1)}%) fall within the high-risk category.`;
}

        // =====================================================
        // UPDATE TOTAL COST
        // =====================================================

        totalCost.textContent =
            formatCrore(originalCost);


        totalCostDetail.textContent =
            `The selected projects have an original approved cost of ${formatCrore(originalCost)}.`;


        // =====================================================
        // UPDATE REVISED COST
        // =====================================================

        revisedCost.textContent =
            formatCrore(revised);


        costIncrease.textContent =
            `+${formatCrore(increase)}`;


        costOverrun.textContent =
            `+${overrun.toFixed(1)}%`;


        // =====================================================
        // UPDATE EXPENDITURE
        // =====================================================

        expenditure.textContent =
            formatCrore(spent);


        expenditureDetail.textContent =
            `${formatCrore(spent)} has been incurred, representing approximately ${expenditurePercentage.toFixed(1)}% of revised cost.`;


        // =====================================================
        // UPDATE SCOPE
        // =====================================================

        briefScope.textContent =
            getScopeText();


        // =====================================================
        // GENERATED DATE
        // =====================================================

        generatedDate.textContent =
            new Date().toLocaleDateString(
                "en-IN",
                {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                }
            );


        // =====================================================
        // TOP RISK PROJECTS
        // =====================================================

        const topRisk =
            [...filtered]
                .sort(
                    (a, b) => b.risk - a.risk
                )
                .slice(0, 5);


        // =====================================================
        // CLEAR EXISTING LIST
        // =====================================================

        riskProjectList.innerHTML = "";


        // =====================================================
        // CREATE TOP RISK PROJECT ITEMS
        // =====================================================

        topRisk.forEach(
            (project, index) => {

                const item =
                    document.createElement("div");


                item.className =
                    "flex items-center gap-3 border border-slate-200 rounded-md p-3";


                let riskColor =
                    "text-green-600";


                if (project.risk >= 80) {

                    riskColor =
                        "text-red-600";

                } else if (project.risk >= 70) {

                    riskColor =
                        "text-amber-600";
                }


                item.innerHTML = `

                    <span class="text-sm font-bold text-slate-400">
                        ${String(index + 1).padStart(2, "0")}
                    </span>


                    <div class="flex-1 min-w-0">

                        <p class="text-sm font-semibold text-slate-800 truncate">
                            ${project.name}
                        </p>


                        <p class="text-xs text-slate-500 mt-1">
                            ${project.sector} · ${project.status}
                        </p>

                    </div>


                    <span class="text-lg font-bold ${riskColor}">
                        ${project.risk}
                    </span>

                `;


                riskProjectList.appendChild(item);
            }
        );


        // =====================================================
        // AI KEY OBSERVATION
        // =====================================================

        const highestRisk =
            topRisk[0];


        if (highestRisk) {

            let observation =
                `${highRisk} high-risk project${highRisk !== 1 ? "s are" : " is"} present within the selected scope. `;


            observation +=
                `${highestRisk.name} has the highest risk score at ${highestRisk.risk}. `;


            if (overrun > 8) {

                observation +=
                    `The portfolio also shows notable cost escalation, with revised cost ${overrun.toFixed(1)}% above the original approved cost. `;

            } else if (overrun > 0) {

                observation +=
                    `The portfolio shows a ${overrun.toFixed(1)}% increase between original and revised cost. `;
            }


            observation +=
                `Management attention should focus on projects showing schedule slippage, cost exposure and gaps between financial and physical progress.`;


            keyObservation.textContent =
                observation;
        }


        // =====================================================
        // CREATE / REFRESH ALL CHARTS
        // =====================================================

        createCharts(filtered);


        // =====================================================
        // UPDATE SCOPE MESSAGE
        // =====================================================

        updateScopeMessage();


        // =====================================================
        // SCROLL TO BRIEF
        // =====================================================

        const briefSection =
            document.getElementById(
                "briefSection"
            );


        if (briefSection) {

            briefSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    }


    // =========================================================
    // CLEAR FILTERS
    // =========================================================

    function clearFilters() {

        searchInput.value = "";

        ministryFilter.value = "";

        sectorFilter.value = "";

        riskFilter.value = "";

        statusFilter.value = "";


        updateScopeMessage();
    }


    // =========================================================
    // UPDATE SCOPE MESSAGE
    // =========================================================

    function updateScopeMessage() {

        const count =
            getFilteredProjects().length;


        scopeMessage.textContent =
            `Current scope: ${getScopeText()} · ${count} matching project${count !== 1 ? "s" : ""}`;
    }


    // =========================================================
    // DOWNLOAD Exclusive Brief
    // =========================================================

    function downloadBrief() {

        const content = `

INFRALENS
EXCLUSIVE BRIEF

Scope:
${briefScope.textContent}

Generated:
${generatedDate.textContent}

----------------------------------------

A. NO. OF PROJECTS
${projectCount.textContent}

${projectCountDetail.textContent}


----------------------------------------

B. HIGH-RISK PROJECTS
${highRiskCount.textContent}

${highRiskDetail.textContent}


----------------------------------------

C. TOTAL COST
${totalCost.textContent}

${totalCostDetail.textContent}


----------------------------------------

D. REVISED COST
${revisedCost.textContent}

Cost Increase:
${costIncrease.textContent}

Cost Overrun:
${costOverrun.textContent}


----------------------------------------

E. CUMULATIVE EXPENDITURE
${expenditure.textContent}

${expenditureDetail.textContent}


----------------------------------------

F. TOP RISK PROJECTS

${Array.from(
    riskProjectList.children
)
.map(
    (item, index) => {

        const name =
            item.querySelector(
                "p"
            )?.textContent || "";

        const risk =
            item.querySelector(
                "span:last-child"
            )?.textContent || "";

        return `${index + 1}. ${name} — Risk Score: ${risk}`;
    }
)
.join("\n")}


----------------------------------------

KEY EXCLUSIVE OBSERVATION

${keyObservation.textContent}


----------------------------------------

INFRALENS
AI-Powered Infrastructure Monitoring
SIH 2026 Prototype

`;


        const blob =
            new Blob(
                [content],
                {
                    type:
                        "text/plain;charset=utf-8"
                }
            );


        const url =
            URL.createObjectURL(blob);


        const link =
            document.createElement("a");


        link.href =
            url;


        link.download =
            "INFRALENS-Exclusive-Brief.txt";


        document.body.appendChild(link);


        link.click();


        document.body.removeChild(link);


        URL.revokeObjectURL(url);
    }
        // =========================================================
    // EVENT LISTENERS
    // =========================================================

    // ---------------------------------------------------------
    // GENERATE BRIEF BUTTON
    // ---------------------------------------------------------

    if (generateBriefButton) {

        generateBriefButton.addEventListener(
            "click",
            () => {

                generateBrief();

            }
        );
    }


    // ---------------------------------------------------------
    // CLEAR FILTERS BUTTON
    // ---------------------------------------------------------

    if (clearFiltersButton) {

        clearFiltersButton.addEventListener(
            "click",
            () => {

                clearFilters();

                generateBrief();

            }
        );
    }


    // ---------------------------------------------------------
    // DOWNLOAD BUTTON
    // ---------------------------------------------------------

    if (downloadButton) {

        downloadButton.addEventListener(
            "click",
            () => {

                downloadBrief();

            }
        );
    }
// ---------------------------------------------------------
// WEATHER DELAY TOGGLE
// ---------------------------------------------------------

if (weatherDelayToggle) {
    weatherDelayToggle.addEventListener(
        "change",
        () => {
            generateBrief();
        }
    );
}

    // ---------------------------------------------------------
    // SEARCH INPUT
    // ---------------------------------------------------------

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            () => {

                updateScopeMessage();

            }
        );
    }


    // ---------------------------------------------------------
    // MINISTRY FILTER
    // ---------------------------------------------------------

    if (ministryFilter) {

        ministryFilter.addEventListener(
            "change",
            () => {

                updateScopeMessage();

            }
        );
    }


    // ---------------------------------------------------------
    // SECTOR FILTER
    // ---------------------------------------------------------

    if (sectorFilter) {

        sectorFilter.addEventListener(
            "change",
            () => {

                updateScopeMessage();

            }
        );
    }


    // ---------------------------------------------------------
    // RISK FILTER
    // ---------------------------------------------------------

    if (riskFilter) {

        riskFilter.addEventListener(
            "change",
            () => {

                updateScopeMessage();

            }
        );
    }


    // ---------------------------------------------------------
    // STATUS FILTER
    // ---------------------------------------------------------

    if (statusFilter) {

        statusFilter.addEventListener(
            "change",
            () => {

                updateScopeMessage();

            }
        );
    }


    // =========================================================
    // NAVIGATION LOGGING
    // =========================================================

    const navigationLinks =
        document.querySelectorAll(
            "nav a"
        );


    navigationLinks.forEach(link => {

        link.addEventListener(
            "click",
            () => {

                console.log(
                    `Navigating to: ${link.textContent.trim()}`
                );

            }
        );

    });


    // =========================================================
    // CHART CANVAS HOVER EFFECT
    // =========================================================

    const chartContainers =
        document.querySelectorAll(
            ".chart-container"
        );


    chartContainers.forEach(container => {

        container.addEventListener(
            "mouseenter",
            () => {

                container.classList.add(
                    "border-blue-200"
                );

            }
        );


        container.addEventListener(
            "mouseleave",
            () => {

                container.classList.remove(
                    "border-blue-200"
                );

            }
        );

    });


    // =========================================================
    // CURRENT YEAR
    // =========================================================

    const currentYear =
        document.getElementById(
            "currentYear"
        );


    if (currentYear) {

        currentYear.textContent =
            new Date().getFullYear();

    }


    // =========================================================
    // INITIAL SCOPE MESSAGE
    // =========================================================

    updateScopeMessage();


    // =========================================================
    // INITIAL BRIEF LOAD
    // =========================================================

    generateBrief();


    // =========================================================
    // INITIALIZATION LOG
    // =========================================================

    console.log(
        "INFRALENS Exclusive Brief initialized."
    );

});