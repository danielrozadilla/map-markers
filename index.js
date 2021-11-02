let marcadores = [];

document.addEventListener('DOMContentLoaded', function () {
  /*var filtro_t = document.getElementById('filtro_tipo');
  filtro_t.addEventListener('change', filtrar);

  var filtro_o = document.getElementById('filtro_oferta');
  filtro_o.addEventListener('change', filtrar);

  var filtro_p_max = document.getElementById('filtro_p_min');
  filtro_p_max.addEventListener('change', filtrar);

  var filtro_p_min = document.getElementById('filtro_p_max');
  filtro_p_min.addEventListener('change', filtrar);
*/


  var aplicar_filtros = document.getElementById('aplicar_filtros');
  aplicar_filtros.addEventListener('click', filtrar);

}, false);


function initMap() {
  getData();
}

function cargarMapa(propiedades) {
  const myLatLng = {
    lat: -34.918325834069165,
    lng: -57.96829147114838
  };
  const map = new google.maps.Map(document.getElementById("map"), {
    zoom: 12,
    center: myLatLng,
    disableDefaultUI: true,
    zoomControl: true,
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
}

function filtrar() {  
  let filtro_t = document.getElementById('filtro_tipo');
  let filtro_o = document.getElementById('filtro_oferta');

  marcadores.forEach(marcador => {
    let cumple = true;
    cumple = cumple && (filtro_t.value == "Todos" || marcador.data[1] == filtro_t.value);
    cumple = cumple && (filtro_o.value == "Todos" || marcador.data[0] == filtro_o.value);
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
  /*Prueba*/ // var url = "https://sheets.googleapis.com/v4/spreadsheets/1Z6ckEgXOxzM9tjS9p-w7YTqXjf9D6IF_PiJlP4j8KKU/values/Mapa!A6:O?key=AIzaSyBb6E0QnyBTlhp-b9JyEyWsL9qAHhKcAiw";
  var url = "https://sheets.googleapis.com/v4/spreadsheets/1h5QpK4d5NAmDET20Pe7tAgDYcWjXzztUSV7Qq0ALIuk/values/Mapa!A6:O?key=AIzaSyBb6E0QnyBTlhp-b9JyEyWsL9qAHhKcAiw";

  var datos = [];
  fetch(url).then(response => response.json())
    .then(data => {    
      cargarMapa(data.values);
    });
}