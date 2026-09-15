import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import imagemMentoria from '../../assets/ChatGPT Image 31_08_2026, 09_41_18.png';
import '../../css/login.css';
import { Cabecalho } from '../components/Cabecalho';

export function Login() {
  const [modalAberto, setModalAberto] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle('modal-aberto', modalAberto);

    return () => document.body.classList.remove('modal-aberto');
  }, [modalAberto]);

  useEffect(() => {
    function fecharComEscape(event) {
      if (event.key === 'Escape') {
        setModalAberto(false);
      }
    }

    document.addEventListener('keydown', fecharComEscape);
    return () => document.removeEventListener('keydown', fecharComEscape);
  }, []);

  function enviarLogin(event) {
    event.preventDefault();
  }

  return (
    <>
      <Cabecalho />
      <main className="container-login">
        <div className="lado-esquerdo">
          <img src={imagemMentoria} alt="Ilustração da Mentoria Livre" />
        </div>
        <div className="lado-direito">
          <h2>LOGIN</h2>
          <form onSubmit={enviarLogin}>
            <label htmlFor="login-email">E-mail:</label>
            <input type="email" id="login-email" name="email" />
            <label htmlFor="login-senha">Senha:</label>
            <input type="password" id="login-senha" name="senha" />
            <div className="botoes-secundarios">
              <button
                type="button"
                className="botao-formulario botao-cadastro"
                onClick={() => setModalAberto(true)}
              >
                CADASTRA-SE
              </button>
              <Link to="/" className="botao-formulario">VOLTAR</Link>
            </div>
            <button type="submit" className="botao-enviar">ENTRAR</button>
          </form>
        </div>
      </main>
      <div
        className={`modal-cadastro${modalAberto ? ' aberto' : ''}`}
        aria-hidden={!modalAberto}
        onClick={(event) => {
          if (event.target === event.currentTarget) setModalAberto(false);
        }}
      >
        <div className="janela-cadastro" role="dialog" aria-modal="true" aria-labelledby="titulo-cadastro">
          <button type="button" className="fechar-modal" aria-label="Fechar" onClick={() => setModalAberto(false)}>
            &times;
          </button>
          <h2 id="titulo-cadastro">Como você deseja participar?</h2>
          <p>Mentor ou Mentorado?</p>
          <div className="opcoes-cadastro">
            <button type="button" className="opcao-cadastro" onClick={() => navigate('/cadastro-mentor')}>MENTOR</button>
            <button type="button" className="opcao-cadastro opcao-mentorado" onClick={() => navigate('/cadastro')}>MENTORADO</button>
          </div>
        </div>
      </div>
    </>
  );
}
