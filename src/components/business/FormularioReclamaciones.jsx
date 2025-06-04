import { useState } from "react";
import { Form } from "react-router-dom";

const departamento = ["Amazonas", "Áncash", "Apurímac", "Arequipa", "Ayacucho", "Cajamarca", "Cusco", "Huancavelica", "Huánuco", "Ica", "Junín", 
    "La Libertad", "Lambayeque", "Lima", "Loreto", "Madre de Dios", "Moquegua", "Pasco", "Piura", "Puno", "San Martín", "Tacna", 
    "Tumbes", "Ucayali"];

const provinciaPorDepartamento = {"Amazonas": ["Chachapoyas", "Bagua", "Bongará", "Condorcanqui", "Luya", "Rodríguez de Mendoza", "Utcubamba"],
    "Áncash": ["Huaraz", "Aija", "Antonio Raymondi", "Asunción, Bolognesi", "Carhuaz, Carlos Fermín Fitzcarrald", "Casma", "Corongo", "Huari", "Huarmey", "Mariscal Luzuriaga", "Ocros", "Pallasca", "Pomabamba", "Recuay", "Santa", "Sihuas", "Yungay"],
    "Apurímac": ["Abancay", "Andahuaylas", "Antabamba", "Aymaraes", "Chincheros", "Grau", "Cotabambas", "Chincheros"],
    "Arequipa": ["Arequipa", "Caylloma", "Camaná", "Caravelí", "Castilla", "Condesuyos", "Islay", "La Unión"],
    "Ayacucho": ["Huamanga", "Cangallo", "Huanca Sancos", "Víctor Fajardo", "Huanta", " La Mar", "Lucanas", "Parinacochas", "Paucar del Sara Sara", "Sucre", "Vilcashuamán"],
    "Cajamarca": ["Cajamarca", "Celendín", "Chota", "Contumazá", "Cutervo", "Hualgayoc", "Jaén", "San Ignacio", "San Marcos", "San Miguel", "San Pablo", "San Ramón", "Santa Cruz"],
    "Cusco": ["Cusco", "Acomayo", "Anta", "Calca", "Canas", "Chumbivilcas", "Espinar", "La Convención", "Paruro", "Paucartambo", "Quispicanchi", "Urubamba"],
    "Huancavelica": ["Huancavelica", "Acobamba", "Angaraes", "Castrovirreyna", "Churcampa", "Huaytará", "Tayacaja"],
    "Huánuco": ["Huánuco", "Ambo", "Dos de Mayo", "Huacaybamba", "Huamalíes", "Leoncio Prado", "Marañón", "Pachitea", "Puerto Inca", "Yarowilca"],
    "Ica": ["Ica", "Chincha", "Nazca", "Palpa", "Pisco"],
    "Junín": ["Junín", "Chanchamayo", "Chupaca", "Concepción", "Jauja", "Satipo", "Tarma", "Yauli"],
    "La Libertad": ["Trujillo", "Ascope", "Bolívar", "Chepén", "Gran Chimú", "Julcán", "Otuzco", "Pataz", "Sánchez Carrión", "Santiago de Chuco","Virú"],
    "Lambayeque": ["Chiclayo", "Ferreñafe", "Lambayeque"],
    "Lima": ["Lima", "Barranca", "Cajatambo", "Canta", "Cañete", "Huaral", "Huarochirí", "Huaura", "Oyón", "Yauyos"],
    "Loreto": ["Maynas", "Alto Amazonas", "Loreto", "Requena", "Ucayali", "Ramón Castilla", "Datem del Marañón", "Putumayo", "Mariscal Ramón Castilla"],
    "Madre de Dios": ["Tambopata", "Manu", "Tahuamanu"],
    "Moquegua": ["Mariscal Nieto", "General Sánchez Cerro", "Ilo"],
    "Pasco": ["Pasco", "Daniel Alcides Carrión", "Oxapampa"],
    "Piura": ["Piura", "Ayabaca", "Huancabamba", "Morropón", "Paita", "Sullana", "Talara", "Sechura"],
    "Puno": ["Puno", "Azángaro", "Carabaya", "Chucuito", "El Collao", "Huancané", "Lampa", "Melgar", "Moho", "San Antonio de Putina", "San Román", "Sandia", "Yunguyo"],
    "San Martín": ["Moyobamba", "Bellavista", "El Dorado", "Huallaga", "Lamas", "Mariscal Cáceres", "Picota", "Rioja", "San Martín", "Tocache"],
    "Tacna": ["Tacna", "Candarave", "Jorge Basadre", "Tarata"],
    "Tumbes": ["Tumbes", "Contralmirante Villar", "Zarumilla"],
    "Ucayali": ["Coronel Portillo", "Atalaya", "Padre Abad", "Purús"],
};

const tienda = ["Kuna Perú", "remate.incalpacastores.com", "Ikuna.pe", "Incalpaca.com","Kuna WorldWide", "Kuna Chile", "Kuna USA"];

function FormularioReclamaciones (){
    const [departamentoSeleccionado, setDepartamentoSeleccionado] = useState("");
    const [provincia, setProvincia] = useState([]);

    const handleDepartamentoChange  = (e) => {
        const dep = e.target.value;
        setDepartamentoSeleccionado(dep);
        setProvincia(provinciaPorDepartamento[dep] || []);
    };
    const [tipoRespuesta, setTipoRespuesta] = useState("");
    return (
        <section>
            <div className="max-w-4xl w-full mx-auto space-y-4 text-center">
                <h1 className="text-2xl font-bold text-black drop-shadow-md text-center">Libro de Reclamaciones</h1>
                <p className="text-black font-bold text-sm leading-relaxed text-center">
                    "Tu opinión es importante para nosotros. Si tienes alguna queja, reclamo o sugerencia, por favor completa este formulario. Estamos comprometidos a mejorar y darte la atención que mereces."
                </p>
            </div>

            <div className="md:w-1/2 mx-auto mt-10 p-8 bg-gray-100 rounded-lg shadow">
            <h2 className="text-black font-bold text-sm leading-relaxed text-center">Datos de la persona que presenta el reclamo</h2>
            <form method="post" className="w-full max-w-md space-y-4 mx-auto">
                <div>
                    <label htmlFor="tipoDocumento" className="block text-gray-800 font-semibold mb-1">Tipo de Documento:</label>
                    <select name="tipoDocumento" id="tipoDocumento" className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black">
                        <option value="" disabled selected>Selecciona el tio de documento</option>
                        <option value="DNI">DNI</option>
                        <option value="C.E.">C.E.</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="numeroDocumento" className="block text-gray-800 font-semibold mb-1">Nª de Documento:</label>
                    <input type="number" name="numeroDocumento" id="numeroDocumento" placeholder="12345678" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"/>
                </div>

                <div>
                    <label htmlFor="nombres" className="block text-gray-800 font-semibold mb-1">Nombres:</label>
                    <input type="text" name="nombres" id="nombres" placeholder="Luis Alberto" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"/>
                </div>

                <div>
                    <label htmlFor="apellidos" className="block text-gray-800 font-semibold mb-1">Apellidos:</label>
                    <input type="text" name="apellidos" id="apellidos" placeholder="Flores Quispe" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"/>
                </div>

                <div>
                    <label htmlFor="tipoRespuesta" className="block text-gray-800 font-semibold mb-1">Tipo de respuesta:</label>
                    <select name="tipoRespuesta" id="tipoRespuesta" value={tipoRespuesta} onChange={(e) => setTipoRespuesta(e.target.value)} className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black">
                        <option value="" disabled selected>Seleccione el tipo de respuesta</option>
                        <option value="correo">Correo Electrónico</option>
                        <option value="dirección">Dirección Domiciliaria</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="direccion" className="block text-gray-800 font-semibold mb-1">Dirección:</label>
                    <input type="text" name="direccion" id="direccion" placeholder="Calle 17, nº 455, Urbanización Corpac" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"/>
                </div>

                {tipoRespuesta === "dirección" && (
                    <div>
                        <label htmlFor="referencia" className="block text-gray-800 font-semibold mb-1">Referencia de la ubicación:</label>
                        <input type="text" name="referencia" id="referencia" placeholder="Ej. Frente al parque, cerca al grifo..." required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"/>
                    </div>
                )}

                <div>
                    <label htmlFor="departamento" className="block text-gray-800 font-semibold mb-1">Departamento:</label>
                    <select name="departamento" id="departamento" required value={departamentoSeleccionado} onChange={handleDepartamentoChange} className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black">
                        <option value="" disabled selected>Seleccione un departamento</option>
                        {departamento.map((dep, index) =>(
                            <option key = {index} value={dep}>{dep}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="provincia" className="block text-gray-800 font-semibold mb-1">Provincia:</label>
                    <select name="provincia" id="provincia" required className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black" disabled={!provincia.length}>
                        <option value="" disabled selected>Seleccione una provincia</option>
                        {provincia.map((prov, index) =>(
                            <option key={index} value={prov}>{prov}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="teléfono" className="block text-gray-800 font-semibold mb-1">Teléfono:</label>
                    <input type="text" name="teléfono" id="teléfono" placeholder="123456789" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"/>
                </div>

                <div>
                    <label htmlFor="correo" className="block text-gray-800 font-semibold mb-1">Correo Electrónico:</label>
                    <input type="email" name="correo" id="correo" placeholder="email@ejemplo.com" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"/>
                </div>

                <h2 className="text-black font-bold text-sm leading-relaxed text-center">Información general</h2>
                <div>
                    <label htmlFor="tiendo" className="block text-gray-800 font-semibold mb-1" >Tienda Online:</label>
                    <select name="tienda" id="tienda" required className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black">
                        <option value="" disabled selected>Seleccione una opción</option>
                        {tienda.map((tien, index) =>(
                            <option key={index} value={tien}>{tien} </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label htmlFor="bienContratado" className="block text-gray-800 font-semibold mb-1">Identificación del bien contratado</label>
                    <select name="bienContratado" id="bienContratado" className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black">
                        <option value="" disabled selected>Seleccione una opción</option>
                        <option value="producto">Producto</option>
                        <option value="servicio">Servicio</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="montoReclamo" className="block text-gray-800 font-semibold mb-1">Monto reclamado en soles</label>
                    <input type="number" name="montoReclamo" id="montoReclamo" placeholder="S/ 100" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"/>
                </div>

                <div>
                    <label htmlFor="descripcion" className="block text-gray-800 font-semibold mb-1">Descripción ( Nombre del producto o servicio):</label>
                    <textarea name="descripcion" id="descripcion" rows="4" placeholder="Escribe tu pregunta aquí..." required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"></textarea>
                </div>

                <h2 className="text-black font-bold text-sm leading-relaxed text-center">Detalle de la reclamación</h2>

                <div>
                    <label htmlFor="motivo" className="block text-gray-800 font-semibold mb-1">Motivo:</label>
                    <select name="motivo" id="motivo" required className="w-full px-4 py-2 border rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black">
                        <option value="" disabled selected>Seleccione una opción</option>
                        <option value="queja">Queja / Servicio: Descontento respecto a la atención al público</option>
                        <option value="reclamo">Reclamo / Producto: Disconformidad relacionada a los productos o servicios</option>
                    </select>
                </div>

                <div>
                    <label htmlFor="numeroComprobante" lassName="block text-gray-800 font-semibold mb-1">Número de comprobante o pedido:</label>
                    <input type="text" name="numeroComprobante" id="numeroComprobante" placeholder="FAC-2025-000123" required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"/>
                </div>

                <div>
                    <label htmlFor="detallesReclamo" className="block text-gray-800 font-semibold mb-1">Detalles del reclamo:</label>
                    <textarea name="detallesReclamo" id="detallesReclamo" rows="4" placeholder="Escribe tu reclamo aquí..." required className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"></textarea>
                </div>

                <p className="text-sm text-justify text-gray-800">He leído y acepto la <span className="text-blue-600">política de Privacidad y Autorización Datos Personales</span> como usuario de Libro de Reclamaciones.
                De acuerdo a las disposiciones del libro de reclamaciones y normas del Código de Protección y Defensa del Consumidor, el libro de reclamaciones virtual podrá ser usado por los consumidores para presentar sus quejas y reclamos. 
                La formulación del reclamo no impide acudir a otras vías de solución de controversias ni es requisito para interponer una denuncia ante el INDECOPI. 
                El proveedor debe dar respuesta al reclamo o queja en un plazo no mayor a quince (15) días hábiles, el cuál es improrrogable.
                </p>

                <button type="submit" className="w-full bg-gray-400 text-white py-2 rounded-lg hover:bg-gray-600 transition-colors">Enviar</button>
            </form>
            </div>
        </section>
    )
}
export default FormularioReclamaciones;