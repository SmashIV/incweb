function StoreCard({ store }) {
  return (
    <div className="border border-gray-300 bg-gray-50 p-6">
      <h1 className="text-xl font-bold mb-2 font-mono">{store.title}</h1>
      <p className="text-gray-700 mb-2 font-mono">{store.address}</p>
      <p className="text-gray-700 mb-2 font-mono">{store.schedule}</p>
      <p className="text-gray-700 mb-4 font-mono">Contactos: {store.contact}</p>
      {store.mapUrl && (
        <a
          href={store.mapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-bold text-black hover:text-gray-700 transition-colors font-mono"
        >
          Ver Ubicación
        </a>
      )}
    </div>
  );
}

export default StoreCard; 