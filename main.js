const ChatWindow  = document.getElementById("chat-window");
const MessageInput = document.getElementById("message-input");
const SendButton   = document.getElementById("send-button");
const ErrorToast   = document.getElementById("error-toast");

const processMessage = (rawText) => {
    const cleanText = rawText.trim();
    try {
        if (cleanText.length === 0) throw new Error("Введите что-то!");
        const spamRegex = /купи|спам|реклама/i;
        if (spamRegex.test(cleanText)) throw new Error("Сообщение содержит недопустимые данные!");
        return cleanText;
    } catch (err) {
        throw err;
    }
};

const simulateSendToServer = (text) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const processedText = processMessage(text);
                resolve({ id: new Date(), text: processedText, status: "Sent" });
            } catch (err) {
                reject(err);
            }
        }, 500);
    });
};

const botReplies = [
    "Интересно, расскажи подробнее.",
    "Ок, понял!",
    "Хм, надо подумать...",
    "Согласен с тобой.",
    "Давай обсудим это.",
    "Понял, принял 👍",
    "Ого, не ожидал такого.",
];

const simulateBotResponse = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(botReplies[Math.floor(Math.random() * botReplies.length)]);
        }, 1000 + Math.random() * 1000);
    });
};

const getTime = () =>
    new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });

const renderMessage = (message, side = "right") => {
    const wrapper = document.createElement("div");
    wrapper.classList.add("message", `message--${side}`);

    const text = document.createElement("span");
    text.classList.add("message__text");
    text.textContent = message;

    const time = document.createElement("span");
    time.classList.add("message__time");
    time.textContent = getTime();

    wrapper.appendChild(text);
    wrapper.appendChild(time);
    ChatWindow.appendChild(wrapper);
    ChatWindow.scrollTop = ChatWindow.scrollHeight;
};

const showTyping = () => {
    const indicator = document.createElement("div");
    indicator.id = "typing-indicator";
    indicator.classList.add("message", "message--left");

    const bubble = document.createElement("span");
    bubble.classList.add("message__text");

    for (let i = 0; i < 3; i++) {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        bubble.appendChild(dot);
    }

    indicator.appendChild(bubble);
    ChatWindow.appendChild(indicator);
    ChatWindow.scrollTop = ChatWindow.scrollHeight;
};

const hideTyping = () => {
    document.getElementById("typing-indicator")?.remove();
};

const showError = (message) => {
    ErrorToast.textContent = message;
    ErrorToast.style.display = "block";
    setTimeout(() => { ErrorToast.style.display = "none"; }, 1500);
};

const handleSend = () => {
    const text = MessageInput.value;
    SendButton.disabled = true;

    simulateSendToServer(text)
        .then((response) => {
            renderMessage(response.text, "right");
            MessageInput.value = "";
            showTyping();
            return simulateBotResponse();
        })
        .then((botText) => {
            hideTyping();
            renderMessage(botText, "left");
        })
        .catch((err) => {
            showError(err.message);
        })
        .finally(() => {
            SendButton.disabled = false;
            MessageInput.focus();
        });
};

SendButton.addEventListener("click", handleSend);
MessageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleSend();
});