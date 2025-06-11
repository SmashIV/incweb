import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { useCart } from "../context/CartContext";

const PAYMENT_STATES = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  ERROR: 'error',
  EXPIRED: 'expired',
  RETRY: 'retry'
};

function MetodoPago({ total, onPaymentSuccess, onPaymentError }) {
    const { items, clearCart } = useCart();
    const [showCardBrick, setShowCardBrick] = useState(false);
    const paymentBrickRef = useRef(null);
    const [promoCode, setPromoCode] = useState("");
    const [promoMessage, setPromoMessage] = useState("");
    const [promoError, setPromoError] = useState("");
    const [paymentState, setPaymentState] = useState(PAYMENT_STATES.IDLE);
    const [retryCount, setRetryCount] = useState(0);
    const [paymentError, setPaymentError] = useState(null);
    const [sessionTimeout, setSessionTimeout] = useState(null);

    const MIN_AMOUNT = 5;
    const isAmountValid = total >= MIN_AMOUNT;

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setPaymentState(PAYMENT_STATES.EXPIRED);
            return;
        }

        const timeout = setTimeout(() => {
            setPaymentState(PAYMENT_STATES.EXPIRED);
        }, 30 * 60 * 1000); 

        setSessionTimeout(timeout);
        return () => clearTimeout(timeout);
    }, []);

    const createPedido = async () => {
        if (!isAmountValid) {
            throw new Error(`El monto mínimo de compra es S/ ${MIN_AMOUNT}`);
        }

        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/payment/create_pedido',
                {
                    items: items.map(item => ({
                        id_producto: item.id,
                        cantidad: item.cantidad,
                        precio: item.precio_unitario
                    })),
                    total_pago: total,
                    codigo_cupon: promoCode || null
                },
                { 
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000 
                }
            );
            return response.data.id_pedido;
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
            }
            throw new Error('Error al crear el pedido. Por favor, intenta nuevamente.');
        }
    };

    const updatePedidoPago = async (id_pedido, paymentData) => {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }

        try {
            await axios.post(
                'http://localhost:3000/payment/update_pedido_pago',
                {
                    id_pedido,
                    payment_data: paymentData
                },
                { 
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 10000
                }
            );
        } catch (error) {
            throw new Error('Error al actualizar el pago. Por favor, contacta a soporte.');
        }
    };

    const handlePaymentRetry = () => {
        setPaymentState(PAYMENT_STATES.RETRY);
        setRetryCount(prev => prev + 1);
        setPaymentError(null);
    };

    const handlePaymentCancel = () => {
        setPaymentState(PAYMENT_STATES.IDLE);
        setShowCardBrick(false);
        if (paymentBrickRef.current) {
            paymentBrickRef.current.innerHTML = "";
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
                    },
                    visual: {
                        style: {
                            theme: 'default'
                        }
                    }
                },
                callbacks: {
                    onReady: () => {
                        setPaymentState(PAYMENT_STATES.IDLE);
                    },
                    onSubmit: async (cardFormData) => {
                        try {
                            setPaymentState(PAYMENT_STATES.PROCESSING);
                            
                            const createPedidoResponse = await axios.post(
                                'http://localhost:3000/payment/create_pedido',
                                {
                                    items: items.map(item => ({
                                        id_producto: item.id,
                                        cantidad: item.cantidad,
                                        precio: item.precio_unitario
                                    })),
                                    total_pago: total,
                                    codigo_cupon: promoCode || null
                                },
                                { 
                                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                                    timeout: 10000
                                }
                            );
                            
                            const id_pedido = createPedidoResponse.data.id_pedido;
                            
                            const paymentResponse = await axios.post(
                                'http://localhost:3000/payment/process_payment',
                                {
                                    ...cardFormData,
                                    id_pedido,
                                    transaction_amount: total,
                                    email: userData?.email || cardFormData.email
                                },
                                { 
                                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                                    timeout: 30000
                                }
                            );
                            
                            const data = paymentResponse.data;
                            
                            if (data.status === 'approved') {
                                await axios.post(
                                    'http://localhost:3000/payment/update_pedido_pago',
                                    {
                                        id_pedido,
                                        payment_data: data
                                    },
                                    { 
                                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                                        timeout: 10000
                                    }
                                );
                                
                                clearCart();
                                setPaymentState(PAYMENT_STATES.SUCCESS);
                                onPaymentSuccess(data);
                            } else {
                                throw new Error('Pago no aprobado');
                            }
                        } catch (error) {
                            console.error('Error en el proceso de pago:', error);
                            setPaymentError(error.message);
                            setPaymentState(PAYMENT_STATES.ERROR);
                            onPaymentError(error);
                        }
                    },
                    onError: (error) => {
                        console.error('Error en el pago:', error);
                        setPaymentError('Error al procesar el pago. Por favor, intenta nuevamente.');
                        setPaymentState(PAYMENT_STATES.ERROR);
                        onPaymentError(error);
                    }
                }
            });
        }
    }, [showCardBrick, total, items, promoCode, retryCount]);

    const handleApplyPromo = async (e) => {
        e.preventDefault();
        if (paymentState === PAYMENT_STATES.PROCESSING) return;

        const token = localStorage.getItem('token');
        if (!token) {
            setPromoError("Debes iniciar sesión para usar códigos promocionales");
            return;
        }

        try {
            const response = await axios.post(
                'http://localhost:3000/payment/validate_cupon',
                { codigo: promoCode },
                { 
                    headers: { Authorization: `Bearer ${token}` },
                    timeout: 5000
                }
            );
            
            if (response.data.valid) {
                setPromoMessage(`¡Código aplicado! ${response.data.mensaje}`);
                setPromoError("");
            } else {
                setPromoMessage("");
                setPromoError(response.data.mensaje);
            }
        } catch (error) {
            setPromoMessage("");
            setPromoError("Error al validar el código promocional");
        }
    };

    const renderPaymentState = () => {
        switch (paymentState) {
            case PAYMENT_STATES.PROCESSING:
                return (
                    <div className="flex items-center justify-center gap-2 text-blue-600">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                        </svg>
                        <span>Procesando pago...</span>
                    </div>
                );
            case PAYMENT_STATES.ERROR:
                return (
                    <div className="flex flex-col items-center gap-2 text-red-600">
                        <span>{paymentError}</span>
                        <button
                            onClick={handlePaymentRetry}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200"
                        >
                            Reintentar
                        </button>
                    </div>
                );
            case PAYMENT_STATES.EXPIRED:
                return (
                    <div className="text-red-600">
                        Sesión expirada. Por favor, inicia sesión nuevamente.
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full flex flex-col gap-4 mt-2">
            <h3 className="font-bold text-lg text-[#8B5C2A] mb-1">Método de Pago</h3>
            <p className="text-sm text-gray-700 mb-2">
                Selecciona tu método de pago preferido y completa los datos requeridos. 
                El pago es 100% seguro y procesado por MercadoPago.
            </p>

            {!isAmountValid && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded">
                    El monto mínimo de compra es S/ {MIN_AMOUNT}
                </div>
            )}

            <form onSubmit={handleApplyPromo} className="flex flex-col sm:flex-row gap-2 items-start sm:items-end mb-2">
                <div className="flex flex-col w-full sm:w-auto">
                    <label htmlFor="promo" className="text-xs font-semibold text-[#8B5C2A] mb-1">
                        Código de Promoción
                    </label>
                    <input
                        id="promo"
                        type="text"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        className="input w-full sm:w-48"
                        placeholder="Ingresa tu código"
                        disabled={paymentState === PAYMENT_STATES.PROCESSING}
                    />
                </div>
                <button
                    type="submit"
                    className="px-4 py-2 rounded bg-[#C19A6B] text-white font-semibold text-sm hover:bg-[#8B5C2A] transition-colors duration-200 disabled:opacity-50"
                    disabled={paymentState === PAYMENT_STATES.PROCESSING}
                >
                    Aplicar
                </button>
            </form>

            {promoMessage && (
                <div className="text-green-600 text-xs font-semibold mb-1">{promoMessage}</div>
            )}
            {promoError && (
                <div className="text-red-500 text-xs font-semibold mb-1">{promoError}</div>
            )}

            <div className="flex flex-col gap-2 w-full">
                <button
                    type="button"
                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[#009ee3] hover:bg-[#007bb6] text-white font-bold text-base shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={() => setShowCardBrick(true)}
                    disabled={paymentState === PAYMENT_STATES.PROCESSING || !isAmountValid}
                >
                    <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <ellipse cx="24" cy="24" rx="24" ry="24" fill="#fff"/>
                        <ellipse cx="24" cy="24" rx="20" ry="12" fill="#009ee3"/>
                        <path d="M16.5 24c1.5-2 4.5-2 6 0 1.5-2 4.5-2 6 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                    <span>
                        {paymentState === PAYMENT_STATES.PROCESSING 
                            ? 'Procesando pago...' 
                            : 'Pagar con Tarjeta (MercadoPago)'}
                    </span>
                </button>

                {showCardBrick && (
                    <div className="w-full mt-2">
                        <button
                            className="w-full mb-2 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold text-sm hover:bg-gray-300 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={handlePaymentCancel}
                            disabled={paymentState === PAYMENT_STATES.PROCESSING}
                        >
                            ← Volver a métodos de pago
                        </button>
                        <div ref={paymentBrickRef} id="paymentBrick_container" className="w-full my-2" />
                        {renderPaymentState()}
                    </div>
                )}
            </div>

            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded text-xs mt-2">
                <b>Advertencia:</b> No cierres ni recargues la página durante el proceso de pago. 
                Si tienes problemas, comunícate con nuestro soporte.
            </div>
            <div className="text-xs text-gray-500 mt-1">
                Tus datos están protegidos y el pago es procesado de forma segura por MercadoPago.
            </div>
        </div>
    );
}

export default MetodoPago;