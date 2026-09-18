// Função do menu: abre/fecha o menu de navegação.
const botaoMenu = document.querySelector('#btn-menu');
const menuNavegacao = document.querySelector('#menu-navegacao');

function alternarMenu() {
	const aberto = menuNavegacao.classList.toggle('aberto');
	botaoMenu.setAttribute('aria-expanded', String(aberto));
}

function fecharMenu() {
	menuNavegacao.classList.remove('aberto');
	botaoMenu.setAttribute('aria-expanded', 'false');
}

botaoMenu.addEventListener('click', alternarMenu);

document.addEventListener('click', (event) => {
	if (!event.target.closest('.menu-wrapper')) {
		fecharMenu();
	}
});

document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		fecharMenu();
	}
});
