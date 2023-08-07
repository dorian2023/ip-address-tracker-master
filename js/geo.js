const ip = document.getElementById('ip');
const locationIP = document.getElementById('locationIP');
const timezone = document.getElementById('timezone');
const isp = document.getElementById('isp');

//Mensaje de bienvenida
window.addEventListener('load', function() {
    document.getElementById('overlay2').style.display = 'block';
    document.getElementById('welcome-message-box').style.display = 'block';
});

document.getElementById('welcome-message-ok-button').addEventListener('click', function() {
    document.getElementById('overlay2').style.display = 'none';
    document.getElementById('welcome-message-box').style.display = 'none';
});
//Codigo para que el presionar la tecla entre elimine el cuadro de texto de bienvenida
document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('overlay2').style.display = 'none';
        document.getElementById('welcome-message-box').style.display = 'none';
        document.getElementById('inputIP').focus(); //Coloca el cursor en el campo de inputIP despues de presionar OK!
    }
});
 // Ejecuta la misma acción que se ejecuta cuando se hace clic en el botón "btnIP"
document.getElementById('inputIP').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        searchIP();
    }
});
//No deja colocar carateres que no sean puntos y numeros en el campo input
document.getElementById('inputIP').addEventListener('input', function() {
    // Verifica si el valor del campo de entrada contiene solo números y puntos
    if (!/^[0-9.]*$/.test(this.value)) {
        // Actualiza el valor del campo de entrada para eliminar los caracteres no válidos
        this.value = this.value.replace(/[^0-9.]/g, '');
    }
});



//Le agregue esta Variable let map.
let map = L.map('map').fitWorld();

const searchIP = (event) => {
    //Muestra el elemento de carga.
    document.getElementById("loading").style.display = "block";
    document.getElementById("overlay").style.display = "block";

    //Constantes 
    const geoAPI = async(url)=> {
        const dataGEO = await fetch(url);
        const resultData = await dataGEO.json();
        return resultData;
    }
    // Utiliza la constante geoAPI para buscar el url
    geoAPI(`https://geo.ipify.org/api/v2/country,city?apiKey=at_QyBpef7f7UZ7uvk9nBhj12w86tSvT&ipAddress=${inputIP.value}`)
        .then((res) => {
            ip.innerText = res.ip;
            locationIP.innerText = res.location.city;
            timezone.innerText = res.location.timezone;
            isp.innerText = res.isp;

            // Elimina el mapa anterior
            map.eachLayer(function (layer) {
                map.removeLayer(layer);
            });
            
            // Actualiza el mapa  y aggrega un nuevo mapa.
            map.setView([res.location.lat, res.location.lng], 13);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '© OpenStreetMap'
            }).addTo(map);

            map.locate({setView: true, maxZoom: 18});
            
            // Crea un nuevo ícono personalizado
            let myIcon = L.divIcon({
                className: 'my-icon',
                html: '<svg xmlns="http://www.w3.org/2000/svg" width="46" height="56"><path fill-rule="evenodd" d="M39.263 7.673c8.897 8.812 8.966 23.168.153 32.065l-.153.153L23 56 6.737 39.89C-2.16 31.079-2.23 16.723 6.584 7.826l.153-.152c9.007-8.922 23.52-8.922 32.526 0zM23 14.435c-5.211 0-9.436 4.185-9.436 9.347S17.79 33.128 23 33.128s9.436-4.184 9.436-9.346S28.21 14.435 23 14.435z"/></svg>',
                iconSize: [11, 14],
                iconAnchor: [5.5, 7]
            });

            //Variable de la punta de localización.
            let marker = L.marker([res.location.lat, res.location.lng], {icon: myIcon}).addTo(map);
            marker.bindPopup("<b>Hola esta es la aplicacion de Dorian</b><br>Adelante!...").openPopup();

            //Evento en el que haciendo click en cualquier parte de mapa, abre una ventana emergenten con informacion de coordenadas.
            //Despues se actualiza y borrar el mapa.
            const popup2 = L.popup();
            function onMapClick(e) {
                popup2
                    .setLatLng(e.latlng)
                    .setContent("Hicistes click en las siguientes coordenadas: " + e.latlng.toString())
                    .openOn(map);
            }
            
            map.on('click', onMapClick);

            //Funcion
            function onLocationFound(e) {
                var radius = e.accuracy;
            
                L.marker(e.latlng).addTo(map)
                    .bindPopup("Estas dentro de  " + radius + " metros desde este punto").openPopup();
            
                L.circle(e.latlng, radius).addTo(map);
            }
            
            map.on('locationfound', onLocationFound);
        
        // Oculta el elemento de carga después de actualizar el mapa
        document.getElementById("loading").style.display = "none";
        document.getElementById("overlay").style.display = "none";
        })
            .catch((err) => {
            console.log(err);
        
        // Oculta el elemento de carga si ocurre un error
        document.getElementById("loading").style.display = "none";
        document.getElementById("overlay").style.display = "none";


    })
    .catch((err) => console.log(err));
}
btnIP.addEventListener('click', searchIP);