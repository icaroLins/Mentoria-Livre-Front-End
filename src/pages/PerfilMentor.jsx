import { Link } from 'react-router-dom';
import { Cabecalho } from '../components/Cabecalho';
import '../../css/cadastro-mentor.css';

export function PerfilMentor() {
  const mentor = {
    nome: 'Ana Beatriz',
    cargo: 'Mentora de Front-end',
    area: 'UX/UI e Desenvolvimento Web',
    experiencia: '5 anos de experiência',
    disponibilidade: 'Segunda a sexta, 18h às 21h',
    descricao:
      'Apoio estudantes e profissionais em desenvolvimento de carreira, revisão de projetos, dicas de mercado e orientação prática para evolução em front-end.',
    email: 'ana@mentorialivre.com.br',
  };

  return (
    <>
      <Cabecalho />
      <main className="container-cadastro-mentor">
        <div className="lado-esquerdo">
          <div className="avatar-wrap">
            <div className="avatar-perfil" aria-label="Foto de perfil do mentor">
              <span>AB</span>
            </div>
            <button type="button" className="botao-upload-foto">
              ADICIONAR FOTO
            </button>
          </div>
        </div>

        <div className="lado-direito">
          <h2>PERFIL DO MENTOR</h2>

          <div className="perfil-mentor-card">
            <div className="perfil-header">
              <div className="avatar">AB</div>
              <div>
                <h3>{mentor.nome}</h3>
                <p>{mentor.cargo}</p>
              </div>
            </div>

            <ul className="lista-perfil">
              <li>
                <strong>Área:</strong> {mentor.area}
              </li>
              <li>
                <strong>Experiência:</strong> {mentor.experiencia}
              </li>
              <li>
                <strong>Disponibilidade:</strong> {mentor.disponibilidade}
              </li>
              <li>
                <strong>E-mail:</strong> {mentor.email}
              </li>
            </ul>

            <p className="descricao-mentor">{mentor.descricao}</p>

            <div className="botoes-mentor">
              <button type="button" className="botao-finalizar">
                SOLICITAR MENTORIA
              </button>
              <Link to="/" className="botao-mentorado">
                VOLTAR
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
