import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Cadastro } from './pages/Cadastro';
import { CadastroMentor } from './pages/CadastroMentor';
import { Inicio } from './pages/Inicio';
import { Login } from './pages/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/cadastro-mentor" element={<CadastroMentor />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;