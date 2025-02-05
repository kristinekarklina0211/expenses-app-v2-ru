const POPUP_OPENED_CLASSNAME = "pop-up_open";

const popupNode = document.querySelector(".js-pop-up");
const btnOpenNode = document.querySelector(".js-pop-up__open-btn");
const popupContentNode = document.querySelector(".js-pop-up__content");
const btnCloseNode = document.querySelector(".js-pop-up__close-btn");

const popupInputNode = document.querySelector(".js-pop-up__input");
const setLimitBtnNode = document.querySelector(".js-pop-up__set-btn");

const togglePopup = () => {
    popupNode.classList.toggle(POPUP_OPENED_CLASSNAME);
}

const saveLimitToStorage = (newLimit) => {
    localStorage.setItem(STORAGE_LABEL_LIMIT, newLimit);
}

// Открытие и закрытие попапа
btnOpenNode.addEventListener("click", togglePopup);
btnCloseNode.addEventListener("click", togglePopup);

popupNode.addEventListener("click", (event) => {
    const clickOutsideContent = !event.composedPath().includes(popupContentNode);

    if (clickOutsideContent) {
        togglePopup();
    }
});

// Изменение лимита в попапе
const setLimitBtnHandler = () => {
    // 1. Получаем значение из поля ввода
    const newLimit = getLimitFromUser();

    // 2. Сохраняем новый лимит и выводим его в интерфейс
    updateLimit(newLimit);

    // 3. Обновляем статус
    renderStatus(limit);

    // 4. Закрываем попап
    togglePopup();
};

setLimitBtnNode.addEventListener("click", setLimitBtnHandler);

/* Подфункции */

// 1. Получаем значение из поля ввода
const getLimitFromUser = () => {
    if (!popupInputNode.value) {
        return null;
    }

    const newLimit = parseInt(popupInputNode.value);

    clearInput(popupInputNode);

    return newLimit;
}

// 2. Сохраняем новый лимит и выводим его в интерфейс
const updateLimit = (newLimit) => {
    limit = newLimit;

    saveLimitToStorage(newLimit);

    limitNode.innerText = `${limit} ${CURRENCY}`;
}