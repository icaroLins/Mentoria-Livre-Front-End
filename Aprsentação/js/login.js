// Função do modal: abre a janela de cadastro.
const abrirCadastro = document.querySelector('#abrir-cadastro');
const fecharCadastro = document.querySelector('#fechar-cadastro');
const modalCadastro = document.querySelector('#modal-cadastro');
const formularioLogin = document.querySelector('#form-login');

// Abre o modal de cadastro.
function abrirModal() {
	modalCadastro.classList.add('aberto');
	modalCadastro.setAttribute('aria-hidden', 'false');
	document.body.classList.add('modal-aberto');
}

// Função para fechar o modal e limpar o estado visual.
// Fecha o modal de cadastro.
function fecharModal() {
	modalCadastro.classList.remove('aberto');
	modalCadastro.setAttribute('aria-hidden', 'true');
	document.body.classList.remove('modal-aberto');
}

abrirCadastro.addEventListener('click', abrirModal);
// Fecha o modal com a tecla Escape.
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

// Valida o login do usuário.
formularioLogin.addEventListener('submit', (event) => {
	event.preventDefault();
	const tipoAcesso = document.querySelector('#tipo-acesso').value;
	const email = document.querySelector('#email').value.trim();
	const senha = document.querySelector('#senha').value;

	if (tipoAcesso === 'mentor') {
		const mentorDados = JSON.parse(localStorage.getItem('mentorDados') || 'null');

		if (!mentorDados || mentorDados.email !== email || mentorDados.senha !== senha) {
			alert('E-mail ou senha do mentor inválidos.');
			return;
		}

		localStorage.setItem('tipoUsuario', tipoAcesso);
		window.location.href = 'perfilMentor.html';
		return;
	}

	if (tipoAcesso === 'mentorado') {
		const mentoradoDados = JSON.parse(localStorage.getItem('mentoradoDados') || 'null');

		if (!mentoradoDados || mentoradoDados.email !== email || mentoradoDados.senha !== senha) {
			alert('E-mail ou senha do mentorado inválidos.');
			return;
		}

		localStorage.setItem('tipoUsuario', tipoAcesso);
		window.location.href = 'PerfilMentorado.html';
		return;
	}

	localStorage.setItem('tipoUsuario', tipoAcesso);
	window.location.href = 'Mentorado-Mentorias.html';
});
