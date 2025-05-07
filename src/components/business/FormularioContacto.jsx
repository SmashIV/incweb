import ImagFormulaC from "../../assets/ImagFormularioContact.webp";
function FormularioContacto (){
    return (
    <section>
        <div className="flex flex-col md:flex-row w-full min-h-screen">
        <div className="md:w-1/2 relative flex items-center justify-center">
            <img src={ImagFormulaC} alt="Fondo de contacto" className="w-full h-full object-cover"/>
            <div className="absolute z-10 text-center px-4">
            <h2 className="text-2xl font-bold text-white drop-shadow-md mb-4">¿TIENES ALGUNA PREGUNTA?</h2>
            <p className="text-sm text-white leading-relaxed drop-shadow-md max-w-md">
                Estaremos encantados de ayudarte y brindarte toda la información que necesites.
            </p>
            </div>
        </div>

        <div className="md:w-1/2 flex justify-center items-center p-8 bg-gray-100">
            <form method="post" className="w-full max-w-md space-y-4">
                <div>
                    <label  htmlFor="nombre" className="block text-gray-800 font-semibold mb-1">Nombre:</label>
                    <input type="text" name="nombre" id="nombre" placeholder="Ingresa tu nombre" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"/>
                </div>

                <div>
                    <label  htmlFor="correo" className="block text-gray-800 font-semibold mb-1">Correo Electrónico:</label>
                    <input type="email" name="correo" id="correo" placeholder="tuemail@ejemplo.com" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div>
                    <label  htmlFor="teléfono" className="block text-gray-800 font-semibold mb-1">Teléfono:</label>
                    <input type="tel" name="teléfono" id="teléfono" placeholder="tu teléfono" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"/>
                </div>

                <div>
                    <label  htmlFor="ciudad" className="block text-gray-800 font-semibold mb-1">Ciudad:</label>
                    <input type="text" name="ciudad" id="ciudad" placeholder="Escriba su ciudad" className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"/>
                </div>

                <div>
                    <label  htmlFor="tipoConsulta" className="block text-gray-800 font-semibold mb-1">Tipo de consulta:</label>
                    <select name="tipoConsulta" id="tipoConsulta" className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black">
                        <option value=""disabled selected>Selecciona el tipo de consulta</option>
                        <option value="ConsultaGaneral">Consulta General</option>
                        <option value="productos">Consulta sobre Productos</option>
                        <option value="envio">Consulta sobre Envíos</option>
                        <option value="otros">Otros</option>
                    </select>
                </div>

                <div>
                    <label  htmlFor="pregunta" className="block text-gray-800 font-semibold mb-1">Tu pregunta:</label>
                    <textarea name="pregunta" id="pregunta" rows="4" placeholder="Escribe tu pregunta aquí..." required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"></textarea>
                </div>

                <button type="submit" className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">Enviar</button>
            </form>
        </div>
        </div>
    </section>
    );
}
export default FormularioContacto; 