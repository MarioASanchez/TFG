import Footer from "./Footer";
import Header from "./Header";

function Eventos() {
  return (
    <>
        <Header/>
      {/* Todos los eventos */}
      <section className="py-5 bg-dark-custom">
        <div className="container">
          <h2 className="display-5 fw-bold mb-5" id="todos_eventos">
            Todos los Eventos
          </h2>

          <div className="row g-4">
            {/* Evento 1 */}

            <div className="col-lg-3 col-md-4 col-sm-6" >
              <div className="card-custom" style={{ cursor: "pointer" }}>
                <img
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400"
                  className="w-100 card-img-small"
                  alt="Stand Up Comedy"
                />
                <div className="p-3">
                  <h3 className="h6 fw-bold mb-2">Stand Up Comedy Night</h3>
                  <p className="small text-gray-custom mb-3">
                    Teatro Circular • 10 Ene 2025
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-purple">20€</span>
                    <span className="small text-success">Disponible</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Evento 2 */}
            <div className="col-lg-3 col-md-4 col-sm-6" >
              <div className="card-custom" style={{ cursor: "pointer" }}>
                <img
                  src="https://images.unsplash.com/photo-1458560871784-56d23406c091?w=400"
                  className="w-100 card-img-small"
                  alt="Concierto Jazz"
                />
                <div className="p-3">
                  <h3 className="h6 fw-bold mb-2">Noche de Jazz en Vivo</h3>
                  <p className="small text-gray-custom mb-3">
                    Jazz Club • 5 Ene 2025
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-purple">18€</span>
                    <span className="small text-success">Disponible</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Evento3 */}
            <div className="col-lg-3 col-md-4 col-sm-6" >
              <div className="card-custom" style={{ cursor: "pointer" }}>
                <img
                  src="https://images.unsplash.com/photo-1534329539061-64caeb388c42?w=400"
                  className="w-100 card-img-small"
                  alt="Opera Carmen"
                />
                <div className="p-3">
                  <h3 className="h6 fw-bold mb-2">Carmen - Ópera</h3>
                  <p className="small text-gray-custom mb-3">
                    Teatro Romea • 25 Ene 2025
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-purple">45€</span>
                    <span className="small text-success">Disponible</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Evento 4 */}
            <div className="col-lg-3 col-md-4 col-sm-6" >
              <div className="card-custom" style={{ cursor: "pointer" }}>
                <img
                  src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400"
                  className="w-100 card-img-small"
                  alt="Flamenco"
                />
                <div className="p-3">
                  <h3 className="h6 fw-bold mb-2">Tablao Flamenco</h3>
                  <p className="small text-gray-custom mb-3">
                    Casa Flamenca • 12 Ene 2025
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-purple">28€</span>
                    <span className="small text-success">Disponible</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Evento 5 */}
            <div className="col-lg-3 col-md-4 col-sm-6" >
              <div className="card-custom" style={{ cursor: "pointer" }}>
                <img
                  src="https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400"
                  className="w-100 card-img-small"
                  alt="Recital Piano"
                />
                <div className="p-3">
                  <h3 className="h6 fw-bold mb-2">Recital de Piano Clásico</h3>
                  <p className="small text-gray-custom mb-3">
                    Auditorio • 18 Ene 2025
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-purple">22€</span>
                    <span className="small text-success">Disponible</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Evento 6 */}

            <div className="col-lg-3 col-md-4 col-sm-6" >
              <div className="card-custom" style={{ cursor: "pointer" }}>
                <img
                  src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400"
                  className="w-100 card-img-small"
                  alt="Teatro Infantil"
                />
                <div className="p-3">
                  <h3 className="h6 fw-bold mb-2">
                    El Mago de Oz - Musical Infantil
                  </h3>
                  <p className="small text-gray-custom mb-3">
                    Teatro Circo • 8 Ene 2025
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-purple">15€</span>
                    <span className="small text-success">Disponible</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Evento 7 */}

            <div className="col-lg-3 col-md-4 col-sm-6" >
              <div className="card-custom" style={{ cursor: "pointer" }}>
                <img
                  src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400"
                  className="w-100 card-img-small"
                  alt="Concierto Rock"
                />
                <div className="p-3">
                  <h3 className="h6 fw-bold mb-2">Festival de Rock Indie</h3>
                  <p className="small text-gray-custom mb-3">
                    La Fica • 30 Ene 2025
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-purple">32€</span>
                    <span className="small text-success">Disponible</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Evento 8 */}
            <div className="col-lg-3 col-md-4 col-sm-6" >
              <div className="card-custom" style={{ cursor: "pointer" }}>
                <img
                  src="https://images.unsplash.com/photo-1518675219903-c682c4b16b1d?w=400"
                  className="w-100 card-img-small"
                  alt="Teatro Drama"
                />
                <div className="p-3">
                  <h3 className="h6 fw-bold mb-2">La Casa de Bernarda Alba</h3>
                  <p className="small text-gray-custom mb-3">
                    Teatro Romea • 22 Ene 2025
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-purple">26€</span>
                    <span className="small text-success">Disponible</span>
                  </div>
                </div>
              </div>
            </div>
             <div className="col-lg-3 col-md-4 col-sm-6" >
              <div className="card-custom" style={{ cursor: "pointer" }}>
                <img
                  src="https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400"
                  className="w-100 card-img-small"
                  alt="Stand Up Comedy"
                />
                <div className="p-3">
                  <h3 className="h6 fw-bold mb-2">Stand Up Comedy Night</h3>
                  <p className="small text-gray-custom mb-3">
                    Teatro Circular • 10 Ene 2025
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-purple">20€</span>
                    <span className="small text-success">Disponible</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Evento 2 */}
            <div className="col-lg-3 col-md-4 col-sm-6" >
              <div className="card-custom" style={{ cursor: "pointer" }}>
                <img
                  src="https://images.unsplash.com/photo-1458560871784-56d23406c091?w=400"
                  className="w-100 card-img-small"
                  alt="Concierto Jazz"
                />
                <div className="p-3">
                  <h3 className="h6 fw-bold mb-2">Noche de Jazz en Vivo</h3>
                  <p className="small text-gray-custom mb-3">
                    Jazz Club • 5 Ene 2025
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-purple">18€</span>
                    <span className="small text-success">Disponible</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Evento3 */}
            <div className="col-lg-3 col-md-4 col-sm-6" >
              <div className="card-custom" style={{ cursor: "pointer" }}>
                <img
                  src="https://images.unsplash.com/photo-1534329539061-64caeb388c42?w=400"
                  className="w-100 card-img-small"
                  alt="Opera Carmen"
                />
                <div className="p-3">
                  <h3 className="h6 fw-bold mb-2">Carmen - Ópera</h3>
                  <p className="small text-gray-custom mb-3">
                    Teatro Romea • 25 Ene 2025
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-purple">45€</span>
                    <span className="small text-success">Disponible</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Evento 4 */}
            <div className="col-lg-3 col-md-4 col-sm-6" >
              <div className="card-custom" style={{ cursor: "pointer" }}>
                <img
                  src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400"
                  className="w-100 card-img-small"
                  alt="Flamenco"
                />
                <div className="p-3">
                  <h3 className="h6 fw-bold mb-2">Tablao Flamenco</h3>
                  <p className="small text-gray-custom mb-3">
                    Casa Flamenca • 12 Ene 2025
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-purple">28€</span>
                    <span className="small text-success">Disponible</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Evento 5 */}
            <div className="col-lg-3 col-md-4 col-sm-6" >
              <div className="card-custom" style={{ cursor: "pointer" }}>
                <img
                  src="https://images.unsplash.com/photo-1465847899084-d164df4dedc6?w=400"
                  className="w-100 card-img-small"
                  alt="Recital Piano"
                />
                <div className="p-3">
                  <h3 className="h6 fw-bold mb-2">Recital de Piano Clásico</h3>
                  <p className="small text-gray-custom mb-3">
                    Auditorio • 18 Ene 2025
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-purple">22€</span>
                    <span className="small text-success">Disponible</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Evento 6 */}

            <div className="col-lg-3 col-md-4 col-sm-6" >
              <div className="card-custom" style={{ cursor: "pointer" }}>
                <img
                  src="https://images.unsplash.com/photo-1578632767115-351597cf2477?w=400"
                  className="w-100 card-img-small"
                  alt="Teatro Infantil"
                />
                <div className="p-3">
                  <h3 className="h6 fw-bold mb-2">
                    El Mago de Oz - Musical Infantil
                  </h3>
                  <p className="small text-gray-custom mb-3">
                    Teatro Circo • 8 Ene 2025
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-purple">15€</span>
                    <span className="small text-success">Disponible</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Evento 7 */}

            <div className="col-lg-3 col-md-4 col-sm-6" >
              <div className="card-custom" style={{ cursor: "pointer" }}>
                <img
                  src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400"
                  className="w-100 card-img-small"
                  alt="Concierto Rock"
                />
                <div className="p-3">
                  <h3 className="h6 fw-bold mb-2">Festival de Rock Indie</h3>
                  <p className="small text-gray-custom mb-3">
                    La Fica • 30 Ene 2025
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-purple">32€</span>
                    <span className="small text-success">Disponible</span>
                  </div>
                </div>
              </div>
            </div>
            {/* Evento 8 */}
            <div className="col-lg-3 col-md-4 col-sm-6" >
              <div className="card-custom" style={{ cursor: "pointer" }}>
                <img
                  src="https://images.unsplash.com/photo-1518675219903-c682c4b16b1d?w=400"
                  className="w-100 card-img-small"
                  alt="Teatro Drama"
                />
                <div className="p-3">
                  <h3 className="h6 fw-bold mb-2">La Casa de Bernarda Alba</h3>
                  <p className="small text-gray-custom mb-3">
                    Teatro Romea • 22 Ene 2025
                  </p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-purple">26€</span>
                    <span className="small text-success">Disponible</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer/>
    </>
  );
}

export default Eventos;
