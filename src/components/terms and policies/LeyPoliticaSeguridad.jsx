import { motion } from "framer-motion";
import { Shield, Lock, Key, Eye, AlertCircle, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";

function GreekPatternBackground() {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const drawGreekSymbol = (x, y, size, symbol, time, rotation = 0) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);
      
      ctx.beginPath();
      ctx.font = `${size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.fillText(symbol, 0, 0);
      
      ctx.restore();
    };

    const drawRomanNumeral = (x, y, size) => {
      ctx.save();
      ctx.translate(x, y);
      
      ctx.beginPath();
      ctx.font = `bold ${size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillText('IV', 0, 0);
      
      ctx.restore();
    };

    const drawPattern = () => {
      const width = canvas.width;
      const height = canvas.height;
      const time = timeRef.current;
      
      ctx.clearRect(0, 0, width, height);

      const centerSize = Math.min(width, height) * 0.75;
      drawRomanNumeral(width / 2, height / 2, centerSize);

      const cornerSize = Math.min(width, height) * 0.15;
      const corners = [
        { x: cornerSize, y: cornerSize, symbol: 'Ω', rotation: 0 },
        { x: width - cornerSize, y: cornerSize, symbol: 'Ψ', rotation: 0 },
        { x: cornerSize, y: height - cornerSize, symbol: 'λ', rotation: 0 },
        { x: width - cornerSize, y: height - cornerSize, symbol: 'Ω', rotation: 0 }
      ];

      corners.forEach(corner => {
        drawGreekSymbol(corner.x, corner.y, cornerSize, corner.symbol, time, corner.rotation);
      });

      const lineSpacing = width / 8;
      for (let i = 1; i < 8; i++) {
        const x = i * lineSpacing;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        
        const steps = 50;
        for (let j = 0; j <= steps; j++) {
          const y = (height * j) / steps;
          const wave = Math.sin(y * 0.02 + time) * 5;
          ctx.lineTo(x + wave, y);
        }
        
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      timeRef.current += 0.01;
      animationRef.current = requestAnimationFrame(drawPattern);
    };

    drawPattern();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full"
      style={{ 
        pointerEvents: 'none',
        zIndex: 0
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  );
}

function LeyPoliticaSeguridad() {
    const [expandedSection, setExpandedSection] = useState(null);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    const securitySections = [
        {
            title: "Protección de Datos Personales",
            content: "Incalpaca TPX ha resuelto cumplir con todas las leyes y regulaciones aplicables en materia de protección de datos personales. Al recopilar, tratar y almacenar datos personales de los Usuarios; Así mismo Incalpaca TPX proporcionara las medidas adecuadas para garantizar su seguridad y privacidad.",
            icon: <Shield className="text-gray-600" size={24} />
        },
        {
            title: "Controles Criptográficos",
            content: "Incalpaca TPX hará uso de certificados de seguridad SSL con el propósito de proteger la seguridad de la información creada, procesada, almacenada, transmitida o en custodia por sus procesos de negocio.",
            icon: <Lock className="text-gray-600" size={24} />
        },
        {
            title: "Gestión de Activos y Control de Accesos",
            content: "Incalpaca TPX controlará la operación de sus procesos de negocio garantizando la seguridad utilizando métodos de autenticación para garantizar que sólo personal autorizado tenga acceso a la información personal y financiera de los Usuarios. Además, Incalpaca TPX protegerá su información de las amenazas procedentes por parte del personal que la gestiona.",
            icon: <Key className="text-gray-600" size={24} />
        },
        {
            title: "Seguridad en la Operativa",
            content: "Incalpaca TPX ha resuelto implementar y operar la pasarela de pago de 'OpenPay' para salvaguardar toda información creada, procesada, almacenada, transmitida por las r las transacciones de los Usuarios 'OpenPay' cumple con los requisitos de la norma de seguridad de datos de la industria de tarjetas de pago (PCI DSS) y emplea medidas de seguridad para proteger la información de las tarjetas de crédito y débito de los Usuarios. Incalpaca TPX no almacena los datos de las tarjetas de los Usuarios en nuestros servidores.",
            icon: <Eye className="text-gray-600" size={24} />
        },
        {
            title: "Seguridad en las Telecomunicaciones",
            content: "Incalpaca TPX controlará la operación de sus procesos de negocio garantizando la seguridad de los recursos tecnológicos y las redes de datos. Además, Incalpaca TPX realiza evaluaciones y pruebas de seguridad (Ethical Hacking Persistente) para garantizar la integridad de nuestros sistemas y protegerlos contra accesos no autorizados.",
            icon: <Shield className="text-gray-600" size={24} />
        }
    ];

    return (
        <motion.main
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-white py-12 px-4 relative"
        >
            <GreekPatternBackground />
            <div className="max-w-5xl mx-auto relative z-10">
                <motion.div 
                    variants={itemVariants}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block"
                    >
                        <h1 className="text-4xl font-serif font-bold text-gray-900 mb-4">
                            Política de Seguridad
                        </h1>
                    </motion.div>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Compromiso con la protección y seguridad de su información
                    </p>
                </motion.div>

                <div className="space-y-6">
                    {securitySections.map((section, index) => (
                        <motion.div
                            key={index}
                            variants={itemVariants}
                            className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                        >
                            <button
                                onClick={() => setExpandedSection(expandedSection === index ? null : index)}
                                className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    {section.icon}
                                    <h2 className="text-xl font-serif font-bold text-gray-900">
                                        {section.title}
                                    </h2>
                                </div>
                                <ChevronRight 
                                    className={`transform transition-transform ${
                                        expandedSection === index ? 'rotate-90' : ''
                                    }`}
                                />
                            </button>
                            
                            <motion.div
                                initial={false}
                                animate={{
                                    height: expandedSection === index ? 'auto' : 0,
                                    opacity: expandedSection === index ? 1 : 0
                                }}
                                transition={{ duration: 0.3 }}
                                className="overflow-hidden"
                            >
                                <div className="p-8 pt-12 border-t border-gray-200">
                                    <div className="prose prose-lg max-w-none">
                                        <p className="text-gray-700 leading-relaxed text-base">
                                            {section.content}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    variants={itemVariants}
                    className="mt-12 bg-gray-50 p-8 rounded-lg border border-gray-200"
                >
                    <div className="flex items-start gap-3">
                        <AlertCircle className="text-gray-500 mt-0.5" size={24} />
                        <div>
                            <h3 className="text-lg font-serif font-bold text-gray-900 mb-2">
                                Compromiso de la Dirección
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                Incalpaca TPX garantizará el cumplimiento de las obligaciones legales, regulatorias y contractuales establecidas.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.main>
    );
}

export default LeyPoliticaSeguridad;