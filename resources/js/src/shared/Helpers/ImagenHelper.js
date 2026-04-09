const URL_API_EVENTOS = import.meta.env.VITE_API_EVENTS_URL ?? "";

function obtenerUrlBaseEventos() {
  const urlNormalizada = URL_API_EVENTOS.trim().replace(/\/+$/, "");

  if (!urlNormalizada) {
    return "";
  }

  return urlNormalizada.endsWith("/api")
    ? urlNormalizada.slice(0, -4)
    : urlNormalizada;
}

export function obtenerUrlImagen(rutaImagen) {
  if (!rutaImagen) {
    return "https://placehold.co/1200x800?text=Evento";
  }

  if (rutaImagen.startsWith("http")) {
    return rutaImagen;
  }

  const urlBaseEventos = obtenerUrlBaseEventos();
  const rutaNormalizada = rutaImagen
    .replace(/^\/+/, "")
    .replace(/^storage\//, "")
    .replace(/^public\//, "");

  if (!urlBaseEventos) {
    return `/storage/${rutaNormalizada}`;
  }

  return `${urlBaseEventos}/storage/${rutaNormalizada}`;
}
