import { motion } from "framer-motion";
import { Truck, Clock, MapPin, Phone, Mail, AlertCircle, Package, Store, CreditCard } from "lucide-react";
import { useRef, useEffect } from "react";

function MathPatternBackground() {
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

    const drawGreekOmega = (x, y, size, time, rotation = 0) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation + Math.sin(time * 0.5) * 0.1);
      
      ctx.beginPath();
      ctx.font = `${size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillText('Ω', 0, 0);
      
      ctx.restore();
    };

    const drawSquareAndCompass = (x, y, size, time, rotation = 0) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation + Math.sin(time * 0.3) * 0.1);
      
      ctx.beginPath();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 2;
      ctx.rect(-size/2, -size/2, size, size);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, -size/2);
      ctx.lineTo(size/2, size/2);
      ctx.moveTo(0, -size/2);
      ctx.lineTo(-size/2, size/2);
      ctx.stroke();
      
      ctx.restore();
    };

    const drawAllSeeingEye = (x, y, size, time) => {
      ctx.save();
      ctx.translate(x, y);
      
      ctx.beginPath();
      ctx.moveTo(0, -size/2);
      ctx.lineTo(size/2, size/2);
      ctx.lineTo(-size/2, size/2);
      ctx.closePath();
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      const eyeSize = size * 0.3;
      ctx.beginPath();
      ctx.arc(0, 0, eyeSize, 0, Math.PI * 2);
      ctx.stroke();
      
      const pupilSize = eyeSize * 0.4;
      ctx.beginPath();
      ctx.arc(0, 0, pupilSize, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fill();
      
      ctx.restore();
    };

    const drawPattern = () => {
      const width = canvas.width;
      const height = canvas.height;
      const time = timeRef.current;
      
      ctx.clearRect(0, 0, width, height);

      const cornerSize = Math.min(width, height) * 0.15;
      const corners = [
        { x: cornerSize, y: cornerSize, rotation: 0 },
        { x: width - cornerSize, y: cornerSize, rotation: Math.PI / 2 },
        { x: cornerSize, y: height - cornerSize, rotation: -Math.PI / 2 },
        { x: width - cornerSize, y: height - cornerSize, rotation: Math.PI }
      ];

      corners.forEach(corner => {
        drawGreekOmega(corner.x, corner.y, cornerSize, time, corner.rotation);
      });

      const topSize = Math.min(width, height) * 0.1;
      const topSpacing = width / 6;
      for (let i = 2; i < 5; i++) {
        drawSquareAndCompass(i * topSpacing, topSize, topSize, time, Math.PI / 4);
      }

      const bottomSize = Math.min(width, height) * 0.1;
      const bottomSpacing = width / 6;
      for (let i = 2; i < 5; i++) {
        drawAllSeeingEye(i * bottomSpacing, height - bottomSize, bottomSize, time);
      }

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.lineWidth = 1;

      const lineSpacing = height / 4;
      for (let i = 1; i < 4; i++) {
        const y = i * lineSpacing;
        ctx.beginPath();
        ctx.moveTo(0, y);
        
        const steps = 50;
        for (let j = 0; j <= steps; j++) {
          const x = (width * j) / steps;
          const wave = Math.sin(x * 0.01 + time) * 10;
          ctx.lineTo(x, y + wave);
        }
        
        ctx.stroke();
      }

      const vLineSpacing = width / 4;
      for (let i = 1; i < 4; i++) {
        const x = i * vLineSpacing;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        
        const steps = 50;
        for (let j = 0; j <= steps; j++) {
          const y = (height * j) / steps;
          const wave = Math.sin(y * 0.01 + time) * 10;
          ctx.lineTo(x + wave, y);
        }
        
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

function LeyPoliticaEnvio() {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5
            }
        }
    };

    const cardHoverVariants = {
        hover: {
            scale: 1.02,
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            transition: {
                duration: 0.3
            }
        }
    };

    const colorVariants = {
        initial: { backgroundColor: "rgb(255, 255, 255)" },
        hover: { 
            backgroundColor: "rgb(249, 250, 251)",
            transition: { duration: 0.3 }
        }
    };

    return (
        <motion.main
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-white py-12 px-4 relative"
        >
            <MathPatternBackground />
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.section 
                    variants={itemVariants}
                    className="text-center mb-16"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-block"
                    >
                        <h1 className="text-4xl font-bold text-gray-900 mb-4">
                            Política de Envío
                        </h1>
                    </motion.div>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Garantizamos entregas seguras y oportunas en todo el Perú. Conozca nuestros términos y condiciones de envío.
                    </p>
                </motion.section>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <motion.div 
                        variants={itemVariants}
                        className="lg:col-span-2 space-y-8"
                    >
                        <motion.section 
                            variants={cardHoverVariants}
                            whileHover="hover"
                            className="bg-white rounded-2xl overflow-hidden border border-gray-200"
                        >
                            <div className="bg-gray-900 p-6">
                                <div className="flex items-center gap-3">
                                    <Package className="text-white" size={24} />
                                    <h2 className="text-2xl font-bold text-white">Envío de Pedidos</h2>
                                </div>
                            </div>
                            <motion.div 
                                variants={colorVariants}
                                initial="initial"
                                whileHover="hover"
                                className="p-8 space-y-4 text-gray-600"
                            >
                                <p className="leading-relaxed">
                                    Para garantizar un envío exitoso, es fundamental que el cliente proporcione información precisa al realizar su pedido. 
                                    La responsabilidad de los datos registrados recae exclusivamente en el cliente.
                                </p>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <p className="text-sm flex items-center">
                                        <AlertCircle className="inline-block mr-2 text-gray-600" size={16} />
                                        Datos incorrectos o incompletos pueden resultar en la cancelación de la orden.
                                    </p>
                                </div>
                            </motion.div>
                        </motion.section>

                        <motion.section 
                            variants={cardHoverVariants}
                            whileHover="hover"
                            className="bg-white rounded-2xl overflow-hidden border border-gray-200"
                        >
                            <div className="bg-gray-900 p-6">
                                <div className="flex items-center gap-3">
                                    <Truck className="text-white" size={24} />
                                    <h2 className="text-2xl font-bold text-white">Costos de Envío</h2>
                                </div>
                            </div>
                            <motion.div 
                                variants={colorVariants}
                                initial="initial"
                                whileHover="hover"
                                className="p-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 transform transition-all duration-300 hover:scale-105">
                                        <h3 className="font-semibold text-gray-800 mb-2">Retiro en Tienda</h3>
                                        <p className="text-2xl font-bold text-gray-900">Gratis</p>
                                        <p className="text-sm text-gray-600 mt-2">Recoge tu pedido en cualquiera de nuestras tiendas</p>
                                    </div>
                                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                        <h3 className="font-semibold text-gray-800 mb-2">Envío a Domicilio</h3>
                                        <ul className="space-y-2">
                                            <li className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-200">
                                                <span>Lima</span>
                                                <span className="font-semibold text-gray-900">S/15.00</span>
                                            </li>
                                            <li className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-200">
                                                <span>Provincia</span>
                                                <span className="font-semibold text-gray-900">S/25.00</span>
                                            </li>
                                            <li className="flex justify-between items-center p-2 bg-white rounded-lg border border-gray-200">
                                                <span>Express</span>
                                                <span className="font-semibold text-gray-900">S/30.00</span>
                                            </li>
                    </ul>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.section>

                        <motion.section 
                            variants={cardHoverVariants}
                            whileHover="hover"
                            className="bg-white rounded-2xl overflow-hidden border border-gray-200"
                        >
                            <div className="bg-gray-900 p-6">
                                <div className="flex items-center gap-3">
                                    <Clock className="text-white" size={24} />
                                    <h2 className="text-2xl font-bold text-white">Tiempos de Entrega</h2>
                                </div>
                            </div>
                            <motion.div 
                                variants={colorVariants}
                                initial="initial"
                                whileHover="hover"
                                className="p-8"
                            >
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Envío a Domicilio</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 transform transition-all duration-300 hover:scale-105">
                                                <h4 className="font-medium text-gray-800">Express Lima Metropolitana</h4>
                                                <p className="text-sm text-gray-600">5 horas después de la 1 p.m.</p>
                                                <p className="text-xs text-gray-500 mt-1">Lunes a viernes (pedidos antes de 1 p.m.)</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 transform transition-all duration-300 hover:scale-105">
                                                <h4 className="font-medium text-gray-800">Lima Metropolitana</h4>
                                                <p className="text-sm text-gray-600">1 día hábil</p>
                                                <p className="text-xs text-gray-500 mt-1">L-V: 1:00 p.m. - 7:00 p.m. | S: 10:00 a.m. - 6:00 p.m.</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 transform transition-all duration-300 hover:scale-105">
                                                <h4 className="font-medium text-gray-800">Lima Provincia</h4>
                                                <p className="text-sm text-gray-600">3 días hábiles</p>
                                            </div>
                                            <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 transform transition-all duration-300 hover:scale-105">
                                                <h4 className="font-medium text-gray-800">Arequipa y Otras Capitales</h4>
                                                <p className="text-sm text-gray-600">Hasta 5 días hábiles</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Retiro en Tienda</h3>
                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                            <p className="text-gray-600">Hasta 3 días hábiles para retiro en tienda</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.section>
                    </motion.div>

                    <motion.div 
                        variants={itemVariants}
                        className="space-y-8"
                    >
                        <motion.section 
                            variants={cardHoverVariants}
                            whileHover="hover"
                            className="bg-white rounded-2xl overflow-hidden border border-gray-200"
                        >
                            <div className="bg-gray-900 p-6">
                                <div className="flex items-center gap-3">
                                    <AlertCircle className="text-white" size={24} />
                                    <h2 className="text-2xl font-bold text-white">Información Importante</h2>
                                </div>
                            </div>
                            <motion.div 
                                variants={colorVariants}
                                initial="initial"
                                whileHover="hover"
                                className="p-8 space-y-4 text-gray-600"
                            >
                                <p className="text-sm leading-relaxed">
                                    Los costos y tiempos de entrega pueden variar para ciudades y distritos alejados. 
                                    Consulte previamente con nuestro equipo de atención al cliente.
                                </p>
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                    <h3 className="font-semibold text-gray-800 mb-2">Requisitos de Entrega</h3>
                                    <ul className="text-sm space-y-2">
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-500">•</span>
                                            <span>El receptor debe ser mayor de edad</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-500">•</span>
                                            <span>Presentar DNI físico</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <span className="text-gray-500">•</span>
                                            <span>Firmar el cargo de recepción</span>
                                        </li>
                    </ul>
                                </div>
                            </motion.div>
                        </motion.section>

                        <motion.section 
                            variants={cardHoverVariants}
                            whileHover="hover"
                            className="bg-white rounded-2xl overflow-hidden border border-gray-200"
                        >
                            <div className="bg-gray-900 p-6">
                                <div className="flex items-center gap-3">
                                    <Phone className="text-white" size={24} />
                                    <h2 className="text-2xl font-bold text-white">Contacto</h2>
                                </div>
                            </div>
                            <motion.div 
                                variants={colorVariants}
                                initial="initial"
                                whileHover="hover"
                                className="p-8"
                            >
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <Phone size={20} className="text-gray-600" />
                                        <span>994 056 860</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-gray-600 bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <Mail size={20} className="text-gray-600" />
                                        <span>incalpacastores@incalpaca.com</span>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.section>

                        <motion.section 
                            variants={cardHoverVariants}
                            whileHover="hover"
                            className="bg-white rounded-2xl overflow-hidden border border-gray-200"
                        >
                            <div className="bg-gray-900 p-6">
                                <div className="flex items-center gap-3">
                                    <CreditCard className="text-white" size={24} />
                                    <h2 className="text-2xl font-bold text-white">Métodos de Pago</h2>
                                </div>
                            </div>
                            <motion.div 
                                variants={colorVariants}
                                initial="initial"
                                whileHover="hover"
                                className="p-8"
                            >
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
                                    <h3 className="font-semibold text-gray-800 mb-4">Aceptamos</h3>
                                    <ul className="space-y-3">
                                        <li className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                                            <CreditCard size={20} className="text-gray-600" />
                                            <span className="text-gray-600">Tarjetas de crédito y débito</span>
                                        </li>
                                        <li className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                                            <Store size={20} className="text-gray-600" />
                                            <span className="text-gray-600">Transferencia bancaria</span>
                                        </li>
                                        <li className="flex items-center gap-2 bg-white p-3 rounded-lg border border-gray-200">
                                            <Package size={20} className="text-gray-600" />
                                            <span className="text-gray-600">Pago en efectivo al recibir</span>
                                        </li>
                                    </ul>
                                </div>
                            </motion.div>
                        </motion.section>
                    </motion.div>
                </div>
            </div>
        </motion.main>
    );
}

export default LeyPoliticaEnvio;