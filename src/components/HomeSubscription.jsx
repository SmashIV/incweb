import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const CIRCLE_COUNT = 18;

// Initial circle specs
function getInitialCircles(containerWidth = 1000) {
  return Array.from({ length: CIRCLE_COUNT }).map(() => {
    const size = Math.random() * 60 + 40; // 40-100px
    const top = Math.random() * 320;

    const left = Math.random() * (containerWidth - size); // px inside the width
    const speedX = (Math.random() - 0.5) * 0.7; // px/frame
    const speedY = (Math.random() - 0.5) * 0.7;
    return {
      id: Math.random().toString(36).slice(2),
      size,
      top,
      left,
      speedX,
      speedY,
      color: [
        '#e5e7eb', // gris claro
        '#d1d5db', // gris medio
        '#f3f4f6', // gris MUY claro
        '#cbd5e1', // gris azulado
      ][Math.floor(Math.random() * 4)]
    };
  });
}

function HomeSubscription() {
  const [agree, setAgree] = useState(false);
  const containerRef = useRef();
  const [containerWidth, setContainerWidth] = useState(1000);
  const [circles, setCircles] = useState(() => getInitialCircles(1000));
  const requestRef = useRef();

  useEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  useEffect(() => {
    setCircles(getInitialCircles(containerWidth));
  }, [containerWidth]);

  useEffect(() => {
    function animate() {
      setCircles(prev => prev.map(circle => {
        let { top, left, speedX, speedY, size } = circle;
        const maxW = containerWidth - size;
        const maxH = 420 - size;
        left += speedX;
        top += speedY;
        // horizontal bounce
        if (left < 0) {
          left = 0;
          speedX = -speedX;
        } else if (left > maxW) {
          left = maxW;
          speedX = -speedX;
        }
        // vertical bounce
        if (top < 0) {
          top = 0;
          speedY = -speedY;
        } else if (top > maxH) {
          top = maxH;
          speedY = -speedY;
        }
        return { ...circle, top, left, speedX, speedY };
      }));
      requestRef.current = requestAnimationFrame(animate);
    }
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [containerWidth]);

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden h-[420px] mt-10 flex items-center justify-center bg-gray-100"
      style={{ minWidth: 0 }}
    >
      {circles.map(circle => (
        <motion.div
          key={circle.id}
          className="absolute rounded-full opacity-60 pointer-events-none"
          style={{
            top: circle.top,
            left: circle.left,
            width: circle.size,
            height: circle.size,
            background: circle.color,
            zIndex: 1,
          }}
          transition={{ type: false }}
        />
      ))}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-3xl flex flex-col gap-8 justify-center py-10 items-center">
          <div className="w-full flex flex-col items-center text-center gap-4 mb-2">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-800">SUSCRÍBETE A INCALPACA</h2>
            <p className="text-2xl md:text-3xl text-gray-700 font-semibold w-full max-w-2xl mx-auto leading-snug">
              Suscríbete y entérate de lo nuevo que tiene Incalpaca para ti
            </p>
          </div>
          <form className="w-full flex flex-col items-center gap-4" onSubmit={e => e.preventDefault()}>
            <div className="flex items-center w-full max-w-2xl">
              <div className="flex w-full items-center self-stretch">
                <input
                  type="email"
                  name="email"
                  autoComplete="off"
                  required
                  placeholder="Email"
                  className="w-full block bg-white text-black px-6 py-3 rounded-l-full placeholder-gray-400 text-lg min-w-0"
                  style={{ borderRight: 'none' }}
                />
                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.04, backgroundColor: '#222' }}
                  whileTap={{ scale: 0.98 }}
                  className="h-full px-6 py-3 bg-black text-white rounded-r-full font-semibold text-lg border border-gray-300 border-l-0 transition-all duration-200 -ml-1 flex items-center justify-center"
                  style={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
                >
                  <svg fill="currentColor" width="18" height="18" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg"><path d="M218.1 38.1L198.3 57.9c-4.7 4.7-4.7 12.3 0 17l155.1 155.1H12c-6.6 0-12 5.4-12 12v28c0 6.6 5.4 12 12 12h341.4L198.3 437.1c-4.7 4.7-4.7 12.3 0 17l19.8 19.8c4.7 4.7 12.3 4.7 17 0l209.4-209.4c4.7-4.7 4.7-12.3 0-17L235.1 38.1c-4.7-4.7-12.3-4.7-17 0z"/></svg>
                </motion.button>
              </div>
            </div>
            <div className="flex justify-center items-center text-black text-sm w-full">
              <label className="flex items-center gap-2 cursor-pointer w-full max-w-2xl justify-center">
                <input
                  type="checkbox"
                  name="agree_terms"
                  required
                  checked={agree}
                  onChange={e => setAgree(e.target.checked)}
                  className="accent-black w-5 h-5 rounded border border-gray-400"
                />
                <span className="text-bold">
                  Estoy de acuerdo con las{' '}
                  <a href="/pages/politica-de-cambios-y-devoluciones" target="_blank" rel="noopener noreferrer" className="underline hover:text-black font-medium">Políticas de Cambios y Devoluciones</a>{' '}y{' '}
                  <a href="/pages/politica-de-envio" target="_blank" rel="noopener noreferrer" className="underline hover:text-black font-medium">Políticas de Envíos</a>
                </span>
              </label>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HomeSubscription;