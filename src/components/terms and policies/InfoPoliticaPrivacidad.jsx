import { motion } from "framer-motion";
import { Shield, Lock, Eye, Key, AlertCircle, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";

function BourgeoisPatternBackground() {
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

    const drawKochCurve = (x1, y1, x2, y2, depth) => {
      if (depth <= 0) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.lineWidth = 1;
        ctx.stroke();
        return;
      }

      const dx = x2 - x1;
      const dy = y2 - y1;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const unit = dist / 3;
      const angle = Math.atan2(dy, dx);

      const x3 = x1 + dx / 3;
      const y3 = y1 + dy / 3;
      const x4 = x2 - dx / 3;
      const y4 = y2 - dy / 3;
      const x5 = x3 + Math.cos(angle - Math.PI / 3) * unit;
      const y5 = y3 + Math.sin(angle - Math.PI / 3) * unit;

      drawKochCurve(x1, y1, x3, y3, depth - 1);
      drawKochCurve(x3, y3, x5, y5, depth - 1);
      drawKochCurve(x5, y5, x4, y4, depth - 1);
      drawKochCurve(x4, y4, x2, y2, depth - 1);
    };

    const drawFractal = (x, y, size, depth) => {
      if (depth <= 0) return;
      
      ctx.save();
      ctx.translate(x, y);
      
      ctx.beginPath();
      ctx.font = `${size}px serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillText('λ', 0, 0);
      
      if (depth > 1) {
        const newSize = size * 0.5;
        const offset = size * 0.7;
        
        drawFractal(-offset, -offset, newSize, depth - 1);
        drawFractal(offset, -offset, newSize, depth - 1);
        drawFractal(-offset, offset, newSize, depth - 1);
        drawFractal(offset, offset, newSize, depth - 1);
      }
      
      ctx.restore();
    };

    const drawPattern = () => {
      const width = canvas.width;
      const height = canvas.height;
      const time = timeRef.current;
      
      ctx.clearRect(0, 0, width, height);

      const bounceOffsets = [
        { x: Math.sin(time * 0.5) * 30, y: Math.cos(time * 0.5) * 30 },
        { x: Math.sin(time * 0.7) * 25, y: Math.cos(time * 0.7) * 25 },
        { x: Math.sin(time * 0.3) * 35, y: Math.cos(time * 0.3) * 35 },
        { x: Math.sin(time * 0.9) * 20, y: Math.cos(time * 0.9) * 20 },
        { x: Math.sin(time * 0.4) * 40, y: Math.cos(time * 0.4) * 40 },
        { x: Math.sin(time * 0.6) * 45, y: Math.cos(time * 0.6) * 45 }
      ];

      const kochSize = Math.min(width, height) * 0.15; 
      
      const kochCurves = [
        // Top left
        { x1: width * 0.1, y1: height * 0.1, x2: width * 0.3, y2: height * 0.3 },
        // Top right
        { x1: width * 0.7, y1: height * 0.1, x2: width * 0.9, y2: height * 0.3 },
        // Bottom left
        { x1: width * 0.1, y1: height * 0.7, x2: width * 0.3, y2: height * 0.9 },
        // Bottom right
        { x1: width * 0.7, y1: height * 0.7, x2: width * 0.9, y2: height * 0.9 },
        // Center left
        { x1: width * 0.1, y1: height * 0.4, x2: width * 0.3, y2: height * 0.6 },
        // Center right
        { x1: width * 0.7, y1: height * 0.4, x2: width * 0.9, y2: height * 0.6 }
      ];

      kochCurves.forEach((curve, index) => {
        const bounce = bounceOffsets[index];
        drawKochCurve(
          curve.x1 + bounce.x,
          curve.y1 + bounce.y,
          curve.x2 + bounce.x,
          curve.y2 + bounce.y,
          4
        );
      });

      const patternSize = Math.min(width, height) * 0.1;
      const patterns = [
        { x: patternSize, y: patternSize },
        { x: width - patternSize, y: patternSize },
        { x: patternSize, y: height - patternSize },
        { x: width - patternSize, y: height - patternSize }
      ];

      patterns.forEach(pattern => {
        drawFractal(pattern.x, pattern.y, patternSize, 2);
      });

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

function InfoPoliticaPrivacidad() {
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

    const privacySections = [
        {
            title: "Declaración de Privacidad",
            content: "INCALPACA TPX S.A. es una sociedad legalmente constituida y registrada en Perú con RUC N° 20100226813 y domicilio social en Calle Cóndor Nro. 100 Urb. Tahuaycani, Distrito de Sachaca, Provincia y Departamento de Arequipa; la cual valora y respeta la privacidad de sus clientes. El tratamiento de la información personal recogida a través de la Plataforma es responsabilidad de la Empresa, y se sujeta a la Ley N°29733 –Ley de Protección de Datos Personales– y demás normas o regulaciones aplicables. Los fines para los cuales serán empleados estos datos se limitan al procesamiento de las órdenes de compra y comunicación con el Cliente, de modo que se pueda atender ágilmente sus inquietudes o suministrarle información relativa a la marca que pudiera ser de su interés.",
            icon: <Shield className="text-gray-600" size={24} />
        },
        {
            title: "Recopilación de Datos",
            content: "La información recopilada en línea incluye aquella que se recoge por medios automáticos así como la que es de índole personal y que el cliente ingresa manualmente. Los datos recogidos automáticamente durante la utilización de la Plataforma serán empleados con el único objetivo de obtener información estadística y comprobar el correcto funcionamiento de la tienda virtual. Algunos de estos incluyen, por ejemplo, las páginas que el cliente visualiza en el sitio web, información sobre el tipo de navegador, dirección IP del cliente, entre otros.",
            icon: <Eye className="text-gray-600" size={24} />
        },
        {
            title: "Cookies y Persistencia",
            content: "La tienda online de Incalpaca hace uso de Google Analytics, herramienta que emplea ficheros temporales creados en cada dispositivo de navegación –denominados 'cookies' –, para almacenar información con diferentes propósitos. Entre ellos, se encuentran el conocer las preferencias de compra del Cliente –tales como las categorías y productos vistos recientemente– y el almacenamiento de los productos que desee adquirir en la bolsa de compras.",
            icon: <Lock className="text-gray-600" size={24} />
        },
        {
            title: "Datos Personales",
            content: "Los usuarios podrán ingresar sus datos para suscribirse a la página web aceptando el envío por parte de Incalpaca de información promocional. Para hacer una compra, el Cliente deberá registrar sus datos personales –en caso no hubiera creado previamente una cuenta– para poder ejecutar su Orden de Compra. La información personal que deberá consignar en el registro incluye sus nombres y apellidos, Documento Nacional de Identidad (DNI)/Carné de Extranjería (CE)/Registro Único de Contribuyentes (RUC), género, fecha de nacimiento, teléfono, dirección, distrito, provincia y departamento. Estos campos podrían variar dependiendo del país donde resida el Cliente.",
            icon: <Key className="text-gray-600" size={24} />
        },
        {
            title: "Transmisión Segura",
            content: "Con el objetivo de brindarle al cliente un proceso de compra seguro, la Empresa posee un acuerdo con un proveedor externo de servicios de pago en línea. Los datos suministrados por el cliente serán compartidos con el proveedor para fines exclusivos de prestación del servicio, los cuales incluyen el procesamiento de pagos y la validación de transacciones a través de un sistema anti fraude, a fin de minimizar el riesgo de suplantación de identidad de los tarjeta habientes. Al efectuar un pago bajo la modalidad de 'Pago con Tarjeta de Crédito', el cliente autoriza el tratamiento confidencial de la información por el proveedor. Los datos personales, de la tarjeta de crédito y de la compra viajan encriptados en la red, quedando así protegidos.",
            icon: <Shield className="text-gray-600" size={24} />
        },
        {
            title: "Derechos del Usuario",
            content: "El cliente, al registrar sus datos personales en la Plataforma, otorga expresamente su consentimiento a la Empresa para que estos sean utilizados para los fines descritos en la presente política. Esta información puede ser editada en aras de procesar correctamente futuras órdenes de compra. El cliente, si así lo desea, puede dejar de recibir correos electrónicos con contenidos de marketing por parte de la marca. Para ello, deberá dirigirse a incalpacastores@incalpaca.com. Se podrá prescindir de mensajes relativos al uso de la cuenta y/o demás notificaciones administrativas siempre y cuando esta sea eliminada, para la cual el cliente deberá comunicar esta decisión por correo electrónico.",
            icon: <AlertCircle className="text-gray-600" size={24} />
        }
    ];

    return (
        <motion.main
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-white py-12 px-4 relative"
        >
            <BourgeoisPatternBackground />
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
                            Política de Privacidad
                        </h1>
                    </motion.div>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Protección y tratamiento de datos personales
                    </p>
                </motion.div>

                <div className="space-y-6">
                    {privacySections.map((section, index) => (
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
                                <div className="p-8 pt-5 border-t border-gray-200">
                                    <div className="prose prose-lg max-w-none">
                                        <div className="relative">
                                            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-gray-200 to-gray-100 rounded-full"></div>
                                            <div className="pl-6">
                                                <p className="text-gray-700 leading-relaxed text-base font-serif">
                                                    {section.content}
                                                </p>
                                                <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
                                                    <span className="font-mono">λλλλλλ</span>
                                                </div>
                                            </div>
                                        </div>
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
                                Actualización de la Política
                            </h3>
                            <p className="text-gray-700 leading-relaxed">
                                La Empresa se reserva el derecho de modificación sobre la presente Política de Privacidad. No obstante, los cambios se realizarán sobre la base de lo estipulado en la legislación aplicable y velando, ante todo, por la protección de los datos personales y satisfacción del cliente.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.main>
    );
}

export default InfoPoliticaPrivacidad;