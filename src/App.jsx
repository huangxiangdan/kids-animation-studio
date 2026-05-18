import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RocketBunnyCanvas from './components/RocketBunnyCanvas';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/rocket-bunny" element={<RocketBunnyCanvas />} />
    </Routes>
  );
}
