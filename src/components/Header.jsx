import logo from '../assets/INCALPACA.webp';
import { ShoppingBasket, CircleUser, LocateFixed, Search} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import CartSidebar from './sales/CartSideBar';

function Header() {
    const [cartOpen, setCartOpen] = useState(false);
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
                <div className='cursor-pointer hover:text-gray-500' onClick={() => setCartOpen(true)}>
                    <ShoppingBasket/>
                </div>
            </div>
            <CartSidebar open={cartOpen} onClose={() => setCartOpen(false)} />
        </div>
    )
}

export default Header;