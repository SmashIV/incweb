import logo from '../assets/INCALPACA.webp';
import { ShoppingBasket, CircleUser, LocateFixed, Search, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import CartSidebar from './sales/CartSideBar';
import { useCart } from './context/CartContext';
import { useAuth } from './context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import SearchBar from './SearchBar';

function Header() {
    const [cartOpen, setCartOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const [searchOpen, setSearchOpen] = useState(false);
    const { totalItems } = useCart();
    const { user, logout } = useAuth();

    const handleLogout = async () => {
        try {
            await logout();
            setUserMenuOpen(false);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    };

    return (
        <div className="flex items-center justify-between text-black bg-white p-4 py-4 shadow-sm relative">
            <SearchBar open={searchOpen} onClose={() => setSearchOpen(false)} />
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
            <div className='flex space-x-4 items-center'>
                <div className='cursor-pointer hover:text-gray-500' onClick={() => setSearchOpen(true)}>
                    <Search/>
                </div>
                <div className='cursor-pointer hover:text-gray-500'>
                    <LocateFixed/>
                </div>
                <div className="relative">
                    {user ? (
                        <div className="relative">
                            <button 
                                onClick={() => setUserMenuOpen(!userMenuOpen)}
                                className="flex items-center space-x-2 cursor-pointer hover:text-gray-500"
                            >
                                <CircleUser className="w-6 h-6" />
                                <span className="text-sm font-medium hidden md:block">
                                    {user.email.split('@')[0]}
                                </span>
                            </button>
                            <AnimatePresence>
                                {userMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50"
                                    >
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Cerrar sesión</span>
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ) : (
                        <Link to="/login" className="cursor-pointer hover:text-gray-500">
                            <CircleUser className="w-6 h-6" />
                        </Link>
                    )}
                </div>
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
    );
}

export default Header;