import logo from '../assets/INCALPACA.webp';
import { ShoppingBasket, CircleUser, LocateFixed, Search} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import CartSidebar from './sales/CartSideBar';
import { useCart } from './context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

function Header() {
    const [cartOpen, setCartOpen] = useState(false);
    const { totalItems } = useCart();

    return (
        <div className="flex items-center justify-between text-black bg-white p-4 py-4 shadow-sm relative">
            <Link to='/'>
                <img src={logo} alt="Incalpaca Logo" className='h-12'/>
            </Link>
            <ul className='flex space-x-6'>
                <li>
                    <Link to='/hombre-sales' className='px-4 py-2 font-medium hover:bg-gray-100 rounded'>
                        Hombre
                    </Link>
                </li>
                <li>
                    <Link to='/mujer-sales' className='px-4 py-2 font-medium hover:bg-gray-100 rounded'>
                        Mujer
                    </Link>
                </li>
                <li>
                    <Link to='/accesorios-sales' className='px-4 py-2 font-medium hover:bg-gray-100 rounded'>
                        Accesorios
                    </Link>
                </li>
                <li>
                    <Link to='/hogar-sales' className='px-4 py-2 font-medium hover:bg-gray-100 rounded'>
                        Hogar
                    </Link>
                </li>   
                <li>
                    <Link to='info-incalpaca' className='px-4 py-2 font- hover:bg-gray-100 rounded'>
                        Incalpaca
                    </Link>
                </li>
            </ul>
            <div className='flex space-x-4'>
                <div className='cursor-pointer hover:text-gray-500'>
                    <Search/>
                </div>
                <div className='cursor-pointer hover:text-gray-500'>
                    <LocateFixed/>
                </div>
                <Link to="Login" className="cursor-pointer hover:text-gray-500"> 
                    <CircleUser/> 
                </Link>
                <div className='cursor-pointer hover:text-gray-500 relative' onClick={() => setCartOpen(true)}>
                    <ShoppingBasket/>
                    <AnimatePresence>
                        {totalItems > 0 && (
                            <motion.div
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="absolute -top-2 -right-2 bg-black text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                                key="cart-count"
                            >
                                <motion.span
                                    key={totalItems}
                                    initial={{ scale: 0.5, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.5, opacity: 0 }}
                                    className="flex items-center justify-center w-full h-full"
                                >
                                    {totalItems}
                                </motion.span>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
            <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
    )
}

export default Header;