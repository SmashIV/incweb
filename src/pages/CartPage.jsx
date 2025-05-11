import React, {useState, useEffect} from "react"
import { useCart } from "../components/context/CartContext";
import {Link, useNavigate} from "react-router-dom"

function CartPage() {
    const { items, totalAmount, updateQuantity, removeFromCart} = useCart();
    const navigate = useNavigate();

    const [promotionCode, setPromotionCode] = useState("");
    const [promotionMessage, setPromotionMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [discount, setDiscount] = useState({});

    const handleApplyPromotion = () => {
        if (promotionCode.trim() === "Prueba") {
            setPromotionMessage("Codigo aplicado! 10% de desc");
            const newDiscount = {};
            items.forEach(item => {
                newDiscount[item.id] = Math.round(item.price * 0.9);
            });
            setDiscount(newDiscount);
        } else {
            setPromotionMessage("");
            setErrorMessage("Codigo invalido");
            setTimeout(() => setErrorMessage(""), 2000);
            setDiscount({});
        }
    };

    useEffect(() => {
        if (promotionMessage && promotionCode.trim() === "Prueba") {
            const newDiscount = {};
            items.forEach(item => {
                newDiscount[item.id] = Math.round(item.price * 0.9);
            });
            setDiscount(newDiscount);
        }
    }, [items, promotionMessage, promotionCode]);

    const subtotal = items.reduce((sum, item) => {
        const price = discount[item.id] || item.price;
        return sum + price * item.quantity; 
    }, 0);
    const shipping = subtotal === 0 ? 0 : 2;
    const total = subtotal + shipping;

    const handleCheckout = () => {
        if (items.length === 0) {
            setErrorMessage("El carrito esta vacio");
            return;
        }
        navigate("/checkout");
    }


    return (  
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row items-center justify-center py-8 px-2 gap-8">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-6 mb-8 md:mb-0">
                <div className="flex flex-col">
                    <div className="grid grid-cols-7 gap-2 font-semibold text-gray-700 text-sm pb-2 border-b border-gray-200">
                        <p className="col-span-1">Imagen</p>
                        <p className="col-span-2">Producto</p>
                        <p className="col-span-1 text-center">Precio</p>
                        <p className="col-span-1 text-center">Cantidad</p>
                        <p className="col-span-1 text-center">Total</p>
                        <p className="col-span-1 text-center">Eliminar</p>
                    </div>
                    {items.length === 0 ? (
                        <div className="text-center text-gray-400 py-12 col-span6">Tu carrito esta vacio</div>
                    ) : (
                        items.map((item) => {
                            const originalPrice = item.price;
                            const priceWithDiscount = discount[item.id] || originalPrice;

                            return (
                                <div key={item.id + item.size} className="grid grid-cols-7 gap-2 items-center py-4 border-b border-gray-100 text-sm">
                                    <img src={item.image} alt={item.title} className="w-14 h-14 rounded-xl object-cover border mx-auto" />
                                    <div className="col-span-2 truncate">
                                        <div className="font-medium text-gray-900">{item.title}</div>
                                        <div className="text-xs text-gray-400">Talla: {item.size}</div>
                                    </div>
                                    <div className="text-center">
                                        {discount[item.id] ? (
                                            <>
                                                <span className="line-through text-gray-400 text-sx mr-1">
                                                    S/{originalPrice}
                                                </span>
                                                <span className="text-green-600 font-semibold">S/{priceWithDiscount}</span>
                                            </>
                                        ) : (
                                            <span>S/ {originalPrice}</span>
                                    )}
                                    </div>
                                    <div className="flex items-center justify-center gap-2">
                                        <button
                                            className="w-7 h-7 rounded-full bg-gray-100 text-lg font-bold text-gray-600 hover:bg-gray-200"
                                            onClick={() => updateQuantity(item.id, item.size, Math.max(1, item.quantity - 1))}
                                            aria-label="Disminuir Cantidad"
                                        >
                                            -
                                        </button>
                                        <span className="mx-2 text-gray-700">{item.quantity}</span>
                                        <button
                                            className="w-7 h-7 rounded-full bg-gray-100 text-lg font-bold text-gray-600 hover:bg-gray-200"
                                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                                            aria-label="Aumentar Cantidad"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-center font-semibold">S/{priceWithDiscount * item.quantity}</div>
                                    <button
                                        className="text-red-400 hover:text-red-600 text-lg mx-1 hover:bg-red-200 rounded-2xl p-1"
                                        onClick={() => removeFromCart(item.id, item.size)}
                                        aria-label="Eliminar"
                                    >
                                        ×
                                    </button>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>
            <div className="w-full max-w-sm bg-white roundex-xl shadow-xl p-6 flex flex-col gap-6">
                    <div className="carrito-total">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">  
                            Total del Pedido
                        </h2>
                        <div>
                            <div className="flex justify-between text-gray-700 mb-2">
                                <p>Total de Envio</p>
                                <p>S/.{shipping}</p>
                            </div>
                            <hr />
                            <div className="flex justify-between text-lg font-bold text-gray-900 mt-2">
                                <b>Total</b>
                                <b>S/.{total}</b>
                            </div>
                        </div>
                        {errorMessage && ( <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p> )}
                        <button
                            className="w-full bg-black text-white py-3 rounded-xl font-semibold text-lg shadow hover:bg-gray-900 transition mt-4"
                            onClick={handleCheckout}
                        >
                            Proceder a Comprar!
                        </button>
                    </div>
                    <div className="carrito-promo bg-gray-50 rounded-2xl p-4">
                        <p className="text-sm text-gray-700 mb-2">Tienes un codigo de descuento? Ingresa aca!</p>
                        <div className="flex gap-2 mb-2">
                        <input 
                            type="text"
                            placeholder="Codigo de Promocion"
                            value={promotionCode}
                            onChange={(e) => setPromotionCode(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black text-sm"
                        /> 
                        <button
                            className="bg-black text-white px-4 py-2 rounded-xl font-semibold text-sm hover:bg-gray-900 transition"
                            onClick={handleApplyPromotion}
                        >
                            Ingresar
                        </button>
                        </div>
                        {promotionMessage && ( <p className="text-green-600 text-xs mt-1">{promotionMessage}</p> )}
                    </div>
                    <Link
                        to="/"
                        className="w-full block text-center py-3 rounded-2xl font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 trans"
                    >
                        Seguir comprando
                    </Link>
            </div>
        </div>
    );
}

export default CartPage;