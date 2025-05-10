import { CartProvider } from './CartContext';
import { ModalProvider } from './ModalContext';
import { AuthProvider } from './AuthContext';

export function Providers({ children }) {
    return (
        <AuthProvider>
            <ModalProvider>
                <CartProvider>
                    {children}
                </CartProvider>
            </ModalProvider>
        </AuthProvider>
    );
} 