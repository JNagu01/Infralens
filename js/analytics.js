document.addEventListener("DOMContentLoaded", () => {

    console.log("Infralens Analytics initialized.");

    /*
     * ---------------------------------------------------------
     * PROGRESS BAR ANIMATION
     * ---------------------------------------------------------
     */

    const progressBars = document.querySelectorAll(
        '[style*="width:"]'
    );

    progressBars.forEach((bar, index) => {

        const targetWidth = bar.style.width;

        if (!targetWidth) {
            return;
        }

        bar.style.width = "0%";

        setTimeout(() => {

            bar.style.transition = "width 700ms ease";

            bar.style.width = targetWidth;

        }, 100 + index * 60);

    });


    /*
     * ---------------------------------------------------------
     * BAR GRAPH ANIMATION
     * ---------------------------------------------------------
     */

    const graphBars = document.querySelectorAll(
        '[style*="height:"]'
    );

    graphBars.forEach((bar, index) => {

        const targetHeight = bar.style.height;

        if (!targetHeight) {
            return;
        }

        bar.style.height = "0%";

        setTimeout(() => {

            bar.style.transition = "height 700ms ease";

            bar.style.height = targetHeight;

        }, 100 + index * 60);

    });


    /*
     * ---------------------------------------------------------
     * CARD HOVER
     * ---------------------------------------------------------
     */

    const cards = document.querySelectorAll(
        ".bg-white.border"
    );

    cards.forEach(card => {

        card.addEventListener("mouseenter", () => {

            card.classList.add(
                "border-[#18A5DC]"
            );

        });


        card.addEventListener("mouseleave", () => {

            card.classList.remove(
                "border-[#18A5DC]"
            );

        });

    });


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