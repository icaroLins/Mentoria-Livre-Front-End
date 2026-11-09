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

```javascript
// Realiza o login pela API.
formularioLogin.addEventListener('submit', async (event) => {
    event.preventDefault();

    const tipoAcesso = document.querySelector('#tipo-acesso').value;
    const email = document.querySelector('#email').value.trim();
    const senha = document.querySelector('#senha').value;

    try {
        const resposta = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                senha: senha
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error('E-mail ou senha incorretos.');
        }

        const usuario = dados.usuario;

        // Verifica se o tipo de acesso selecionado corresponde ao usuário.
        if (usuario.role !== tipoAcesso.toUpperCase()) {
            throw new Error('Tipo de acesso incorreto.');
        }

        // Salva os tokens e os dados do usuário.
        localStorage.setItem('accessToken', dados.accessToken);
        localStorage.setItem('refreshToken', dados.refreshToken);
        localStorage.setItem('usuario', JSON.stringify(usuario));
        localStorage.setItem('tipoUsuario', tipoAcesso);

        alert('Login realizado com sucesso!');

        if (usuario.role === 'MENTOR') {
            window.location.href = 'perfilMentor.html';
        } else {
            window.location.href = 'PerfilMentorado.html';
        }

    } catch (erro) {
        alert('Erro ao realizar login: ' + erro.message);
    }
});
```
