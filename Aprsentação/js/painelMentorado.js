const MENTORIAS_KEY = "mentoriasMentor";
const INSCRICOES_KEY = "mentoriasInscritas";
const MENSAGENS_KEY = "mensagensMentorias";
const LEITURAS_KEY = "leiturasChatMentorado";
const listaPainel = document.querySelector("#listaPainel");

function lerJson(chave, valorPadrao) {
	return JSON.parse(localStorage.getItem(chave) || JSON.stringify(valorPadrao));
}

// Formata a data exibida no painel.
function formatarData(data) {
	if (!data) {
		return "Data não informada";
	}

	return new Intl.DateTimeFormat("pt-BR", { dateStyle: "long" }).format(new Date(`${data}T00:00:00`));
}

// Verifica novas mensagens do mentor.
function temMensagemNova(mentoria, mensagens) {
	const leituras = lerJson(LEITURAS_KEY, {});
	const mensagensDoMentor = mensagens.filter((mensagem) => mensagem.autor === "mentor").length;
	return mensagensDoMentor > (leituras[mentoria.id] || 0);
}

// Marca as mensagens como lidas.
function marcarComoLidas(mentoria, mensagens) {
	const leituras = lerJson(LEITURAS_KEY, {});
	leituras[mentoria.id] = mensagens.filter((mensagem) => mensagem.autor === "mentor").length;
	localStorage.setItem(LEITURAS_KEY, JSON.stringify(leituras));
}

// Cria uma mensagem do chat.
function criarMensagem(mensagem) {
	const item = document.createElement("div");
	item.className = `mensagem-chat ${mensagem.autor === "mentorado" ? "mensagem-mentorado" : ""}`;
	item.textContent = `${mensagem.autor === "mentorado" ? "Você" : "Mentor"}: ${mensagem.texto}`;
	return item;
}

// Abre o chat do mentorado.
function abrirChat(mentoria) {
	const mensagens = lerJson(MENSAGENS_KEY, {})[mentoria.id] || [];
	marcarComoLidas(mentoria, mensagens);

	const modal = document.createElement("div");
	modal.className = "modal-chat aberto";
	modal.setAttribute("aria-hidden", "false");
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
		const todasMensagens = lerJson(MENSAGENS_KEY, {});
		const mensagem = { autor: "mentorado", texto: entrada.value.trim() };
		todasMensagens[mentoria.id] = [...(todasMensagens[mentoria.id] || []), mensagem];
		localStorage.setItem(MENSAGENS_KEY, JSON.stringify(todasMensagens));
		listaMensagens.append(criarMensagem(mensagem));
		entrada.value = "";
		listaMensagens.scrollTop = listaMensagens.scrollHeight;
	});

	function fecharModal() {
		modal.remove();
		document.removeEventListener("keydown", tratarTecla);
		renderizarPainel();
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

// Cria o cartão da mentoria inscrita.
function criarCartao(mentoria, status, mensagens) {
	const cartao = document.createElement("article");
	cartao.className = "cartao-painel";
	const titulo = document.createElement("h3");
	titulo.textContent = mentoria.titulo;
	const detalhes = document.createElement("dl");
	detalhes.className = "detalhes-painel";
	detalhes.innerHTML = `<div><dt>Aluno:</dt><dd>${mentoria.quantidade}</dd></div><div><dt>Data:</dt><dd>${formatarData(mentoria.data)}</dd></div>`;
	const descricao = document.createElement("p");
	descricao.className = "descricao-painel";
	descricao.textContent = mentoria.descricao;
	const statusElemento = document.createElement("span");
	statusElemento.className = `status-inscricao status-${status}`;
	statusElemento.textContent = status === "aceito" ? "Aceito" : status === "recusado" ? "Recusado" : "Pendente";
	cartao.append(titulo, detalhes, descricao, statusElemento);

	if (status === "aceito") {
		const botaoChat = document.createElement("button");
		botaoChat.type = "button";
		botaoChat.className = "botao-chat-sala";
		botaoChat.textContent = "CHAT DA SALA";
		if (temMensagemNova(mentoria, mensagens)) {
			const indicador = document.createElement("span");
			indicador.className = "indicador-novas-mensagens";
			indicador.setAttribute("aria-label", "Novas mensagens");
			botaoChat.append(indicador);
		}
		botaoChat.addEventListener("click", () => abrirChat(mentoria));
		cartao.append(botaoChat);
	}

	return cartao;
}

// Renderiza o painel do mentorado.
function renderizarPainel() {
	const mentorias = lerJson(MENTORIAS_KEY, []);
	const inscricoes = lerJson(INSCRICOES_KEY, []);
	const mensagens = lerJson(MENSAGENS_KEY, {});
	const inscritas = mentorias.filter((mentoria) => inscricoes.includes(mentoria.id));

	if (inscritas.length === 0) {
		listaPainel.innerHTML = "<div class=\"estado-painel\"><h3>Nenhuma mentoria inscrita</h3><p>Suas inscrições aparecerão aqui.</p></div>";
		return;
	}

	listaPainel.replaceChildren(...inscritas.map((mentoria) => criarCartao(mentoria, "aceito", mensagens[mentoria.id] || [])));
}

renderizarPainel();
