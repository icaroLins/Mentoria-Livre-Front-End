import { Link, useNavigate } from 'react-router-dom';
import imagemMentoria from '../../assets/ChatGPT Image 31_08_2026, 09_41_18.png';
import '../../css/cadastro.css';
import { Cabecalho } from '../components/Cabecalho';

export function Cadastro() {
  const navigate = useNavigate();

  function finalizarCadastro(event) {
    event.preventDefault();
    navigate('/login');
  }

  return (
    <>
      <Cabecalho />
      <main className="container-cadastro">
        <div className="lado-esquerdo">
          <img src={imagemMentoria} alt="Ilustração da Mentoria Livre" />
        </div>
        <div className="lado-direito">
          <h2>CADASTRO DO MENTORADO</h2>
          <form onSubmit={finalizarCadastro}>
            <label htmlFor="mentorado-nome">Nome:</label>
            <input type="text" id="mentorado-nome" name="nome" autoComplete="name" required />
            <label htmlFor="data-nascimento">Data de nascimento:</label>
            <input type="date" id="data-nascimento" name="data-nascimento" required />
            <label htmlFor="mentorado-email">E-mail:</label>
            <input type="email" id="mentorado-email" name="email" autoComplete="email" required />
            <label htmlFor="mentorado-senha">Senha:</label>
            <input type="password" id="mentorado-senha" name="senha" autoComplete="new-password" required />
            <div className="botoes-cadastro">
              <button type="submit" className="botao-finalizar">FINALIZAR</button>
              <Link to="/cadastro-mentor" className="botao-mentorado">MENTOR</Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}
