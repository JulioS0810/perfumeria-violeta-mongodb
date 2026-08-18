import React from 'react';

const Nosotros = () => {
  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-sm border-0 rounded-4 p-4 p-md-5">
            <h2 className="text-violeta mb-4 text-center">Nosotros</h2>

            <p className="lead text-muted text-center mb-4">
              Perfumería Violeta nace para celebrar la esencia, la elegancia y la personalidad de cada persona.
            </p>

            <div className="row g-4">
              <div className="col-md-4">
                <div className="card h-100 border-0 bg-light rounded-4 p-4">
                  <h4 className="text-violeta mb-3">Nuestra historia</h4>
                  <p className="mb-0 text-muted">
                    Somos una marca apasionada por los aromas exclusivos y por crear experiencias inolvidables a través de fragancias premium.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100 border-0 bg-light rounded-4 p-4">
                  <h4 className="text-violeta mb-3">Nuestra misión</h4>
                  <p className="mb-0 text-muted">
                    Ofrecer perfumes de alta calidad, con atención personalizada y un servicio que acompañe cada compra con confianza y estilo.
                  </p>
                </div>
              </div>

              <div className="col-md-4">
                <div className="card h-100 border-0 bg-light rounded-4 p-4">
                  <h4 className="text-violeta mb-3">Nuestra visión</h4>
                  <p className="mb-0 text-muted">
                    Ser la referencia de perfumería boutique para quienes buscan lujo, autenticidad y una identidad olorosa única.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 text-center">
              <h4 className="text-violeta mb-3">Familia Violeta</h4>
              <p className="text-muted mb-0">
                Violeta Suárez, propietaria, lidera la visión de marca; Julio César Suárez, administrador, orienta la operación y crecimiento del proyecto.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Nosotros;
