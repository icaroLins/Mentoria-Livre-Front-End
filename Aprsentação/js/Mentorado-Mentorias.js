const STORAGE_KEY = "mentoriasMentor";
const ENROLLMENTS_KEY = "mentoriasInscritas";
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
	const estaAberta = mentoria.status === "aberta";
	const inscricoes = JSON.parse(localStorage.getItem(ENROLLMENTS_KEY) || "[]");
	const estaInscrito = inscricoes.includes(mentoria.id);

	cartao.className = "cartao-mentoria";

	const cabecalho = document.createElement("div");
	cabecalho.className = "cartao-cabecalho";

	const titulo = document.createElement("h3");
	titulo.textContent = mentoria.titulo;

	const status = document.createElement("span");
	status.className = `status-mentoria status-${mentoria.status}`;
	status.textContent = estaAberta ? "Aberta" : "Fechada";
	cabecalho.append(titulo, status);

	const detalhes = document.createElement("dl");
	detalhes.className = "detalhes-mentoria";
	detalhes.innerHTML = `
		<div><dt>Alunos</dt><dd>${mentoria.quantidade}</dd></div>
		<div><dt>Data</dt><dd>${formatarData(mentoria.data)}</dd></div>
	`;

	const descricao = document.createElement("p");
	descricao.textContent = mentoria.descricao;

	const botao = document.createElement("button");
	botao.type = "button";
	botao.className = "botao-inscrever";
	botao.textContent = estaInscrito ? "INSCRITO" : estaAberta ? "INSCREVER-SE" : "VAGAS ENCERRADAS";
	botao.disabled = !estaAberta || estaInscrito;
	botao.addEventListener("click", () => {
		const inscricoesAtuais = JSON.parse(localStorage.getItem(ENROLLMENTS_KEY) || "[]");
		inscricoesAtuais.push(mentoria.id);
		localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(inscricoesAtuais));
		botao.textContent = "INSCRITO";
		botao.disabled = true;
	});

	cartao.append(cabecalho, detalhes, descricao, botao);
	return cartao;
}

function renderizarMentorias() {
	const mentorias = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");

	if (mentorias.length === 0) {
		listaMentorias.innerHTML = `
			<div class="estado-vazio">
				<h3>Nenhuma mentoria disponível</h3>
				<p>As mentorias criadas pelos mentores aparecerão aqui.</p>
			</div>
		`;
		return;
	}

	listaMentorias.replaceChildren(...mentorias.map(criarCartaoMentoria));
}

renderizarMentorias();
