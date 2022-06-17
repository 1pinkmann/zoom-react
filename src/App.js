import {
  BrowserRouter,
  Routes,
  Route,
} from 'react-router-dom';
import ConnectPage from './ConnectPage';
import './index.css';
import Zoom from './Zoom';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ConnectPage />} />
        <Route path="/cdn" element={<Zoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
