const STORAGE_KEY = "mentoriasMentor";
const ENROLLMENTS_KEY = "mentoriasInscritas";
const STATUS_KEY = "statusInscricoes";
const listaMentorias = document.querySelector("#listaMentorias");

function formatarData(data) {
	if (!data) {
		return "Data não informada";
	}

	return new Intl.DateTimeFormat("pt-BR", {
		dateStyle: "long"
	}).format(new Date(`${data}T00:00:00`));
}

// Obtém a data atual.
function obterDataAtual() {
	const hoje = new Date();
	return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, "0")}-${String(hoje.getDate()).padStart(2, "0")}`;
}

// Ordena as mentorias disponíveis.
function ordenarMentorias(mentorias) {
	return [...mentorias].sort((primeira, segunda) => {
		const primeiraDisponivel = primeira.status === "aberta"
			&& (Number(primeira.inscritos) || 0) < (Number(primeira.quantidade) || 0)
			&& (!primeira.data || obterDataAtual() <= primeira.data);
		const segundaDisponivel = segunda.status === "aberta"
			&& (Number(segunda.inscritos) || 0) < (Number(segunda.quantidade) || 0)
			&& (!segunda.data || obterDataAtual() <= segunda.data);

		return Number(segundaDisponivel) - Number(primeiraDisponivel);
	});
}

// Cria o cartão de uma mentoria.
function criarCartaoMentoria(mentoria) {
	const cartao = document.createElement("article");
	const estaAberta = mentoria.status === "aberta";
	const inscricoes = JSON.parse(localStorage.getItem(ENROLLMENTS_KEY) || "[]");
	const estaInscrito = inscricoes.includes(mentoria.id);
	const limiteVagas = Number(mentoria.quantidade) || 0;
	const vagasOcupadas = Number(mentoria.inscritos) || 0;
	const estaCheia = vagasOcupadas >= limiteVagas;
	const prazoEncerrado = Boolean(mentoria.data) && obterDataAtual() > mentoria.data;

	cartao.className = "cartao-mentoria";

	const cabecalho = document.createElement("div");
	cabecalho.className = "cartao-cabecalho";

	const titulo = document.createElement("h3");
	titulo.textContent = mentoria.titulo;

	const status = document.createElement("span");
	status.className = `status-mentoria ${prazoEncerrado || estaCheia ? "status-cheia" : `status-${mentoria.status}`}`;
	status.textContent = prazoEncerrado ? "Encerrado" : estaCheia ? "Vagas esgotadas" : estaAberta ? "Aberta" : "Fechada";
	cabecalho.append(titulo, status);

	const detalhes = document.createElement("dl");
	detalhes.className = "detalhes-mentoria";
	detalhes.innerHTML = `
		<div><dt>Aluno:</dt><dd>${mentoria.quantidade}</dd></div>
		<div><dt>Inscrições até:</dt><dd>${formatarData(mentoria.data)}</dd></div>
	`;
	cabecalho.insertBefore(detalhes, status);

	const descricao = document.createElement("p");
	descricao.textContent = mentoria.descricao;

	cartao.append(cabecalho, descricao);

	if (!(estaInscrito && (prazoEncerrado || estaCheia))) {
		const botao = document.createElement("button");
		botao.type = "button";
		botao.className = "botao-inscrever";
		botao.textContent = estaInscrito ? "INSCRITO" : prazoEncerrado ? "ENCERRADO" : estaCheia ? "VAGAS ESGOTADAS" : estaAberta ? "INSCREVER-SE" : "VAGAS ENCERRADAS";
		botao.disabled = (!estaAberta || estaCheia || prazoEncerrado) && !estaInscrito;
		botao.addEventListener("click", () => {
			if (estaInscrito) {
				window.location.href = "painelMentorado.html";
				return;
			}

			const inscricoesAtuais = JSON.parse(localStorage.getItem(ENROLLMENTS_KEY) || "[]");
			const mentoriasAtuais = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
			const mentoriaAtual = mentoriasAtuais.find((item) => item.id === mentoria.id);
			const ocupacaoAtual = Number(mentoriaAtual?.inscritos) || 0;
			const limiteAtual = Number(mentoriaAtual?.quantidade) || 0;

			if (ocupacaoAtual >= limiteAtual || obterDataAtual() > mentoriaAtual.data) {
				renderizarMentorias();
				return;
			}

			if (!inscricoesAtuais.includes(mentoria.id)) {
				inscricoesAtuais.push(mentoria.id);
			}
			localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(inscricoesAtuais));
			mentoriaAtual.inscritos = ocupacaoAtual + 1;
			localStorage.setItem(STORAGE_KEY, JSON.stringify(mentoriasAtuais));
			botao.textContent = "INSCRITO";
			window.location.href = "painelMentorado.html";
		});
		cartao.append(botao);
	}
	return cartao;
}

// Renderiza as mentorias para o mentorado.
function renderizarMentorias() {
	const mentorias = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
	const inscricoes = JSON.parse(localStorage.getItem(ENROLLMENTS_KEY) || "[]");
	let houveAtualizacao = false;
	mentorias.forEach((mentoria) => {
		if (!Number.isFinite(Number(mentoria.inscritos))) {
			mentoria.inscritos = inscricoes.includes(mentoria.id) ? 1 : 0;
			houveAtualizacao = true;
		}
	});
	if (houveAtualizacao) {
		localStorage.setItem(STORAGE_KEY, JSON.stringify(mentorias));
	}

	if (mentorias.length === 0) {
		listaMentorias.innerHTML = `
			<div class="estado-vazio">
				<h3>Nenhuma mentoria disponível</h3>
				<p>As mentorias criadas pelos mentores aparecerão aqui.</p>
			</div>
		`;
		return;
	}

	listaMentorias.replaceChildren(...ordenarMentorias(mentorias).map(criarCartaoMentoria));
}

renderizarMentorias();
