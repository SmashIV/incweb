import { Section } from "lucide-react";

function LeyPoliticaEnvio(){
    return(
        <main>
            <section className="max-w-4xl w-full mx-auto space-y-4 text-center">
                <h1 className="text-3xl font-bold text-black drop-shadow-md text-center">Política de envío</h1>
            </section>

            <section className="max-w-4xl mx-auto mt-16 px-6 text-gray-800 space-y-4">
                <section>
                    <h2 className="text-xl font-bold drop-shadow-md">ENVIO DE PEDIDOS REALIZADOS EN LA PAGINA WEB:</h2>
                    <p className="text-base leading-relaxed text-justify">Para que el envío del pedido realizado en la tienda online se lleve a cabo exitosamente, es decir, de manera adecuada y oportuna, el cliente deberá consignar la información correcta al momento de ejecutar la Orden de Compra.
                    El registro de datos erróneos o incompletos que ocasione un procesamiento indebido de la misma será de exclusiva responsabilidad del cliente. Ello podría devenir incluso en una cancelación de la orden si así lo considera pertinente la Empresa.
                    El plazo de entrega del pedido se contabiliza desde que se valida la confirmación el pago de la Orden de Compra. La extensión de dicho plazo dependerá principalmente de la dirección de entrega.
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold drop-shadow-md">Costo:</h2>
                    <ul>
                        <li> <strong>Retiro en tienda:</strong> Gratis.</li>
                        <li> <strong>Envío a domicilio: </strong>Lima(S/15.00), Provincia(S/25.00), Envío express(S/ 30.00 )</li>
                    </ul>
                </section>

                <section>
                    <h2 className="text-xl font-bold drop-shadow-md">Tiempo promedio de entrega:</h2>
                    <h3 className=" font-bold drop-shadow-md">"Envío a domicilio"</h3>
                    <ul>
                        <li><strong>Express Lima metropolitana:</strong> 5 hrs después de la 1 p.m. (De lunes a viernes si pide antes de la 1 p.m.</li>
                        <li><strong>Lima metropolitana:</strong> 1 día hábil (Entregas L-V de 01:00 pm a 07:00 pm y S de 10:00 am a 06:00 pm)</li>
                        <li><strong>Lima provincia: </strong> 3 días hábiles.</li>
                        <li><strong>Arequipa ciudad: </strong> Arequipa ciudad: Hasta 5 días hábiles.</li>
                        <li><strong>Demás capitales de provincia: </strong> Hasta 5 días hábiles.</li>
                    </ul>
                    <h3 className=" font-bold drop-shadow-md">"Retiro en tienda"</h3>
                    <p><strong>Retiro en tienda Alpaca:</strong>Hasta 3 días hábiles. </p>
                </section>

                <section>
                    <p>Puede haber costos y tiempos de entrega adicionales para envíos a ciudades y distritos alejados. Consultar previamente a la línea de atención 994 056 860 o al correo incalpacastores@incalpaca.com. El pedido deberá ser recibido por una mayor de edad, el cual se identificará con su Nombre Completo y Documento Nacional de Identidad (DNI) en físico y firmará el cargo de recepción para acreditar la conformidad de entrega.</p>
                </section>
            </section>
        </main>
    );
}
export default LeyPoliticaEnvio;