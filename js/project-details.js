document.addEventListener("DOMContentLoaded", () => {

    console.log("Infralens Project Details initialized.");

    /*
     * ---------------------------------------------------------
     * DEMO PROJECT DATA
     * ---------------------------------------------------------
     * Later this object can be replaced with FastAPI data.
     */

    const project = {

        id: "INF-001",

        name: "Eastern Highway Development",

        description:
            "Major highway infrastructure development project under the Roads & Highways sector.",

        ministry: "Road Transport & Highways",

        sector: "Roads & Highways",

        state: "Maharashtra",

        year: "2024-25",

        status: "Delayed",

        riskScore: 91,

        riskZone: "High Risk",

        originalCost: "₹42,500 Cr",

        revisedCost: "₹47,200 Cr",

        expenditure: "₹28,700 Cr",

        physicalProgress: 62,

        financialProgress: 68,

        timeElapsed: 72,

        remainingWork: 38,

        progressGap: 6,

        expectedCompletion: "Dec 2027"

    };


    /*
     * ---------------------------------------------------------
     * HELPER
     * ---------------------------------------------------------
     */

    function setText(id, value) {

        const element = document.getElementById(id);

        if (element) {
            element.textContent = value;
        }

    }


    /*
     * ---------------------------------------------------------
     * POPULATE PROJECT INFORMATION
     * ---------------------------------------------------------
     */

    setText("projectId", project.id);
    setText("projectName", project.name);
    setText("projectDescription", project.description);

    setText("projectMinistry", project.ministry);
    setText("projectSector", project.sector);
    setText("projectState", project.state);
    setText("projectYear", project.year);

    setText("projectStatus", project.status);

    setText("riskScore", project.riskScore);
    setText("riskZone", project.riskZone);

    setText("originalCost", project.originalCost);
    setText("revisedCost", project.revisedCost);
    setText("expenditure", project.expenditure);

    setText(
        "physicalProgress",
        `${project.physicalProgress}%`
    );

    setText(
        "financialProgress",
        `${project.financialProgress}%`
    );

    setText(
        "progressGap",
        `+${project.progressGap}%`
    );

    setText(
        "timeElapsed",
        `${project.timeElapsed}%`
    );

    setText(
        "remainingWork",
        `${project.remainingWork}%`
    );

    setText(
        "expectedCompletion",
        project.expectedCompletion
    );


    /*
     * ---------------------------------------------------------
     * PROGRESS BARS
     * ---------------------------------------------------------
     */

    const physicalBar =
        document.getElementById("physicalBar");

    const financialBar =
        document.getElementById("financialBar");


    if (physicalBar) {

        physicalBar.style.width =
            `${project.physicalProgress}%`;

    }


    if (financialBar) {

        financialBar.style.width =
            `${project.financialProgress}%`;

    }


    /*
     * ---------------------------------------------------------
     * MONTHLY PROGRESS GRAPH
     * ---------------------------------------------------------
     *
     * Static demo data for now.
     * Later this will come from backend/model data.
     */

    const monthlyProgress = [
        {
            month: "Jan",
            value: 38
        },
        {
            month: "Feb",
            value: 43
        },
        {
            month: "Mar",
            value: 47
        },
        {
            month: "Apr",
            value: 52
        },
        {
            month: "May",
            value: 57
        },
        {
            month: "Jun",
            value: 62
        }
    ];


    const chartContainer =
        document.getElementById("progressChart");


    if (chartContainer) {

        chartContainer.innerHTML = "";


        monthlyProgress.forEach(item => {

            const wrapper =
                document.createElement("div");

            wrapper.className =
                "flex-1 h-full flex flex-col justify-end items-center";


            const value =
                document.createElement("span");

            value.className =
                "text-xs text-slate-500 mb-2";

            value.textContent =
                `${item.value}%`;


            const bar =
                document.createElement("div");

            bar.className =
                "w-full max-w-[42px] rounded-t-md bg-[#15158A]";

            bar.style.height =
                `${item.value}%`;


            const label =
                document.createElement("span");

            label.className =
                "hidden";


            wrapper.appendChild(value);
            wrapper.appendChild(bar);
            wrapper.appendChild(label);

            chartContainer.appendChild(wrapper);

        });

    }


    /*
     * ---------------------------------------------------------
     * SIMPLE BAR ANIMATION
     * ---------------------------------------------------------
     */

    const bars =
        document.querySelectorAll(
            "#progressChart div[class*='bg-']"
        );


    bars.forEach((bar, index) => {

        const targetHeight =
            bar.style.height;

        bar.style.height = "0%";

        setTimeout(() => {

            bar.style.transition =
                "height 700ms ease";

            bar.style.height =
                targetHeight;

        }, 100 + index * 100);

    });


    /*
     * ---------------------------------------------------------
     * RISK SCORE HIGHLIGHT
     * ---------------------------------------------------------
     */

    const riskScore =
        document.getElementById("riskScore");


    if (riskScore) {

        riskScore.classList.add(
            "transition-transform",
            "duration-500"
        );


        setTimeout(() => {

            riskScore.classList.add(
                "scale-110"
            );


            setTimeout(() => {

                riskScore.classList.remove(
                    "scale-110"
                );

            }, 500);

        }, 700);

    }


    /*
     * ---------------------------------------------------------
     * CURRENT YEAR
     * ---------------------------------------------------------
     */

    document
        .querySelectorAll("[data-current-year]")
        .forEach(element => {

            element.textContent =
                new Date().getFullYear();

        });

});