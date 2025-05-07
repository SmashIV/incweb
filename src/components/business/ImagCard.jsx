function ImagCard({ imageUrl, name }) {
    return (
      <div className="relative group w-64 h-80 overflow-hidden rounded-xl shadow-md">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute bottom-0 w-full bg-black bg-opacity-60 text-white text-center py-2 text-sm font-semibold">
          {name}
        </div>
      </div>
    );
  }
  export default ImagCard;