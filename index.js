let marcadores = [];

document.addEventListener('DOMContentLoaded', function () {
  var aplicar_filtros = document.getElementById('aplicar_filtros');
  aplicar_filtros.addEventListener('click', filtrar);
}, false);

function initMap() {
  getData();
}

function cargarMapa(data) {
  var propiedades = [];
  if (data.hasOwnProperty("values")) {
    propiedades = data.values;
  }
  const myLatLng = {
    lat: -34.918325834069165,
    lng: -57.96829147114838
  };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: myLatLng,
    disableDefaultUI: true,
    zoomControl: true,
    mapTypeControl: true,
  });

  map.setOptions({
    styles: [
      /*{
        featureType: "poi.business",
        stylers: [{ visibility: "off" }],
      },      */
      {
        featureType: "poi",
        stylers: [{
          visibility: "off"
        }],
      },
      {
        featureType: "transit",
        elementType: "labels.icon",
        stylers: [{
          visibility: "off"
        }],
      },
    ]
  });
  setMarkers(propiedades, map);

}

function setMarkers(propiedades, map) {
  for (let i = 0; i < propiedades.length; i++) {
    let prop = propiedades[i];
    /*seleccion de imagen*/
    if (prop[13] && prop[14]) {
      var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
      switch (prop[0]) {
        case "Búsqueda": {
          image = "https://maps.google.com/mapfiles/ms/icons/yellow.png";
          break;
        }
        case "Oportunidad": {
          image = "https://maps.google.com/mapfiles/ms/icons/green.png";
          break;
        }
        case "Ingreso": {
          image = "https://maps.google.com/mapfiles/ms/icons/blue.png";
          break;
        }
      };
      /*--------*/
      /*Formato de lat y long*/
      let latitud;
      let longitud;

      if (prop[13]) {
        latitud = parseFloat(prop[13].replace(",", "."));
      }
      if (prop[14]) {
        longitud = parseFloat(prop[14].replace(",", "."));
      }
      /*--------*/

      const marker = new google.maps.Marker({
        position: {
          lat: latitud,
          lng: longitud
        },
        map,
        icon: image,
        //title: prop[0] + ": " + prop[3] + " " + prop[4] + " " + prop[5],
        title: prop[0] + ": " + prop[1],
        zIndex: i,
        label: prop[1].toString(),

      });

      // Add a click listener for each marker
      marker.addListener("click", () => {
        getFicha(prop)
      });

      marcadores.push({
        'data': prop,
        'marker': marker
      });
    }
  }
  filtrar();
}

document.body.onload = function () {
  cargar_fechas();
}

function cargar_fechas() {
  var array = [];
  let inicio = "1/11/2021";
  let hoy = new Date();
  let fecha = stringDMAToDate(inicio);
  while (fecha <= hoy) {
    array.push(dateToStringDMA(fecha));
    fecha = sumarDias(fecha, 7);
  }
  addOptions(array);
}

// Rutina para agregar opciones a un <select>
function addOptions(array) {
  var select = document.getElementById('filtro_fecha');

  for (value in array) {
    var option = document.createElement("option");
    option.text = array[value];
    select.add(option);
  }
  option.selected = true;
  // document.getElementById('filtro_fecha').value = array[0];
  // console.log(document.getElementById('filtro_fecha').value);
}

function sumarDias(fecha, dias) {
  fecha.setDate(fecha.getDate() + dias);
  return fecha;
}

function dateToStringDMA(fecha) {
  var dd = String(fecha.getDate()).padStart(2, '0');
  var mm = String(fecha.getMonth() + 1).padStart(2, '0'); // Enero es 0  
  var yyyy = fecha.getFullYear();
  return dd + '/' + mm + '/' + yyyy;
}

function dateInverter(stringDate) {
  var dd = stringDate.split("/")[0].padStart(2, '0');
  var mm = stringDate.split("/")[1].padStart(2, '0'); // Enero es 0  
  var yyyy = stringDate.split("/")[2];
  return yyyy + '/' + mm + '/' + dd;
}

function stringDMAToDate(stringDate) {
  var dateParts = stringDate.split("/");
  // month is 0-based, that's why we need dataParts[1] - 1
  return (new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]));
}

function getProximaSemana(stringDate) {
  let dateObject = stringDMAToDate(stringDate);
  let prox = sumarDias(dateObject, 7);
  return dateToStringDMA(prox);
}

function filtrar() {
  document.getElementById("navbarText").classList.remove('show');
  let filtro_t = document.getElementById('filtro_tipo');
  let filtro_o = document.getElementById('filtro_oferta');
  let filtro_f = document.getElementById('filtro_fecha');
  let proxima = getProximaSemana(filtro_f.value)
  let fecha_desde = dateInverter(filtro_f.value);
  let fecha_hasta = dateInverter(proxima);

  marcadores.forEach(marcador => {
    var dd = marcador.data[8].split("/")[0].padStart(2, '0');
    var mm = marcador.data[8].split("/")[1].padStart(2, '0'); // Enero es 0  
    var yyyy = marcador.data[8].split("/")[2].substring(0, 4);
    let fecha = yyyy + '/' + mm + '/' + dd;

    let oferta=[];
    oferta = ["Todos"];
    if (filtro_o.value == "Disponible") {
      oferta = ["Ingreso", "Oportunidad"];
    } else {
      oferta = ["Búsqueda"];
    }
    let cumple = true;
    //cumple = cumple && (fecha >= fecha_desde) && (fecha < fecha_hasta);
    cumple = cumple && (fecha >= fecha_desde);
    cumple = cumple && (filtro_t.value == "Todos" || marcador.data[1] == filtro_t.value);
    cumple = cumple && (filtro_o.value == "Todos" || oferta.includes(marcador.data[0]));
    cumple = cumple && (filtro_p_min.value == "" || soloDigitos(marcador.data[2]) >= filtro_p_min.value);
    cumple = cumple && (filtro_p_max.value == "" || soloDigitos(marcador.data[2]) <= filtro_p_max.value);
    marcador.marker.setVisible(cumple);
  });

}


function soloDigitos(texto) {
  return parseInt(texto.replace(/[^\d,-]/g, ''));
}

/*Ficha detalle ----------------------------------*/
function getFicha(prop) {
  var myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
    keyboard: false
  });
  myModal.toggle();
  let oferta = prop[0];
  let tipo = prop[1];
  let precio = prop[2];
  let direccion = prop[3];
  let calle = prop[4] != "Sin calle" ? prop[4] : "";
  let numero = prop[5] != "Sin numero" ? prop[5] : "";
  let observaciones = prop[6];
  let link = prop[7];
  let fecha = prop[8];
  let email = prop[9];
  let responsable = prop[10];
  let inmobiliaria = prop[11];
  let telefono = prop[12];
  let lat = prop[13];
  let long = prop[14];


  document.getElementById("tipo").innerHTML = oferta + ": " + tipo;
  document.getElementById("direccion").innerHTML = "<strong>Ubicación:</strong> " + direccion + " " + calle + " " + numero;
  document.getElementById("fecha").innerHTML = "<strong>Fecha de publicación:</strong> " + fecha.substring(0, 10);
  document.getElementById("observaciones").innerHTML = "<strong>Observaciones:</strong> " + observaciones;
  document.getElementById("precio").innerHTML = "<strong>Precio:</strong> " + precio;
  document.getElementById("link").href = link;
  if (link.length > 5) {
    document.getElementById("link").classList.remove("invisible");
    document.getElementById("link").classList.add("visible");
  } else {
    document.getElementById("link").classList.remove("visible");
    document.getElementById("link").classList.add("invisible");
  }
  document.getElementById("inmobiliaria").innerHTML = "<strong>Inmobiliaria:</strong> " + inmobiliaria;
  document.getElementById("responsable").innerHTML = "<strong>Responsable:</strong> " + responsable;
  document.getElementById("telefono").innerHTML = "<strong>Teléfono:</strong> " + telefono;
  document.getElementById("email").innerHTML = "<strong>E-mail:</strong> " + email;
}

function getData() {
  var url = "https://sheets.googleapis.com/v4/spreadsheets/1h5QpK4d5NAmDET20Pe7tAgDYcWjXzztUSV7Qq0ALIuk/values/Mapa!A6:O?key=AIzaSyBb6E0QnyBTlhp-b9JyEyWsL9qAHhKcAiw";

  var datos = [];
  fetch(url).then(response => response.json())
    .then(data => {
      cargarMapa(data);
    });
}