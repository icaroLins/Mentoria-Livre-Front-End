import { Link } from 'react-router-dom';
import { Cabecalho } from '../components/Cabecalho';

export function Inicio() {
  return (
    <Cabecalho>
      <Link className="btn-login" to="/login">LOGIN</Link>
      <Link className="btn-cadastro" to="/cadastro">CADASTRO</Link>
    </Cabecalho>
  );
}
