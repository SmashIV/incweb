import alpaca_video from '../assets/videos/alpacas.mp4';
import llama_home from '../assets/llama_home.webp';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

function Typewriter({ text, speed = 80 }) {
  const [displayed, setDisplayed] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [showLlama, setShowLlama] = useState(false);

  useEffect(() => {
    let i = 0;
    setDisplayed('');
    setShowCursor(true);
    setShowLlama(false);
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
        setTimeout(() => setShowCursor(false), 1200);
        setTimeout(() => setShowLlama(true), 400);
      }
    }, speed);
    return () => clearInterval(interval);
  }, [text, speed]);
  
  return (
    <div className="relative flex items-center justify-center">
      {showLlama && (
        <motion.img
          src={llama_home}
          alt="Llama"
          initial={{ opacity: 0, x: 40, y: -40, scale: 0.7, rotate: 0 }}
          animate={{ opacity: 0.95, x: 0, y: 0, scale: 1, rotate: 30 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="absolute md:w-[80px] md:h-[80px] w-[48px] h-[48px] object-contain select-none pointer-events-none"
          style={{ zIndex: 0, right: '0.5rem', top: '0.5rem' }}
        />
      )}
      <h1 className="text-[clamp(3rem,12vw,8rem)] font-extrabold text-white text-left tracking-tight leading-tight drop-shadow-xl flex flex-wrap gap-x-2 select-none">
        {displayed}
        <motion.span
          initial={{ opacity: 1 }}
          animate={{ opacity: [1, 0, 1] }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
          className="ml-1"
          style={{ visibility: showCursor ? 'visible' : 'hidden' }}
        >
          |
        </motion.span>
      </h1>
    </div>
  );
}


function HomeVideoPanel() {
    {/* TODO: maybe change to another video (idk if it needs to be a video in Peru, I pick a random one lol).
        Fix panel-text container's components and aesthetics*/}
    return (  
        <div className="relative max-w-full h-[850px] overflow-hidden rounded-2xl m-20 mb-10" id='panel-video'>
            <video src={alpaca_video} autoPlay loop muted className="absolute w-full h-full object-cover" >
            </video>
            <div className='absolute inset-0 flex flex-col items-center justify-center gap-4 z-10' id='panel-text'>
                <span className="text-4xl md:text-6xl font-extrabold tracking-tight text-center select-none" style={{lineHeight: 1.1, color: '#f5e9da', textShadow: '0 2px 8px rgba(0,0,0,0.10)'}}>Bienvenido a</span>
                <Typewriter text="Incalpaca" speed={80} />
                <button
                  className='px-8 py-4 rounded-full font-bold text-xl shadow-lg transition-all duration-300 mt-4'
                  style={{
                    background: '#f5e9da',
                    color: '#5c4632',
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.background = '#e9d7bb';
                    e.currentTarget.style.color = '#fff';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.background = '#f5e9da';
                    e.currentTarget.style.color = '#5c4632';
                  }}
                >
                  Explora el catálogo
                </button>
            </div>
        </div>
    );
}

export default HomeVideoPanel;