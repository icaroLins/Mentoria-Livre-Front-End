function formatarDataMentorado(data) {
    if (!data) return 'Data não informada';

    const dataObj = new Date(`${data}T00:00:00`);
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

        if (!arquivo) return;

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

const formMentorado = document.getElementById('form-mentorado');

// Salva o cadastro do mentorado e encaminha para o login.
if (formMentorado) {
    formMentorado.addEventListener('submit', (event) => {
        event.preventDefault();

        const dados = {
            nome: document.getElementById('nome')?.value.trim() || '',
            nascimento: document.getElementById('data-nascimento')?.value || '',
            email: document.getElementById('email')?.value.trim() || '',
            senha: document.getElementById('senha')?.value || ''
        };

        localStorage.setItem('mentoradoDados', JSON.stringify(dados));
        localStorage.removeItem('tipoUsuario');
        window.location.href = 'login.html';
    });
}

const infoMentorado = document.getElementById('infoMentorado');
const btnEditarDados = document.getElementById('btnEditarDados');
const modalEditar = document.getElementById('modalEditar');
const formEditarPerfil = document.getElementById('formEditarPerfil');
const cancelarEdicao = document.getElementById('cancelarEdicao');

if (infoMentorado && localStorage.getItem('tipoUsuario') !== 'mentorado') {
    window.location.href = 'login.html';
}

// Mostra os dados do mentorado na tela.
function renderizarDadosMentorado() {
    if (!infoMentorado) return;

    const mentoradoDados = JSON.parse(localStorage.getItem('mentoradoDados') || '{}');
    const campos = [
        { label: 'Nome', value: mentoradoDados.nome || 'Nome não informado' },
        { label: 'E-mail', value: mentoradoDados.email || 'E-mail não informado' },
        {
            label: 'Data de nascimento',
            value: mentoradoDados.nascimento
                ? formatarDataMentorado(mentoradoDados.nascimento)
                : 'Data não informada'
        }
    ];

    infoMentorado.innerHTML = campos.map((campo) => `
        <div class="info-item">
            <span>${campo.label}</span>
            <strong>${campo.value}</strong>
        </div>
    `).join('');
}

// Abre o modal de edição do perfil.
function abrirModalEdicao() {
    const mentoradoDados = JSON.parse(localStorage.getItem('mentoradoDados') || '{}');

    document.getElementById('editarNome').value = mentoradoDados.nome || '';
    document.getElementById('editarEmail').value = mentoradoDados.email || '';
    document.getElementById('editarNascimento').value = mentoradoDados.nascimento || '';
    modalEditar.classList.remove('hidden');
    modalEditar.setAttribute('aria-hidden', 'false');
}

// Fecha o modal de edição.
function fecharModalEdicao() {
    modalEditar.classList.add('hidden');
    modalEditar.setAttribute('aria-hidden', 'true');
}

if (infoMentorado) {
    renderizarDadosMentorado();
}

if (btnEditarDados) {
    btnEditarDados.addEventListener('click', abrirModalEdicao);
}

if (cancelarEdicao) {
    cancelarEdicao.addEventListener('click', fecharModalEdicao);
}

if (modalEditar) {
    modalEditar.addEventListener('click', (event) => {
        if (event.target === modalEditar) fecharModalEdicao();
    });
}

if (formEditarPerfil) {
    formEditarPerfil.addEventListener('submit', (event) => {
        event.preventDefault();

        const dadosAtualizados = {
            nome: document.getElementById('editarNome').value.trim(),
            email: document.getElementById('editarEmail').value.trim(),
            nascimento: document.getElementById('editarNascimento').value,
            senha: JSON.parse(localStorage.getItem('mentoradoDados') || '{}').senha || ''
        };

        localStorage.setItem('mentoradoDados', JSON.stringify(dadosAtualizados));
        renderizarDadosMentorado();
        fecharModalEdicao();
    });
}