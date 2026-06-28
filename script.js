document.addEventListener("DOMContentLoaded", () => {
    // 1. КАСТОМНЫЙ КУРСОР
    const dot = document.querySelector(".custom-cursor-dot");
    if (dot && window.innerWidth > 768) {
        document.addEventListener("mousemove", (e) => {
            dot.style.opacity = "1";
            dot.style.left = `${e.clientX}px`;
            dot.style.top = `${e.clientY}px`;
        });
        document.addEventListener("mouseleave", () => {
            dot.style.opacity = "0";
        });
    }

    // 2. SCROLL REVEAL
    const revealTargets = document.querySelectorAll(".scroll-reveal");
    revealTargets.forEach(target => target.classList.add("js-prep"));

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("scroll-reveal-active");
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.05 });
    
    revealTargets.forEach(target => revealObserver.observe(target));

    // 3. ФИЛЬТРАЦИЯ ПОРТФОЛИО
    const filterButtons = document.querySelectorAll(".filter-btn");
    const portfolioCards = document.querySelectorAll(".portfolio-item-card");

    filterButtons.forEach(button => {
        button.addEventListener("click", () => {
            filterButtons.forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");

            const filterValue = button.getAttribute("data-filter");
            portfolioCards.forEach(card => {
                const cat = card.getAttribute("data-category");
                if (filterValue === "all" || cat === filterValue) {
                    card.classList.remove("hide");
                } else {
                    card.classList.add("hide");
                }
            });
        });
    });

    // 4. ЖИВОЙ КАЛЬКУЛЯТОР
    const tiles = document.querySelectorAll(".selector-tile");
    const checkTg = document.getElementById("addon-tg");
    const checkAnim = document.getElementById("addon-anim");
    const priceDisplay = document.getElementById("live-price-display");

    let currentType = "landing";
    let basePrices = { "landing": 750, "service": 1500, "store": 3000 };

    function calculateTotal() {
        let total = basePrices[currentType];
        if (checkTg && checkTg.checked) total += 200;
        if (checkAnim && checkAnim.checked) total += 150;
        if (priceDisplay) priceDisplay.textContent = total;
    }

    tiles.forEach(tile => {
        tile.addEventListener("click", () => {
            tiles.forEach(t => t.classList.remove("active"));
            tile.classList.add("active");
            currentType = tile.getAttribute("data-type");
            calculateTotal();
        });
    });

    [checkTg, checkAnim].forEach(checkbox => {
        if (checkbox) checkbox.addEventListener("change", calculateTotal);
    });

    // 5. ОТПРАВКА ФОРМЫ
    const form = document.getElementById("portfolio-interactive-form");
    const submitBtn = document.getElementById("form-submit-trigger");
    const successState = document.getElementById("form-success-state");

    if (form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault(); 

            // Блокируем кнопку
            submitBtn.classList.add("disabled");
            const spinner = submitBtn.querySelector(".spinner");
            if (spinner) spinner.classList.remove("hidden");

            const formData = new FormData(form);

            fetch("/", {
                method: "POST",
                headers: { "Content-Type": "application/x-www-form-urlencoded" },
                body: new URLSearchParams(formData).toString(),
            })
            .then(() => {
                // Скрываем форму и показываем блок успеха
                form.style.display = "none";
                if (successState) successState.classList.remove("hidden");
            })
            .catch((error) => {
                console.error("Ошибка:", error);
                alert("Ошибка отправки, попробуйте еще раз.");
                // Разблокируем кнопку, чтобы можно было попробовать снова
                submitBtn.classList.remove("disabled");
                if (spinner) spinner.classList.add("hidden");
            });
        });
    }
});
