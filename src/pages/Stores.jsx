import { useState } from 'react';
import StoreCard from '../components/stores/StoreCard';

function Stores() {
  const [filtro, setFiltro] = useState('todos');

  const stores = {
    lima: [
      {
        id: 1,
        title: "Lima - ALPACA 111 BENAVIDES",
        address: "Av. Benavides Nro. 1131, Lima , Miraflores, Lima, Lima",
        schedule: "Lunes a sábado de 10:00 am a 8:00 pm | Domingo de 10:00 am a 7:00 pm",
        contact: "994 185121 / benavides@incalpaca.com",
        mapUrl: "https://www.google.com/maps/place/Incalpaca+-+Av.+Benavides,+Miraflores+-+Lima/@-12.1262574,-77.0223851,17.75z/data=!4m6!3m5!1s0x9105c8033f43aef7:0x66b12b273fad85d9!8m2!3d-12.1256644!4d-77.0207447!16s%2Fg%2F11dx9fy61w?entry=tts"
      },
      {
        id: 2,
        title: "Lima - ALPACA 111 LARCO",
        address: "Av. Larco 671-A, Miraflores, Lima, Lima",
        schedule: "Lunes a sábado de 10:00 am a 8:00 pm | Domingo de 10:00 am a 7:00 pm",
        contact: "922 597607 / larcoincalpaca@incalpaca.com",
        mapUrl: "https://www.google.com/maps/place/INCALPACA+TPX/@-12.1240649,-77.0317638,17z/data=!3m1!4b1!4m6!3m5!1s0x9105c90fe0dcb0d9:0xd4eba85104fe32d6!8m2!3d-12.1240702!4d-77.0291889!16s%2Fg%2F11pdqwx0y4?entry=tts"
      },
      {
        id: 3,
        title: "Lima - ALPACA 111 JOCKEY PLAZA",
        address: "Av. Javier Prado Este Nro. 4200 Int. NCL (CC Jockey Plaza - Local NCL255), Santiago de Surco, Lima, Lima",
        schedule: "Lunes a sábado de 10:00 am a 10:00 pm | Domingo de 10:00 am a 10:00 pm",
        contact: "994-056856 / jockeyplaza@incalpaca.com",
        mapUrl: "https://www.google.com/maps/place/Jockey+Plaza/@-12.0853491,-76.9811377,17z/data=!4m6!3m5!1s0x9105c79f5dacafbf:0x2aecf92fd4325f0d!8m2!3d-12.0852535!4d-76.9772493!16s%2Fg%2F11fhws7zdk?entry=tts"
      },
      {
        id: 4,
        title: "Lima - ALPACA 111 AEROPUERTO CHECK IN",
        address: "Apto.Jorge Chávez, Av.Elmer Faucet s/n,  Local AC 30043 Check in, Callao, P.C.Callao, P.C.Callao",
        schedule: "Lunes a Domingo 24hrs",
        contact: "994-056851"
      }
    ],
    arequipa: [
      {
        id: 5,
        title: "Arequipa - ALPACA 111 AEROPUERTO",
        address: "Av. Aeropuerto S/N, Sala de Embarque Nacional, Cerro Colorado, Arequipa",
        schedule: "Lunes a domingo de 06:00 am a 09:00 pm",
        contact: "994 185075 / aerarequipa@incalpaca.com",
        mapUrl: "https://www.google.com/maps/place/Alpaca+111+-+Aereopuerto+Arequipa/@-16.3707108,-71.573124,14z/data=!4m6!3m5!1s0x9142498e3cd5821d:0xccc24aff95db3b94!8m2!3d-16.3443303!4d-71.5681264!16s%2Fg%2F11sxy9gyjg?entry=tts&g_ep=EgoyMDI0MDYxMC4wKgBIAVAD"
      },
      {
        id: 6,
        title: "Arequipa - ALPACA 111 PORTAL DE FLORES",
        address: "Cal. Portal de Flores 140-A Nro. 140 (Portal de Flores) - Arequipa",
        schedule: "Lunes a sábado de 09:00 am a 08:00 pm | Domingo de 09:00 am a 06:00 pm",
        contact: "922 596 689 / portaldeflores@incalpaca.com",
        mapUrl: "https://www.google.com/maps/place/Incalpaca+-+Portal+de+Flores+-+Arequipa/@-16.3993424,-71.5390183,17z/data=!3m1!4b1!4m6!3m5!1s0x91424be4481b2741:0x8bdbd21bd620363c!8m2!3d-16.3993476!4d-71.5364434!16s%2Fg%2F11s5hp04fh?entry=tts"
      }
    ],
    cusco: [
      {
        id: 7,
        title: "Cusco - ALPACA 111 HELADEROS",
        address: "Calle Heladeros Nro. 135 Centro Histórico (Tda 149) Cusco, Cusco, Cusco",
        schedule: "Lunes a domingo de 08:00 am a 08:00 pm",
        contact: "914 711216 / heladeros@incalpaca.com",
        mapUrl: "https://www.google.com/maps/place/Incalpaca+-+Calle+Heladeros+-+Cusco/@-13.5179579,-71.9811702,18z/data=!4m7!3m6!1s0x916dd70af49ccec5:0x76d41d3787ab9a23!8m2!3d-13.5179579!4d-71.9800876!15sChNJTkNBTFBBQ0EgSEVMQURFUk9TWhUiE2luY2FscGFjYSBoZWxhZGVyb3OSAQ5jbG90aGluZ19zdG9yZeABAA!16s%2Fg%2F11my4l0brz?entry=tts"
      },
      {
        id: 8,
        title: "Cusco - ALPACA 111 MANTAS",
        address: "Calle Mantas No. 114, Cusco",
        schedule: "Lunes a domingo de 08:00 am a 10:00 pm",
        contact: "914 711218 / mantas@incalpaca.com",
        mapUrl: "https://www.google.com/search?hl=es-419&authuser=0&kgmid=/g/11y3_m3jnv&q=Alpaca+111+-+Mantas&shndl=30&shem=lcuae,uaasie&kgs=7f4424dd86184844"
      },
      {
        id: 9,
        title: "Cusco - ALPACA 111 PLATEROS",
        address: "Calle Plateros Nro. 107, Cusco",
        schedule: "Lunes a domingo de 08:00 am a 10:00 pm",
        contact: "994-188573 / plateros@incalpaca.com",
        mapUrl: "https://www.google.com/maps/place/Alpaca+111+-+Plateros/@-13.5165876,-71.9801878,18.99z/data=!4m6!3m5!1s0x916dd78f61049423:0xfbf9c308f5cfe097!8m2!3d-13.5166132!4d-71.9799109!16s%2Fg%2F11l5vn1nl4?entry=tts"
      }
    ]
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-center mb-8 font-mono">Nuestras Tiendas</h2>
      
      <div className="max-w-3xl mx-auto mb-8">
        <select
          className="w-full p-3 border border-gray-300 rounded-none bg-gray-50 font-mono text-lg"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="todos">Todas las tiendas</option>
          <option value="cusco">Cusco</option>
          <option value="lima">Lima</option>
          <option value="arequipa">Arequipa</option>
        </select>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        {filtro === 'todos' && (
          <>
            {Object.values(stores).flat().map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </>
        )}
        {filtro !== 'todos' && stores[filtro]?.map((store) => (
          <StoreCard key={store.id} store={store} />
        ))}
      </div>
    </div>
  );
}

export default Stores; 