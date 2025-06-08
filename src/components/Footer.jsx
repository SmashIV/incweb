import {useState, useEffect} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useModal } from './context/ModalContext';

function Footer() {
    const { modalOpen } = useModal();
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        if (modalOpen) return; // No expand/collapse when modal is open
        const handleScroll = () => {
            requestAnimationFrame(() => {
                const scrollPosition = Math.ceil(window.scrollY + window.innerHeight);
                const totalHeight = Math.ceil(document.documentElement.scrollHeight);
                const threshold = Math.max(100, window.innerHeight * 0.1);
                const isAtBottom = scrollPosition >= totalHeight - threshold;
                if (isAtBottom !== isExpanded) {
                    setIsExpanded(isAtBottom);
                }
            });
        };
        const opts = {passive: true};
        window.addEventListener('scroll', handleScroll, opts);
        window.addEventListener('resize', handleScroll, opts); 
        return () => {
            window.removeEventListener('scroll', handleScroll, opts);
            window.removeEventListener('resize', handleScroll, opts);
        }
    }, [isExpanded, modalOpen]);

    //handle the position in a better way, but can be improved
    const [positionStyle, setPositionStyle] = useState('sticky');
    useEffect(() => {
        const checkPosition = () => {
            const hasScroll = document.documentElement.scrollHeight > window.innerHeight;
            const newPosition = hasScroll ? 'sticky' : 'fixed';
            if (newPosition !== positionStyle) {
                setPositionStyle(newPosition);
            }
        };
        const resizeObserver = new ResizeObserver(checkPosition);
        resizeObserver.observe(document.documentElement);
        return () => resizeObserver.disconnect();
    }, [positionStyle]);

    const footerVariants = {
        collapsed: {
            height: "60px",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        },
        expanded: {
            height: typeof window !== 'undefined' && window.innerWidth >= 768 ? "300px" : "200px",
            transition: {
                duration: 0.3,
                ease: "easeInOut"
            }
        }
    };

    const contentVariants = {
        hidden: {
            opacity: 0,
            y: 20
        },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return ( 
        <motion.footer 
            className={`sticky bottom-0 left-0 z-20 w-full p-4 border-t border-gray-200 shadow-sm transition-colors duration-300 ${modalOpen ? 'bg-black/80 pointer-events-none' : 'bg-white'}`}
            variants={footerVariants}
            animate={modalOpen ? "collapsed" : (isExpanded ? "expanded" : "collapsed")}
            initial="collapsed"
            style={{
                willChange: 'height',
                transform: 'translateZ(0)',
            }}
        >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">© 2025 <a href="/" className="hover:underline">Grupo Inca™</a>. Todos los derechos reservados.
                </span>
                <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
                    <li>
                        <a href="/info-incalpaca" className="hover:underline me-4 md:me-6">Nosotros</a>
                    </li>
                    <li>
                        <a href="/PoliticaPrivacidad" className="hover:underline me-4 md:me-6">Politica de Privacidad</a>
                    </li>
                    <li>
                        <a href="/TerminoCondiciones" className="hover:underline me-4 md:me-6">Terminos y condiciones</a>
                    </li>
                    <li>
                        <a href="tel:(51-54) 60 3000" className="hover:underline">Contacto</a>
                    </li>
                </ul>
            </div>
            <AnimatePresence>
                {!modalOpen && isExpanded && (
                    <motion.div 
                        className="text-gray-500 dark:text-gray-400"
                        variants={contentVariants}
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                    >
                        <hr />
                        <div className='mx-auto w-full max-w-screen-xl'>
                            <div className='grid grid-cols-2 gap-8 px-4 py-6 lg:py-8 md:grid-cols-4'>
                                <div>
                                    <h2 className='mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-black'>Compania</h2>
                                    <ul className='text-gray-500 dark:text-gray-400 font-medium'>
                                        <li className="mb-4">
                                            <a href="#" className='hover:underline'>Acerca</a>
                                        </li>
                                        <li className="mb-4">
                                            <a href="./info-incalpaca" className='hover:underline'>Nosotros</a>
                                        </li>
                                        <li className="mb-4">
                                            <a href="#" className='hover:underline'>Locales</a>
                                        </li>
                                        <li className="mb-4">
                                            <a href="#" className='hover:underline'>Noticias</a>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h2 className='mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-black'>Centro de Ayuda</h2>
                                    <ul className='text-gray-500 dark:text-gray-400 font-medium'>
                                        <li className="mb-4">
                                            <a href="mailto:sales@incalpaca.com" className='hover:underline'>Email</a>
                                        </li>
                                        <li className="mb-4">
                                            <a href="https://www.facebook.com/incalpacaofficial" target="_blank" rel="noopener noreferrer" className='hover:underline'>Facebook</a>
                                        </li>
                                        <li className="mb-4">
                                            <a href="https://www.instagram.com/incalpacaofficial/" target="_blank" rel="noopener noreferrer"  className='hover:underline'>Instagram</a>
                                        </li>
                                        <li className="mb-4">
                                            <a href="tel:(51-54) 60 3000" className='hover:underline'>Mas contacto</a>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h2 className='mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-black'>Legal</h2>
                                    <ul className='text-gray-500 dark:text-gray-400 font-medium'>
                                        <li className="mb-4">
                                            <a href="/PoliticaPrivacidad" className='hover:underline'>Politica de Privacidad</a>
                                        </li>
                                        <li className="mb-4">
                                            <a href="#" className='hover:underline'>Licencia</a>
                                        </li>
                                        <li className="mb-4">
                                            <a href="/TerminoCondiciones" className='hover:underline'>Terminos y condiciones</a>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h2 className='mb-6 text-sm font-semibold text-gray-900 uppercase dark:text-black'>Servicio al cliente</h2>
                                    <ul className='text-gray-500 dark:text-gray-400 font-medium'>
                                        <li className="mb-4">
                                            <a href="/Legal" className='hover:underline'>Legales</a>
                                        </li>
                                        <li className="mb-4">
                                            <a href="/PoliticaEnvio" className='hover:underline'>Politica de envio</a>
                                        </li>
                                        <li className="mb-4">
                                            <a href="/Reclamaciones" className='hover:underline'>Libro de reclamaciones</a>
                                        </li>
                                        <li className="mb-4">
                                            <a href="/PoliticaSeguridad" className='hover:underline'>Politica de seguridad</a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.footer>
     );
}

export default Footer;