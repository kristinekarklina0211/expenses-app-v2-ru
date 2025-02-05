// 1. Константы
const STATUS_IN_LIMIT = "всё хорошо";
const STATUS_OUT_OF_LIMIT = "всё плохо";
const STORAGE_LABEL_LIMIT = "limit";
const STORAGE_LABEL_EXPENSES = "expenses";

const CURRENCY = "EUR";
const INITIAL_SUM = 0;
const INITIAL_LIMIT = 2000;
const STATUS_OUT_OF_LIMIT_CLASSNAME = "stats__status-red";

// 2. Переменные
let limit = INITIAL_LIMIT;

// Объявление переменных – ссылок на HTML элементы
const inputNode = document.querySelector(".js-input");
const currencyNodes = document.querySelectorAll(".js-input__currency");
const categoryNode = document.querySelector(".js-category");
const addBtnNode = document.querySelector(".js-add-btn");
const historyNode = document.querySelector(".js-history__list");
const limitNode = document.querySelector(".js-limit");
const sumNode = document.querySelector(".js-sum");
const statusNode = document.querySelector(".js-status");
const clearBtnNode = document.querySelector(".js-clear-btn");
const errorMessageNode = document.querySelector(".js-error-message");

// Объявление нашей основной переменной expenses.
// При запуске она содержит в себе пустой массив, который мы пополняем по нажатию на кнопку "Добавить"
let expenses = [];

// ФУНКЦИИ ------------------------------------------------------

// Загружаем данные из localStorage
const loadExpensesFromStorage = () => {
    const expensesFromStorageString = localStorage.getItem(STORAGE_LABEL_EXPENSES);
    const expensesFromStorage = JSON.parse(expensesFromStorageString);

    if (Array.isArray(expensesFromStorage)) {
        return expensesFromStorage;
    } else {
        return [];
    }
};

expenses = loadExpensesFromStorage();

// Запуск приложения (инициализация)
init();

// Сохраняем данные в localStorage
const saveExpensesToStorage = () => {
    const expensesString = JSON.stringify(expenses);
    localStorage.setItem(STORAGE_LABEL_EXPENSES, expensesString);
};

// 1. Считаем и возвращаем сумму всех трат
// (эта функция идёт самой первой, чтобы другие функции работали)
function calculateExpenses() {
    let sum = 0;

    expenses.forEach(element => {
        // Пробегаем по массиву объектов expenses,
        // берём из каждого поля amount,
        // и прибавляем к переменной sum
        sum += element.amount;
    });

    return sum;
}

// 2.1. Задаём изначальный лимит
function initLimit() {
    // Получаем лимит из localStorage
    const limitFromStorage = parseInt(localStorage.getItem(STORAGE_LABEL_LIMIT));
    // Присваиваем глобальной переменной значение limitFromStorage или изначальное значение, если не задан
    limit = limitFromStorage || INITIAL_LIMIT;
    limitNode.innerText = `${limit} ${CURRENCY}`;
}

// 2. Задаём первоначальные значения
function init() {
    currencyNodes.forEach(currencyNode => {
        currencyNode.innerText = CURRENCY;
    });
    initLimit();
    sumNode.innerText = `${calculateExpenses()} ${CURRENCY}`;
    statusNode.innerText = STATUS_IN_LIMIT;
    categoryNode.selectedIndex = 0;
    render();
}

// 3. Получаем введённую пользователем сумму
const getExpenseFromUser = () => parseInt(inputNode.value);

// 3.1 Очищаем поле ввода суммы
const clearInput = (input) => {
    input.value = "";
};

// 4. Получаем категорию трат
const getCategoryFromUser = () => categoryNode.value.toLowerCase();

// 5. Собираем данные от пользователя и сохраняем их в массив расходов expenses
const addExpense = () => {
    // 1. Получаем введённую пользователем сумму и сохраняем её в переменную amount
    const amount = getExpenseFromUser();

    // Если сумма не введена, то выполнение функции прерывается
    if (!amount) {
        showError("Введите сумму!");
        return;
    }
    
    // 2. Сохраняем выбранную пользователем категорию в переменную category
    const category = getCategoryFromUser();

    // Если категория не введена, то выполнение функции прерывается
    if (categoryNode.selectedIndex === 0) {
        showError("Выберите категорию!");
        return null;
    }

    // 3. Из полученных переменных собираем объект newExpense, который состоит из двух полей –
    // amount, в которое записано значение переменной amount,
    // и category, в которое записано значение переменной category
    const newExpense = { amount, category };

    // 4. Сохраняем объект с тратой и категорией в массив расходов expenses
    expenses.push(newExpense);
    saveExpensesToStorage();

    // 5. Сбрасываем введённую сумму
    clearInput(inputNode);

    // 6. Сбрасываем категорию
    clearCategory();
};

// 6.1 Выводим список трат
function renderHistory() {
    historyNode.innerHTML = "";

    expenses.forEach(element => {
        const historyItem = document.createElement("li");
        historyItem.innerText = `${element.amount} ${CURRENCY} – ${element.category}`;
        historyNode.appendChild(historyItem);
    });
}

// 6.2 Выводим сумму
function renderSum(sum) {
    sumNode.innerText = `${sum} ${CURRENCY}`;
}

// 6.3.1 Считаем дефицит для выведения статуса
function getDeficit() {
    const sum = calculateExpenses();
    const deficit = limit - sum;

    return deficit;
}

// 6.3 Выводим статус
function renderStatus() {
    const sum = calculateExpenses();
    
    if (sum <= limit) {
        statusNode.innerText = STATUS_IN_LIMIT;
        statusNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
    } else {
        statusNode.innerText = `${STATUS_OUT_OF_LIMIT} (${getDeficit()} ${CURRENCY})`;
        statusNode.classList.add(STATUS_OUT_OF_LIMIT_CLASSNAME);
    }
}

// 6. Выводим все данные в интерфейс
function render() {
    const sum = calculateExpenses();

    renderHistory();
    renderSum(sum);
    renderStatus();
}

// 7.1 Сбрасываем массив расходов
const clearExpenses = () => {
    localStorage.removeItem(STORAGE_LABEL_EXPENSES); // Удаляем расходы из localStorage
    expenses = []; // Очищаем массив в коде
};

// 7.2 Сбрасывам категорию
const clearCategory = () => {
    categoryNode.selectedIndex = 0;
};

// 7.3 Сбрасываем историю
const clearHistory = () => {
    historyNode.innerHTML = "";
};

// 7.4 Сбрасываем сумму до 0
const clearSum = () => {
    const sum = INITIAL_SUM;
    sumNode.innerText = `${sum} ${CURRENCY}`;
};

// 7.5 Сбрасываем статус до "всё хорошо"
const clearStatus = () => {
    statusNode.innerText = STATUS_IN_LIMIT;
    statusNode.classList.remove(STATUS_OUT_OF_LIMIT_CLASSNAME);
};

// 7. Сбрасываем всё после нажатия на кнопку "Сбросить расходы"
const clear = () => {
    clearExpenses();

    clearCategory();

    clearHistory();

    clearSum();

    clearStatus();
    
    render();
};

// ОСНОВНЫЕ ФУНКЦИИ

// Функция-обработчик, которая будет вызвана при нажатии на кнопку "Добавить"
const addBtnHandler = () => {
    // 1. Собираем данные от пользователя и сохраняем их в массив расходов expenses
    addExpense();

    // 2. Выводим данные в интерфейс
    render();
};

const clearBtnHandler = () => {
    clear();
};

// Привязка функций-обработчиков к кнопкам
addBtnNode.addEventListener("click", addBtnHandler);
clearBtnNode.addEventListener("click", clearBtnHandler);

function showError(message) {
    errorMessageNode.innerText = message;
    errorMessageNode.classList.remove("error-message_hidden");
}