import { useEffect } from 'react'
import { confetti } from '@tsparticles/confetti'
import AnimatedBackground from './molecules/AnimatedBackground'
import TopMenu from './molecules/TopMenu';


const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
  confetti("tsparticles", {
    count: 100,
    spread: 360,
    startVelocity: 30,
    decay: 0.9,
    gravity: 0.5,
    origin: {
      x: e.clientX / window.innerWidth,
      y: e.clientY / window.innerHeight,
    },
  });
};

function App() {
  useEffect(() => {
    window.addEventListener('click', handleClick)

    return () => {
      window.removeEventListener('click', handleClick)
    }
  }, []);

  return (
    <>
      <div className="h-screen bg-sunshine ">
        <TopMenu />
        <AnimatedBackground />
      </div>
    </>
  )
}

export default App
