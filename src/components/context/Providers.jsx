import { CartProvider } from './CartContext';
import { ModalProvider } from './ModalContext';

export function Providers({ children }) {
    return (
        <ModalProvider>
            <CartProvider>
                {children}
            </CartProvider>
        </ModalProvider>
    );
} 