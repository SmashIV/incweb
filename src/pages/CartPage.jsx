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
    const [showCheckout, setShowCheckout] = useState(false);
    const [showNowPayments, setShowNowPayments] = useState(false);
    const [showCardBrick, setShowCardBrick] = useState(false);
    const paymentBrickRef = useRef(null);

    const subtotal = items.reduce((sum, item) => {
        const price = item.precio_final ?? item.precio_unitario;
        return sum + price * item.cantidad;
    }, 0);
    const shipping = subtotal === 0 ? 0 : 2;
    const total = subtotal + shipping;

    const handleApplyPromotion = () => {
        if (promotionCode.trim() === "Prueba") {
            setPromotionMessage("Codigo aplicado! 10% de desc");
        } else {
            setPromotionMessage("");
            setErrorMessage("Codigo invalido");
            setTimeout(() => setErrorMessage(""), 2000);
        }
    };

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

    // NOWPayments Payment Link (fijo)
    const nowPaymentsLink = "https://nowpayments.io/payment/?iid=4369578198&paymentId=5172100595"; 

    const handleCheckout = () => {
        if (items.length === 0) {
            setErrorMessage("El carrito esta vacio");
            return;
        }
        //setShowCheckout(true);
        navigate('detalle-pedido');
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex flex-col items-center py-10 px-2">
            <div className="w-full max-w-5xl mx-auto flex flex-col gap-8">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">Tu Carrito de Compras</h1>
                    <p className="text-gray-500 text-base md:text-lg">Revisa tus productos antes de finalizar la compra. Puedes modificar cantidades o eliminar productos si lo deseas.</p>
                </div>
                {/* Tabla de productos */}
                <div className="bg-white rounded-2xl shadow-lg p-6">
                    <div className="flex flex-col w-full">
                        <div className="grid grid-cols-7 gap-2 font-semibold text-gray-700 text-sm pb-2 border-b border-gray-200">
                            <p className="col-span-1">Imagen</p>
                            <p className="col-span-2">Producto</p>
                            <p className="col-span-1 text-center">Precio</p>
                            <p className="col-span-1 text-center">Cantidad</p>
                            <p className="col-span-1 text-center">Total</p>
                            <p className="col-span-1 text-center">Eliminar</p>
                        </div>
                        {items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16">
                                <span className="text-4xl text-gray-300 mb-4">🛒</span>
                                <p className="text-lg text-gray-500 mb-2">Tu carrito está vacío.</p>
                                <Link to="/" className="mt-2 px-6 py-2 bg-black text-white rounded-lg font-semibold shadow hover:bg-gray-900 transition">Volver a la tienda</Link>
                            </div>
                        ) : (
                            items.map((item) => {
                                const originalPrice = item.precio_unitario;
                                const priceWithDiscount = item.precio_final ?? originalPrice;
                                return (
                                    <div key={`${item.id}-${item.talla}`} className="grid grid-cols-7 gap-2 items-center py-4 border-b border-gray-100 text-sm auto-rows-min hover:bg-gray-50 transition">
                                        <div className="col-span-1 flex items-center justify-center">
                                            <img src={`/${item.imagen}`} alt={item.nombre} className="w-14 h-14 rounded-xl object-cover border" />
                                        </div>
                                        <div className="col-span-2 flex flex-col min-w-0">
                                            <div className="font-medium text-gray-900 break-words">{item.nombre}</div>
                                            <div className="text-xs text-gray-400">Talla: {item.talla}</div>
                                            {item.color && (
                                                <div className="text-xs text-gray-400">Color: {item.color}</div>
                                            )}
                                        </div>
                                        <div className="col-span-1 flex flex-col items-center justify-center">
                                            {priceWithDiscount !== originalPrice ? (
                                                <>
                                                    <span className="line-through text-gray-400 mr-1 text-base">S/. {originalPrice}</span>
                                                    <span className="text-green-600 font-semibold text-base">S/. {priceWithDiscount.toFixed(2)}</span>
                                                </>
                                            ) : (
                                                <span className="font-semibold text-gray-600 text-base">S/. {originalPrice}</span>
                                            )}
                                        </div>
                                        <div className="col-span-1 flex items-center justify-center gap-2">
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
                                        <div className="col-span-1 flex flex-col items-center justify-center font-semibold">
                                            S/{(priceWithDiscount * item.cantidad).toFixed(2)}
                                        </div>
                                        <div className="col-span-1 flex items-center justify-center">
                                            <button
                                                className="text-red-400 hover:text-red-600 text-lg mx-1 hover:bg-red-200 rounded-2xl p-1"
                                                onClick={() => removeFromCart(item.id, item.talla)}
                                                aria-label="Eliminar"
                                            >
                                                ×
                                            </button>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
                {/* Métricas del carrito */}
                <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row gap-8 mt-4">
                    <div className="flex-1 bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div className="flex flex-col gap-2">
                            <span className="text-lg font-bold text-gray-900">Métricas del Carrito</span>
                            <span className="text-gray-700">Productos únicos: <b>{items.length}</b></span>
                            <span className="text-gray-700">Cantidad total: <b>{items.reduce((acc, item) => acc + item.cantidad, 0)}</b></span>
                            <span className="text-gray-700">Ahorro total por descuentos: <b>S/.{items.reduce((acc, item) => {
                                const ahorro = (item.precio_unitario - (item.precio_final ?? item.precio_unitario)) * item.cantidad;
                                return acc + (ahorro > 0 ? ahorro : 0);
                            }, 0).toFixed(2)}</b></span>
                        </div>
                        <div className="flex flex-col gap-2 md:items-end">
                            <span className="text-gray-700">Subtotal: <b>S/.{subtotal.toFixed(2)}</b></span>
                            <span className="text-gray-700">Envío: <b>S/.{shipping}</b></span>
                            <span className="text-lg font-bold text-gray-900">Total: <b>S/.{total.toFixed(2)}</b></span>
                        </div>
                    </div>
                </div>
                {/* Resumen y botón de compra */}
                <div className="w-full max-w-5xl mx-auto flex flex-col items-center mt-4">
                    <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col gap-6 w-full">
                        {errorMessage && (
                            <p className="text-red-500 text-sm mt-2 text-center">{errorMessage}</p>
                        )}
                        <button
                            className="w-full bg-black text-white py-3 rounded-xl font-semibold text-lg shadow hover:bg-gray-900 transition mt-2"
                            onClick={handleCheckout}
                        >
                            Proceder a Comprar
                        </button>
                        <div className="carrito-promo bg-gray-50 rounded-2xl p-4 mt-4">
                            <p className="text-sm text-gray-700 mb-2">¿Tienes un código de descuento? Ingresa aquí:</p>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    placeholder="Código de Promoción"
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
                            {promotionMessage && (
                                <p className="text-green-600 text-xs mt-1">{promotionMessage}</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CartPage;