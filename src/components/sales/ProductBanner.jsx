import React from 'react';
import { motion } from 'framer-motion';

const waveColors = [
  '#059669', // verde esmeralda 
  '#48bb78', // verde medio
  '#38b2ac', // azul medio verdoso xd
  '#b5a27a', // beige medio
  '#7b8a8b', // gris medio
  '#4fd1c5', // turquesa 
];

function WaveText({ text }) {
  return (
    <p className="text-lg md:text-xl font-medium flex flex-wrap justify-center gap-0.5 relative z-20 select-none">
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          initial={{ color: waveColors[i % waveColors.length] }}
          animate={{
            color: waveColors,
          }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 3.2,
            delay: i * 0.12,
            ease: 'easeInOut',
          }}
          style={{ fontFamily: 'Montserrat, Inter, Poppins, Nunito Sans, sans-serif' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </p>
  );
}

const squares = [
  { size: 60, top: '10%', left: '18%', rotate: 0, color: '#e5e7eb', delay: 0 },
  { size: 40, top: '60%', left: '10%', rotate: 20, color: '#059669', delay: 0.5 },
  { size: 50, top: '30%', left: '80%', rotate: -15, color: '#111', delay: 1 },
  { size: 30, top: '70%', left: '70%', rotate: 10, color: '#b5a27a', delay: 1.5 },
  { size: 36, top: '50%', left: '50%', rotate: 30, color: '#e5e7eb', delay: 0.8 },
  { size: 80, top: '20%', left: '60%', rotate: 45, color: '#6ee7b7', delay: 1.2 },
  { size: 24, top: '80%', left: '40%', rotate: 60, color: '#059669', delay: 1.7 },
  { size: 70, top: '35%', left: '35%', rotate: -30, color: '#b5a27a', delay: 0.3 },
  { size: 55, top: '75%', left: '85%', rotate: 15, color: '#111', delay: 2 },
  { size: 32, top: '15%', left: '75%', rotate: 90, color: '#e5e7eb', delay: 2.2 },
];

function ProductBanner() {
  return (
    <div className="w-full bg-gray-200 py-12 flex items-center justify-center relative overflow-hidden">
      {squares.map((sq, idx) => (
        <motion.div
          key={idx}
          className="absolute z-0 rounded-lg opacity-70 pointer-events-none"
          style={{
            width: sq.size,
            height: sq.size,
            background: sq.color,
            top: sq.top,
            left: sq.left,
          }}
          animate={{ rotate: [sq.rotate, sq.rotate + 360] }}
          transition={{
            repeat: Infinity,
            repeatType: 'loop',
            duration: 12 + idx * 2,
            ease: 'linear',
            delay: sq.delay,
          }}
        />
      ))}
      <div className="text-center max-w-2xl mx-auto relative z-20">
        <h2
          className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight"
          style={{ fontFamily: 'Montserrat, Inter, Poppins, Nunito Sans, sans-serif' }}
        >
          DESCUBRE LA MÁS FINA FIBRA DE ALPACA
        </h2>
        <WaveText text="Acompaña tus días con colecciones inspiradas en las últimas tendencias" />
      </div>
    </div>
  );
}

export default ProductBanner; 