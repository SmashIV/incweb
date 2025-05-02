import alpaca_video from '../assets/videos/alpacas.mp4';
function HomeVideoPanel() {
    {/* TODO: maybe change to another video (idk if it needs to be a video in Peru, I pick a random one lol).
        Fix panel-text container's components and aesthetics*/}
    return (  
        <div className="relative max-w-full h-[850px] overflow-hidden rounded-2xl m-20" id='panel-video'>
            <video src={alpaca_video} autoPlay loop muted className="absolute w-full h-full object-cover" >
            </video>
            <div className='absolute bottom-10 left-10 items-start space-y-4' id='panel-text'>
                <h1 className='text-8xl font-extrabold text-white text-left tracking-wide'>Incalpaca</h1>
                <p className='text-xl text-white text-left leading-relaxed'>Somos parte del Grupo Inca, uno de los conglomerados empresariales más importantes de Perú, lo que nos permite estar totalmente integrados en toda la cadena productiva.
                    Incalpaca, ofrece una amplia gama de productos, desde hilados y tejidos hasta prendas de vestir y accesorios, todos elaborados con la mejor calidad y tecnología.
                </p>
                <button className='px-6 py-3 bg-black rounded-lg text-white hover:bg-white hover:text-black transition-all duration-300'>Explora el catalogo!</button>
            </div>
        </div>
    );
}

export default HomeVideoPanel;