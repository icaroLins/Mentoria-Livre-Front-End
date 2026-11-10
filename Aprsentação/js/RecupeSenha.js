 
const formulario = document.getElementById("form-recuperacao");
const campoEmail = document.getElementById("email-recuperacao");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const email = campoEmail.value.trim();

    if (email === "") {
        alert("Por favor, informe seu e-mail.");
        return;
    }

    alert("Solicitação recebida! Em breve você receberá o link de recuperação.");

    formulario.reset();
});
