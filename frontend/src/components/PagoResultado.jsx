// Pantalla de retorno después del pago demo o de una pasarela externa.
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const PagoResultado = () => {
  // Wompi y el modo demo informan el resultado mediante parámetros de la URL.
  const [searchParams] = useSearchParams();
  const estado = searchParams.get('status') || searchParams.get('estado');
  const esDemo = searchParams.get('modo') === 'demo';
  const aprobado = estado === 'APPROVED' || estado === 'aprobado';

  return (
    <main className="container py-5 text-center">
      <div className="card shadow-sm border-0 p-5 mx-auto" style={{ maxWidth: '620px' }}>
        <h1 className="text-violeta mb-3">
          {esDemo ? 'Pago simulado exitosamente' : aprobado ? 'Pago aprobado' : 'Pago recibido'}
        </h1>
        <p className="text-muted mb-4">
          {esDemo
            ? 'Este es un pago demo local. No se realizó ningún cobro real.'
            : aprobado
            ? 'Tu pedido fue confirmado correctamente.'
            : 'Estamos confirmando el estado de tu pago. Puedes revisar el resultado en unos instantes.'}
        </p>
        <Link to="/" className="btn btn-violeta">
          Volver al catálogo
        </Link>
      </div>
    </main>
  );
};

export default PagoResultado;
