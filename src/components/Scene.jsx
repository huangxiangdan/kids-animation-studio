import { useState, useEffect, useCallback } from 'react';
import StarField from './StarField';
import Moon from './Moon';
import Rocket from './Rocket';
import Clouds from './Clouds';
import Credits from './Credits';

/*
 * Phase timeline:
 *   0 (0-2s)  : Ground scene, rocket idle, bunny waves
 *   1 (2-5s)  : Ignition, launch, clouds rush down
 *   2 (5-8s)  : Deep space, stars bright, rocket flies toward moon
 *   3 (8-10s) : Arrive at moon, bunny jumps out, Chang'e bunny welcomes
 *   4 (10-12s): Credits roll in
 */

const PHASE_DURATIONS_MS = [2000, 3000, 3000, 2000, 2000];

function Scene() {
  const [phase, setPhase] = useState(0);
  const [key, setKey] = useState(0);

  useEffect(() => {
    const timers = [];
    let accumulated = 0;

    for (let i = 1; i < PHASE_DURATIONS_MS.length; i++) {
      accumulated += PHASE_DURATIONS_MS[i - 1];
      const nextPhase = i;
      const delay = accumulated;
      const timer = setTimeout(() => {
        setPhase(nextPhase);
      }, delay);
      timers.push(timer);
    }

    return () => {
      timers.forEach((t) => clearTimeout(t));
    };
  }, [key]);

  const handleReplay = useCallback(() => {
    setPhase(0);
    setKey((prev) => prev + 1);
  }, []);

  const hideGround = phase >= 2;

  return (
    <div className="scene-container" key={key}>
      {/* Sky gradient background */}
      <div className={`sky-bg phase-${phase}`} />

      {/* Star field */}
      <StarField phase={phase} />

      {/* Moon */}
      <Moon phase={phase} />

      {/* Clouds (during launch) */}
      <Clouds phase={phase} />

      {/* Ground + launch pad */}
      <div className={`ground${hideGround ? ' hidden' : ''}`}>
        <div className="ground-detail">
          {Array.from({ length: 12 }, (_, i) => (
            <div key={i} className="grass-tuft" />
          ))}
        </div>
      </div>
      <div className={`launch-pad${hideGround ? ' hidden' : ''}`} />

      {/* Rocket with bunny */}
      <Rocket phase={phase} />

      {/* Credits overlay */}
      <Credits phase={phase} onReplay={handleReplay} />
    </div>
  );
}

export default Scene;
