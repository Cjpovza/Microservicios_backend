const PUERTOS = {
  suma: 3000,
  resta: 3001,
  multiplicacion: 3002,
  division: 3003,
  registros: 3004
};

// operación seleccionada
// operación seleccionada
async function operar(operacion, tipo) {
  const dato1 = document.getElementById("dato1").value;
  const dato2 = document.getElementById("dato2").value;

  if (dato1 === "" || dato2 === "") {
    alert("Por favor ingresa ambos números.");
    return;
  }

  const API_URL = `http://localhost:${PUERTOS[operacion]}`;
  let url = "";
  let options = {};

  if (tipo === "path") {
    url = `${API_URL}/${operacion}/${dato1}/${dato2}`;
    options = { method: "GET" };
  } else if (tipo === "query") {
    url = `${API_URL}/${operacion}?dato1=${dato1}&dato2=${dato2}`;
    options = { method: "GET" };
  } else {
    url = `${API_URL}/${operacion}`;
    options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dato1, dato2 }),
    };
  }

  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error("Error en la operación");
    const data = await res.json();

    document.getElementById(`resultado-${operacion}`).textContent = JSON.stringify(data, null, 2);

    setTimeout(async () => {
  await cargarRegistros();
    }, 300);

    console.log("Operación completada y registros actualizados correctamente.");
  } catch (err) {
    console.error("Error al operar:", err);
    alert("Hubo un problema realizando la operación. Revisa la consola.");
  }
}


// Cargar registros desde el microservicio de registros
async function cargarRegistros() {
  try {
    const tabla = document.getElementById("tabla-registros");
    tabla.innerHTML = `
      <tr><td colspan="6" style="text-align:center;">Cargando registros...</td></tr>
    `;

    const res = await fetch(`http://localhost:${PUERTOS.registros}/registros`);
    if (!res.ok) throw new Error("Error al obtener los registros");

    const datos = await res.json();

    if (!Array.isArray(datos) || datos.length === 0) {
      tabla.innerHTML = `
        <tr><td colspan="6" style="text-align:center;">No hay registros disponibles.</td></tr>
      `;
      return;
    }

    tabla.innerHTML = datos
      .map(
        (item) => `
        <tr>
          <td>${item.id}</td>
          <td>${item.metodo}</td>
          <td>${item.dato1}</td>
          <td>${item.dato2}</td>
          <td>${item.resultado}</td>
          <td>
            <button class="btn btn-sm btn-outline-warning" onclick="actualizarRegistro(${item.id}, '${item.metodo}')">✏️</button>
            <button class="btn btn-sm btn-outline-danger" onclick="eliminarRegistro(${item.id})">🗑️</button>
          </td>
        </tr>`
      )
      .join("");
  } catch (err) {
    console.error("Error cargando registros:", err);
    document.getElementById("tabla-registros").innerHTML = `
      <tr><td colspan="6" style="text-align:center; color:red;">Error cargando registros.</td></tr>
    `;
  }
}

async function eliminarRegistro(id) {
  if (!confirm("¿Seguro que deseas eliminar este registro?")) return;

  try {
    const res = await fetch(`http://localhost:${PUERTOS.registros}/registros/${id}`, {
      method: "DELETE"
    });

    if (res.ok) {
      alert("Registro eliminado correctamente.");
      cargarRegistros();
    } else {
      alert("No se pudo eliminar el registro.");
    }
  } catch (err) {
    console.error("Error eliminando registro:", err);
  }
}

async function actualizarRegistro(id, metodo) {
  const dato1 = prompt("Ingrese el nuevo dato 1:");
  const dato2 = prompt("Ingrese el nuevo dato 2:");

  if (!dato1 || !dato2) {
    alert("Debe ingresar ambos valores.");
    return;
  }

  const resultado = calcularOperacion(metodo, dato1, dato2);

  try {
    const res = await fetch(`http://localhost:${PUERTOS.registros}/registros/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ metodo, dato1, dato2, resultado }),
    });

    if (res.ok) {
      alert("Registro actualizado correctamente.");
      cargarRegistros();
    } else {
      alert("No se pudo actualizar el registro.");
    }
  } catch (err) {
    console.error("Error actualizando registro:", err);
  }
}

function calcularOperacion(metodo, d1, d2) {
  const n1 = parseFloat(d1);
  const n2 = parseFloat(d2);

  switch (metodo) {
    case "suma": return n1 + n2;
    case "resta": return n1 - n2;
    case "multiplicacion": return n1 * n2;
    case "division": return n2 !== 0 ? n1 / n2 : "Error";
    default: return "N/A";
  }
}

cargarRegistros();
