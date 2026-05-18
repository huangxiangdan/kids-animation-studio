import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RocketBunnyCanvas from './components/RocketBunnyCanvas';
import WhiteBoneDemonCanvas from './components/WhiteBoneDemonCanvas';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rocket-bunny" element={<RocketBunnyCanvas />} />
      <Route path="/white-bone-demon" element={<WhiteBoneDemonCanvas />} />
    </Routes>
  );
}
