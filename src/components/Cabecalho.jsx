import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../css/cabecalho.css';

export function Cabecalho({ children }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    function fecharAoClicarFora(event) {
      if (!menuRef.current?.contains(event.target)) {
        setMenuAberto(false);
      }
    }

    function fecharComEscape(event) {
      if (event.key === 'Escape') {
        setMenuAberto(false);
      }
    }

    document.addEventListener('click', fecharAoClicarFora);
    document.addEventListener('keydown', fecharComEscape);

    return () => {
      document.removeEventListener('click', fecharAoClicarFora);
      document.removeEventListener('keydown', fecharComEscape);
    };
  }, []);

  return (
    <>
      <div className="container-cabeçalho">
        <h1>MENTORIA LIVRE</h1>
        <div className="container-botoes">
          {children}
          <div className="menu-wrapper" ref={menuRef}>
            <button
              type="button"
              className="btn-cadastro"
              aria-expanded={menuAberto}
              aria-controls="menu-navegacao"
              onClick={() => setMenuAberto((aberto) => !aberto)}
            >
              MENU
            </button>
            <nav
              className={`menu-navegacao${menuAberto ? ' aberto' : ''}`}
              id="menu-navegacao"
              aria-label="Navegação principal"
            >
              <Link to="/" onClick={() => setMenuAberto(false)}>INÍCIO</Link>
              <Link to="/login" onClick={() => setMenuAberto(false)}>LOGIN</Link>
              <Link to="/cadastro-mentor" onClick={() => setMenuAberto(false)}>CADASTRO DO MENTOR</Link>
              <Link to="/cadastro" onClick={() => setMenuAberto(false)}>CADASTRO DO MENTORADO</Link>
            </nav>
          </div>
        </div>
      </div>
      <hr />
    </>
  );
}
