function formatarData(data) {
    if (!data) return 'Data não informada';

    const dataObj = new Date(data + 'T00:00:00');
    return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    }).format(dataObj);
}

const inputFoto = document.getElementById('input-foto');
const fotoPerfil = document.getElementById('fotoPerfil');

if (inputFoto && fotoPerfil) {
    inputFoto.addEventListener('change', (event) => {
        const arquivo = event.target.files[0];

        if (!arquivo) {
            return;
        }

        const leitor = new FileReader();

        leitor.onload = (evento) => {
            fotoPerfil.style.backgroundImage = `url("${evento.target.result}")`;
            fotoPerfil.style.backgroundSize = 'cover';
            fotoPerfil.style.backgroundPosition = 'center';
            fotoPerfil.style.backgroundRepeat = 'no-repeat';
        };

        leitor.readAsDataURL(arquivo);
    });
}

// Salva o cadastro do mentor e encaminha para o login.
const formMentor = document.getElementById('form-mentor');

if (formMentor) {
    formMentor.addEventListener('submit', async (event) => {
        event.preventDefault();

        const dados = {
            nome: document.getElementById('nome').value.trim(),
            email: document.getElementById('email').value.trim(),
            senha: document.getElementById('senha').value,
            dataNascimento: document.getElementById('nascimento').value,
            role: 'MENTOR',
            especialidade: document.getElementById('area').value.trim(),
            objetivo: null
        };

        try {
            const resposta = await fetch('http://localhost:8080/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dados)
            });

            const resultado = await resposta.json();

            if (!resposta.ok) {
                throw new Error(
                    resultado.message || resultado.mensagem || 'Não foi possível realizar o cadastro.'
                );
            }

            alert('Cadastro de mentor realizado com sucesso!');
            window.location.href = 'login.html';

        } catch (erro) {
            console.error('Erro no cadastro:', erro);
            alert('Erro ao cadastrar: ' + erro.message);
        }
    });
}

const infoMentor = document.getElementById('infoMentor');
const btnVoltar = document.querySelector('.btn-voltar');
const btnEditarDados = document.getElementById('btnEditarDados');
const modalEditar = document.getElementById('modalEditar');
const formEditarPerfil = document.getElementById('formEditarPerfil');
const cancelarEdicao = document.getElementById('cancelarEdicao');

if (infoMentor && localStorage.getItem('tipoUsuario') !== 'mentor') {
    window.location.href = 'login.html';
}

// Mostra os dados do mentor na tela.
function renderizarDadosMentor() {
    if (!infoMentor) return;

    const mentorDados = JSON.parse(localStorage.getItem('mentorDados') || '{}');

    const campos = [
        { label: 'Nome', value: mentorDados.nome || 'Nome não informado' },
        { label: 'Área de atuação', value: mentorDados.area || 'Área não informada' },
        { label: 'E-mail', value: mentorDados.email || 'E-mail não informado' },
        { label: 'Data de nascimento', value: mentorDados.nascimento ? formatarData(mentorDados.nascimento) : 'Data não informada' }
    ];

    infoMentor.innerHTML = campos.map((campo) => `
        <div class="info-item">
            <span>${campo.label}</span>
            <strong>${campo.value}</strong>
        </div>
    `).join('');
}

function abrirModalEdicao() {
    if (!modalEditar || !formEditarPerfil) return;

    const mentorDados = JSON.parse(localStorage.getItem('mentorDados') || '{}');

    document.getElementById('editarNome').value = mentorDados.nome || '';
    document.getElementById('editarArea').value = mentorDados.area || '';
    document.getElementById('editarEmail').value = mentorDados.email || '';
    document.getElementById('editarNascimento').value = mentorDados.nascimento || '';

    modalEditar.classList.remove('hidden');
    modalEditar.setAttribute('aria-hidden', 'false');
}

function fecharModalEdicao() {
    if (!modalEditar) return;

    modalEditar.classList.add('hidden');
    modalEditar.setAttribute('aria-hidden', 'true');
}

if (infoMentor) {
    renderizarDadosMentor();
}

if (btnVoltar) {
    btnVoltar.addEventListener('click', () => {
        window.location.href = 'Mentorias-Mentor.html';
    });
}

if (btnEditarDados) {
    btnEditarDados.addEventListener('click', abrirModalEdicao);
}

if (cancelarEdicao) {
    cancelarEdicao.addEventListener('click', fecharModalEdicao);
}

if (modalEditar) {
    modalEditar.addEventListener('click', (event) => {
        if (event.target === modalEditar) {
            fecharModalEdicao();
        }
    });
}

if (formEditarPerfil) {
    formEditarPerfil.addEventListener('submit', (event) => {
        event.preventDefault();

        const dadosAtualizados = {
            nome: document.getElementById('editarNome').value.trim(),
            area: document.getElementById('editarArea').value.trim(),
            email: document.getElementById('editarEmail').value.trim(),
            nascimento: document.getElementById('editarNascimento').value,
            senha: JSON.parse(localStorage.getItem('mentorDados') || '{}').senha || ''
        };

        localStorage.setItem('mentorDados', JSON.stringify(dadosAtualizados));
        renderizarDadosMentor();
        fecharModalEdicao();
    });
}
