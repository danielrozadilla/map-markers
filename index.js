function initMap() {
    const myLatLng = {
        lat: -34.918325834069165,
        lng: -57.96829147114838
    };
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 12,
        center: myLatLng,     
    });
    map.setOptions({ styles: [
        /*{
          featureType: "poi.business",
          stylers: [{ visibility: "off" }],
        },      */
          {
            featureType: "poi",
            stylers: [{ visibility: "off" }],
          },
        {
          featureType: "transit",
          elementType: "labels.icon",
          stylers: [{ visibility: "off" }],
        },
      ] });

    //const image =
        "https://developers.google.com/maps/documentation/javascript/examples/full/images/beachflag.png";

    // Create an info window to share between markers.
    //const infoWindow = new google.maps.InfoWindow();

    const beaches = [
        ["Bondi Beach", -34.890542, -57.974856, 4, "https://google.com"],
        ["Coogee Beach", -34.893342, -57.983356, 5, "https://google.com"],
        ["Cronulla Beach", -34.870542, -57.868856, 3, "https://google.com"],
        ["Manly Beach", -34.870542, -57.984456, 2, "https://google.com"],
        ["Maroubra Beach", -34.950542, -57.972856, 1, "https://google.com"],
    ];

    for (let i = 0; i < beaches.length; i++) {
        const beach = beaches[i];

        const marker = new google.maps.Marker({
            position: {
                lat: beach[1],
                lng: beach[2]
            },
            map,
            //icon: image,
            title: beach[0],
            zIndex: beach[3],
            label: beach[3].toString(),
        });

        // Add a click listener for each marker, and set up the info window.
        marker.addListener("click", () => {
            //infoWindow.close();
            //infoWindow.setContent(beach[4]);
            //infoWindow.open(marker.getMap(), marker);
            document.getElementById("card").innerHTML="<h2>"+beach[0]+" <a href='"+beach[4]+"'>Ver</a></h2>";
        });
        
    }
}