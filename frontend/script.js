let servicioSeleccionadoId = null;
// 🔥 URLs CORRECTAS
const URL_CITAS = "http://localhost:3000/citas";
const URL_SERVICIOS = "http://localhost:3000/servicios";

// CAMBIAR VISTAS
function mostrar(id) {
  document.getElementById("inicio").classList.add("hidden");
  document.getElementById("reserva").classList.add("hidden");
  document.getElementById("servicios").classList.add("hidden");

  document.getElementById(id).classList.remove("hidden");

  if (id === "servicios") {
    cargarServicios();
  }
}

// SELECCIONAR SERVICIO
function seleccionar(servicio) {
  const input = document.getElementById("servicio");

  input.dataset.id = servicio.id;

  document.getElementById("servicio-mostrado").textContent = servicio.nombre;

  mostrar("reserva");
}

// CARGAR CITAS
function cargarCitas() {
  fetch(URL_CITAS)
    .then(res => res.json())
    .then(data => {

      const contenedor = document.getElementById("lista-citas");
      contenedor.innerHTML = "";

      data.forEach(cita => {
        const div = document.createElement("div");
        div.classList.add("cita");

        div.innerHTML = `
          <span>
            ${cita.servicio_nombre} - 
            ${cita.fecha.split("T")[0]} - 
            ${cita.hora}
          </span>
          <button onclick="eliminarCita(${cita.id})">X</button>
        `;

        contenedor.appendChild(div);
      });

    })
    .catch(err => console.error(err));
}

// AGENDAR
function agendar() {
  const servicioInput = document.getElementById("servicio");
  const fecha = document.getElementById("fecha").value;
  const hora = document.getElementById("hora").value;

  // VALIDACIÓN CORRECTA
  if (!servicioInput.dataset.id) {
    alert("Selecciona un servicio");
    return;
  }
if (hora < "09:00" || hora > "18:00") {
  alert("Horario fuera de servicio");
  return;
}
  const data = {
    cliente_id: 1,
    servicio_id: servicioInput.dataset.id,
    fecha,
    hora
  };

  fetch(URL_CITAS, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  })
    .then(res => res.text())
    .then(() => {
      alert("Cita guardada");
      mostrar("inicio");
      cargarCitas();
    })
    .catch(err => console.error(err));
}
console.log("ENTRÓ A CARGAR SERVICIOS");

// CARGAR SERVICIOS
function cargarServicios() {
  fetch(URL_SERVICIOS)
    .then(res => res.json())
    .then(data => {
      console.log("servicios:", data);

      const contenedor = document.getElementById("lista-servicios");
      contenedor.innerHTML = "";

      data.forEach(servicio => {
        const btn = document.createElement("button");
        btn.textContent = servicio.nombre;
        btn.onclick = () => seleccionar(servicio);
        contenedor.appendChild(btn);
      });
    })
    .catch(err => console.error(err));
}

// ELIMINAR
function eliminarCita(id) {
  if (!confirm("¿Eliminar cita?")) return;

  fetch(`${URL_CITAS}/${id}`, {
    method: "DELETE"
  })
    .then(() => cargarCitas())
    .catch(err => console.error(err));
}

// INICIO
window.onload = cargarCitas;