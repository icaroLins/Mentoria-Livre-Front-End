const STORAGE_KEY = "mentoriasMentor";
const ENROLLMENTS_KEY = "mentoriasInscritas";
const MENSAGENS_KEY = "mensagensMentorias";
const LEITURAS_KEY = "leiturasChatMentor";
const LEITURAS_MENTORADO_KEY = "leiturasChatMentorado";
const listaMentorias = document.querySelector("#listaMentorias");
const abrirEdicao = document.querySelector("#abrir-edicao");
const modalEdicao = document.querySelector("#modal-edicao");
const mentorDados = JSON.parse(localStorage.getItem("mentorDados") || "null");

if (localStorage.getItem("tipoUsuario") !== "mentor" || !mentorDados?.email) {
	window.location.href = "login.html";
}

function lerTodasMentorias() {
	return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

// Filtra as mentorias do mentor logado.
function lerMentorias() {
	return lerTodasMentorias().filter((mentoria) => mentoria.mentorEmail === mentorDados.email);
}

// Formata a data para o campo de edição.
function formatarDataInput(data) {
	return data || "";
}

// Monta o modal de edição.
function renderizarEdicao() {
	const mentorias = lerMentorias();
	modalEdicao.innerHTML = `
		<div class="janela-edicao" role="dialog" aria-modal="true" aria-labelledby="titulo-edicao">
			<button class="fechar-edicao" id="fechar-edicao" type="button" aria-label="Fechar">&times;</button>
			<h2 id="titulo-edicao">EDITAR MENTORIAS</h2>
			<div class="lista-edicao">
				${mentorias.length ? mentorias.map((mentoria) => `
					<form class="formulario-edicao" data-id="${mentoria.id}">
						<h3>${mentoria.titulo}</h3>
						<label>Título:
							<input name="titulo" value="${escaparHtml(mentoria.titulo)}" required>
						</label>
						<label>Quantidade de alunos:
							<input name="quantidade" type="number" min="${Number(mentoria.inscritos) || 1}" max="20" value="${Number(mentoria.quantidade) || 1}" required>
						</label>
						<label>Inscrições até:
							<input name="data" type="date" value="${formatarDataInput(mentoria.data)}" required>
						</label>
						<label>Status:
							<select name="status">
								<option value="aberta" ${mentoria.status === "aberta" ? "selected" : ""}>Aberta</option>
								<option value="fechada" ${mentoria.status === "fechada" ? "selected" : ""}>Fechada</option>
							</select>
						</label>
						<label>Descrição:
							<textarea name="descricao" required>${escaparHtml(mentoria.descricao)}</textarea>
						</label>
						<div class="acoes-edicao">
							<button class="botao-salvar-edicao" type="submit">SALVAR</button>
							<button class="botao-encerrar" data-encerrar="${mentoria.id}" type="button">ENCERRAR</button>
							<button class="botao-encerrar botao-apagar" data-apagar="${mentoria.id}" type="button">APAGAR MENTORIA</button>
						</div>
					</form>
				`).join("") : "<p>Nenhuma mentoria cadastrada.</p>"}
			</div>
		</div>
	`;

	modalEdicao.querySelector("#fechar-edicao").addEventListener("click", fecharEdicao);
	modalEdicao.querySelectorAll(".formulario-edicao").forEach((formulario) => {
		formulario.addEventListener("submit", salvarEdicao);
	});
	modalEdicao.querySelectorAll("[data-encerrar]").forEach((botao) => {
		botao.addEventListener("click", encerrarMentoria);
	});
	modalEdicao.querySelectorAll("[data-apagar]").forEach((botao) => {
		botao.addEventListener("click", apagarMentoria);
	});
}

// Protege textos exibidos no HTML.
function escaparHtml(valor) {
	return String(valor || "")
		.replaceAll("&", "&amp;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;")
		.replaceAll('"', "&quot;");
}

// Abre a edição das mentorias.
function abrirModalEdicao() {
	renderizarEdicao();
	modalEdicao.classList.add("aberto");
	modalEdicao.setAttribute("aria-hidden", "false");
}

// Fecha a edição das mentorias.
function fecharEdicao() {
	modalEdicao.classList.remove("aberto");
	modalEdicao.setAttribute("aria-hidden", "true");
}

// Salva alterações da mentoria.
function salvarEdicao(event) {
	event.preventDefault();
	const formulario = event.currentTarget;
	const dados = new FormData(formulario);
	const data = dados.get("data");
	const mentorias = lerTodasMentorias();
	const mentoria = mentorias.find((item) => String(item.id) === formulario.dataset.id);

	if (!mentoria || !data) {
		return;
	}

	mentoria.titulo = dados.get("titulo").trim();
	mentoria.quantidade = dados.get("quantidade");
	mentoria.data = data;
	mentoria.status = dados.get("status");
	mentoria.descricao = dados.get("descricao").trim();
	localStorage.setItem(STORAGE_KEY, JSON.stringify(mentorias));
	fecharEdicao();
	renderizarMentorias();
}

// Encerra uma mentoria.
function encerrarMentoria(event) {
	const id = event.currentTarget.dataset.encerrar;
	if (!window.confirm("Tem certeza que quer encerrar esta mentoria?")) {
		return;
	}

	const mentorias = lerTodasMentorias();
	const mentoria = mentorias.find((item) => String(item.id) === id);
	if (mentoria && mentoria.mentorEmail === mentorDados.email) {
		mentoria.status = "fechada";
		localStorage.setItem(STORAGE_KEY, JSON.stringify(mentorias));
	}
	fecharEdicao();
	renderizarMentorias();
}

// Apaga a mentoria e seus dados relacionados.
function apagarMentoria(event) {
	const id = event.currentTarget.dataset.apagar;
	if (!window.confirm("Tem certeza que deseja apagar esta mentoria? Essa ação não pode ser desfeita.")) {
		return;
	}

	const mentorias = lerTodasMentorias();
	const mentoria = mentorias.find((item) => String(item.id) === id);
	if (!mentoria || mentoria.mentorEmail !== mentorDados.email) {
		return;
	}

	localStorage.setItem(STORAGE_KEY, JSON.stringify(mentorias.filter((item) => String(item.id) !== id)));

	const inscricoes = JSON.parse(localStorage.getItem(ENROLLMENTS_KEY) || "[]");
	localStorage.setItem(ENROLLMENTS_KEY, JSON.stringify(inscricoes.filter((item) => String(item) !== id)));

	const mensagens = JSON.parse(localStorage.getItem(MENSAGENS_KEY) || "{}");
	delete mensagens[id];
	localStorage.setItem(MENSAGENS_KEY, JSON.stringify(mensagens));

	const leituras = JSON.parse(localStorage.getItem(LEITURAS_KEY) || "{}");
	delete leituras[id];
	localStorage.setItem(LEITURAS_KEY, JSON.stringify(leituras));

	const leiturasMentorado = JSON.parse(localStorage.getItem(LEITURAS_MENTORADO_KEY) || "{}");
	delete leiturasMentorado[id];
	localStorage.setItem(LEITURAS_MENTORADO_KEY, JSON.stringify(leiturasMentorado));

	fecharEdicao();
	renderizarMentorias();
}

abrirEdicao.addEventListener("click", abrirModalEdicao);
modalEdicao.addEventListener("click", (event) => {
	if (event.target === modalEdicao) {
		fecharEdicao();
	}
});
document.addEventListener("keydown", (event) => {
	if (event.key === "Escape" && modalEdicao.classList.contains("aberto")) {
		fecharEdicao();
	}
});

function lerMensagens(id) {
	const mensagens = JSON.parse(localStorage.getItem(MENSAGENS_KEY) || "{}");
	return mensagens[id] || [];
}

// Verifica novas mensagens.
function temMensagemNova(mentoria, mensagens) {
	const leituras = JSON.parse(localStorage.getItem(LEITURAS_KEY) || "{}");
	const mensagensDoMentorado = mensagens.filter((mensagem) => mensagem.autor === "mentorado").length;
	return mensagensDoMentorado > (leituras[mentoria.id] || 0);
}

// Cria uma mensagem do chat.
function criarMensagem(mensagem) {
	const item = document.createElement("div");
	item.className = `mensagem-chat ${mensagem.autor === "mentor" ? "mensagem-mentor" : ""}`;
	item.textContent = `${mensagem.autor === "mentor" ? "Você" : "Mentorado"}: ${mensagem.texto}`;
	return item;
}

// Abre o chat do mentor.
function abrirChatMentor(mentoria) {
	const mensagens = lerMensagens(mentoria.id);
	const leituras = JSON.parse(localStorage.getItem(LEITURAS_KEY) || "{}");
	leituras[mentoria.id] = mensagens.filter((mensagem) => mensagem.autor === "mentorado").length;
	localStorage.setItem(LEITURAS_KEY, JSON.stringify(leituras));

	const modal = document.createElement("div");
	modal.className = "modal-chat aberto";
	const janela = document.createElement("div");
	janela.className = "janela-chat";
	janela.setAttribute("role", "dialog");
	janela.setAttribute("aria-modal", "true");
	const fechar = document.createElement("button");
	fechar.type = "button";
	fechar.className = "fechar-chat";
	fechar.setAttribute("aria-label", "Fechar chat");
	fechar.textContent = "×";
	const titulo = document.createElement("h2");
	titulo.textContent = `Chat da sala: ${mentoria.titulo}`;
	const painelConversa = document.createElement("div");
	painelConversa.className = "painel-conversa";
	const saudacao = document.createElement("p");
	saudacao.className = "saudacao-conversa";
	saudacao.textContent = "OLÁ!";
	const listaMensagens = document.createElement("div");
	listaMensagens.className = "mensagens-chat";
	mensagens.forEach((mensagem) => listaMensagens.append(criarMensagem(mensagem)));
	const formulario = document.createElement("form");
	formulario.className = "formulario-chat";
	const entrada = document.createElement("input");
	entrada.type = "text";
	entrada.placeholder = "Digite sua mensagem";
	entrada.maxLength = 300;
	entrada.required = true;
	const botao = document.createElement("button");
	botao.type = "submit";
	botao.textContent = "ENVIAR";
	formulario.append(entrada, botao);
	formulario.addEventListener("submit", (event) => {
		event.preventDefault();
		const todasMensagens = JSON.parse(localStorage.getItem(MENSAGENS_KEY) || "{}");
		const mensagem = { autor: "mentor", texto: entrada.value.trim() };
		todasMensagens[mentoria.id] = [...(todasMensagens[mentoria.id] || []), mensagem];
		localStorage.setItem(MENSAGENS_KEY, JSON.stringify(todasMensagens));
		listaMensagens.append(criarMensagem(mensagem));
		entrada.value = "";
		listaMensagens.scrollTop = listaMensagens.scrollHeight;
	});

	function fecharModal() {
		modal.remove();
		document.removeEventListener("keydown", tratarTecla);
		renderizarMentorias();
	}
	function tratarTecla(event) {
		if (event.key === "Escape") {
			fecharModal();
		}
	}
	fechar.addEventListener("click", fecharModal);
	modal.addEventListener("click", (event) => {
		if (event.target === modal) {
			fecharModal();
		}
	});
	document.addEventListener("keydown", tratarTecla);
	painelConversa.append(saudacao, listaMensagens);
	janela.append(fechar, titulo, painelConversa, formulario);
	modal.append(janela);
	document.body.append(modal);
	entrada.focus();
}

// Cria o botão do chat.
function criarBotaoChat(mentoria) {
	const botao = document.createElement("button");
	botao.type = "button";
	botao.className = "botao-chat-sala";
	botao.textContent = "CHAT DA SALA";
	const mensagens = lerMensagens(mentoria.id);
	if (temMensagemNova(mentoria, mensagens)) {
		const indicador = document.createElement("span");
		indicador.className = "indicador-novas-mensagens";
		indicador.setAttribute("aria-label", "Novas mensagens");
		botao.append(indicador);
	}
	botao.addEventListener("click", () => abrirChatMentor(mentoria));
	return botao;
}

// Formata a data exibida.
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

// Ordena as mentorias.
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

// Cria o cartão da mentoria.
function criarCartaoMentoria(mentoria) {
	const cartao = document.createElement("article");
	cartao.className = "cartao-mentoria";
	const vagasOcupadas = Number(mentoria.inscritos) || 0;
	const limiteVagas = Number(mentoria.quantidade) || 0;
	const estaCheia = vagasOcupadas >= limiteVagas;
	const prazoEncerrado = Boolean(mentoria.data) && obterDataAtual() > mentoria.data;

	const status = prazoEncerrado ? "Encerrado" : estaCheia ? "Vagas esgotadas" : mentoria.status === "aberta" ? "Aberta" : "Fechada";
	cartao.innerHTML = `
		<div class="cartao-cabecalho">
			<h3>${mentoria.titulo}</h3>
			<dl class="detalhes-mentoria">
				<div><dt>Aluno:</dt><dd>${mentoria.quantidade}</dd></div>
				<div><dt>Inscrições até:</dt><dd>${formatarData(mentoria.data)}</dd></div>
			</dl>
			<span class="status-mentoria ${prazoEncerrado || estaCheia ? "status-cheia" : `status-${mentoria.status}`}" >${status}</span>
		</div>
		<p class="ocupacao-mentoria">Vagas: ${vagasOcupadas}/${limiteVagas}</p>
		<p>${mentoria.descricao}</p>
	`;

	cartao.append(criarBotaoChat(mentoria));

	return cartao;
}

// Renderiza as mentorias do mentor.
function renderizarMentorias() {
	const mentorias = lerMentorias();
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
				<h3>Nenhuma mentoria cadastrada</h3>
				<p>Crie sua primeira mentoria para ela aparecer nesta página.</p>
			</div>
		`;
		return;
	}

	listaMentorias.replaceChildren(...ordenarMentorias(mentorias).map(criarCartaoMentoria));
}

renderizarMentorias();
