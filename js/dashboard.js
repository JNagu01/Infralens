/* =========================================================
   INFRALENS
   DASHBOARD JAVASCRIPT
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {


    // =====================================================
    // PAGE LOAD
    // =====================================================

    console.log(
        "Infralens Dashboard initialized."
    );


    // =====================================================
    // SMOOTH NAVIGATION
    // =====================================================

    document.querySelectorAll(
        'a[href$=".html"]'
    ).forEach(link => {

        link.addEventListener(
            "click",
            event => {

                const href =
                    link.getAttribute("href");


                if (!href || href.startsWith("#")) {
                    return;
                }


                // Allow normal navigation
                console.log(
                    `Navigating to ${href}`
                );

            }
        );

    });


    // =====================================================
    // PORTFOLIO METRIC INTERACTION
    // =====================================================

    const metricCards =
        document.querySelectorAll(
            "main section .bg-white.border"
        );


    metricCards.forEach(card => {

        card.addEventListener(
            "mouseenter",
            () => {

                card.classList.add(
                    "border-[#18A5DC]"
                );

            }
        );


        card.addEventListener(
            "mouseleave",
            () => {

                card.classList.remove(
                    "border-[#18A5DC]"
                );

            }
        );

    });


    // =====================================================
    // RISK INDICATOR ANIMATION
    // =====================================================

    const progressBars =
        document.querySelectorAll(
            '[style*="width:"]'
        );


    progressBars.forEach(bar => {

        const originalWidth =
            bar.style.width;


        if (!originalWidth) {
            return;
        }


        bar.style.width = "0%";


        requestAnimationFrame(() => {

            setTimeout(() => {

                bar.style.transition =
                    "width 800ms ease";

                bar.style.width =
                    originalWidth;

            }, 100);

        });

    });


    // =====================================================
    // RISK SCORE HIGHLIGHT
    // =====================================================

    const riskScore =
        Array.from(
            document.querySelectorAll("p")
        ).find(
            element =>
                element.textContent.trim() === "54"
        );


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

        }, 600);

    }


    // =====================================================
    // HIGH-RISK PROJECT ROWS
    // =====================================================

    const highRiskRows =
        document.querySelectorAll(
            ".divide-y > div"
        );


    highRiskRows.forEach(row => {

        row.addEventListener(
            "click",
            () => {

                const projectName =
                    row.querySelector(
                        "p.text-sm"
                    )?.textContent.trim();


                if (!projectName) {
                    return;
                }


                console.log(
                    `Selected high-risk project: ${projectName}`
                );

            }
        );

        row.classList.add(
            "cursor-pointer"
        );

    });


    // =====================================================
    // UPDATE YEAR
    // =====================================================

    const yearElements =
        document.querySelectorAll(
            "[data-current-year]"
        );


    yearElements.forEach(element => {

        element.textContent =
            new Date().getFullYear();

    });


});
const notificationBell = document.getElementById("notificationBell");
const notificationPanel = document.getElementById("notificationPanel");

if (notificationBell && notificationPanel) {
    notificationBell.addEventListener("click", (event) => {
        event.stopPropagation();
        notificationPanel.classList.toggle("hidden");
    });

    document.addEventListener("click", (event) => {
        if (!notificationPanel.contains(event.target) &&
            !notificationBell.contains(event.target)) {
            notificationPanel.classList.add("hidden");
        }
    });
}