import { createContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
import React from "react";


export const IndexHelperContext = createContext();

export const IndexHelperProvider = ({ children }) => {
  // const navigate = useNavigate();
  let [eventos , setEventos] = useState([])
  // aqui se pueden agregar mas estados y funciones

  useEffect(() => {
  const cargarEventos = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/eventos");
      const data = await response.json();
      setEventos(data);
      console.log(data)
    } catch (error) {
      console.error("Error al cargar eventos:", error);
    }
  };
  cargarEventos();

}, []);


 
  return (
    <IndexHelperContext.Provider value={{ eventos }}>
      { children}
    </IndexHelperContext.Provider>
  );
};
