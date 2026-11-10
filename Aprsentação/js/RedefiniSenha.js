
const formulario = document.getElementById("form-redefinicao");
const novaSenha = document.getElementById("nova-senha");
const confirmaNovaSenha = document.getElementById("confirma-nova-senha");

formulario.addEventListener("submit", function(event) {
    event.preventDefault();

    const senha = novaSenha.value;
    const confirmacao = confirmaNovaSenha.value;

    if (senha.trim() === "" || confirmacao.trim() === "") {
        alert("Preencha todos os campos.");
        return;
    }

    if (senha !== confirmacao) {
        alert("As senhas não são iguais!");
        return;
    }

    if (senha.length < 8) {
        alert("A senha deve ter pelo menos 8 caracteres.");
        return;
    }

    alert("As senhas conferem! Agora podemos integrar com o backend.");
});
