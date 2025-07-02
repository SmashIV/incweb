import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from 'axios';
import { useCart } from "../context/CartContext";

const discountStyles = `
  .discount-glow {
    box-shadow: 0 0 20px rgba(255, 193, 7, 0.3);
    animation: pulse-glow 2s infinite;
  }
  
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 20px rgba(255, 193, 7, 0.3); }
    50% { box-shadow: 0 0 30px rgba(255, 193, 7, 0.6); }
  }
  
  .discount-badge {
    background: linear-gradient(45deg, #ffd700, #ff8c00, #ff4500);
    background-size: 200% 200%;
    animation: gradient-shift 3s ease infinite;
  }
  
  @keyframes gradient-shift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
  
  .success-pulse {
    animation: success-pulse 1.5s ease-in-out;
  }
  
  @keyframes success-pulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.05); }
    100% { transform: scale(1); }
  }
`;

const PAYMENT_STATES = {
  IDLE: 'idle',
  PROCESSING: 'processing',
  SUCCESS: 'success',
  ERROR: 'error',
  EXPIRED: 'expired',
  RETRY: 'retry'
};

function getPlatform() {
  if (navigator.userAgentData && navigator.userAgentData.platform) {
    return navigator.userAgentData.platform;
  }
  const ua = navigator.userAgent;
  if (/windows phone/i.test(ua)) return "Windows Phone";
  if (/win/i.test(ua)) return "Windows";
  if (/android/i.test(ua)) return "Android";
  if (/linux/i.test(ua)) return "Linux";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/mac/i.test(ua)) return "Mac";
  return "unknown";
}

const PaymentSummary = ({ total, totalConDescuento, isMastercard, mastercardPromo, items }) => {
  const subtotal = items.reduce((sum, item) => {
    const price = item.precio_final ?? item.precio_unitario;
    return sum + price * item.cantidad;
  }, 0);
  const shipping = subtotal === 0 ? 0 : 2;
  const totalOriginal = subtotal + shipping;
  const descuentoAplicado = totalOriginal - totalConDescuento;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-xl p-6 mb-6 shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">Resumen de Pago</h3>
        {isMastercard && mastercardPromo && (
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-sm font-semibold discount-badge">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            </svg>
            Descuento Mastercard
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">S/ {subtotal.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Envío</span>
          <span className="font-medium">S/ {shipping.toFixed(2)}</span>
        </div>

        {isMastercard && mastercardPromo && descuentoAplicado > 0 && (
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="flex justify-between items-center bg-green-50 border border-green-200 rounded-lg p-3"
            >
              <div className="flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-600">
                  <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-green-700 font-medium">
                  Descuento Mastercard ({mastercardPromo.descuento_porcentaje}%)
                </span>
              </div>
              <span className="text-green-700 font-bold">-S/ {descuentoAplicado.toFixed(2)}</span>
            </motion.div>
          </AnimatePresence>
        )}

        <div className="border-t border-gray-200 pt-3">
          <div className="flex justify-between items-center">
            <span className="text-lg font-bold text-gray-900">
              {isMastercard && mastercardPromo ? 'Total con descuento' : 'Total'}
            </span>
            <div className="text-right">
              {isMastercard && mastercardPromo && descuentoAplicado > 0 ? (
                <div>
                  <div className="text-sm text-gray-400 line-through">S/ {totalOriginal.toFixed(2)}</div>
                  <div className="text-xl font-bold text-green-600 success-pulse">S/ {totalConDescuento.toFixed(2)}</div>
                </div>
              ) : (
                <div className="text-xl font-bold text-gray-900">S/ {totalConDescuento.toFixed(2)}</div>
              )}
            </div>
          </div>
        </div>

        {isMastercard && mastercardPromo && (
          <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-blue-600 mt-0.5">
                <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="text-sm text-blue-700">
                <p className="font-medium">¡Descuento aplicado automáticamente!</p>
                <p className="text-blue-600">Tu descuento de {mastercardPromo.descuento_porcentaje}% se aplicará al finalizar el pago con Mastercard.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

const MastercardDiscountNotification = ({ isMastercard, mastercardPromo, descuentoAplicado }) => {
  if (!isMastercard || !mastercardPromo || descuentoAplicado <= 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8, y: -20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="fixed top-4 right-4 z-50 max-w-sm"
      >
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white p-4 rounded-xl shadow-2xl border border-yellow-300 discount-glow">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg">¡Descuento Aplicado!</h4>
              <p className="text-sm opacity-90">
                {mastercardPromo.descuento_porcentaje}% de descuento con Mastercard
              </p>
              <p className="text-lg font-bold mt-1">
                Ahorras S/ {descuentoAplicado.toFixed(2)}
              </p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-white border-opacity-20">
            <div className="flex items-center gap-2 text-sm">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span>El descuento se aplicará automáticamente al finalizar el pago</span>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

// Componente de banner informativo de promociones
const PromotionsBanner = ({ mastercardPromo }) => {
  if (!mastercardPromo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4 mb-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-white">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-blue-900">¡Promoción Especial Disponible!</h4>
          <p className="text-sm text-blue-700">
            Paga con Mastercard y obtén un {mastercardPromo.descuento_porcentaje}% de descuento automático en tu compra.
          </p>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-blue-200">
        <div className="flex items-center gap-2 text-xs text-blue-600">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>El descuento se aplicará automáticamente cuando selecciones Mastercard como método de pago</span>
        </div>
      </div>
    </motion.div>
  );
};

const DiscountStatusIndicator = ({ isMastercard, mastercardPromo, isProcessing }) => {
  if (!isMastercard || !mastercardPromo) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4"
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {isProcessing ? (
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 text-green-600" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            </div>
          ) : (
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-600">
                <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold text-green-800">
            {isProcessing ? 'Aplicando descuento...' : 'Descuento aplicado'}
          </h4>
          <p className="text-sm text-green-700">
            {isProcessing 
              ? 'Procesando el descuento de Mastercard...' 
              : `${mastercardPromo.descuento_porcentaje}% de descuento activo con Mastercard`
            }
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const DiscountConfirmation = ({ isMastercard, mastercardPromo, descuentoAplicado }) => {
  if (!isMastercard || !mastercardPromo || descuentoAplicado <= 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4 mb-4 success-pulse"
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-green-600">
              <path d="M9 12l2 2 4-4" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="flex-1">
          <h4 className="font-bold text-green-800 text-lg">¡Descuento Confirmado!</h4>
          <p className="text-green-700 mb-2">
            Tu descuento de <span className="font-bold">{mastercardPromo.descuento_porcentaje}%</span> con Mastercard ha sido aplicado exitosamente.
          </p>
          <div className="bg-white bg-opacity-50 rounded-lg p-2">
            <p className="text-sm text-green-800">
              <span className="font-semibold">Ahorro total:</span> S/ {descuentoAplicado.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-green-200">
        <div className="flex items-center gap-2 text-sm text-green-700">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span>El descuento se aplicará automáticamente al finalizar el pago. ¡Disfruta de tu ahorro!</span>
        </div>
      </div>
    </motion.div>
  );
};

function MetodoPago({ total, id_direccion, onPaymentSuccess, onPaymentError }) {
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
    const [userEmail, setUserEmail] = useState("");
    const [mastercardPromo, setMastercardPromo] = useState(null);
    const [isMastercard, setIsMastercard] = useState(false);
    const [totalConDescuento, setTotalConDescuento] = useState(total);
    const MIN_AMOUNT = 5;
    const isAmountValid = totalConDescuento >= MIN_AMOUNT;

    const brickKey = `${isMastercard ? 'mastercard' : 'otro'}-${totalConDescuento}`;

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setPaymentState(PAYMENT_STATES.EXPIRED);
                return;
            }
            try {
                const response = await axios.get(
                    'http://localhost:3000/payment/get_usuario_datos',
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if (response.data && response.data.email) {
                    setUserEmail(response.data.email);
                }
            } catch (e) {
                setUserEmail("");
            }
        };
        fetchUserData();
    }, []);

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

    useEffect(() => {
        const token = localStorage.getItem('token');
        axios.get('http://localhost:3000/promociones/pago/mastercard', {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
        .then(res => {
            if (res.data && res.data.hasPromo) {
                setMastercardPromo(res.data);
            } else {
                setMastercardPromo(null);
            }
        })
        .catch(() => setMastercardPromo(null));
    }, []);

    useEffect(() => {
        if (isMastercard && mastercardPromo) {
            const descuento = Number(mastercardPromo.descuento_porcentaje) || 0;
            const nuevoTotal = Math.round((total * (1 - descuento / 100)) * 100) / 100;
            setTotalConDescuento(nuevoTotal);
        } else {
            setTotalConDescuento(Math.round(total * 100) / 100);
        }
    }, [isMastercard, mastercardPromo, total]);

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
                    amount: totalConDescuento,
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
                        console.log("[MP Brick] Brick listo");
                    },
                    onPaymentMethodReceived: (paymentMethod) => {
                        console.log("[MP Brick] Método de pago detectado:", paymentMethod);
                        if (paymentMethod && paymentMethod.payment_method_id === 'master') {
                            setIsMastercard(true);
                            console.log("[MP Brick] Mastercard detectado, se aplicará descuento");
                        } else {
                            setIsMastercard(false);
                            console.log("[MP Brick] No es Mastercard, sin descuento");
                        }
                    },
                    onChange: (state) => {
                        console.log("[MP Brick] onChange:", state);
                    },
                    onCardTokenReceived: (token) => {
                        console.log("[MP Brick] onCardTokenReceived:", token);
                    },
                    onSubmit: async (cardFormData) => {
                        try {
                            setPaymentState(PAYMENT_STATES.PROCESSING);
                            const token = localStorage.getItem('token');
                            if (!token) throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
                            
                            const promociones_aplicadas = items
                                .filter(item => item.promo_aplicada && item.promo_aplicada.titulo)
                                .map(item => item.promo_aplicada.titulo);

                            const payload = {
                                items: items.map(item => ({
                                    id_producto: Number(item.id),
                                    cantidad: Number(item.cantidad),
                                    precio: Number((Number(item.precio_final ?? item.precio_unitario)).toFixed(2)),
                                    talla: item.talla || null
                                })),
                                total_pago: totalConDescuento,
                                codigo_cupon: promoCode ? String(promoCode) : null,
                                id_direccion: id_direccion,
                                user_agent: navigator.userAgent,
                                cantidad_total_productos: items.reduce((sum, item) => sum + item.cantidad, 0),
                                colores_pedidos: items.map(item => item.color || 'sin_color'),
                                tallas_pedidas: items.map(item => item.talla || 'sin_talla'),
                                categorias_pedidas: items.map(item => item.categoria?.nombre || 'sin_categoria'),
                                platform: getPlatform(),
                                language: navigator.language || null,
                                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || null,
                                timezone_offset: new Date().getTimezoneOffset() || null,
                                promo_mastercard: isMastercard && mastercardPromo ? mastercardPromo.id_promocion : null,
                                promociones_aplicadas: promociones_aplicadas.length > 0 ? promociones_aplicadas.join(",") : null
                            };
                            
                            const createPedidoResponse = await axios.post(
                                'http://localhost:3000/payment/create_pedido',
                                payload,
                                { 
                                    headers: { Authorization: `Bearer ${token}` },
                                    timeout: 10000
                                }
                            );
                            const id_pedido = createPedidoResponse.data.id_pedido;
                            
                            const email = userEmail || cardFormData.payer?.email || cardFormData.email || 'usuario@example.com';
                            console.log("Email para payment:", email);
                            
                            const validatedCardData = {
                                ...cardFormData,
                                payment_method_id: cardFormData.payment_method_id,
                                issuer_id: cardFormData.issuer_id && !isNaN(cardFormData.issuer_id) ? cardFormData.issuer_id : null,
                                transaction_amount: totalConDescuento,
                                installments: Number(cardFormData.installments || 1),
                                payer: {
                                    email: email,
                                    identification: cardFormData.payer?.identification || {
                                        type: "DNI",
                                        number: "12345678"
                                    }
                                }
                            };
                            if (!validatedCardData.issuer_id) {
                                delete validatedCardData.issuer_id;
                            }
                            
                            const paymentResponse = await axios.post(
                                'http://localhost:3000/payment/process_payment',
                                {
                                    ...validatedCardData,
                                    id_pedido,
                                    email: email
                                },
                                { 
                                    headers: { Authorization: `Bearer ${token}` },
                                    timeout: 30000
                                }
                            );
                            const data = paymentResponse.data;
                            if (data.status === 'approved') {
                                clearCart();
                                setPaymentState(PAYMENT_STATES.SUCCESS);
                                
                                axios.post(
                                    'http://localhost:3000/payment/send_order_email',
                                    { id_pedido: id_pedido },
                                    { 
                                        headers: { Authorization: `Bearer ${token}` },
                                        timeout: 10000
                                    }
                                ).then(() => {
                                    console.log('Email de confirmación enviado exitosamente');
                                }).catch((emailError) => {
                                    console.error('Error al enviar email de confirmación:', emailError);
                                });
                                
                                onPaymentSuccess({
                                    ...data,
                                    id_pedido: id_pedido
                                });
                            } else {
                                throw new Error('Pago no aprobado');
                            }
                        } catch (error) {
                            console.error('Error en el proceso de pago:', error);
                            if (error.response) {
                                console.error('Error response:', error.response.data);
                                console.error('Error status:', error.response.status);
                            }
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
    }, [showCardBrick, totalConDescuento, isMastercard, items, promoCode, retryCount, userEmail, mastercardPromo]);

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

    const subtotal = items.reduce((sum, item) => {
        const price = item.precio_final ?? item.precio_unitario;
        return sum + price * item.cantidad;
    }, 0);
    const shipping = subtotal === 0 ? 0 : 2;
    const totalOriginal = subtotal + shipping;
    const descuentoAplicado = totalOriginal - totalConDescuento;

    return (
        <div className="w-full flex flex-col gap-4 mt-2">
            <style>{discountStyles}</style>
            
            <MastercardDiscountNotification 
                isMastercard={isMastercard}
                mastercardPromo={mastercardPromo}
                descuentoAplicado={descuentoAplicado}
            />
            
            <h3 className="font-bold text-lg text-[#8B5C2A] mb-1">Método de Pago</h3>
            <p className="text-sm text-gray-700 mb-2">
                Selecciona tu método de pago preferido y completa los datos requeridos. 
                El pago es 100% seguro y procesado por MercadoPago.
            </p>
            
            <PromotionsBanner 
                mastercardPromo={mastercardPromo}
            />
            
            <DiscountStatusIndicator 
                isMastercard={isMastercard}
                mastercardPromo={mastercardPromo}
                isProcessing={paymentState === PAYMENT_STATES.PROCESSING}
            />
            
            <DiscountConfirmation 
                isMastercard={isMastercard}
                mastercardPromo={mastercardPromo}
                descuentoAplicado={descuentoAplicado}
            />

            {!isAmountValid && (
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-3 rounded">
                    El monto mínimo de compra es S/ {MIN_AMOUNT}
                </div>
            )}
            <div className="flex flex-col gap-2 w-full">
                <button
                    type="button"
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded-lg font-bold text-base shadow-sm transition disabled:opacity-50 disabled:cursor-not-allowed ${
                        isMastercard && mastercardPromo 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white' 
                            : 'bg-[#009ee3] hover:bg-[#007bb6] text-white'
                    }`}
                    onClick={() => setShowCardBrick(true)}
                    disabled={paymentState === PAYMENT_STATES.PROCESSING || !isAmountValid}
                >
                    {isMastercard && mastercardPromo ? (
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z"/>
                        </svg>
                    ) : (
                        <svg width="28" height="28" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <ellipse cx="24" cy="24" rx="24" ry="24" fill="#fff"/>
                            <ellipse cx="24" cy="24" rx="20" ry="12" fill="#009ee3"/>
                            <path d="M16.5 24c1.5-2 4.5-2 6 0 1.5-2 4.5-2 6 0" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                    )}
                    <span>
                        {paymentState === PAYMENT_STATES.PROCESSING 
                            ? 'Procesando pago...' 
                            : isMastercard && mastercardPromo
                                ? `Pagar con Mastercard - ${mastercardPromo.descuento_porcentaje}% descuento`
                                : 'Pagar con Tarjeta (MercadoPago)'}
                    </span>
                </button>
                
                {showCardBrick && (
                    <div className="w-full mt-2" key={brickKey}>
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