import React, { useState } from 'react';
import { href, Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Tag,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import logo from '../../assets/INCALPACA.webp';
import { icon } from 'leaflet';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const location = useLocation();

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      exact: true
    },
    {
      name: 'Productos',
      href: '/admin/products',
      icon: Package,
      exact: false
    },
    {
      name: 'Pedidos',
      href: '/admin/orders',
      icon: ShoppingCart,
      exact: false
    },
    {
      name: 'Usuarios',
      href: '/admin/users',
      icon: Users,
      exact: false
    },
    {
      name: 'Cupones',
      href: '/admin/coupons',
      icon: Tag,
      exact: false
    },
    {
      name: 'Quejas',
      href: '/admin/complaints',
      icon: MessageSquare,
      exact: false
    },
    ,
  ];

  const isActive = (path, exact = false) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white lg:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-gray-200 w-[280px] transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          <div className="h-16 flex items-center justify-center px-6 border-b border-gray-200">
            <Link to="/" className="flex items-center justify-center">
              <img src={logo} alt="Incalpaca" className="h-8 w-auto" />
            </Link>
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 p-2 rounded-lg hover:bg-gray-100 lg:hidden"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive(item.href, item.exact)
                    ? 'bg-gray-900 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <item.icon size={20} />
                <span className="flex-1">{item.name}</span>
                {isActive(item.href, item.exact) && (
                  <div className="w-1 h-6 bg-white rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <button
              onClick={() => {
              }}
              className="flex items-center gap-3 w-full px-3 py-2 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <LogOut size={20} />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </aside>

      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
        />
      )}
    </>
  );
};

export default AdminSidebar; 