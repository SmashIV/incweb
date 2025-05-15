import alpacagroup_img from "../../assets/INCALPACA-INFO.webp";
import ImagCard from "./ImagCard";
import ImagC01 from "../../assets/ImagCard-01.webp";
import ImagC02 from "../../assets/ImagCard-02.webp";
import ImagC03 from "../../assets/ImagCard-03.webp";
import ImagKuna from "../../assets/MarcaKuna.webp";
import ImagKuna2 from "../../assets/MarcaKuna2.webp";
import Imag111 from "../../assets/Marca-Alpaca111.webp";
import Imag222 from "../../assets/Marca-Alpaca222.webp";
function Info (){
    return (
        <>
        <section>
            <div className="relative max-w-full h-[750px] overflow-hidden rounded-2xl m-09" id="panel-imagen">
                <img src={alpacagroup_img}   className="absolute w-full h-full object-cover" />
                <div className='absolute bottom-100 left-1/2 transform -translate-x-1/2 max-w-3xl w-full items-start space-y-4'>
                    <h1 className="text-2xl font-bold text-white drop-shadow-md text-center">SOBRE NOSOTROS.</h1>
                    <p className="text-white font-bold text-sm leading-relaxed  drop-shadow-md text-center">
                    Somos parte del Grupo Inca, uno de los conglomerados empresariales más importantes de Perú, lo que nos permite estar totalmente integrados en toda la cadena productiva. Incalpaca, hoy conocida como Alpaca 111, se ha consolidado como líder en la industria y como una marca que lleva la esencia de la alpaca a todo el mundo.
                    Fundada en 1986 en el corazón de Arequipa, Alpaca 111 fue pionera en la creación y comercialización de prendas de alpaca, llevando consigo la tradición y la calidad de este noble material.
                    Hoy, Alpaca 111 es una marca con un legado de innovación que ha dado vida a prendas versátiles y atemporales. Con cada nueva colección, continuamos diseñando piezas que trascienden el tiempo, fusionando excelencia y funcionalidad en cada detalle.
                    </p>
                </div>
            </div>
            
            <article className="max-w-4xl mx-auto mt-16 px-6 text-gray-800 space-y-4">
                <h2 className="text-3xl font-bold text-center text-gray-900">Herencia</h2>
                <p className="text-base leading-relaxed text-justify">
                A principios de los años 80 se fundó Condor TIPS, que producía tejidos de alpaca de alta calidad. Dos años más tarde se funda Industrial Tumi Knits para producir suéteres principalmente de fibra de alpaca. 
                Luego de 20 años de experiencia en la producción de hilados y actividades de comercio exterior, Grupo Inca decidió fusionar estas dos últimas empresas. Así nació Incalpaca TPX en 1996. Incalpaca trabaja con las principales marcas de moda del mundo y exporta a más de 50 países en todo el mundo.
                </p>
                <>
                <div className="flex space-x-6 mt-8 justify-center">
                <ImagCard imageUrl={ImagC01} name="Francis Patthey"/>
                <ImagCard imageUrl={ImagC02} name=" Alejandro Olazábal Gómez"/>
                <ImagCard imageUrl={ImagC03} name="Comprometidos con la calidad" />
                </div>
                </>
            </article>

            <article className="max-w-4xl mx-auto mt-16 px-6 text-gray-800 space-y-5">
                <p className="text-base leading-relaxed text-center">
                Contamos con cinco líneas de producción: Accesorios, Línea de casa, Tejido de Punto, Confecciones y Telas. Proporcionando una amplia gama de productos y procesos a nuestros clientes.
                </p>
                <h2 className="text-2xl font-bold  drop-shadow-md text-center">
                Hoy, en un mundo preocupado por el medio ambiente y las condiciones de comercio justo, creemos que la sostenibilidad es el único camino.
                </h2>
                <div className="flex flex-col md:flex-row justify-center items-start gap-20 mt-12 px-6">
                    <div className="text-center max-w-md mx-auto space-y-4">
                        <h2 className="text-2xl font-bold drop-shadow-md">Nuestra visión</h2>
                        <p className="text-sm text-justify text-gray-800">
                        “Ser líder mundial en la confección y comercialización de prendas únicas de Alpaca y Vicuña, conectadas con diversas comunidades, dentro y fuera del país, que nos ayuden a promover una moda más justa, sustentable y verdaderamente peruana”.
                        </p>
                    </div>
                    <div className="text-center max-w-md mx-auto space-y-4">
                        <h2 className="text-2xl font-bold drop-shadow-md">Nuestra Misión</h2>
                        <p className="text-sm text-justify text-gray-800">
                        "Creamos productos únicos a partir de Alpaca y Vicuña, siempre ligados a historias, conceptos innovadores y utilizando procesos sustentables e integrados. A través de ellos, nos asociamos con empresas, marcas y diseñadores exigentes y sofisticados. Buscamos trascender en el tiempo para asegurar la continuidad de nuestros grupos de interés, especialmente los productores de estas fibras nobles."
                        </p>
                    </div>
                </div>
            </article>
        </section>

        <section>
            <article>
                <div className="bg-gray-100 py-12 px-6 text-center rounded-lg shadow-md max-w-8xl mx-auto mt-12">
                <h2 className="text-2xl font-bold text-gray-800 mb-2">NUESTRAS MARCAS</h2>
                <p className="text-base text-gray-700 leading-relaxed max-w-2xl mx-auto">
                Somos una empresa textil con más de 25 años de experiencia. Nuestra primera tienda Alpaca 111 nos convirtió en la primera cadena de productos de alpaca en el Perú. Nuestras ofertas incluyen abrigos lujosos, finos suéteres de alpaca y bufandas de alpaca de alta calidad.
                </p>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 ">
                    <div className="flex flex-col md:flex-row items-center md:items-center justify-center gap-12">
                    <div className="md:w-2/5">
                    <img  src= {ImagKuna} />
                    <p className="text-sm text-justify text-gray-800 max-w-2xl mx-auto">
                    <strong>Kuna</strong>, más que un nombre, es el encuentro de dos mundos diferentes: el pasado, a través de la inspiración en las expresiones estéticas de las antiguas culturas andinas, y el presente, a través de diseños exclusivos que se unen en un estilo único y cautivador.
                    Cada artículo de KUNA lleva la suavidad de la mejor fibra, resultado de una refinada selección de vicuña, guanaco, alpaca y llama. Siente las manos de los Andes.
                    </p>
                    </div>
                    <div className="md:w-1/4">
                    <img src= {ImagKuna2}  alt="Producto Kuna" className="w-full h-auto object-cover rounded"/>
                    </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6 ">
                    <div className="flex flex-col md:flex-row items-center md:items-center justify-center gap-15">
                    <div className="md:w-2/6">
                    <img src= {Imag222}  alt="Producto Alpaca11" className="w-full h-auto object-cover rounded"/>
                    </div>
                    <div className="md:w-1/4">
                    <img  src= {Imag111} className="h-30 w-auto object-contain mb-4" />
                    <p className="text-sm text-justify text-gray-800 max-w-2xl mx-auto">
                    <strong>ALPACA111</strong>, la mejor confección desde 1976. Cada detalle de nuestro proceso textil garantiza una incomparable suavidad, alta resistencia y gran finura de nuestras prendas y complementos.
                    </p>
                    </div>
                    </div>
                </div>

            </article>
        </section>

        </>
    );
}
export default Info;