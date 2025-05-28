import React, {useState, useEffect, useRef} from "react"
import { useCart } from "../components/context/CartContext";
import {Link, useNavigate} from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion";

function CartPage() {
    const { items, totalAmount, updateQuantity, removeFromCart} = useCart();
    const navigate = useNavigate();

    const [promotionCode, setPromotionCode] = useState("");
    const [promotionMessage, setPromotionMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [discount, setDiscount] = useState({});
    const [showCheckout, setShowCheckout] = useState(false);
    const [showNowPayments, setShowNowPayments] = useState(false);
    const [showCardBrick, setShowCardBrick] = useState(false);
    const paymentBrickRef = useRef(null);

    const handleApplyPromotion = () => {
        if (promotionCode.trim() === "Prueba") {
            setPromotionMessage("Codigo aplicado! 10% de desc");
            const newDiscount = {};
            items.forEach(item => {
                newDiscount[`${item.id}-${item.talla}`] = Math.round(item.precio_unitario * 0.9);
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
                newDiscount[`${item.id}-${item.talla}`] = Math.round(item.precio_unitario * 0.9);
            });
            setDiscount(newDiscount);
        }
    }, [items, promotionMessage, promotionCode]);

    const subtotal = items.reduce((sum, item) => {
        const price = discount[`${item.id}-${item.talla}`] || item.precio_unitario;
        return sum + price * item.cantidad; 
    }, 0);
    const shipping = subtotal === 0 ? 0 : 2;
    const total = subtotal + shipping

    useEffect(() => {
        if (showCardBrick && window.MercadoPago) {
            if (paymentBrickRef.current) {
                paymentBrickRef.current.innerHTML = "";
            }
            const mp = new window.MercadoPago(import.meta.env.VITE_MP_PUBLIC_KEY, {
                locale: 'es-PE'
            });
            mp.bricks().create("cardPayment", "paymentBrick_container", {
                initialization: {
                    amount: total,
                },
                customization: {
                    paymentMethods: {
                        ticket: "all",
                        bankTransfer: "all"
                    }
                },
                callbacks: {
                    onReady: () => {
                        // El Brick está listo
                    },
                    onSubmit: (cardFormData) => {
                        fetch("/api/process_payment", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(cardFormData)
                        })
                        .then(res => res.json())
                        .then(data => {
                            alert("Pago procesado: " + data.status);
                        })
                        .catch(err => {
                            alert("Error en el pago: " + err.message);
                        });
                    },
                    onError: (error) => {
                        alert("Error en el pago: " + error.message);
                    }
                }
            });
        }
    }, [showCardBrick, total]);
;
    // NOWPayments Payment Link (fijo)
    const nowPaymentsLink = "https://nowpayments.io/payment/?iid=4369578198&paymentId=5172100595"; 

    const handleCheckout = () => {
        if (items.length === 0) {
            setErrorMessage("El carrito esta vacio");
            return;
        }
        setShowCheckout(true);
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
                            const originalPrice = item.precio_unitario;
                            const priceWithDiscount = discount[`${item.id}-${item.talla}`] || originalPrice;

                            return (
                                <div key={`${item.id}-${item.talla}`} className="grid grid-cols-7 gap-2 items-center py-4 border-b border-gray-100 text-sm">
                                    <img src={`/${item.imagen}`} alt={item.nombre} className="w-14 h-14 rounded-xl object-cover border mx-auto" />
                                    <div className="col-span-2 truncate">
                                        <div className="font-medium text-gray-900">{item.nombre}</div>
                                        <div className="text-xs text-gray-400">Talla: {item.talla}</div>
                                    </div>
                                    <div className="text-center">
                                        {discount[`${item.id}-${item.talla}`] ? (
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
                                            onClick={() => updateQuantity(item.id, item.talla, Math.max(1, item.cantidad - 1))}
                                            aria-label="Disminuir Cantidad"
                                        >
                                            -
                                        </button>
                                        <span className="mx-2 text-gray-700">{item.cantidad}</span>
                                        <button
                                            className="w-7 h-7 rounded-full bg-gray-100 text-lg font-bold text-gray-600 hover:bg-gray-200"
                                            onClick={() => updateQuantity(item.id, item.talla, item.cantidad + 1)}
                                            aria-label="Aumentar Cantidad"
                                        >
                                            +
                                        </button>
                                    </div>
                                    <div className="text-center font-semibold">S/{priceWithDiscount * item.cantidad}</div>
                                    <button
                                        className="text-red-400 hover:text-red-600 text-lg mx-1 hover:bg-red-200 rounded-2xl p-1"
                                        onClick={() => removeFromCart(item.id, item.talla)}
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
            <AnimatePresence mode="wait">
                {!showCheckout && (
                    <motion.div
                        key="resumen"
                        initial={{ opacity: 1, x: 0 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.4 }}
                        className="w-full max-w-sm bg-white roundex-xl shadow-xl p-6 flex flex-col gap-6"
                    >
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
                    </motion.div>
                )}
                {showCheckout && (
                    <motion.div
                        key="checkout-options"
                        initial={{ opacity: 0, x: 100 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 100 }}
                        transition={{ duration: 0.4 }}
                        className="w-full max-w-sm bg-white roundex-xl shadow-xl p-6 flex flex-col gap-6 items-center justify-center"
                    >
                        <h2 className="text-xl font-bold text-gray-900 mb-4 text-center">Selecciona un método de pago</h2>
                        <div className="flex flex-col w-full gap-2">
                            <button
                                className="flex h-14 w-full items-center justify-between bg-[#009ee3] hover:bg-[#007bb6] text-white rounded-xl font-semibold text-lg shadow transition mx-auto text-center px-4"
                                onClick={() => setShowCardBrick(true)}
                            >
                                <span className="flex items-center">
                                    <svg width="32" height="32" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                                        <ellipse cx="24" cy="24" rx="24" ry="24" fill="#fff"/>
                                        <ellipse cx="24" cy="24" rx="20" ry="12" fill="#009ee3"/>
                                        <path d="M16.5 24c1.5-2 4.5-2 6 0 1.5-2 4.5-2 6 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                                    </svg>
                                </span>
                                <span className="flex-1 text-center">Pagar con Tarjeta (MercadoPago)</span>
                                <span className="w-[32px]" />
                            </button>
                            {showCardBrick && (
                                <>
                                    <button
                                        className="w-full mb-2 bg-gray-200 text-gray-700 py-2 rounded-xl font-semibold text-sm hover:bg-gray-300 transition"
                                        onClick={() => {
                                            setShowCardBrick(false);
                                            if (paymentBrickRef.current) paymentBrickRef.current.innerHTML = "";
                                        }}
                                    >
                                        ← Volver a métodos de pago
                                    </button>
                                    <div ref={paymentBrickRef} id="paymentBrick_container" className="w-full my-2" />
                                </>
                            )}
                            <button
                                className="flex h-14 w-full items-center justify-between bg-[#7a4df6] hover:bg-[#6a3ed6] text-white rounded-xl font-semibold text-lg shadow transition mx-auto text-center px-4"
                                onClick={() => setShowNowPayments(!showNowPayments)}
                            >
                                <span className="flex items-center">
                                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M13.5 2L6 14H12L10.5 22L18 10H12L13.5 2Z" fill="#fff"/>
                                    </svg>
                                </span>
                                <span className="flex-1 text-center">Paga con Cripto :D</span>
                                <span className="w-[28px]" />
                            </button>
                        </div>
                        <AnimatePresence>
                            {showNowPayments && (
                                <motion.div
                                    key="nowpayments-iframe"
                                    initial={{ opacity: 0, y: 40 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 40 }}
                                    transition={{ duration: 0.4 }}
                                    className="w-full flex flex-col items-center"
                                >
                                    <iframe
                                        src={nowPaymentsLink}
                                        width="420"
                                        height="650"
                                        frameBorder="0"
                                        allowFullScreen
                                        title="Pago cripto NOWPayments"
                                        className="rounded-xl border"
                                    />
                                    <button
                                        className="w-full mt-4 bg-gray-200 text-gray-700 py-2 rounded-xl font-semibold text-sm hover:bg-gray-300 transition"
                                        onClick={() => setShowNowPayments(false)}
                                    >
                                        ← Usar otro metodo
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <button
                            className="w-full mt-2 bg-gray-200 text-gray-700 py-2 rounded-xl font-semibold text-sm hover:bg-gray-300 transition"
                            onClick={() => setShowCheckout(false)}
                        >
                            ← Volver a detalles
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default CartPage;