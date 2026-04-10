import { createContext, useEffect, useState } from "react";

export const IndexHelperContext = createContext();

export const IndexHelperProvider = ({ children }) => {
  // const navigate = useNavigate();
  let [eventos , setEventos] = useState([])
  let [etiquetas, setEtiquetas] = useState([])
  // aqui se pueden agregar mas estados y funciones
  const URL_LARAVEL = import.meta.env.VITE_API_EVENTS_URL;
  useEffect(() => {
  const cargarEventos = async () => {
    try {
      const [respuestaEventos, respuestaEtiquetas] = await Promise.all([
        fetch(`${URL_LARAVEL}/eventos`),
        fetch(`${URL_LARAVEL}/etiquetas`)
      ]);

      const dataEventos = await respuestaEventos.json();
      const dataEtiquetas = await respuestaEtiquetas.json();

      setEventos(dataEventos);
      setEtiquetas(dataEtiquetas);
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    }
  };
  cargarEventos();

}, []);

  const eventosDestacados = [...eventos]
    .sort((eventoA, eventoB) => Number(eventoB.aforo) - Number(eventoA.aforo))
    .slice(0, 3);

  const eliminarEventoDelIndex = (idEvento) => {
    setEventos((eventosPrevios) =>
      eventosPrevios.filter((evento) => evento.id !== idEvento)
    );
  };

 
  return (
    <IndexHelperContext.Provider value={{ eventos, eventosDestacados, etiquetas, eliminarEventoDelIndex }}>
      { children}
    </IndexHelperContext.Provider>
  );
};
