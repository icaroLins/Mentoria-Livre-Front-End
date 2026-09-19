// Função do menu: abre/fecha o menu de navegação.
const botaoMenu = document.querySelector('#btn-menu');
const menuNavegacao = document.querySelector('#menu-navegacao');

// Alterna a exibição do menu.
function alternarMenu() {
	const aberto = menuNavegacao.classList.toggle('aberto');
	botaoMenu.setAttribute('aria-expanded', String(aberto));
}

// Fecha o menu.
function fecharMenu() {
	menuNavegacao.classList.remove('aberto');
	botaoMenu.setAttribute('aria-expanded', 'false');
}

botaoMenu.addEventListener('click', alternarMenu);
// Fecha o menu ao clicar fora dele.

document.addEventListener('click', (event) => {
	if (!event.target.closest('.menu-wrapper')) {
		fecharMenu();
	}
});

// Fecha o menu com a tecla Escape.
document.addEventListener('keydown', (event) => {
	if (event.key === 'Escape') {
		fecharMenu();
	}
});
