document.addEventListener("DOMContentLoaded", () => {

    // =========================
    // 1. КООРДИНАТЫ МАРШРУТА
    // =========================
    const points = [
        [59.9797, 30.2686], // Елагин дворец
        [59.9792, 30.2669], // Кухонный корпус
        [59.9788, 30.2655], // Оранжерея
        [59.9782, 30.2638], // Музыкальный павильон
        [59.9776, 30.2625]  // Пристань со львами
    ];

    // =========================
    // 2. ИНИЦИАЛИЗАЦИЯ КАРТЫ
    // =========================
    const map = L.map('map').setView(points[0], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // =========================
    // 3. МАРКЕРЫ
    // =========================
    const markers = points.map((point, index) => {
        return L.marker(point).addTo(map).bindPopup(`Точка ${index + 1}`);
    });

    // =========================
    // 4. ЛИНИЯ МАРШРУТА
    // =========================
    const routeLine = L.polyline(points, {
        weight: 4
    }).addTo(map);

    map.fitBounds(routeLine.getBounds());

    // =========================
    // 5. ДВИЖУЩИЙСЯ МАРКЕР
    // =========================
    let movingMarker = L.marker(points[0]).addTo(map);

    let currentIndex = 0;

    function animateRoute() {
        currentIndex = 0;

        function step() {
            if (currentIndex >= points.length) return;

            movingMarker.setLatLng(points[currentIndex]);
            map.panTo(points[currentIndex]);

            highlightStep(currentIndex + 1);

            currentIndex++;

            setTimeout(step, 1500);
        }

        step();
    }

    animateRoute();

    // =========================
    // 6. КАРТОЧКИ
    // =========================
    const cards = document.querySelectorAll(".card");

    function highlightStep(stepNumber) {
        cards.forEach(card => card.classList.remove("active"));

        const activeCard = document.querySelector(`.card[data-step="${stepNumber}"]`);
        if (activeCard) {
            activeCard.classList.add("active");
        }
    }

    // =========================
    // 7. СКРОЛЛ → СИНХРОНИЗАЦИЯ
    // =========================
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {

                const step = entry.target.getAttribute("data-step");

                highlightStep(step);

                const index = step - 1;

                map.panTo(points[index]);

                markers.forEach(m => m.setOpacity(0.4));
                markers[index].setOpacity(1);
            }
        });
    }, {
        threshold: 0.6
    });

    cards.forEach(card => observer.observe(card));

    // =========================
    // 8. КЛИК ПО КАРТОЧКЕ
    // =========================
    cards.forEach((card, index) => {
        card.addEventListener("click", () => {
            map.setView(points[index], 16);
            movingMarker.setLatLng(points[index]);
            highlightStep(index + 1);
        });
    });

    // =========================
    // 9. MODAL WINDOW
    // =========================
    const modal = document.getElementById("modal");
    const modalTitle = document.getElementById("modalTitle");
    const modalText = document.getElementById("modalText");
    const closeModal = document.getElementById("closeModal");

    const details = [
        {
            title: "Елагин дворец",
            text: "Архитектурный ансамбль в стиле классицизма, спроектированный Карлом Росси. Использовался как летняя императорская резиденция."
        },
        {
            title: "Кухонный корпус",
            text: "Служебное здание, обеспечивавшее функционирование дворца. Здесь готовилась пища для резиденции."
        },
        {
            title: "Оранжерея",
            text: "Помещение для выращивания экзотических растений, характерное для дворцовых парков XVIII–XIX веков."
        },
        {
            title: "Музыкальный павильон",
            text: "Площадка для проведения концертов и культурных мероприятий в парковой зоне."
        },
        {
            title: "Пристань со львами",
            text: "Декоративная пристань, украшенная скульптурами львов, символизирующих силу и охрану."
        }
    ];

    function openModal(index) {
        modal.classList.remove("hidden");
        modalTitle.textContent = details[index].title;
        modalText.textContent = details[index].text;
    }

    closeModal.onclick = () => modal.classList.add("hidden");

    modal.onclick = (e) => {
        if (e.target === modal) modal.classList.add("hidden");
    };

    // кнопки "Подробнее"
    document.querySelectorAll(".more-btn").forEach((btn, index) => {
        btn.addEventListener("click", (e) => {
            e.stopPropagation();
            openModal(index);
        });
    });

    // =========================
    // 10. ПЛАВНАЯ ПОДСВЕТКА ПРИ ЗАГРУЗКЕ
    // =========================
    highlightStep(1);

});
