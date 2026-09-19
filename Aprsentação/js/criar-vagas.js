const STORAGE_KEY = "mentoriasMentor";
const formulario = document.querySelector("#formularioMentoria");
const campoData = document.querySelector("#data");
const mentorDados = JSON.parse(localStorage.getItem("mentorDados") || "null");

if (localStorage.getItem("tipoUsuario") !== "mentor" || !mentorDados?.email) {
	window.location.href = "login.html";
}

function obterDataAtual() {
	const hoje = new Date();
	const ano = hoje.getFullYear();
	const mes = String(hoje.getMonth() + 1).padStart(2, "0");
	const dia = String(hoje.getDate()).padStart(2, "0");
	return `${ano}-${mes}-${dia}`;
}

campoData.min = obterDataAtual();
// Cria uma nova mentoria.

formulario.addEventListener("submit", (event) => {
	event.preventDefault();
	const data = campoData.value;

	if (!data || data < obterDataAtual()) {
		campoData.setCustomValidity("Escolha a data de hoje ou uma data futura.");
		campoData.reportValidity();
		return;
	}

	campoData.setCustomValidity("");

	const dadosFormulario = new FormData(formulario);
	const mentoriasSalvas = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
	const novaMentoria = {
		id: Date.now(),
		titulo: dadosFormulario.get("titulo").trim(),
		status: dadosFormulario.get("status"),
		quantidade: dadosFormulario.get("quantidade"),
		inscritos: 0,
		data,
		descricao: dadosFormulario.get("descricao").trim(),
		mentorEmail: mentorDados.email
	};

	mentoriasSalvas.push(novaMentoria);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(mentoriasSalvas));
	window.location.href = "Mentorias-Mentor.html";
});
