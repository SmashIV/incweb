import { createContext, useContext, useState, useCallback  } from "react";
import { motion, AnimatePresence} from "framer-motion"; 

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((message, type = "success", duration = 3000) => {
        const id = Date.now() + Math.random();
        setNotifications((prev) => [...prev, {id, message, type}]);
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, duration);
    }, []);
    
    const removeNotification = useCallback((id) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, []);

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 items-end p-3">
                <AnimatePresence initial={false} mode="popLayout">
                    {notifications.map((n) => (
                        <Notification
                            key={n.id}
                            id={n.id}
                            message={n.message}
                            type={n.type}
                            onClose={removeNotification}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    return useContext(NotificationContext);
}


function Notification({ id, message, type, onClose }) {
    return (
        <motion.li
            layout
            initial={{opacity: 0, y: 50, scale: 0.3}}
            animate={{opacity: 1, y: 0, scale: 1}}
            exit={{opacity: 0, scale: 0.5, transition: {duration: 0.2}}}
            className={`relative px-4 py-3 rounded-lg shadow-lg text-white font-semibold list-none ${
                type === "success" ? "bg-green-500" : "bg-red-500"
              }`}
        >
            {message}
            <button
                onClick={() => onClose(id)}
                className="absolute top-0 right-1 text-white text-lg font-bold hover:text-gray-200"
                aria-label="Cerrar notificación"
            >
                ×
            </button>
        </motion.li>
    );
}