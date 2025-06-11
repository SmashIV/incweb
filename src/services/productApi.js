import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const getProducts = async () => {
    try {
        const response = await axios.get(`${API_URL}/productos`);
        return response.data;
    } catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
};

export const calculateProductStats = (products) => {
    return {
        total: products.length,
        disponibles: products.filter(p => p.estado === 'disponible').length,
        agotados: products.filter(p => p.estado === 'agotado').length,
        retirados: products.filter(p => p.estado === 'retirado').length
    };
}; 