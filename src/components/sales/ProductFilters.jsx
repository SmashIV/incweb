import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as Slider from '@radix-ui/react-slider';

const SIZES = ['XS', 'S', 'M', 'L', 'XL'];

export default function ProductFilters({ products, onChange }) {

  const categories = Array.from(new Set(products.map(p => p.categoria?.nombre)));
  const prices = products.map(p => Number(p.precio_unitario));
  const minPrice = prices.length > 0 ? Math.floor(Math.min(...prices)) : 0;
  const maxPrice = prices.length > 0 ? Math.ceil(Math.max(...prices)) : 0;

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [priceRange, setPriceRange] = useState([minPrice, maxPrice]);

  useEffect(() => {
    onChange({
      categories: selectedCategories,
      sizes: selectedSizes,
      price: priceRange,
    });

  }, [selectedCategories, selectedSizes, priceRange]);

  const filterAnim = {
    hidden: { x: -40, opacity: 0 },
    show: { x: 0, opacity: 1, transition: { type: 'spring', bounce: 0.2, duration: 0.7 } }
  };

  return (
    <motion.aside
      className="bg-white rounded-2xl p-10 flex flex-col gap-10 w-full max-w-[380px] min-h-[600px]"
      initial="hidden"
      animate="show"
      variants={filterAnim}
    >
      <div>
        <h3 className="text-xl font-bold mb-4 text-black">Categorías</h3>
        <div className="flex flex-col gap-3">
          {categories.map(cat => (
            <label key={cat || 'sin-categoria'} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={e => {
                  setSelectedCategories(val =>
                    e.target.checked ? [...val, cat] : val.filter(c => c !== cat)
                  );
                }}
                className="accent-black w-5 h-5 rounded border border-black"
              />
              <span className="text-black text-lg">{cat || 'Sin categoría'}</span>
            </label>
          ))}
        </div>
      </div>
      <hr className="border-t border-gray-300 my-2" />
      <div>
        <h3 className="text-xl font-bold mb-4 text-black">Tallas</h3>
        <div className="flex flex-wrap gap-3">
          {SIZES.map(size => (
            <label key={size} className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedSizes.includes(size)}
                onChange={e => {
                  setSelectedSizes(val =>
                    e.target.checked ? [...val, size] : val.filter(s => s !== size)
                  );
                }}
                className="accent-black w-5 h-5 rounded border border-black"
              />
              <span className="text-black text-lg">{size}</span>
            </label>
          ))}
        </div>
      </div>
      <hr className="border-t border-gray-300 my-2" />
      <div>
        <h3 className="text-xl font-bold mb-4 text-black">Precio</h3>
        <div className="flex flex-col gap-4">
          <div className="flex justify-between text-base text-black text-bold mb-2 font-bold">
            <span>S/.{priceRange[0]}</span>
            <span>S/.{priceRange[1]}</span>
          </div>
          <Slider.Root
            className="relative flex items-center select-none touch-none w-full h-10"
            min={minPrice}
            max={maxPrice}
            step={1}
            value={priceRange}
            onValueChange={setPriceRange}
            minStepsBetweenThumbs={1}
          >
            <Slider.Track className="bg-gray-200 relative grow rounded-full h-3">
              <Slider.Range className="absolute bg-black rounded-full h-3" />
            </Slider.Track>
            <Slider.Thumb className="block w-7 h-7 bg-black rounded-full shadow-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-black transition-all" />
            <Slider.Thumb className="block w-7 h-7 bg-black rounded-full shadow-lg border-2 border-white focus:outline-none focus:ring-2 focus:ring-black transition-all" />
          </Slider.Root>
        </div>
      </div>
    </motion.aside>
  );
}
