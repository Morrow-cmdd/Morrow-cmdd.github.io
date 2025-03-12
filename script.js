
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
    var quantityInput = document.getElementById("quantity");
    var promoInput = document.getElementById("promo");
    var totalPriceElement = document.getElementById("total-price");
    var discountLabel = document.getElementById("discount-label");

    var basePricePerTicket = 500; // Цена за 1 билет

    var promoCodes = {
        "VOTAKOI": 0.1,  // 10%
        "SUPER50": 0.5,  // 50%
        "DISCOUNT20": 0.2 // 20%
    };

    function updateTotalPrice() {
        var quantity = parseInt(quantityInput.value) || 1;
        if (quantity < 1) quantity = 1;

        var promoCode = promoInput.value.trim().toUpperCase();
        var discount = promoCodes[promoCode] || 0;

        var total = basePricePerTicket * quantity;
        var discountedTotal = total - (total * discount);

        totalPriceElement.textContent = Math.round(discountedTotal) + " ";

        if (discount > 0) {
            discountLabel.textContent = "-" + (discount * 100) + "% скидка";
            discountLabel.style.display = "block";
        } else {
            discountLabel.style.display = "none";
        }
    }

    // Обновление при изменении количества билетов
    quantityInput.addEventListener("input", updateTotalPrice);

    // Обновление при вводе промокода
    promoInput.addEventListener("input", updateTotalPrice);
});


document.getElementById("quantity").addEventListener("input", function() {
    var quantity = this.value;

    // Позволяем временно оставить поле пустым, не заменяя на 1 сразу
    if (quantity === "") return;

    quantity = parseInt(quantity) || 1;
    if (quantity < 1) quantity = 1;
    
    this.value = quantity;
    document.querySelector(".total-price").textContent = (500 * quantity) + " ₽";
});

function submitForm() {
    // Собираем остальные данные формы
    var name = document.getElementById("name").value;
    var phone = document.getElementById("phone").value;
    var promo = document.getElementById("promo").value.trim() === "" ? "Нет промокода" : document.getElementById("promo").value;
    var quantity = document.getElementById("quantity").value;
    var totalPrice = document.getElementById("total-price").innerText;

    // Логируем данные формы для отладки
    console.log("Данные формы:", { name, phone, promo, quantity, totalPrice });

    // Код отправки в Telegram
    var botToken = "6211414542:AAGbIdZ2IRat7fXPMdDl-YTXuuQPfTRRgl8";
    var chatId = "1366351508";
    var message = "📩 Новый заказ билета\n\n" +
                  "👤 Имя: " + name + "\n" +
                  "📞 Телефон: " + phone + "\n" +
                  "🎫 Количество билетов: " + quantity + "\n" +
                  "💰 Общая сумма: " + totalPrice + "\n" +
                  "🎟 Промокод: " + promo;

    // Формируем URL для отправки сообщения через Telegram Bot API
    var url = 'https://api.telegram.org/bot' + botToken + '/sendMessage?chat_id=' + chatId + '&text=' + encodeURIComponent(message) + '&parse_mode=HTML';

    // Отправка запроса с использованием fetch
    fetch(url)
        .then(function(response) { return response.json(); })
        .then(function(data) {
            console.log(data);  // Логируем ответ от Telegram API
            if (data.ok) {
                alert("Данные отправлены в Telegram!");
            } else {
                alert("Ошибка при отправке. Проверьте настройки бота.");
            }
        })
        .catch(function(error) {
            alert("Ошибка сети: " + error.message);
        });
}

