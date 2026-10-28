
"use strict";

const form = document.getElementById("signupForm");

const nome = document.getElementById("nome");
const email = document.getElementById("email");
const telefone = document.getElementById("telefone");
const senha = document.getElementById("senha");
const confirmarSenha = document.getElementById("confirmarSenha");
const termos = document.getElementById("termos");

const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const feedback = document.getElementById("feedback");
const submitButton = document.getElementById("submitButton");
const buttonText = document.getElementById("buttonText");

let submitted = false;

function setMessage(field, message = "", state = "") {
    const container = field.closest(".field");
    const messageElement = document.getElementById(field.id + "Message");

    if (container) {
        container.classList.remove("invalid", "valid");

        if (state) {
            container.classList.add(state);
        }
    }

    if (messageElement) {
        messageElement.textContent = message;
    }

    field.setAttribute(
        "aria-invalid",
        state === "invalid" ? "true" : "false"
    );
}

function showFeedback(message, type) {
    feedback.textContent = message;
    feedback.className = "feedback " + type;
    feedback.hidden = false;
}

function hideFeedback() {
    feedback.hidden = true;
    feedback.textContent = "";
    feedback.className = "feedback";
}

function validateNome() {
    const value = nome.value.trim();
    const letters = value.replace(/[\s'-]/g, "");

    if (!value) {
        setMessage(nome, "Por favor, informe seu nome.", "invalid");
        return false;
    }

    if (letters.length < 3) {
        setMessage(nome, "Digite pelo menos 3 letras.", "invalid");
        return false;
    }

    if (!/^[\p{L}\p{M}\s'-]+$/u.test(value)) {
        setMessage(nome, "Use apenas letras, espaços, apóstrofos e hífens.", "invalid");
        return false;
    }

    setMessage(nome, "", "valid");
    return true;
}

function validateEmail() {
    const value = email.value.trim();

    if (!value) {
        setMessage(email, "O e-mail é obrigatório.", "invalid");
        return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(value)) {
        setMessage(email, "Digite um endereço de e-mail válido.", "invalid");
        return false;
    }

    setMessage(email, "", "valid");
    return true;
}

function validateTelefone() {
    const digits = telefone.value.replace(/\D/g, "");

    if (!digits) {
        setMessage(telefone);
        return true;
    }

    if (digits.length < 10 || digits.length > 11) {
        setMessage(
            telefone,
            "Informe um telefone com DDD e 10 ou 11 dígitos.",
            "invalid"
        );
        return false;
    }

    setMessage(telefone, "", "valid");
    return true;
}

function getPasswordStrength(value) {
    if (!value) {
        return {
            score: 0,
            label: "Digite sua senha",
            color: "#eeeaf5"
        };
    }

    let score = 0;

    if (value.length >= 8) score++;
    if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
    if (/\d/.test(value)) score++;
    if (/[^A-Za-z0-9]/.test(value)) score++;

    const levels = [
        { label: "Muito fraca", color: "#e64f70" },
        { label: "Fraca", color: "#f08a54" },
        { label: "Razoável", color: "#e5b944" },
        { label: "Boa", color: "#53b99a" },
        { label: "Forte", color: "#16865c" }
    ];

    const level = score === 0 ? 0 : score;

    return {
        score: level,
        label: levels[level].label,
        color: levels[level].color
    };
}

function updatePasswordStrength() {
    const result = getPasswordStrength(senha.value);

    strengthBar.style.width = (result.score * 25) + "%";
    strengthBar.style.backgroundColor = result.color;
    strengthText.textContent = result.label;
    strengthText.style.color = result.color;
}

function validateSenha() {
    const value = senha.value;

    if (!value) {
        setMessage(senha, "A senha é obrigatória.", "invalid");
        return false;
    }

    if (value.length < 8) {
        setMessage(senha, "Use pelo menos 8 caracteres.", "invalid");
        return false;
    }

    if (value.length > 72) {
        setMessage(senha, "A senha deve ter no máximo 72 caracteres.", "invalid");
        return false;
    }

    setMessage(senha, "", "valid");
    return true;
}

function validateConfirmacao() {
    if (!confirmarSenha.value) {
        setMessage(
            confirmarSenha,
            "Confirme sua senha.",
            "invalid"
        );
        return false;
    }

    if (confirmarSenha.value !== senha.value) {
        setMessage(
            confirmarSenha,
            "As senhas não são iguais.",
            "invalid"
        );
        return false;
    }

    setMessage(confirmarSenha, "", "valid");
    return true;
}

function validateTermos() {
    const message = document.getElementById("termosMessage");

    if (!termos.checked) {
        message.textContent = "Você precisa aceitar os termos para continuar.";
        termos.setAttribute("aria-invalid", "true");
        return false;
    }

    message.textContent = "";
    termos.setAttribute("aria-invalid", "false");
    return true;
}

function validateAll() {
    const results = [
        validateNome(),
        validateEmail(),
        validateTelefone(),
        validateSenha(),
        validateConfirmacao(),
        validateTermos()
    ];

    return results.every(Boolean);
}

// Validação enquanto a pessoa preenche os campos.

nome.addEventListener("input", () => {
    if (submitted) validateNome();
});

email.addEventListener("input", () => {
    if (submitted) validateEmail();
});

telefone.addEventListener("input", () => {
    let digits = telefone.value.replace(/\D/g, "").slice(0, 11);

    if (digits.length > 10) {
        digits = digits.replace(
            /^(\d{2})(\d{5})(\d{4})$/,
            "($1) $2-$3"
        );
    } else if (digits.length > 6) {
        digits = digits.replace(
            /^(\d{2})(\d{4})(\d{0,4})$/,
            "($1) $2-$3"
        );
    } else if (digits.length > 2) {
        digits = digits.replace(/^(\d{2})(\d*)$/, "($1) $2");
    } else if (digits.length > 0) {
        digits = digits.replace(/^(\d*)$/, "($1");
    }

    telefone.value = digits;

    if (submitted) validateTelefone();
});

senha.addEventListener("input", () => {
    updatePasswordStrength();

    if (submitted) {
        validateSenha();

        if (confirmarSenha.value) {
            validateConfirmacao();
        }
    }
});

confirmarSenha.addEventListener("input", () => {
    if (submitted) validateConfirmacao();
});

termos.addEventListener("change", () => {
    if (submitted) validateTermos();
});

// Mostrar e ocultar as senhas.

document.querySelectorAll(".toggle-password").forEach((button) => {
    button.addEventListener("click", () => {
        const target = document.getElementById(button.dataset.target);
        const showing = target.type === "password";

        target.type = showing ? "text" : "password";
        button.setAttribute("aria-pressed", String(showing));

        button.setAttribute(
            "aria-label",
            showing ? "Ocultar senha" : "Mostrar senha"
        );

        button.textContent = showing ? "◎" : "◉";
    });
});

// Envio e validação final.

form.addEventListener("submit", (event) => {
    event.preventDefault();

    submitted = true;
    hideFeedback();

    if (!validateAll()) {
        showFeedback(
            "Confira os campos destacados e corrija as informações antes de continuar.",
            "error"
        );

        const firstInvalid = form.querySelector(
            '[aria-invalid="true"]'
        );

        if (firstInvalid) {
            firstInvalid.focus();
        }

        return;
    }

    // Demonstração: não envia os dados para um servidor.
    // A integração real exige um backend.

    showFeedback(
        "Tudo certo, " + nome.value.trim().split(/\s+/)[0] +
        "! O formulário foi validado com sucesso. Para criar sua conta de verdade, conecte-o a um servidor.",
        "success"
    );

    buttonText.textContent = "Dados validados ✓";
    submitButton.style.background = "linear-gradient(105deg, #16865c, #43b58c)";

    // Não armazenamos nem exibimos a senha.
});

// Links demonstrativos: substitua por páginas reais quando existirem.

document.getElementById("termsLink").addEventListener("click", (event) => {
    event.preventDefault();

    showFeedback(
        "Adicione aqui sua página real de termos de uso antes de publicar o cadastro.",
        "error"
    );
});

document.getElementById("privacyLink").addEventListener("click", (event) => {
    event.preventDefault();

    showFeedback(
        "Adicione aqui sua política de privacidade antes de publicar o cadastro.",
        "error"
    );
});

document.getElementById("loginLink").addEventListener("click", (event) => {
    event.preventDefault();

    showFeedback(
        "Conecte este link à página de login do seu projeto.",
        "error"
    );
});

updatePasswordStrength();
