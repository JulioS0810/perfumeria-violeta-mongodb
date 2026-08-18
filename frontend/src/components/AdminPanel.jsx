import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';

const AdminPanel = ({ usuario, usuariosAdmin, productosAdmin, onActualizarDatos }) => {
  const [tab, setTab] = useState('usuarios');
  const [usuarios, setUsuarios] = useState(usuariosAdmin || []);
  const [productos, setProductos] = useState(productosAdmin || []);
  const [cargando, setCargando] = useState(false);
  const [formularioUsuario, setFormularioUsuario] = useState({ name: '', email: '', rol: 'cliente' });
  const [formularioProducto, setFormularioProducto] = useState({ name: '', marca: '', precio: '', genero: 'Unisex' });
  const [editandoId, setEditandoId] = useState(null);

  useEffect(() => {
    setUsuarios(usuariosAdmin || []);
  }, [usuariosAdmin]);

  useEffect(() => {
    setProductos(productosAdmin || []);
  }, [productosAdmin]);

  const puedoGestionarUsuarios = ['propietario', 'admin'].includes(usuario?.rol);
  const puedoGestionarProductos = ['propietario', 'admin'].includes(usuario?.rol);

  // ===== USUARIOS =====
  const handleEditarUsuario = (usuarioItem) => {
    setFormularioUsuario({
      name: usuarioItem.name,
      email: usuarioItem.email,
      rol: usuarioItem.rol
    });
    setEditandoId(usuarioItem._id);
  };

  const handleGuardarUsuario = async (e) => {
    e.preventDefault();
    if (!formularioUsuario.name || !formularioUsuario.email) {
      Swal.fire('Error', 'Completa todos los campos', 'error');
      return;
    }

    setCargando(true);
    try {
      const metodo = editandoId ? 'PUT' : 'POST';
      const url = editandoId
        ? `http://localhost:4000/api/usuarios/${editandoId}`
        : 'http://localhost:4000/api/usuarios';

      const respuesta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formularioUsuario)
      });

      if (!respuesta.ok) {
        throw new Error('Error al guardar usuario');
      }

      Swal.fire('Éxito', editandoId ? 'Usuario actualizado' : 'Usuario creado', 'success');
      setFormularioUsuario({ name: '', email: '', rol: 'cliente' });
      setEditandoId(null);
      onActualizarDatos();
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setCargando(false);
    }
  };

  const handleEliminarUsuario = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este usuario será eliminado permanentemente',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6a1b9a',
      cancelButtonColor: '#6c757d'
    });

    if (!resultado.isConfirmed) return;

    try {
      const respuesta = await fetch(`http://localhost:4000/api/usuarios/${id}`, {
        method: 'DELETE'
      });

      if (!respuesta.ok) throw new Error('Error al eliminar usuario');

      Swal.fire('Eliminado', 'Usuario removido del sistema', 'success');
      onActualizarDatos();
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  // ===== PRODUCTOS =====
  const handleEditarProducto = (producto) => {
    setFormularioProducto({
      name: producto.nombre || producto.name,
      marca: producto.marca,
      precio: producto.precio,
      genero: producto.genero || 'Unisex'
    });
    setEditandoId(producto._id);
  };

  const handleGuardarProducto = async (e) => {
    e.preventDefault();
    if (!formularioProducto.name || !formularioProducto.marca || !formularioProducto.precio) {
      Swal.fire('Error', 'Completa todos los campos', 'error');
      return;
    }

    setCargando(true);
    try {
      const metodo = editandoId ? 'PUT' : 'POST';
      const url = editandoId
        ? `http://localhost:4000/api/productos/${editandoId}`
        : 'http://localhost:4000/api/productos';

      const payload = {
        nombre: formularioProducto.name,
        marca: formularioProducto.marca,
        precio: Number(formularioProducto.precio),
        genero: formularioProducto.genero
      };

      const respuesta = await fetch(url, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!respuesta.ok) {
        throw new Error('Error al guardar producto');
      }

      Swal.fire('Éxito', editandoId ? 'Producto actualizado' : 'Producto creado', 'success');
      setFormularioProducto({ name: '', marca: '', precio: '', genero: 'Unisex' });
      setEditandoId(null);
      onActualizarDatos();
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setCargando(false);
    }
  };

  const handleEliminarProducto = async (id) => {
    const resultado = await Swal.fire({
      title: '¿Estás seguro?',
      text: 'Este producto será eliminado del catálogo',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#6a1b9a',
      cancelButtonColor: '#6c757d'
    });

    if (!resultado.isConfirmed) return;

    try {
      const respuesta = await fetch(`http://localhost:4000/api/productos/${id}`, {
        method: 'DELETE'
      });

      if (!respuesta.ok) throw new Error('Error al eliminar producto');

      Swal.fire('Eliminado', 'Producto removido del catálogo', 'success');
      onActualizarDatos();
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };

  const getRolBadgeClass = (rol) => {
    switch (rol) {
      case 'propietario':
        return 'bg-danger';
      case 'admin':
        return 'bg-warning text-dark';
      case 'empleado':
        return 'bg-info';
      default:
        return 'bg-secondary';
    }
  };

  return (
    <div className="container py-5">
      {/* HEADER */}
      <div className="card shadow-sm border-0 rounded-4 p-4 mb-4">
        <h2 className="text-violeta mb-2">Panel Administrativo</h2>
        <p className="text-muted mb-0">
          Bienvenido, <strong>{usuario?.name}</strong> · Rol: <strong className="text-uppercase">{usuario?.rol}</strong>
        </p>
      </div>

      {/* TABS */}
      <ul className="nav nav-tabs mb-4 border-0" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link fw-bold ${tab === 'usuarios' ? 'active border-0 border-bottom text-violeta' : 'text-muted'}`}
            onClick={() => setTab('usuarios')}
            type="button"
          >
            👥 Usuarios ({usuarios.length})
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className={`nav-link fw-bold ${tab === 'productos' ? 'active border-0 border-bottom text-violeta' : 'text-muted'}`}
            onClick={() => setTab('productos')}
            type="button"
          >
            🎁 Productos ({productos.length})
          </button>
        </li>
      </ul>

      {/* TAB: USUARIOS */}
      {tab === 'usuarios' && (
        <div className="row g-4">
          {puedoGestionarUsuarios && (
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h5 className="text-violeta mb-3">{editandoId ? 'Editar' : 'Nuevo'} Usuario</h5>
                <form onSubmit={handleGuardarUsuario}>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Nombre"
                    value={formularioUsuario.name}
                    onChange={(e) => setFormularioUsuario({ ...formularioUsuario, name: e.target.value })}
                    required
                  />
                  <input
                    type="email"
                    className="form-control mb-2"
                    placeholder="Correo"
                    value={formularioUsuario.email}
                    onChange={(e) => setFormularioUsuario({ ...formularioUsuario, email: e.target.value })}
                    required
                  />
                  <select
                    className="form-select mb-3"
                    value={formularioUsuario.rol}
                    onChange={(e) => setFormularioUsuario({ ...formularioUsuario, rol: e.target.value })}
                  >
                    <option value="cliente">Cliente</option>
                    <option value="empleado">Empleado</option>
                    <option value="admin">Admin</option>
                    {usuario?.rol === 'propietario' && <option value="propietario">Propietario</option>}
                  </select>
                  <button type="submit" className="btn btn-violeta w-100" disabled={cargando}>
                    {cargando ? 'Guardando...' : editandoId ? 'Actualizar' : 'Crear'}
                  </button>
                  {editandoId && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100 mt-2"
                      onClick={() => {
                        setEditandoId(null);
                        setFormularioUsuario({ name: '', email: '', rol: 'cliente' });
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}

          <div className={puedoGestionarUsuarios ? 'col-lg-8' : 'col-12'}>
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="text-violeta mb-3">Lista de Usuarios</h5>
              <div className="table-responsive">
                <table className="table table-sm align-middle mb-0">
                  <thead className="text-muted small">
                    <tr>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      {puedoGestionarUsuarios && <th className="text-end">Acciones</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {usuarios.length > 0 ? (
                      usuarios.map((usuarioItem) => (
                        <tr key={usuarioItem._id} className="border-bottom">
                          <td className="fw-500">{usuarioItem.name}</td>
                          <td className="text-muted small">{usuarioItem.email}</td>
                          <td>
                            <span className={`badge ${getRolBadgeClass(usuarioItem.rol)} text-uppercase small`}>
                              {usuarioItem.rol}
                            </span>
                          </td>
                          {puedoGestionarUsuarios && (
                            <td className="text-end">
                              <button
                                className="btn btn-sm btn-outline-warning me-2"
                                onClick={() => handleEditarUsuario(usuarioItem)}
                                title="Editar"
                              >
                                ✏️
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleEliminarUsuario(usuarioItem._id)}
                                title="Eliminar"
                              >
                                🗑️
                              </button>
                            </td>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={puedoGestionarUsuarios ? 4 : 3} className="text-center text-muted py-4">
                          Sin usuarios registrados
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB: PRODUCTOS */}
      {tab === 'productos' && (
        <div className="row g-4">
          {puedoGestionarProductos && (
            <div className="col-lg-4">
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <h5 className="text-violeta mb-3">{editandoId ? 'Editar' : 'Nuevo'} Producto</h5>
                <form onSubmit={handleGuardarProducto}>
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Nombre del perfume"
                    value={formularioProducto.name}
                    onChange={(e) => setFormularioProducto({ ...formularioProducto, name: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Marca"
                    value={formularioProducto.marca}
                    onChange={(e) => setFormularioProducto({ ...formularioProducto, marca: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="Precio"
                    value={formularioProducto.precio}
                    onChange={(e) => setFormularioProducto({ ...formularioProducto, precio: e.target.value })}
                    required
                    step="0.01"
                  />
                  <select
                    className="form-select mb-3"
                    value={formularioProducto.genero}
                    onChange={(e) => setFormularioProducto({ ...formularioProducto, genero: e.target.value })}
                  >
                    <option value="Unisex">Unisex</option>
                    <option value="Femenino">Femenino</option>
                    <option value="Masculino">Masculino</option>
                  </select>
                  <button type="submit" className="btn btn-violeta w-100" disabled={cargando}>
                    {cargando ? 'Guardando...' : editandoId ? 'Actualizar' : 'Crear'}
                  </button>
                  {editandoId && (
                    <button
                      type="button"
                      className="btn btn-outline-secondary w-100 mt-2"
                      onClick={() => {
                        setEditandoId(null);
                        setFormularioProducto({ name: '', marca: '', precio: '', genero: 'Unisex' });
                      }}
                    >
                      Cancelar
                    </button>
                  )}
                </form>
              </div>
            </div>
          )}

          <div className={puedoGestionarProductos ? 'col-lg-8' : 'col-12'}>
            <div className="card border-0 shadow-sm rounded-4 p-4">
              <h5 className="text-violeta mb-3">Catálogo</h5>
              <div className="row g-3">
                {productos.length > 0 ? (
                  productos.map((producto) => (
                    <div key={producto._id} className="col-md-6">
                      <div className="card border-0 bg-light rounded-3 p-3 h-100">
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="mb-1 fw-bold">{producto.nombre || producto.name}</h6>
                            <small className="text-muted">{producto.marca}</small>
                          </div>
                          <span className="badge bg-violeta text-white text-uppercase small">{producto.genero}</span>
                        </div>
                        <p className="text-violeta fw-bold mb-2">${Number(producto.precio).toLocaleString('es-CO')}</p>
                        {puedoGestionarProductos && (
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-warning flex-grow-1"
                              onClick={() => handleEditarProducto(producto)}
                            >
                              ✏️ Editar
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleEliminarProducto(producto._id)}
                            >
                              🗑️
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-12 text-center text-muted py-5">
                    Sin productos en el catálogo
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
