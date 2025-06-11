import React, { useState, useCallback, useEffect } from 'react';
import { X, Upload, Trash2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const EditProductModal = ({ isOpen, onClose, onSubmit, product }) => {
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio_unitario: '',
        stock: '',
        estado: 'disponible',
        genero: 'unisex',
        id_categoria: '',
    });

    const [images, setImages] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (isOpen && product) {
            console.log('Producto recibido:', product);
            setFormData({
                nombre: product.nombre,
                descripcion: product.descripcion,
                precio_unitario: product.precio_unitario,
                stock: product.stock,
                estado: product.estado,
                genero: product.genero,
                id_categoria: product.categoria.id.toString(),
            });

            setImages([{ preview: `/${product.imagen}`, path: product.imagen }]);
            
            const fetchAdditionalImages = async () => {
                try {
                    const token = localStorage.getItem('token');
                    const productId = product.id;
                    console.log('ID del producto:', productId);
                    
                    if (!productId) {
                        console.error('ID del producto no encontrado');
                        return;
                    }

                    const response = await axios.get(
                        `http://localhost:3000/admin/get_producto_imagenes/${productId}`,
                        {
                            headers: {
                                'Authorization': `Bearer ${token}`
                            }
                        }
                    );
                    
                    console.log('Respuesta del servidor:', response.data);
                    
                    if (response.data && Array.isArray(response.data)) {
                        const additionalImages = response.data.map(img => ({
                            preview: `/${img.url_imagen}`,
                            path: img.url_imagen
                        }));
                        
                        setImages(prevImages => [...prevImages, ...additionalImages]);
                    }
                } catch (error) {
                    console.error('Error al cargar imágenes adicionales:', error);
                    console.error('Detalles del error:', {
                        status: error.response?.status,
                        data: error.response?.data,
                        config: error.config
                    });
                }
            };

            fetchAdditionalImages();
        }
    }, [isOpen, product]);

    useEffect(() => {
        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen]);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:3000/admin/get_categorias');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const onDrop = useCallback((acceptedFiles) => {
        const newImages = acceptedFiles.map(file => ({
            file,
            preview: URL.createObjectURL(file),
            path: `productos/${uuidv4()}.webp`
        }));
        setImages(prev => [...prev, ...newImages]);
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': ['.jpeg', '.jpg', '.png', '.webp']
        },
        maxSize: 5242880
    });

    const removeImage = (index) => {
        setImages(prev => {
            const newImages = [...prev];
            URL.revokeObjectURL(newImages[index].preview);
            newImages.splice(index, 1);
            return newImages;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const savedImages = await Promise.all(
                images.map(async (image) => {
                    if (!image.file) {
                        return image.path;
                    }

                    const response = await fetch(image.preview);
                    const blob = await response.blob();
                    
                    const formData = new FormData();
                    formData.append('file', blob, image.path.split('/').pop());
                    
                    await axios.post('http://localhost:3000/admin/upload_image', formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                    });
                    
                    return image.path;
                })
            );

            const productData = {
                id_producto: product.id,
                nombre: formData.nombre,
                descripcion: formData.descripcion,
                precio_unitario: parseFloat(formData.precio_unitario),
                stock: parseInt(formData.stock),
                estado: formData.estado,
                genero: formData.genero,
                id_categoria: parseInt(formData.id_categoria),
                imagen: savedImages[0] || '',
                imagenes: savedImages.slice(1)
            };

            const token = localStorage.getItem('token');

            const response = await axios.put(
                `http://localhost:3000/admin/update_producto/${product.id}`,
                productData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            await onSubmit(response.data);
            onClose();
        } catch (error) {
            console.error('Error al actualizar el producto:', error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-xl relative">
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <span className="text-[20rem] font-serif text-gray-100 select-none">IV</span>
                </div>
                <div className="relative z-10 p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-serif font-light text-gray-800">
                            Editar Producto
                        </h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X size={24} className="text-gray-500" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-light text-gray-500 mb-1">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                                        value={formData.nombre}
                                        onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-light text-gray-500 mb-1">Descripción</label>
                                    <textarea
                                        required
                                        rows={3}
                                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4"
                                        value={formData.descripcion}
                                        onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-light text-gray-500 mb-1">Precio Unitario</label>
                                    <input
                                        type="text"
                                        required
                                        step="0.01"
                                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                                        value={formData.precio_unitario}
                                        onChange={(e) => setFormData(prev => ({ ...prev, precio_unitario: e.target.value }))}
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-light text-gray-500 mb-1">Stock</label>
                                    <input
                                        type="text"
                                        required
                                        min="0"
                                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                                        value={formData.stock}
                                        onChange={(e) => setFormData(prev => ({ ...prev, stock: e.target.value }))}
                                    />
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-xs font-light text-gray-500 mb-1">Categoría</label>
                                    <select
                                        required
                                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                                        value={formData.id_categoria}
                                        onChange={(e) => setFormData(prev => ({ ...prev, id_categoria: e.target.value }))}
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        {categories.map(category => (
                                            <option key={category.id_categoria} value={category.id_categoria.toString()}>
                                                {category.nombre}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-light text-gray-500 mb-1">Estado</label>
                                    <select
                                        required
                                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                                        value={formData.estado}
                                        onChange={(e) => setFormData(prev => ({ ...prev, estado: e.target.value }))}
                                    >
                                        <option value="disponible">Disponible</option>
                                        <option value="agotado">Agotado</option>
                                        <option value="retirado">Retirado</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-light text-gray-500 mb-1">Género</label>
                                    <select
                                        required
                                        className="w-full rounded-md border-gray-200 shadow-sm focus:outline-none focus:ring-0 focus:border-gray-200 text-sm py-3 px-4 h-12"
                                        value={formData.genero}
                                        onChange={(e) => setFormData(prev => ({ ...prev, genero: e.target.value }))}
                                    >
                                        <option value="hombre">Hombre</option>
                                        <option value="mujer">Mujer</option>
                                        <option value="unisex">Unisex</option>
                                        <option value="accesorios">Accesorios</option>
                                        <option value="hogar">Hogar</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <h3 className="text-lg font-serif font-light text-gray-700 mb-4">
                                Imágenes del Producto
                            </h3>
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                                    ${isDragActive ? 'border-gray-300 bg-gray-50' : 'border-gray-200 hover:border-gray-300'}`}
                            >
                                <input {...getInputProps()} />
                                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                                <p className="mt-2 text-sm text-gray-500">
                                    {isDragActive
                                        ? "Suelta las imágenes aquí..."
                                        : "Arrastra y suelta imágenes aquí, o haz clic para seleccionar"}
                                </p>
                                <p className="mt-1 text-xs text-gray-400">
                                    PNG, JPG, WEBP hasta 5MB
                                </p>
                            </div>

                            {images.length > 0 && (
                                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {images.map((image, index) => (
                                        <div key={index} className="relative group">
                                            <img
                                                src={image.preview}
                                                alt={`Preview ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => removeImage(index)}
                                                className="absolute top-2 right-2 p-1 bg-red-400 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2 text-sm font-light text-gray-600 bg-white border border-gray-200 rounded-md hover:bg-gray-50"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 text-sm font-light text-white bg-gray-600 rounded-md hover:bg-gray-700 disabled:opacity-50"
                            >
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditProductModal; 