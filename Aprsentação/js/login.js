// Função do modal: abre a janela de cadastro.
const abrirCadastro = document.querySelector('#abrir-cadastro');
const fecharCadastro = document.querySelector('#fechar-cadastro');
const modalCadastro = document.querySelector('#modal-cadastro');

function abrirModal() {
	modalCadastro.classList.add('aberto');
	modalCadastro.setAttribute('aria-hidden', 'false');
	document.body.classList.add('modal-aberto');
}

// Função para fechar o modal e limpar o estado visual.
function fecharModal() {
	modalCadastro.classList.remove('aberto');
	modalCadastro.setAttribute('aria-hidden', 'true');
	document.body.classList.remove('modal-aberto');
}

abrirCadastro.addEventListener('click', abrirModal);
fecharCadastro.addEventListener('click', fecharModal);

modalCadastro.addEventListener('click', (event) => {
	if (event.target === modalCadastro) {
		fecharModal();
	}
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape' && modalCadastro.classList.contains('aberto')) {
		fecharModal();
	}
});
