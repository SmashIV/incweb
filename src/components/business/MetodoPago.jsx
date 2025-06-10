import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

function MetodoPago({ total }) {
    const [showCardBrick, setShowCardBrick] = useState(false);
    const paymentBrickRef = useRef(null);
    const [promoCode, setPromoCode] = useState("");
    const [promoMessage, setPromoMessage] = useState("");
    const [promoError, setPromoError] = useState("");

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
                    onReady: () => {},
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

    const handleApplyPromo = (e) => {
        e.preventDefault();
        if (promoCode.trim().toLowerCase() === "prueba") {
            setPromoMessage("¡Código aplicado! 10% de descuento.");
            setPromoError("");
        } else {
            setPromoMessage("");
            setPromoError("Código inválido o expirado.");
        }
    };

    return (
        <div className="w-full flex flex-col gap-4 mt-2">
            <h3 className="font-bold text-lg text-[#8B5C2A] mb-1">Método de Pago</h3>
            <p className="text-sm text-gray-700 mb-2">Selecciona tu método de pago preferido y completa los datos requeridos. El pago es 100% seguro y procesado por MercadoPago.</p>

            <form onSubmit={handleApplyPromo} className="flex flex-col sm:flex-row gap-2 items-start sm:items-end mb-2">
                <div className="flex flex-col w-full sm:w-auto">
                    <label htmlFor="promo" className="text-xs font-semibold text-[#8B5C2A] mb-1">Código de Promoción</label>
                    <input
                        id="promo"
                        type="text"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        className="input w-full sm:w-48"
                        placeholder="Ingresa tu código"
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#C19A6B] text-white font-semibold text-sm hover:bg-[#8B5C2A] transition-colors duration-200"
                >
                    Aplicar
                </button>
            </form>
            {promoMessage && <div className="text-green-600 text-xs font-semibold mb-1">{promoMessage}</div>}
            {promoError && <div className="text-red-500 text-xs font-semibold mb-1">{promoError}</div>}

            <div className="flex flex-col gap-2 w-full">
                <button
                    type="button"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#009ee3] hover:bg-[#007bb6] text-white font-bold text-base shadow-sm transition"
                    onClick={() => setShowCardBrick(true)}
                >
                    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="24" cy="24" rx="24" ry="24" fill="#fff"/>
                        <ellipse cx="24" cy="24" rx="20" ry="12" fill="#009ee3"/>
                        <path d="M16.5 24c1.5-2 4.5-2 6 0 1.5-2 4.5-2 6 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>Pagar con Tarjeta (MercadoPago)</span>
                </button>
                {showCardBrick && (
                    <div className="w-full mt-2">
                        <button
                            className="w-full mb-2 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold text-sm hover:bg-gray-300 transition"
                            onClick={() => {
                                setShowCardBrick(false);
                                if (paymentBrickRef.current) paymentBrickRef.current.innerHTML = "";
                            }}
                        >
                            ← Volver a métodos de pago
                        </button>
                        <div ref={paymentBrickRef} id="paymentBrick_container" className="w-full my-2" />
                    </div>
                )}
            </div>

            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded text-xs mt-2">
                <b>Advertencia:</b> No cierres ni recargues la página durante el proceso de pago. Si tienes problemas, comunícate con nuestro soporte.
            </div>
            <div className="text-xs text-gray-500 mt-1">
                Tus datos están protegidos y el pago es procesado de forma segura por MercadoPago.
            </div>
        </div>
    );
}

export default MetodoPago;