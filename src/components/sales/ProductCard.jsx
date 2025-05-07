import { clothesData } from "../../constants/testClothes";
import ProductItem from "./ProductItem";
import { useState } from "react";
import ProductFilters from "./ProductFilters";

function ProductCard() {
    const [filteredProducts, setFilteredProducts] = useState(clothesData);

    function handleFilterChange(filters) {
        let filtered = [...clothesData];
        if (filters.categories.length > 0) {
            filtered = filtered.filter(item => filters.categories.includes(item.category));
        }
        filtered = filtered.filter(item => item.price >= filters.price[0] && item.price <= filters.price[1]);
        setFilteredProducts(filtered);
    }

    return (
        <div className="bg-white relative z-0 min-h-screen flex items-start">
            <aside className="flex-shrink-0 flex items-start justify-center w-[400px] z-10 mt-20">
                <ProductFilters products={clothesData} onChange={handleFilterChange} />
            </aside>
            <main className="flex-1 flex flex-col items-center justify-start py-16 px-4 sm:px-8">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8 text-center w-full">Productos</h2>
                <div className="w-full max-w-full mx-auto grid grid-cols-1 gap-y-16 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    { filteredProducts.map((item) => (
                        <ProductItem key={item.title} item={item} />
                    ))}
                </div>
            </main>
        </div>
     );
}

export default ProductCard;