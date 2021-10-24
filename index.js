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

  //const image =
  "https://developers.google.com/maps/documentation/javascript/examples/full/images/propflag.png";

  // Create an info window to share between markers.
  //const infoWindow = new google.maps.InfoWindow();

  for (let i = 0; i < propiedades.length; i++) {
    let prop = propiedades[i];
    if (prop[11] &&prop[12]) {    
      var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
      switch (prop[0]) {
        case "Búsqueda": {
          image= "http://maps.google.com/mapfiles/ms/icons/yellow.png";
          break;
        }
        case "Oportunidad": {
          image="http://maps.google.com/mapfiles/ms/icons/green.png";
          break;
        }
        case "Ingreso": {
          image= "http://maps.google.com/mapfiles/ms/icons/blue.png";
          break;
        }
      };

      let latitud;
      let longitud;

      if (prop[11]){
        latitud=parseFloat(prop[11].replace(",", "."));
      }
      if (prop[12]){
        longitud=parseFloat(prop[12].replace(",", "."));
      }
     
    const marker = new google.maps.Marker({   

      position: {
        lat: latitud,
        lng: longitud
      },
      map,
      icon: image,
      title: prop[0]+": "+prop[4],
      zIndex: i,
      label: prop[1].toString(),
    });

    // Add a click listener for each marker, and set up the info window.
    marker.addListener("click", () => {
      //infoWindow.close();
      //infoWindow.setContent(prop[4]);
      //infoWindow.open(marker.getMap(), marker);
      var myModal = new bootstrap.Modal(document.getElementById('exampleModal'), {
        keyboard: false
      });
      myModal.toggle()      
      let oferta = prop[0];
      let tipo = prop[1];
      let precio = prop[2];
      let direccion = prop[3];
      let observaciones = prop[4];
      let link = prop[5];
      let responsable = prop[8];
      let email = prop[7];
      let inmobiliaria = prop[9];
      let telefono = prop[10];

      document.getElementById("tipo").innerHTML = oferta + ": " + tipo;
      document.getElementById("direccion").innerHTML = direccion;
      document.getElementById("observaciones").innerHTML = observaciones;
      document.getElementById("precio").innerHTML = precio;
      document.getElementById("link").href = link;
      if (link.length > 5) {        
        document.getElementById("link").classList.remove("invisible");
        document.getElementById("link").classList.add("visible");
      } else {
        document.getElementById("link").classList.remove("visible");
        document.getElementById("link").classList.add("invisible");
      }
      document.getElementById("inmobiliaria").innerHTML = inmobiliaria;
      document.getElementById("responsable").innerHTML = responsable;
      document.getElementById("telefono").innerHTML = telefono;
      document.getElementById("email").innerHTML = email;
    });
  }
  }
}

function getData() {
  var url = "https://sheets.googleapis.com/v4/spreadsheets/1h5QpK4d5NAmDET20Pe7tAgDYcWjXzztUSV7Qq0ALIuk/values/Propiedades!A6:M?key=AIzaSyBb6E0QnyBTlhp-b9JyEyWsL9qAHhKcAiw";
  var datos = [];
  fetch(url).then(response => response.json())
    .then(data => {
      console.log(data);
      cargarMapa(data.values);
    });
}