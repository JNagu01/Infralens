document.addEventListener("DOMContentLoaded", () => {

    console.log("INFRALENS Data Quality Center initialized.");

    // ---------------------------------------------------------
    // Subtle hover interaction for quality check cards
    // ---------------------------------------------------------

    const checkCards = document.querySelectorAll(
        "section .hover\\:border-\\[\\#18A5DC\\]"
    );

    checkCards.forEach(card => {

        card.addEventListener("mouseenter", () => {
            card.classList.add("shadow-sm");
        });

        card.addEventListener("mouseleave", () => {
            card.classList.remove("shadow-sm");
        });

    });


    // ---------------------------------------------------------
    // Animate progress indicators
    // ---------------------------------------------------------

    const progressBars = document.querySelectorAll('[style*="width:"]');

    progressBars.forEach(bar => {

        const originalWidth = bar.style.width;

        if (!originalWidth) return;

        bar.style.width = "0%";

        requestAnimationFrame(() => {

            setTimeout(() => {

                bar.style.transition = "width 700ms ease";

                bar.style.width = originalWidth;

            }, 100);

        });

    });


    // ---------------------------------------------------------
    // Review buttons
    // ---------------------------------------------------------

    const reviewButtons = document.querySelectorAll("button");

    reviewButtons.forEach(button => {

        button.addEventListener("click", () => {

            const row = button.closest("tr");

            if (!row) return;

            const project =
                row.querySelector("td:first-child")?.textContent.trim();

            const field =
                row.querySelector("td:nth-child(2)")?.textContent.trim();

            console.log(
                `Data quality review requested: ${project} - ${field}`
            );

        });

    });

});
document.getElementById("missingFieldsCard")
    ?.addEventListener("click", () => {
        document.getElementById("missing-fields-section")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    });

document.getElementById("roundValuesCard")
    ?.addEventListener("click", () => {
        document.getElementById("round-values-section")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    });

document.getElementById("duplicateReportsCard")
    ?.addEventListener("click", () => {
        document.getElementById("duplicate-reports-section")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    });

document.getElementById("marchRushCard")
    ?.addEventListener("click", () => {
        document.getElementById("march-rush-section")
            ?.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
    });