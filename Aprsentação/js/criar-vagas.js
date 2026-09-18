const STORAGE_KEY = "mentoriasMentor";
const formulario = document.querySelector("#formularioMentoria");

formulario.addEventListener("submit", (event) => {
	event.preventDefault();

	const dadosFormulario = new FormData(formulario);
	const mentoriasSalvas = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
	const novaMentoria = {
		id: Date.now(),
		titulo: dadosFormulario.get("titulo").trim(),
		status: dadosFormulario.get("status"),
		quantidade: dadosFormulario.get("quantidade"),
		data: dadosFormulario.get("data"),
		descricao: dadosFormulario.get("descricao").trim()
	};

	mentoriasSalvas.push(novaMentoria);
	localStorage.setItem(STORAGE_KEY, JSON.stringify(mentoriasSalvas));
	window.location.href = "Mentorias-Mentor.html";
});
