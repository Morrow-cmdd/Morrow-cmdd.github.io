
document.addEventListener("DOMContentLoaded", function () {
    var phoneInput = document.getElementById("phone");
    var nameInput = document.getElementById("name");
    var telegramInput = document.getElementById("telegram");

    // Функция для форматирования номера
    function formatPhone(value) {
        var numbers = value.replace(/\D/g, ""); // Удаляем всё, кроме цифр

        // Гарантируем, что номер начинается с 7
        if (numbers.length === 0 || numbers[0] !== "7") {
            numbers = "7" + numbers;
        }

        var formatted = "+7 ";
        if (numbers.length > 1) formatted += "(" + numbers.slice(1, 4);
        if (numbers.length >= 5) formatted += ") " + numbers.slice(4, 7);
        if (numbers.length >= 8) formatted += "-" + numbers.slice(7, 9);
        if (numbers.length >= 10) formatted += "-" + numbers.slice(9, 11);

        return formatted;
    }

    // Обработчик ввода номера
    phoneInput.addEventListener("input", function (event) {
        var value = event.target.value;
        phoneInput.value = formatPhone(value);
    });

    // Блокировка удаления +7
    phoneInput.addEventListener("keydown", function (event) {
        if ((event.key === "Backspace" || event.key === "Delete") && phoneInput.value.length <= 4) {
            event.preventDefault();
        }
    });

    // Фильтрация имени (только 2 слова на русском)
    nameInput.addEventListener("input", function () {
        var value = nameInput.value.trim();
        var words = value.split(/\s+/).filter(word => word.length > 0);

        // Оставляем только русские буквы
        value = words.map(word => word.replace(/[^а-яА-ЯёЁ]/g, "")).join(" ");

        if (words.length > 2) {
            value = words.slice(0, 2).join(" ");
        }

        nameInput.value = value;
    });

    // Фильтрация Telegram username
    telegramInput.addEventListener("input", function () {
        var value = telegramInput.value.trim();

        if (!value.startsWith("@")) {
            value = "@" + value;
        }

        // Разрешаем только @, латиницу, цифры и _
        value = value.replace(/[^@a-zA-Z0-9_]/g, "");

        telegramInput.value = value;
    });
});

document.addEventListener("DOMContentLoaded", function () {
    const submitButton = document.querySelector(".btn-submit");
    const phoneInput = document.getElementById("phone");
    const nameInput = document.getElementById("name");
    const quantityInput = document.getElementById("quantity");
    const promoInput = document.getElementById("promo");
    const totalPriceElement = document.getElementById("total-price");

async function submitForm() {
    const userId = "123456789"; // Подставь реальный user_id
    const name = nameInput.value;
    const phone = phoneInput.value;
    const quantity = quantityInput.value;
    const totalPrice = totalPriceElement.innerText;

    try {
        const response = await fetch("http://127.0.0.1:5000/send_ticket_info", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                user_id: userId,
                name: name,
                phone: phone,
                quantity: quantity,
                total_price: totalPrice
            })
        });

        const result = await response.json();
        console.log(result);

        if (response.ok) {
            alert("Данные отправлены в Telegram!");
        } else {
            alert("Ошибка при отправке. Проверьте настройки сервера.");
        }
    } catch (error) {
        console.error("Ошибка:", error);
        alert("Ошибка при отправке данных. Попробуйте позже.");
    }
}

    // Добавляем обработчик события на кнопку
    if (submitButton) {
        submitButton.addEventListener("click", submitForm);
    } else {
        console.error("Кнопка не найдена!");
    }

    // Форматирование телефона
    function formatPhone(value) {
        var numbers = value.replace(/\D/g, "");
        if (numbers.length === 0 || numbers[0] !== "7") {
            numbers = "7" + numbers;
        }
        var formatted = "+7 ";
        if (numbers.length > 1) formatted += "(" + numbers.slice(1, 4);
        if (numbers.length >= 5) formatted += ") " + numbers.slice(4, 7);
        if (numbers.length >= 8) formatted += "-" + numbers.slice(7, 9);
        if (numbers.length >= 10) formatted += "-" + numbers.slice(9, 11);
        return formatted;
    }

    phoneInput.addEventListener("input", function (event) {
        var value = event.target.value;
        phoneInput.value = formatPhone(value);
    });


    // Слушатель для изменения количества билетов и обновления общей стоимости
    const basePricePerTicket = 500; // Базовая стоимость билета
    const promoCodes = {
        "VOTAKOI": 0.1,  // 10% скидка
        "SUPER50": 0.5,  // 50% скидка
        "DISCOUNT20": 0.2 // 20% скидка
    };

    function updateTotalPrice() {
        var quantity = parseInt(quantityInput.value) || 1; // Количество билетов
        if (quantity < 1) quantity = 1;

        var promoCode = promoInput.value.trim().toUpperCase();
        var discount = promoCodes[promoCode] || 0;

        var total = basePricePerTicket * quantity;
        var discountedTotal = total - (total * discount);

        totalPriceElement.textContent = Math.round(discountedTotal) + " ₽"; // Обновляем цену

        if (discount > 0) {
            discountLabel.textContent = "-" + (discount * 100) + "% скидка";
            discountLabel.style.display = "block";
        } else {
            discountLabel.style.display = "none";
        }
    }

    quantityInput.addEventListener("input", updateTotalPrice); // Обновление при изменении количества билетов
    promoInput.addEventListener("input", updateTotalPrice); // Обновление при вводе промокода


});
