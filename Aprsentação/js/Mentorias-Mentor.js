const STORAGE_KEY = "mentoriasMentor";
const listaMentorias = document.querySelector("#listaMentorias");

function formatarData(data) {
	if (!data) {
		return "Data não informada";
	}

	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "long"
	}).format(new Date(`${data}T00:00:00`));
}

function criarCartaoMentoria(mentoria) {
	const cartao = document.createElement("article");
	cartao.className = "cartao-mentoria";

	const status = mentoria.status === "aberta" ? "Aberta" : "Fechada";
	cartao.innerHTML = `
		<div class="cartao-cabecalho">
			<h3>${mentoria.titulo}</h3>
			<span class="status-mentoria status-${mentoria.status}">${status}</span>
		</div>
		<dl class="detalhes-mentoria">
			<div><dt>Alunos</dt><dd>${mentoria.quantidade}</dd></div>
			<div><dt>Data</dt><dd>${formatarData(mentoria.data)}</dd></div>
		</dl>
		<p>${mentoria.descricao}</p>
	`;

	return cartao;
}

function renderizarMentorias() {
	const mentorias = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

	if (mentorias.length === 0) {
		listaMentorias.innerHTML = `
			<div class="estado-vazio">
				<h3>Nenhuma mentoria cadastrada</h3>
				<p>Crie sua primeira mentoria para ela aparecer nesta página.</p>
			</div>
		`;
		return;
	}

	listaMentorias.replaceChildren(...mentorias.map(criarCartaoMentoria));
}

renderizarMentorias();
