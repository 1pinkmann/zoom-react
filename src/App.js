import {
  BrowserRouter,
  Switch,
  Route,
} from 'react-router-dom';
import ConnectPage from './ConnectPage';
import './index.css';
import Zoom from './Zoom';

function App() {

  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" element={<ConnectPage />} />
        <Route path="/cdn" element={<Zoom />} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
