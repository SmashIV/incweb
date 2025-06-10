import { motion } from "framer-motion";
import { ScrollText, Scale, BookOpen, FileText, Shield, Clock, AlertCircle, ChevronRight } from "lucide-react";
import { useRef, useEffect, useState } from "react";

function LegalBackground() {
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

    const drawSeal = (x, y, size, time) => {
      ctx.save();
      ctx.translate(x, y);
      
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.lineWidth = 2;
      ctx.stroke();

      const segments = 12;
      for (let i = 0; i < segments; i++) {
        const angle = (i * Math.PI * 2) / segments + time * 0.2;
        const innerSize = size * 0.7;
        
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(
          Math.cos(angle) * innerSize,
          Math.sin(angle) * innerSize
        );
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawPattern = () => {
      const width = canvas.width;
      const height = canvas.height;
      const time = timeRef.current;
      
      ctx.clearRect(0, 0, width, height);

      const sealSize = Math.min(width, height) * 0.1;
      const seals = [
        { x: sealSize, y: sealSize },
        { x: width - sealSize, y: sealSize },
        { x: sealSize, y: height - sealSize },
        { x: width - sealSize, y: height - sealSize }
      ];

      seals.forEach(seal => {
        drawSeal(seal.x, seal.y, sealSize, time);
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

function InfoLegal() {
    const [activeTab, setActiveTab] = useState('promotions');
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

    const legalSections = [
        {
            title: "Términos y Condiciones Generales",
            content: "Al realizar una compra en nuestra tienda, usted acepta los siguientes términos y condiciones. Estos términos se aplican a todas las compras realizadas a través de nuestra tienda online, venta telefónica, WhatsApp y tiendas físicas.",
            icon: <FileText className="text-gray-600" size={24} />
        },
        {
            title: "Política de Privacidad",
            content: "Su privacidad es importante para nosotros. Esta política describe cómo recopilamos, usamos y protegemos su información personal cuando utiliza nuestros servicios.",
            icon: <Shield className="text-gray-600" size={24} />
        },
        {
            title: "Política de Devoluciones",
            content: "Aceptamos devoluciones dentro de los 30 días posteriores a la compra. Los productos deben estar en su estado original, sin usar y con todas las etiquetas intactas.",
            icon: <Scale className="text-gray-600" size={24} />
        },
        {
            title: "Términos de Uso",
            content: "Al acceder y utilizar nuestro sitio web, usted acepta cumplir con estos términos de uso. Nos reservamos el derecho de modificar estos términos en cualquier momento.",
            icon: <BookOpen className="text-gray-600" size={24} />
        }
    ];

    const promotionalSections = [
        {
            title: "Día del Padre",
            date: "02/06/2025 - 15/06/2025",
            content: "Hasta 40% de descuento en prendas seleccionadas del 02/06/2025 al 15/06/2025. Promoción válida en nuestra tienda online www.alpaca111.com, en venta telefónica, en venta por WhatsApp y en tiendas físicas disponibles. El descuento se aplica a precio de etiqueta, no sobre precios especiales o con un descuento previo. Es válido con cualquier medio de pago. No aplica para prendas Luxury. Stock mínimo: 01 unidad por modelo. No es acumulable con otras promociones y/o descuentos. Los descuentos de esta promoción no son aplicables para reembolsos de compras anteriores.",
            icon: <Scale className="text-gray-600" size={24} />
        },
        {
            title: "Feliz Día Mamá",
            date: "01/05/2025 - 11/05/2025",
            content: "40% de descuento en prendas seleccionadas de la categoría punto del 01/05/2025 al 11/05/2025. Promoción válida en nuestra tienda online www.alpaca111.com, en venta telefónica, en venta por WhatsApp y en tiendas físicas disponibles. El descuento se aplica a precio de etiqueta, no sobre precios especiales o con un descuento previo. Es válido con cualquier medio de pago. No aplica para la colección Luxury. Stock mínimo: 01 unidad por modelo. No es acumulable con otras promociones y/o descuentos. Los descuentos de esta promoción no son aplicables para reembolsos de compras anteriores.",
            icon: <Shield className="text-gray-600" size={24} />
        },
        {
            title: "Cyber Alpaca",
            date: "24/03/2025 - 27/03/2025",
            content: "40% dto. en suéteres, cárdigan y ponchos del 24/03/2025 al 27/03/2025. Promoción válida en nuestra tienda online www.alpaca111.com, en venta telefónica, en venta por WhatsApp y en tiendas físicas disponibles. El descuento se aplica a precio de etiqueta, no sobre precios especiales o con un descuento previo. Es válido con cualquier medio de pago. Stock mínimo: 01 unidad por modelo. No es acumulable con otras promociones y/o descuentos. Los descuentos de esta promoción no son aplicables para reembolsos de compras anteriores.",
            icon: <Clock className="text-gray-600" size={24} />
        },
        {
            title: "EXCLUSIVO ONLINE",
            date: "Vigente",
            content: "Promoción válida únicamente para canales digitales: alpaca111.com y Fonoventas. Los precios que presenten el sello de 'Exclusivo Online' no serán los mismos que se encontrarán disponibles en nuestras tiendas físicas.",
            icon: <FileText className="text-gray-600" size={24} />
        },
        {
            title: "HASTA 50% EN PRENDAS SELECCIONADAS",
            date: "23/01/2025 - 02/02/2025",
            content: "Hasta 50% dto. en prendas seleccionadas del 23/01/2025 al 02/02/2025. Promoción válida en nuestra tienda online www.alpaca111.com, en venta telefónica, en venta por WhatsApp y en tiendas físicas disponibles. El descuento se aplica a precio de etiqueta, no sobre precios especiales o con un descuento previo. Es válido con cualquier medio de pago. No aplica para prendas Luxury. Stock mínimo: 01 unidad por modelo. No es acumulable con otras promociones y/o descuentos. Los descuentos de esta promoción no son aplicables para reembolsos de compras anteriores.",
            icon: <Scale className="text-gray-600" size={24} />
        },
        {
            title: "CAMPAÑA 40% - CARDIGAN",
            date: "16/01/2025 - 19/01/2025",
            content: "40% dto. en todo cárdigans del 16/01/2025 al 19/01/2025. Promoción válida en nuestra tienda online, en venta telefónica, en venta por WhatsApp y en tiendas físicas disponibles. El descuento se aplica a precio de etiqueta, no sobre precios especiales o con un descuento previo. Es válido con cualquier medio de pago. No aplica para prendas Luxury. Stock mínimo: 01 unidad por modelo. No es acumulable con otras promociones y/o descuentos. Los descuentos de esta promoción no son aplicables para reembolsos de compras anteriores.",
            icon: <Shield className="text-gray-600" size={24} />
        },
        {
            title: "WISH LIST",
            date: "12/12/2024 - 25/12/2024",
            content: "40% dto. en prendas de punto, 30% dto. en accesorios, 20% en confecciones del 12/12/2024 al 25/12/2024. Promoción válida en nuestra tienda online www.alpaca111.com, en venta telefónica, en venta por WhatsApp y en tiendas físicas disponibles. El descuento se aplica a precio de etiqueta, no sobre precios especiales o con un descuento previo. Es válido con cualquier medio de pago. Stock mínimo: 01 unidad por modelo. No es acumulable con otras promociones y/o descuentos. Los descuentos de esta promoción no son aplicables para reembolsos de compras anteriores.",
            icon: <BookOpen className="text-gray-600" size={24} />
        },
        {
            title: "A111- BLACK WEEKEND",
            date: "29/11/2024 - 02/12/2024",
            content: "Hasta 60% dto. en prendas seleccionadas del 29/11/2024 al 02/12/2024. Promoción válida en nuestra tienda online, en venta telefónica, en venta por WhatsApp y en tiendas físicas disponibles. El descuento se aplica a precio de etiqueta, no sobre precios especiales o con un descuento previo. Es válido con cualquier medio de pago. Stock mínimo: 01 unidad por modelo. No es acumulable con otras promociones y/o descuentos. Los descuentos de esta promoción no son aplicables para reembolsos de compras anteriores.",
            icon: <Clock className="text-gray-600" size={24} />
        },
        {
            title: "PRE BLACK FRIDAY",
            date: "27/11/2024 - 28/11/2024",
            content: "Adicional en tu compra. Válido del 27/11/2024 a partir de las 19:00h al 28/11/2024 a las 23:59h. Promoción válida en toda nuestra tienda online www.alpaca111.com utilizando el código PreBlackFriday. Es acumulable con otros descuentos establecidos por Black Friday. El descuento se aplica sobre el precio total de la compra. Los descuentos de esta promoción no son aplicables para reembolsos de compras anteriores.",
            icon: <FileText className="text-gray-600" size={24} />
        },
        {
            title: "PROMOCIÓN NOVIEMBRE",
            date: "04/11/2024 - 07/11/2024",
            content: "Hasta 40% dto. del 04/11/2024 al 07/11/2024. Promoción válida en nuestra tienda online www.alpaca111.com, en venta telefónica, en venta por WhatsApp y en tiendas físicas disponibles. El descuento se aplica a precio de etiqueta, no sobre precios especiales o con un descuento previo. Es válido con cualquier medio de pago. Stock mínimo: 01 unidad por modelo. No es acumulable con otras promociones y/o descuentos. Los descuentos de esta promoción no son aplicables para reembolsos de compras anteriores.",
            icon: <Scale className="text-gray-600" size={24} />
        },
        {
            title: "VENTA NOCTURNA",
            date: "20/10/2024",
            content: "30% de descuento en toda la web el 20/10/2024 desde las 17:00 hrs. a las 24:00 hrs. Promoción válida en nuestra tienda online www.alpaca111.com. El descuento se aplica a precio de etiqueta, no sobre precios especiales o con un descuento previo. Stock mínimo: 01 unidad por modelo. No es acumulable con otras promociones y/o descuentos. Los descuentos de esta promoción no son aplicables para reembolsos de compras anteriores.",
            icon: <Clock className="text-gray-600" size={24} />
        },
        {
            title: "DÍA DEL SHOPPING",
            date: "27/09/2024 - 29/09/2024",
            content: "Hasta 60% dto. del 27/09/2024 al 29/09/2024. Promoción válida en nuestra tienda online www.alpaca111.com, en venta telefónica, en venta por WhatsApp y en tiendas físicas disponibles. El descuento se aplica a precio de etiqueta, no sobre precios especiales o con un descuento previo. Es válido con cualquier medio de pago. No aplica para prendas Luxury. Stock mínimo: 01 unidad por modelo. No es acumulable con otras promociones y/o descuentos. Los descuentos de esta promoción no son aplicables para reembolsos de compras anteriores.",
            icon: <Shield className="text-gray-600" size={24} />
        },
        {
            title: "PRE CYBER",
            date: "14/07/2024",
            content: "20% dto. en la nueva colección solo el 14/07/2024. Promoción válida en nuestra tienda online www.alpaca111.com. El descuento se aplica a precio de etiqueta, no sobre precios especiales o con un descuento previo. Es válido con cualquier medio de pago. Stock mínimo: 01 unidad por modelo. No es acumulable con otras promociones y/o descuentos. Los descuentos de esta promoción no son aplicables para reembolsos de compras anteriores.",
            icon: <FileText className="text-gray-600" size={24} />
        },
        {
            title: "Black Weekend",
            date: "24/11/23 - 27/11/23",
            content: "Hasta 70% de descuento del 24/11/23 al 27/11/23. Promoción válida en nuestra tienda online www.incalpacastores.com, en venta telefónica, en venta por WhatsApp y en tiendas físicas disponibles. El descuento se aplica a precio de etiqueta, no sobre precios especiales o con un descuento previo. Es válido con cualquier medio de pago. No aplica para la colección Luxury. Stock mínimo: 01 unidad por modelo. No es acumulable con otras promociones y/o descuentos. Los descuentos de esta promoción no son aplicables para reembolsos de compras anteriores.",
            icon: <Clock className="text-gray-600" size={24} />
        },
        {
            title: "Fin de temporada",
            date: "01/09/23 - 30/09/23",
            content: "Hasta 60% dto. del 01/09/23 al 30/09/23. Promoción válida en nuestra tienda online, en venta telefónica, en venta por WhatsApp y en tiendas físicas disponibles. El descuento se aplica a precio de etiqueta, no sobre precios especiales o con un descuento previo. Es válido con cualquier medio de pago. No aplica para la colección Luxury. Stock mínimo: 01 unidad por modelo. No es acumulable con otras promociones y/o descuentos. Los descuentos de esta promoción no son aplicables para reembolsos de compras anteriores.",
            icon: <Scale className="text-gray-600" size={24} />
        }
    ];

    return (
        <motion.main
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="min-h-screen bg-white py-12 px-4 relative"
        >
            <LegalBackground />
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
                            Información Legal
                        </h1>
                    </motion.div>
                    <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                        Documento oficial de términos legales y promociones vigentes
                    </p>
                </motion.div>

                {/* Legal Information Section */}
                <motion.div variants={itemVariants} className="mb-16">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-gray-200"></div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 whitespace-nowrap">
                            Información Legal
                        </h2>
                        <div className="h-px flex-1 bg-gray-200"></div>
                    </div>

                    <div className="space-y-6">
                        {legalSections.map((section, index) => (
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
                                        <h3 className="text-xl font-serif font-bold text-gray-900">
                                            {section.title}
                                        </h3>
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
                </motion.div>

                {/* Promotional Information Section */}
                <motion.div variants={itemVariants}>
                    <div className="flex items-center gap-4 mb-8">
                        <div className="h-px flex-1 bg-gray-200"></div>
                        <h2 className="text-2xl font-serif font-bold text-gray-900 whitespace-nowrap">
                            Promociones Vigentes
                        </h2>
                        <div className="h-px flex-1 bg-gray-200"></div>
                    </div>

                    <div className="space-y-6">
                        {promotionalSections.map((section, index) => (
                            <motion.div
                                key={index}
                                variants={itemVariants}
                                className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                            >
                                <button
                                    onClick={() => setExpandedSection(expandedSection === index + legalSections.length ? null : index + legalSections.length)}
                                    className="w-full p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        {section.icon}
                                        <div className="text-left">
                                            <h3 className="text-xl font-serif font-bold text-gray-900">
                                                {section.title}
                                            </h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                {section.date}
                                            </p>
                                        </div>
                                    </div>
                                    <ChevronRight 
                                        className={`transform transition-transform ${
                                            expandedSection === index + legalSections.length ? 'rotate-90' : ''
                                        }`}
                                    />
                                </button>
                                
                                <motion.div
                                    initial={false}
                                    animate={{
                                        height: expandedSection === index + legalSections.length ? 'auto' : 0,
                                        opacity: expandedSection === index + legalSections.length ? 1 : 0
                                    }}
                                    transition={{ duration: 0.3 }}
                                    className="overflow-hidden"
                                >
                                    <div className="p-8 pt-12 border-t border-gray-200">
                                        <div className="prose prose-lg max-w-none">
                                            <div className="mb-6">
                                                <h4 className="text-sm font-semibold text-gray-500 mb-2">Detalles de la Promoción</h4>
                                                <p className="text-gray-700 leading-relaxed text-base">
                                                    {section.content}
                                                </p>
                                            </div>
                                            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                                <div className="flex items-start gap-3">
                                                    <AlertCircle className="text-gray-500 mt-0.5" size={18} />
                                                    <div>
                                                        <h4 className="text-sm font-semibold text-gray-700 mb-1">Términos y Condiciones</h4>
                                                        <p className="text-sm text-gray-600">
                                                            No acumulable con otras promociones y/o descuentos. Los descuentos de esta promoción no son aplicables para reembolsos de compras anteriores.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </motion.main>
    );
}

export default InfoLegal;