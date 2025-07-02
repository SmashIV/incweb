import ProductItem from "./ProductItem";
import { useEffect, useState } from "react";
import ProductFilters from "./ProductFilters";
import axios from "axios";

function ProductCard({ genero }) {
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [colorPromos, setColorPromos] = useState({}); // { color: { descuento_porcentaje, ... } }

    useEffect(() => {
        axios.get("http://localhost:3000/productos")
            .then(async res => {
                let prods = res.data;
                if (genero) {
                    prods = prods.filter(p => {
                        const generoProducto = p.genero?.toLowerCase().trim();
                        const generoBuscado = genero.toLowerCase().trim();
                        
                        if (generoProducto === "unisex") {
                            return generoBuscado === "hombre" || generoBuscado === "mujer";
                        }
                        
                        return generoProducto === generoBuscado;
                    });
                }
                setProducts(prods);
                setFilteredProducts(prods);
                setLoading(false);

                const coloresUnicos = Array.from(new Set(prods.map(p => p.color).filter(Boolean)));
                console.log('Colores únicos detectados:', coloresUnicos);
                const promosObj = {};
                await Promise.all(coloresUnicos.map(async (color) => {
                    try {
                        const token = localStorage.getItem('token');
                        const resPromo = await axios.get(`http://localhost:3000/promociones/por-color?tcolor=${encodeURIComponent(color)}`, {
                            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
                        });
                        console.log(`Respuesta promo para color ${color}:`, resPromo.data);
                        if (resPromo.data && resPromo.data.hasPromo && resPromo.data.color_objetivo === color) {
                            promosObj[color] = resPromo.data;
                        }
                    } catch (e) {
                        console.error(`Error consultando promo para color ${color}:`, e);
                    }
                }));
                console.log('Objeto colorPromos final:', promosObj);
                setColorPromos(promosObj);
            })
            .catch((error) => {
                console.error("Error al cargar productos:", error);
                setLoading(false);
            });
    }, [genero]);

    function handleFilterChange(filters) {
        let filtered = [...products];
        if (filters.categories.length > 0) {
            filtered = filtered.filter(item => filters.categories.includes(item.categoria?.nombre));
        }
        filtered = filtered.filter(item => item.precio_unitario >= filters.price[0] && item.precio_unitario <= filters.price[1]);
        setFilteredProducts(filtered);
    }

    if (loading) {
        return <div className="text-center py-20">Cargando productos...</div>;
    }
    
    return (
        <div className="bg-gray-50 relative z-0 min-h-screen flex items-start">
            <aside className="flex-shrink-0 flex items-start justify-center w-[400px] z-10 mt-20">
                <ProductFilters products={products} onChange={handleFilterChange} />
            </aside>
            <main className="flex-1 flex flex-col items-center justify-start py-16 px-4 sm:px-8">
                <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 mb-8 text-center w-full">Productos</h2>
                <div className="w-full max-w-full mx-auto grid grid-cols-1 gap-y-16 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    { filteredProducts.map((item) => {
                        const promo = item.color && colorPromos[item.color];
                        let precioConDescuento = null;
                        let tituloPromo = promo && promo.titulo ? promo.titulo : null;
                        if (promo && promo.descuento_porcentaje) {
                            precioConDescuento = Math.round(item.precio_unitario * (1 - promo.descuento_porcentaje / 100) * 100) / 100;
                        }
                        // Log de depuración por producto
                        console.log('Producto:', item.nombre, '| Color:', item.color, '| Promo:', promo, '| Título promo:', tituloPromo);
                        return (
                            <div key={item.id} className="relative">
                                {/* Badge discreto */}
                                {promo && (
                                    <span className="absolute top-2 right-2 bg-yellow-100 text-yellow-700 rounded px-2 py-0.5 text-xs font-semibold shadow-sm z-10">
                                        -{promo.descuento_porcentaje}% color promo{tituloPromo ? `: ${tituloPromo}` : ''}
                                    </span>
                                )}
                                <div className="h-full">
                                    <ProductItem 
                                        item={item}
                                        tienePromoColor={!!promo}
                                        descuentoColor={promo ? promo.descuento_porcentaje : null}
                                    >
                                        {/* Render precio con descuento de forma discreta */}
                                        {promo && precioConDescuento !== null && precioConDescuento < item.precio_unitario ? (
                                            <div className="flex flex-col items-start mt-2">
                                                <span className="text-xs text-gray-400 line-through">S/. {item.precio_unitario}</span>
                                                <span className="text-green-600 font-semibold text-base">S/. {precioConDescuento.toFixed(2)}</span>
                                            </div>
                                        ) : (
                                            <span className="font-semibold text-gray-600 text-base">S/. {item.precio_unitario}</span>
                                        )}
                                    </ProductItem>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </main>
        </div>
     );
}

export default ProductCard;