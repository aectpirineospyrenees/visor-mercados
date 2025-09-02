var map = L.map("contenedor-mapa").setView([42.84860271917637, -0.3145734537237116], 9);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Cargar GeoJSON de límites
fetch('data/limites.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            style: function(feature) {
                return {
                    color: "#333333",
                    weight: 4,
                    opacity: 1
                };
            }
        }).addTo(map);
    })
    .catch(err => console.error("Error cargando GeoJSON de límites:", err));

// Icono SVG
const marketIcon = L.icon({
    iconUrl: 'icons/market.svg',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
});

let markers = [];
let markersCluster = L.markerClusterGroup();

// Orden de días (Español/Francés) y semanas
const ordenDias = [
    "Lunes/Lundi",
    "Martes/Mardi",
    "Miércoles/Mercredi",
    "Jueves/Jeudi",
    "Viernes/Vendredi",
    "Sábado/Samedi",
    "Domingo/Dimanche"
];
const ordenSemanas = ["1", "2", "3", "4"];

function ordenarSegunLista(array, listaReferencia) {
    return array.sort((a, b) => {
        let iA = listaReferencia.indexOf(a);
        let iB = listaReferencia.indexOf(b);
        if (iA === -1) iA = array.length;
        if (iB === -1) iB = array.length;
        return iA - iB;
    });
}

// Cargar GeoJSON de mercados
fetch('data/mercados_aect.geojson')
    .then(response => response.json())
    .then(data => {
        L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                let marker = L.marker(latlng, { icon: marketIcon });
                markers.push({ marker, props: feature.properties });
                markersCluster.addLayer(marker);
                return marker;
            },
            onEachFeature: function(feature, layer) {
                updatePopup(layer, feature.properties);
            }
        });

        map.addLayer(markersCluster);
        initFilters();
    });

// Popups tipo tarjeta con filas flexibles
function updatePopup(layer, props) {
    let popupContent = '<div class="popup-tarjeta">';

    // Nombre centrado
    const nombre = props.nombre || 'Sin nombre';
    popupContent += `<h3>${nombre}</h3>`;

    const customTitles = {
        nombre_tipo: "Tipo de Mercado/Type de marché",
        nombre_frecuencia: "Frecuencia/Fréquence",
        nombre_semana: "Semana del mes",
        nombre_dia: "Día de la semana/Semaine du mois",
        nombre_apertura: "Horario de apertura/Horaires d'ouverture",
        direccion: "Dirección/Adresse",
        horario: "Horario/Horaires",
        num_postes: "Número de postes/Nombre de postes",
        municipios_communes: "Municipio/Commune",
        comarca: "Comarca",
        provincia_departement: "Provincia/Departement"
    };

    for (let key in props) {
        if (props.hasOwnProperty(key)) {
            if (key === "row_number" || key.toLowerCase().includes("coord") || key.toLowerCase().includes("id_") || key === "nombre") continue;
            let title = customTitles[key] || key;
            popupContent += `<div class="popup-row"><b>${title}:</b> <span>${props[key]}</span></div>`;
        }
    }

    popupContent += '</div>';

    layer.bindPopup(popupContent, {
        className: 'popup-tarjeta-popup',
        minWidth: 250,
        maxWidth: 600,
        autoPanPadding: [10, 10]
    });
}

// Filtrar marcadores usando cluster
function filtrarMarcadores() {
    let filtroTipo = document.getElementById('filtro-tipo').value;
    let filtroFrecuencia = document.getElementById('filtro-frecuencia').value;
    let filtroSemana = document.getElementById('filtro-semana').value;
    let filtroDia = document.getElementById('filtro-dia').value;
    let filtroApertura = document.getElementById('filtro-apertura').value;

    markersCluster.clearLayers();

    markers.forEach(({ marker, props }) => {
        let mostrar = true;

        if (filtroTipo && props.nombre_tipo != filtroTipo) mostrar = false;
        if (filtroFrecuencia && props.nombre_frecuencia != filtroFrecuencia) mostrar = false;
        if (filtroSemana && props.nombre_semana != filtroSemana) mostrar = false;
        if (filtroDia && props.nombre_dia != filtroDia) mostrar = false;
        if (filtroApertura && props.nombre_apertura != filtroApertura) mostrar = false;

        if (mostrar) markersCluster.addLayer(marker);
    });
}

// Inicializar filtros
function initFilters() {
    const filtroIds = ['filtro-tipo', 'filtro-frecuencia', 'filtro-semana', 'filtro-dia', 'filtro-apertura'];
    const keys = ['nombre_tipo', 'nombre_frecuencia', 'nombre_semana', 'nombre_dia', 'nombre_apertura'];

    keys.forEach((key, index) => {
        const filtro = document.getElementById(filtroIds[index]);
        let valoresUnicos = [...new Set(markers.map(m => m.props[key]).filter(v => v))];

        if (key === 'nombre_dia') valoresUnicos = ordenarSegunLista(valoresUnicos, ordenDias);
        if (key === 'nombre_semana') valoresUnicos = ordenarSegunLista(valoresUnicos, ordenSemanas);

        if (key !== 'nombre_dia' && key !== 'nombre_semana') valoresUnicos.sort();

        valoresUnicos.forEach(val => {
            let option = document.createElement('option');
            option.value = val;
            option.textContent = val;
            filtro.appendChild(option);
        });
    });

    filtroIds.forEach(id => document.getElementById(id).addEventListener('change', filtrarMarcadores));
}
