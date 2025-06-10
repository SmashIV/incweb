import { useEffect, useRef } from 'react';

function InforTerminoCondiciones() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        let animationFrameId;
        let time = 0;

        const resizeCanvas = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };

        const drawAbstractArt = () => {
            const width = canvas.width;
            const height = canvas.height;
            
            ctx.clearRect(0, 0, width, height);
            
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
            ctx.lineWidth = 1.5;

            for (let i = 0; i < 5; i++) {
                const y = height * (0.2 + i * 0.15);
                ctx.beginPath();
                ctx.moveTo(0, y + Math.sin(time + i) * 15);
                ctx.lineTo(width, y + Math.sin(time + i + width/100) * 15);
                ctx.stroke();
            }

            for (let i = 0; i < 3; i++) {
                const x = width * (0.2 + i * 0.3);
                const y = height * 0.5;
                const radius = 60 + Math.sin(time + i) * 15;
                
                ctx.beginPath();
                ctx.arc(x, y, radius, 0, Math.PI * 2);
                ctx.stroke();
            }

            time += 0.01;
            animationFrameId = requestAnimationFrame(drawAbstractArt);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        drawAbstractArt();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="min-h-screen bg-white">
            <div className="fixed inset-0 pointer-events-none">
                <canvas
                    ref={canvasRef}
                    className="w-full h-full"
                />
            </div>

            <main className="relative">
                <div className="max-w-5xl mx-auto px-6 py-16">
                    <div className="flex justify-center mb-12">
                        <div className="w-32 h-1 bg-gray-900 transform rotate-45"></div>
                        <div className="w-32 h-1 bg-gray-900 transform -rotate-45"></div>
                    </div>

                    <h1 className="text-5xl font-bold text-gray-900 mb-16 text-center tracking-wider">
                        <span className="inline-block transform hover:rotate-2 transition-transform duration-300">
                            Términos
                        </span>
                        <span className="inline-block mx-4 text-gray-400">&</span>
                        <span className="inline-block transform hover:-rotate-2 transition-transform duration-300">
                            Condiciones
                        </span>
                    </h1>

                    <div className="space-y-12 text-gray-700">
                        <section className="relative group">
                            <div className="absolute -left-4 top-0 w-1 h-full bg-gray-200 transform group-hover:scale-y-110 transition-transform duration-300"></div>
                            <div className="pl-8">
                                <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide">
                                    <span className="font-bold">PRIMERO -</span> GENERALIDADES
                                </h2>
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 w-8 h-8 border-2 border-gray-200 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                                    <p className="leading-relaxed text-lg">
                                        El presente documento contiene los términos y condiciones de uso (en adelante "TCU"), los cuales serán aplicables a los actos celebrados y acciones ejecutadas a través de, o en relación directa o indirecta con, el portal web de propiedad de Incalpaca TPX con RUC Nº 20100226813 (en adelante "INCALPACA"), que opera con el nombre de dominio https://alpaca111.com y sus derivados relacionados (en adelante "El Sitio"). Los TCU contenidos en el presente instrumento, se aplicarán especialmente a los siguientes actos y acciones: (i) La compra y venta de los Productos a través de "El Sitio"; (ii) El acceso y uso de El Sitio de cualquier forma y para cualquier efecto previamente autorizado por INCALPACA, salvo acuerdo expreso en contrario que conste por escrito; (iii) El acceso y uso de otros espacios relacionados que se formen en asociación o con ocasión a El Sitio, tales como chats, foros, páginas, entre otros. Las personas naturales o jurídicas debidamente representadas, (en adelante "el Usuario" o "el Comprador") que deseen comprar los productos de El Sitio, podrán hacerlo siempre y cuando se registren y acepten los TCU contenidas en este documento, así como también las demás políticas y principios que rigen El Sitio y que son incorporados al presente documento. Los TCU son vinculantes y obligatorios. En caso de que los TCU no sean aceptados, quedará prohibido a la persona de que se trate hacer uso de El Sitio. La prohibición indicada será de carácter absoluto y se referirá al uso directo o indirecto y para cualquier fin, incluyendo el acceso a El Sitio, la compra de los productos ofrecidos a través del mismo y de sus portales relacionados, el acceso a la información publicada en El Sitio, etc.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="relative group">
                            <div className="absolute -left-4 top-0 w-1 h-full bg-gray-200 transform group-hover:scale-y-110 transition-transform duration-300"></div>
                            <div className="pl-8">
                                <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide">
                                    <span className="font-bold">SEGUNDO -</span> ACEPTACIÓN
                                </h2>
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 w-8 h-8 border-2 border-gray-200 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                                    <p className="leading-relaxed text-lg">
                                        El acceso, uso, registro y descarga de información contenida en El Sitio implica la aceptación completa y sin reserva por parte de los Usuarios de los TCU.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="relative group">
                            <div className="absolute -left-4 top-0 w-1 h-full bg-gray-200 transform group-hover:scale-y-110 transition-transform duration-300"></div>
                            <div className="pl-8">
                                <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide">
                                    <span className="font-bold">TERCERO -</span> MODIFICACIÓN
                                </h2>
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 w-8 h-8 border-2 border-gray-200 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                                    <p className="leading-relaxed text-lg">
                                        Uno de los Servicios ofrecidos en El Sitio, es la oferta de venta al público en general de Productos "Prendas de vestir y accesorios similares. Estolas, Chalinas, Gorras, billeteras, carteras, mochilas, bolsos, entre otros productos similares". Este Servicio se denominará, en adelante, la "Oferta".
                                    </p>
                                </div>
                            </div>
                        </section>

                        <div className="flex justify-center my-16">
                            <div className="w-24 h-24 border-2 border-gray-200 rounded-full transform rotate-45"></div>
                        </div>

                        <section className="relative group">
                            <div className="absolute -left-4 top-0 w-1 h-full bg-gray-200 transform group-hover:scale-y-110 transition-transform duration-300"></div>
                            <div className="pl-8">
                                <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide">
                                    <span className="font-bold">CUARTO -</span> CAPACIDAD
                                </h2>
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 w-8 h-8 border-2 border-gray-200 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                                    <p className="leading-relaxed text-lg">
                                        En este acto, INCALPACA se reserva el derecho de modificar los TCU, las políticas y condiciones de uso relacionadas al uso y destino de El Sitio. INCALPACA podrá modificar los Términos y Condiciones en cualquier momento, haciendo público ello en El Sitio. Todos los términos modificados entrarán en vigor desde la fecha de su publicación en El Sitio.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="relative group">
                            <div className="absolute -left-4 top-0 w-1 h-full bg-gray-200 transform group-hover:scale-y-110 transition-transform duration-300"></div>
                            <div className="pl-8">
                                <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide">
                                    <span className="font-bold">QUINTO -</span> LA OFERTA
                                </h2>
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 w-8 h-8 border-2 border-gray-200 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                                    <p className="leading-relaxed text-lg">
                                        INCALPACA, a través de El Sitio, ofrecerá a la venta los Productos, según las condiciones y procedimientos que se expresan a continuación: a) Durante el o los días que el aviso se encuentre publicado en El Sitio, los Compradores y/o Usuarios podrán efectuar órdenes de compra online, garantizando el pago de estos a través de una tarjeta de crédito bancaria, tarjeta de débito o cualquier otra forma que, a juicio de INCALPACA, ofrezca garantía suficiente de pago según se defina expresamente en El Sitio; b) Las Ofertas incluirán los parámetros, detalles y condiciones específicas de los Productos; c) Las Ofertas tendrán una cantidad determinada y stock para su compra. Las Ofertas serán válidas exclusivamente dentro del territorio de Perú. Las fotografías e imágenes de los Productos, entre otros, son meramente referenciales.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="relative group">
                            <div className="absolute -left-4 top-0 w-1 h-full bg-gray-200 transform group-hover:scale-y-110 transition-transform duration-300"></div>
                            <div className="pl-8">
                                <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide">
                                    <span className="font-bold">SEXTO -</span> REGISTRO
                                </h2>
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 w-8 h-8 border-2 border-gray-200 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                                    <p className="leading-relaxed text-lg">
                                        El Usuario interesado podrá aceptar la Oferta y adquirirla, siempre y cuando se encuentre previamente registrado en El Sitio, para lo cual se hace obligatorio que todos los datos proporcionados en el formulario de El Sitio sean válidos, veraces y actuales. El Usuario se obliga a actualizar de manera oportuna los datos proporcionados y registrados en El Sitio, para ajustarlos a las modificaciones que ocurran con el tiempo. INCALPACA no se hace responsable por la certeza de los datos proporcionados por los Compradores y/o Usuarios de El Sitio. Los Usuarios se hacen responsables, en todos los casos, de la veracidad, exactitud, vigencia y autenticidad de los datos. INCALPACA se reserva el derecho de solicitar comprobantes, respaldos y/o información adicional, a efectos de corroborar los Datos Personales y de envío, así como de suspender temporal o definitivamente a aquellos Usuarios cuyos datos no hayan podido ser confirmados. En estos casos de inhabilitación, se imposibilitará al Usuario realizar Ofertas, sin que ello genere derecho a algún resarcimiento. La información personal que el Usuario le proporcione a INCALPACA estará asegurada por una clave de acceso, de la cual solo el Usuario tendrá conocimiento. El Usuario es el único responsable de mantener en secreto la Clave. El Usuario se compromete a notificar a la Empresa en forma inmediata y por medio idóneo y fehaciente, cualquier uso no autorizado de su cuenta. La Cuenta es personal, única e intransferible, y está prohibido que un mismo Usuario registre o posea más de una cuenta. En caso que INCALPACA detecte distintas Cuentas que contengan datos coincidentes o relacionados, podrá cancelar, suspender o inhabilitarlas
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="relative group">
                            <div className="absolute -left-4 top-0 w-1 h-full bg-gray-200 transform group-hover:scale-y-110 transition-transform duration-300"></div>
                            <div className="pl-8">
                                <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide">
                                    <span className="font-bold">SÉPTIMO -</span> PRECIO
                                </h2>
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 w-8 h-8 border-2 border-gray-200 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                                    <p className="leading-relaxed text-lg">
                                        El precio del producto se publicará en la Oferta en El Sitio, con IGV incluido.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="relative group">
                            <div className="absolute -left-4 top-0 w-1 h-full bg-gray-200 transform group-hover:scale-y-110 transition-transform duration-300"></div>
                            <div className="pl-8">
                                <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide">
                                    <span className="font-bold">OCTAVO -</span> PAGO
                                </h2>
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 w-8 h-8 border-2 border-gray-200 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                                    <p className="leading-relaxed text-lg">
                                        El Usuario realizará el pago mediante tarjetas de crédito o débito, transferencias bancarias, o depósitos en agencias bancarias o agentes autorizados por El Sitio y que se tenga como entidad financiera emisora a un establecimiento de crédito peruano autorizado por la Superintendencia de Bancos e Instituciones Financieras. Para el efecto, el Usuario deberá informar la fecha de caducidad de la tarjeta, los tres (3) dígitos de seguridad, así como el nombre del titular de la misma, en el momento que realiza el pedido y/o aceptación de la Oferta en cuestión. El comprobante de compra del producto estará disponible y se podrá visualizar en El Sitio Web. Para evitar cualquier fraude, el Usuario deberá notificar a INCALPACA cualquier movimiento fraudulento en la tarjeta utilizada para la compra de la Oferta, mediante e-mail o vía telefónica, en el menor plazo de tiempo posible para que INCALPACA pueda realizar las gestiones oportunas. De existir algún fraude bancario, INCALPACA  no será responsable por el monto de la transacción. No obstante, realizará las coordinaciones y todo lo que se encuentre a su alcance entre el cliente, la pasarela de pagos e incluso con los bancos para resolver cualquier problema financiero.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="relative group">
                            <div className="absolute -left-4 top-0 w-1 h-full bg-gray-200 transform group-hover:scale-y-110 transition-transform duration-300"></div>
                            <div className="pl-8">
                                <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide">
                                    <span className="font-bold">NOVENO -</span> EL SERVICIO
                                </h2>
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 w-8 h-8 border-2 border-gray-200 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                                    <p className="leading-relaxed text-lg">
                                        INCALPACA solo vende prendas de vestir. Este Servicio se denominará, en adelante, la "Oferta" que el Usuario puede comprar de acuerdo a los TCU. El proceso de compra del producto es bajo el siguiente procedimiento:
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="relative group">
                            <div className="absolute -left-4 top-0 w-1 h-full bg-gray-200 transform group-hover:scale-y-110 transition-transform duration-300"></div>
                            <div className="pl-8">
                                <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide">
                                    <span className="font-bold">DÉCIMO -</span> RESPONSABILIDAD
                                </h2>
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 w-8 h-8 border-2 border-gray-200 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                                    <p className="leading-relaxed text-lg">
                                        En ningún caso INCALPACA responderá por: i) la utilización indebida que Usuarios o visitantes de El Sitio puedan hacer de los materiales exhibidos, de los derechos de propiedad industrial y de los derechos de propiedad intelectual. ii) de los daños o eventuales daños y perjuicios que se le puedan causar a los Compradores y/o Usuarios por el funcionamiento de las herramientas de búsqueda y de los errores que se generen por los elementos técnicos de El Sitio o motor de búsqueda. iii) de los contenidos de las páginas a las que los Compradores o Usuarios puedan acceder con o sin autorización de INCALPACA. iv) del acceso de menores de edad o personas sin capacidad, bajo los términos de la legislación correspondiente, a los contenidos adherentes a la relación contractual que surja de El Sitio. v) INCALPACA en ningún caso se hará responsable de la pérdida, mal uso o uso no autorizado de su código de validación, ya sea por parte del Usuario y/o Comprador(es) o de terceros, luego de realizada la compra en la forma expresada en los TCU. Asimismo, las partes reconocen y dejan constancia de que la plataforma computacional proporcionada por INCALPACA no es infalible, y por tanto, durante la vigencia del presente Contrato pueden verificarse circunstancias ajenas a la voluntad de INCALPACA, que impliquen que El Sitio o la plataforma computacional no se encuentren operativos durante un determinado periodo de tiempo. En tales casos, INCALPACA procurará restablecer El Sitio y el sistema computacional con la mayor celeridad posible, sin que por ello pueda imputársele algún tipo de responsabilidad. INCALPACA no garantiza la disponibilidad y continuidad del funcionamiento de El Sitio y tampoco que, en cualquier momento y tiempo, los Usuarios puedan acceder a las Ofertas de El Sitio. INCALPACA no se hace responsable por los virus ni otros elementos en el contenido de El Sitio que puedan producir alteraciones en el sistema informático del Usuario o en los documentos electrónicos almacenados en los sistemas informáticos de los Usuarios. INCALPACA no responderá de los perjuicios ocasionados al Cliente, provenientes del uso inadecuado de las tecnologías puestas a disposición de éste, cualquiera sea la forma en la cual se utilicen inadecuadamente estas tecnologías. INCALPACA no responderá de los daños producidos a El Sitio por el uso indebido y de mala fe de los Usuarios y/o Compradores. En todo caso, la responsabilidad de INCALPACA, contractual, extracontractual o legal, con los Usuarios, Compradores o visitantes de El Sitio, no excederá del precio efectivamente pagado por el Comprador en contraprestación por el Producto.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="relative group">
                            <div className="absolute -left-4 top-0 w-1 h-full bg-gray-200 transform group-hover:scale-y-110 transition-transform duration-300"></div>
                            <div className="pl-8">
                                <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide">
                                    <span className="font-bold">DECIMOPRIMERO -</span> POLÍTICAS DE ENVÍO
                                </h2>
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 w-8 h-8 border-2 border-gray-200 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                                    <p className="leading-relaxed text-lg">
                                        ENVÍO GRATIS POR COMPRAS MAYORES A S/ 399.00. Para que el envío del pedido realizado en la tienda online de INCALPACA se lleve a cabo exitosamente, es decir, de manera adecuada y oportuna, el cliente deberá consignar la información correcta al momento de ejecutar la Orden de Compra.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="relative group">
                            <div className="absolute -left-4 top-0 w-1 h-full bg-gray-200 transform group-hover:scale-y-110 transition-transform duration-300"></div>
                            <div className="pl-8">
                                <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide">
                                    <span className="font-bold">DECIMOSEGUNDO -</span> DEVOLUCIONES O CAMBIOS DEL PRODUCTO
                                </h2>
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 w-8 h-8 border-2 border-gray-200 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                                    <p className="leading-relaxed text-lg">
                                        En INCALPACA, estamos comprometidos con la plena satisfacción de nuestros clientes durante toda su experiencia de compra. Por ello, garantizamos que si el cliente no está satisfecho con su adquisición, podrá realizar un cambio o devolución sin inconvenientes.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="relative group">
                            <div className="absolute -left-4 top-0 w-1 h-full bg-gray-200 transform group-hover:scale-y-110 transition-transform duration-300"></div>
                            <div className="pl-8">
                                <h2 className="text-3xl font-light text-gray-900 mb-6 tracking-wide">
                                    <span className="font-bold">DECIMOQUINTO -</span> DATOS PERSONALES
                                </h2>
                                <div className="relative">
                                    <div className="absolute -left-4 top-0 w-8 h-8 border-2 border-gray-200 rounded-full transform group-hover:scale-110 transition-transform duration-300"></div>
                                    <p className="leading-relaxed text-lg">
                                        Los Usuarios y/o Compradores garantizan que la información que suministran para la compra del producto es veraz, completa, exacta, actualizada y probable. En concordancia con la Ley 29733, se establece lo siguiente: Los datos que suministren en El Sitio formarán parte de la base de datos de INCALPACA y serán destinados para los fines del contrato; responder sus consultas, contacto, etc. INCALPACA presume que los datos han sido incorporados por su titular o por persona autorizada por éste, así como que son correctos y exactos. Los Usuarios y/o Compradores, con la aceptación de los presentes TCU, manifiestan que los datos de carácter personal que aporten a través de los formularios online en la página web de INCALPACA pueden ser utilizados para Ofertas posteriores y distintas a las ofrecidas en El Sitio. INCALPACA se compromete a no usar los datos personales brindados por los usuarios para fines diferentes a los de la compra y venta de productos y servicios online, respetando en todo momento la Ley No. 29733 – Ley de Protección de Datos Personales y su reglamento. Todo usuario que ingrese sus datos en la página web de INCALPACA está brindando su consentimiento expreso e inequívoco para que se utilicen sus datos en el intercambio comercial que se realice a través de la web de INCALPACA.
                                    </p>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="flex justify-center mt-16">
                        <div className="w-32 h-1 bg-gray-900 transform -rotate-45"></div>
                        <div className="w-32 h-1 bg-gray-900 transform rotate-45"></div>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default InforTerminoCondiciones;