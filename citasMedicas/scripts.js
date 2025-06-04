// Espera que todo el contenido del DOM esté cargado antes de ejecutar el script
document.addEventListener("DOMContentLoaded", () => {
  // Elementos principales
  const form = document.getElementById("form-cita");
  const alerta = document.getElementById("alerta");


  //  MODAL DE BUSQUEDA NUEVO
  const modalBusqueda = document.getElementById("modal-busqueda");
  const cerrarBusqueda = document.getElementById("cerrar-busqueda");
  const btnBuscarModal = document.getElementById("btn-buscar-modal");

  // Manejador del formulario para agendar cita
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Evita que el formulario recargue la página

    // Captura los valores ingresados
    const documento = document.getElementById("documento").value;
    const nombre = document.getElementById("nombre").value;
    const telefono = document.getElementById("telefono").value;
    const consulta = document.getElementById("consulta").value;
    const fecha = document.getElementById("fecha").value;
    const hora = document.getElementById("hora").value;

    // Crea un objeto con los datos
    const nuevaCita = { documento, nombre, telefono, consulta, fecha, hora };

    // Recupera citas existentes del localStorage o inicia array vacío
    let citas = JSON.parse(localStorage.getItem("citas")) || [];

    // Agrega la nueva cita al arreglo
    citas.push(nuevaCita);

    // Guarda nuevamente en localStorage
    localStorage.setItem("citas", JSON.stringify(citas));

    // Muestra una alerta temporal
    mostrarAlerta();

    // Limpia el formulario
    form.reset();
  });

// 🟡 BOTÓN LUPA – Abre modal de búsqueda
  document.getElementById("btn-lupa").addEventListener("click", () => {
    modalBusqueda.classList.remove("oculto"); // Muestra modal para ingresar documento
  });

  // 🔴 CERRAR MODAL DE BÚSQUEDA
  cerrarBusqueda.addEventListener("click", () => {
    modalBusqueda.classList.add("oculto");
  });

  // 🔍 BOTÓN BUSCAR DENTRO DEL MODAL DE BÚSQUEDA
  btnBuscarModal.addEventListener("click", () => {
    const documento = document.getElementById("buscar-doc-modal").value.trim();

    if (!documento) {
      alert("Ingresa un número de documento.");
      return;
    }

    modalBusqueda.classList.add("oculto"); // Oculta modal de búsqueda
    mostrarCitas(documento);               // Llama al modal con los datos encontrados
  });


  // Función para mostrar la alerta flotante
  function mostrarAlerta() {
    alerta.classList.add("alerta-mostrar");
    setTimeout(() => {
      alerta.classList.remove("alerta-mostrar");
    }, 2000);
  }

  // Función para mostrar las citas filtradas por documento en un modal
  function mostrarCitas(documento) {
    const citas = JSON.parse(localStorage.getItem("citas")) || [];

    // Filtra citas por documento e incluye el índice para futuras operaciones
    const filtradas = citas
      .map((c, i) => ({ ...c, index: i }))
      .filter((c) => c.documento === documento);

    const contenidoModal = document.getElementById("contenido-modal");

    // Si no hay citas, alerta y no muestra el modal
    if (filtradas.length === 0) {
      alert("No hay citas para este documento.");
      return;
    }

    // Construye el contenido HTML para cada cita encontrada
    contenidoModal.innerHTML = filtradas
      .map(
        (cita) => `
      <div class="card">
        <p><strong>Nombre:</strong> ${cita.nombre}</p>
        <p><strong>Teléfono:</strong> ${cita.telefono}</p>
        <p><strong>Consulta:</strong> ${cita.consulta}</p>
        <p><strong>Fecha:</strong> ${cita.fecha}</p>
        <p><strong>Hora:</strong> ${cita.hora}</p>
        <button onclick="eliminarCita(${cita.index})">🗑 Eliminar</button>
        <button onclick="editarCita(${cita.index})">✏ Editar fecha</button>
      </div>
    `
      )
      .join("");

    // Muestra el modal quitando la clase 'oculto'
    document.getElementById("modal-citas").classList.remove("oculto");
  }




  // Función global para eliminar una cita
  window.eliminarCita = (index) => {
    let citas = JSON.parse(localStorage.getItem("citas")) || [];

    // Elimina la cita en el índice indicado
    citas.splice(index, 1);

    // Actualiza el almacenamiento
    localStorage.setItem("citas", JSON.stringify(citas));

    alert("Cita eliminada");

    // Oculta el modal y vuelve a consultar
    document.getElementById("modal-citas").classList.add("oculto");
  };

  // Función global para editar la fecha de una cita
  window.editarCita = (index) => {
    const nuevaFecha = prompt("Nueva fecha (YYYY-MM-DD):");
    if (!nuevaFecha) return;

    let citas = JSON.parse(localStorage.getItem("citas")) || [];

    // Actualiza la fecha de la cita
    citas[index].fecha = nuevaFecha;

    // Guarda los cambios
    localStorage.setItem("citas", JSON.stringify(citas));

    alert("Fecha actualizada");

    // Oculta el modal y vuelve a consultar
    document.getElementById("modal-citas").classList.add("oculto");
  };

  // Manejador para cerrar el modal al hacer clic en la "X"
  document.getElementById("cerrar-modal").addEventListener("click", () => {
    document.getElementById("modal-citas").classList.add("oculto");
  });

});
