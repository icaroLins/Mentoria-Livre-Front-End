import { Link, useNavigate } from 'react-router-dom';
import imagemMentoria from '../../assets/ChatGPT Image 31_08_2026, 09_41_18.png';
import '../../css/cadastro-mentor.css';
import { Cabecalho } from '../components/Cabecalho';

export function CadastroMentor() {
  const navigate = useNavigate();

  function finalizarCadastro(event) {
    event.preventDefault();
    navigate('/login');
  }

  return (
    <>
      <Cabecalho />
      <main className="container-cadastro-mentor">
        <div className="lado-esquerdo">
          <img src={imagemMentoria} alt="Ilustração da Mentoria Livre" />
        </div>
        <div className="lado-direito">
          <h2>CADASTRO DO MENTOR</h2>
          <form onSubmit={finalizarCadastro}>
            <label htmlFor="mentor-nome">Nome:</label>
            <input type="text" id="mentor-nome" name="nome" autoComplete="name" required />
            <label htmlFor="area">Área de atuação:</label>
            <input type="text" id="area" name="area" required />
            <label htmlFor="mentor-email">E-mail:</label>
            <input type="email" id="mentor-email" name="email" autoComplete="email" required />
            <label htmlFor="mentor-senha">Senha:</label>
            <input type="password" id="mentor-senha" name="senha" autoComplete="new-password" required />
            <fieldset className="dados-vaga">
              <legend>VAGA DE MENTORIA</legend>
              <label htmlFor="vaga-titulo">Título da vaga:</label>
              <input type="text" id="vaga-titulo" name="vaga-titulo" required />
              <label htmlFor="vaga-descricao">Descrição:</label>
              <textarea id="vaga-descricao" name="vaga-descricao" rows="4" required />
              <div className="campos-vaga">
                <div>
                  <label htmlFor="vaga-data-hora">Data e horário:</label>
                  <input type="datetime-local" id="vaga-data-hora" name="vaga-data-hora" required />
                </div>
                <div>
                  <label htmlFor="vaga-status">Status:</label>
                  <select id="vaga-status" name="vaga-status" defaultValue="disponivel" required>
                    <option value="disponivel">Disponível</option>
                    <option value="indisponivel">Indisponível</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="vaga-min-pessoas">Mínimo de pessoas:</label>
                  <input type="number" id="vaga-min-pessoas" name="vaga-min-pessoas" min="1" required />
                </div>
                <div>
                  <label htmlFor="vaga-max-pessoas">Máximo de pessoas:</label>
                  <input type="number" id="vaga-max-pessoas" name="vaga-max-pessoas" min="1" required />
                </div>
              </div>
            </fieldset>
            <div className="botoes-mentor">
              <button type="submit" className="botao-finalizar">FINALIZAR</button>
              <Link to="/cadastro" className="botao-mentorado">MENTORADO</Link>
            </div>
          </form>
        </div>
      </main>
    </>
  );
}