import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/INCALPACA.webp';

function SearchBar({ open, onClose }) {
  const containerRef = useRef(null);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  // Handler para backdrop
  const handleBackdropClick = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      onClose();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim() !== '') {
      navigate(`/search?q=${encodeURIComponent(search.trim())}`);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop translúcido y desenfocado */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-opacity-90 z-40"
            onClick={handleBackdropClick}
          />
          {/* Contenedor de búsqueda */}
          <motion.div
            initial={{ y: '-100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '-100%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-0 left-0 w-full z-50 shadow-sm"
            style={{ minHeight: '120px' }}
          >
            <div
              ref={containerRef}
              className="relative"
            >
              <div className="search-container py-4 md:py-8 bg-gray-100 relative min-h-full md:min-h-0 transition-transform">
                <div className="container-fluid m-search-wrapper px-4 md:px-16">
                  <div className="flex justify-between items-center md:hidden mb-2">
                    <h3 className="text-base font-medium">Busca en nuestra tienda</h3>
                    <button onClick={onClose} className="text-black p-2">
                      <svg className="w-[20px] h-[20px]" fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                        <path d="M193.94 256L296.5 153.44l21.15-21.15c3.12-3.12 3.12-8.19 0-11.31l-22.63-22.63c-3.12-3.12-8.19-3.12-11.31 0L160 222.06 36.29 98.34c-3.12-3.12-8.19-3.12-11.31 0L2.34 120.97c-3.12 3.12-3.12 8.19 0 11.31L126.06 256 2.34 379.71c-3.12 3.12-3.12 8.19 0 11.31l22.63 22.63c3.12 3.12 8.19 3.12 11.31 0L160 289.94 262.56 392.5l21.15 21.15c3.12 3.12 8.19 3.12 11.31 0l22.63-22.63c3.12-3.12 3.12-8.19 0-11.31L193.94 256z"></path>
                      </svg>
                    </button>
                  </div>
                  <div className="flex">
                    <div className="sf-logo px-4 w-1/6 justify-center has-logo-img hidden md:flex">
                      <a href="/" className="block py-2.5 logo-img relative" title="Incalpaca">
                        <div className="sf-image sf-logo-default">
                          <img src={logo} alt="Incalpaca Logo" width="120" height="40" className="inline-block" />
                        </div>
                      </a>
                    </div>
                    <div className="w-full md:w-2/3 flex justify-center items-center">
                      <form onSubmit={handleSubmit} className="m-search-form relative w-full md:mx-28 flex rounded-md bg-white">
                        <input
                          type="search"
                          name="q"
                          required
                          autoComplete="off"
                          placeholder="Buscar productos"
                          aria-label="Buscar productos"
                          className="w-full h-11 px-4 focus:outline-none bg-white rounded-md"
                          style={{ border: 'none' }}
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                        />
                        <button type="submit" className="absolute top-px right-0 py-3 px-3.5">
                          <svg className="w-[18px] h-[18px]" fill="currentColor" stroke="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                            <path d="M508.5 468.9L387.1 347.5c-2.3-2.3-5.3-3.5-8.5-3.5h-13.2c31.5-36.5 50.6-84 50.6-136C416 93.1 322.9 0 208 0S0 93.1 0 208s93.1 208 208 208c52 0 99.5-19.1 136-50.6v13.2c0 3.2 1.3 6.2 3.5 8.5l121.4 121.4c4.7 4.7 12.3 4.7 17 0l22.6-22.6c4.7-4.7 4.7-12.3 0-17zM208 368c-88.4 0-160-71.6-160-160S119.6 48 208 48s160 71.6 160 160-71.6 160-160 160z"></path>
                          </svg>
                        </button>
                      </form>
                    </div>
                    <div className="w-1/6 hidden md:flex justify-end items-center"></div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default SearchBar; 