import { useState } from 'react';
import Zoom from './Zoom';
import './index.css';

function App() {
  const [meeting, setMeeting] = useState(false);

  return (
    <div>
        <button onClick={() => setMeeting(true)}>Join meeting</button>
        {meeting && <Zoom />}
    </div>
  );
}

export default App;
