import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RocketBunnyCanvas from './components/RocketBunnyCanvas';
import WhiteBoneDemonCanvas from './components/WhiteBoneDemonCanvas';
import RainbowDragonCanvas from './components/RainbowDragonCanvas';

import DinoGardenCanvas from './components/DinoGardenCanvas';
import CandyCatCanvas from './components/CandyCatCanvas';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rocket-bunny" element={<RocketBunnyCanvas />} />
      <Route path="/white-bone-demon" element={<WhiteBoneDemonCanvas />} />
      <Route path="/rainbow-dragon" element={<RainbowDragonCanvas />} />
      <Route path="/dino-garden" element={<DinoGardenCanvas />} />
      <Route path="/candy-cat" element={<CandyCatCanvas />} />
    </Routes>
  );
}
