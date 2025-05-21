import { CartProvider } from './CartContext';
import { ModalProvider } from './ModalContext';
import { AuthProvider } from './AuthContext';
import { NotificationProvider } from './NotificationContext';

export function Providers({ children }) {
    return (
       <NotificationProvider>
            <AuthProvider>
                <ModalProvider>
                    <CartProvider>
                        {children}
                    </CartProvider>
                </ModalProvider>
            </AuthProvider>
       </NotificationProvider> 

    );
} 