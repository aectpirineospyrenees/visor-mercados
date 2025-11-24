// ================= MAPA =================
var map = L.map("contenedor-mapa").setView([42.8486, -0.3145], 9);

// Definir mapas base típicos de OpenStreetMap
const osmStandard = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19
});

const osmTopo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="https://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)',
    maxZoom: 17
});

const osmSatelital = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19
});




// Añadir el control de capas
const baseMaps = {
    "OSM Standard": osmStandard,
    "OSM Topographic": osmTopo,
    "OSM Satelital": osmSatelital,
};

// Añadir el control al mapa
L.control.layers(baseMaps, null, { position: 'bottomleft', collapsed: false }).addTo(map);

// Establecer el mapa base inicial
osmStandard.addTo(map);

const iconsProductosAgro = {
    "Bulbos, rizomas y similares": L.icon({ iconUrl: 'icons/bulbos.svg', iconSize:[32,32], iconAnchor:[16,32], popupAnchor:[0,-32] }),
    "Cereales": L.icon({ iconUrl: 'icons/cereales.svg', iconSize:[32,32], iconAnchor:[16,32], popupAnchor:[0,-32] }),
    "Frutas y hortalizas de fruto": L.icon({ iconUrl: 'icons/frutas.svg', iconSize:[32,32], iconAnchor:[16,32], popupAnchor:[0,-32] }),
    "Hortalizas de hoja y tallo": L.icon({ iconUrl: 'icons/hortalizas.svg', iconSize:[32,32], iconAnchor:[16,32], popupAnchor:[0,-32] }),
    "Legumbres": L.icon({ iconUrl: 'icons/legumbres.svg', iconSize:[32,32], iconAnchor:[16,32], popupAnchor:[0,-32] }),
    "Raices y tubérculos": L.icon({ iconUrl: 'icons/tuberculos.svg', iconSize:[32,32], iconAnchor:[16,32], popupAnchor:[0,-32] })
};

// Función genérica para crear iconos
function crearIcono(ruta) {
    return L.icon({
        iconUrl: ruta,              // dirección de la imagen
        iconSize: [32, 32],         // tamaño
        iconAnchor: [16, 32],       // punto de anclaje
        popupAnchor: [0, -32],      // punto de anclaje del popup
    });
}

// Ejemplos de uso
const turismoIcon    = crearIcono("icons/turismo.svg");
const hotelesIcon    = crearIcono("icons/hotel.svg");
const campingIcon    = crearIcono("icons/camping.svg");
const albergueIcon   = crearIcono("icons/albergue.svg");
const refugioIcon    = crearIcono("icons/refugio.svg");
const restaurantesIcon = crearIcono("icons/restaurante.svg");
const balneariosIcon = crearIcono("icons/spa.svg");
const museosIcon     = crearIcono("icons/museo.svg");
const arbolesIcon    = crearIcono("icons/arbol.svg");
const marketIconMercados = crearIcono('icons/market.svg');
const marketIconEscuelas = crearIcono('icons/escuelas_formacion.svg');
const marketIconOtrosCentros = crearIcono('icons/otros_centros.svg');
const miradoresIcon = crearIcono("icons/mirador.svg");
const castilloIcon = crearIcono('icons/castillo.svg');
const monumentoIcon = crearIcono('icons/monumento.svg');
const monumentoReligiosoIcon = crearIcono('icons/monumentos_religiosos.svg');
const restosArqueologicosIcon = crearIcono('icons/restos_arqueologicos.svg');
const glaciaresIcon = crearIcono("icons/glaciar.svg");
const zonaBanoIcon = crearIcono("icons/zona_bano.svg");
const piscinasIcon = crearIcono("icons/piscina.svg");
const productorIcon = crearIcono ("icons/productor.svg");
const comerciosIcon = crearIcono ("icons/tienda.svg");
const skiIcon = crearIcono ("icons/ski.svg");
const empresasNieveIcon = crearIcono ("icons/empresas_nieve.svg")
const productoresProximidadIcon = crearIcono("icons/productor.svg");
const nucleosClaveIcon = crearIcono("icons/marker.svg");
const puntosEscaladaIcon = crearIcono("icons/escalada.svg");
const empresasEscaladasIcon = crearIcono("icons/empresas_escalada.svg");
const viaFerrataIcon = crearIcono("icons/via_ferrata.svg");
const viaFerrataEmpresasIcon = crearIcono("icons/empresas_via_ferrata.svg");
const canyoningIcon = crearIcono("icons/canyoning.svg");
const empresasCanyoningIcon = crearIcono("icons/empresas_canyoning.svg");
const itinerariosadaptadosIcon = crearIcono("icons/itinerarios_adaptados.svg");
const itinerariospedestresIcon = crearIcono("icons/itinerarios_pedestres.svg");
const itinerariosequestresIcon = crearIcono("icons/itinerarios_equestres.svg");
const ittinerariostrailrunningIcon = crearIcono("icons/itinerarios_trailrunning.svg");
const bosqueIcon = crearIcono("icons/bosque.svg");

function normalizaTexto(s){
    return (s || "").toString()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase().trim();
}

const aliasTipoProducto = {
    "bulbos, rizomas y similares": "Bulbos, rizomas y similares",
    "cereales": "Cereales",
    "frutas y hortalizas de fruto": "Frutas y hortalizas de fruto",
    "hortalizas de hoja y tallo": "Hortalizas de hoja y tallo",
    "legumbres": "Legumbres",
    "raices y tuberculos": "Raices y tubérculos",
    "raíces y tuberculos": "Raices y tubérculos"
};

function getIconoProductoAgro(tipo){
    const keyNorm = normalizaTexto(tipo);
    const canonica = aliasTipoProducto[keyNorm];
    const icono = canonica ? iconsProductosAgro[canonica] : null;
    return icono || DEFAULT_ICON_AGRO;
}


// ================= VARIABLES =================
let buffersInfluenciaLayer;
let limitesLayer;
let carreterasLayer;
let vttLayer;
let markers = [];
let markersCentros = [];
let productosMarkers = [];
let turismoMarkers = [];
let restaurantesMarkers = [];
let hotelesMarkers = [];
let campingsMarkers = [];
let alberguesMarkers = [];
let refugiosMarkers = [];
let fortalezasMarkers = [];
let monumentosMarkers = [];
let monumentosReligiososMarkers = [];
let restosArqueologicosMarkers = [];
let balneariosMarkers = [];
let museosMarkers = [];
let arbolesMarkers = [];
let miradoresMarkers = [];
let glaciaresMarkers = [];
let zonasBanosMarkers = [];
let piscinasMarkers = [];
let productoresMarkers = [];
let comerciosMarkers = [];
let skiMarkers = [];
let empresasNieveMarkers = [];
let productoresProximidadMarkers = [];
let nucleosclaveMarkers = [];
let puntosEscaladaMarkers = [];
let empresasEscaladaMarkers = [];
let viaFerrataMarkers = [];
let empresasViaFerrataMarkers = [];
let canyoningMarkers = [];
let empresasCanyoningMarkers = [];
let itinerariosAdaptadosMarkers = [];
let itinerariosPedestresMarkers = [];
let itinerariosEquestresMarkers = [];
let itinerariosTrailrunningMarkers = [];
const itinerariosPedestresTracksMarkers = L.layerGroup();
const rutasArboledasLayer = L.layerGroup();
let bosquesMarkers = [];
const ordenDias = ["Lunes/Lundi","Martes/Mardi","Miércoles/Mercredi","Jueves/Jeudi","Viernes/Vendredi","Sábado/Samedi","Domingo/Dimanche"];
const ordenSemanas = ["Primera semana del mes/Première semaine du mois","Segunda semana del mes/Deuxième semaine du mois","Tercera semana del mes/Troisième semaine du mois","Cuarta semana del mes/Quatrième semaine du mois","Todas las semanas/Toutes les semaines"];

function ordenarSegunLista(array, listaReferencia) {
    return array.sort((a,b)=>{
        let iA = listaReferencia.indexOf(a);
        let iB = listaReferencia.indexOf(b);
        if(iA===-1) iA=array.length;
        if(iB===-1) iB=array.length;
        return iA-iB;
    });
}


// ================= FUNCIONES GENERALES =================

    // Función para mostrar avisos modernos (tipo toast)
        function mostrarAvisoModerno(mensajes, duracion = 3000) {
            const container = document.getElementById('toast-container');
            if (!container) {
                console.error("El contenedor #toast-container no fue encontrado.");
                alert(mensajes.es + "\n" + mensajes.fr); 
                return;
            }

            const toast = document.createElement('div');
            toast.classList.add('toast');
            
            const pEs = document.createElement('p');
            pEs.textContent = mensajes.es;
            toast.appendChild(pEs);

            const pFr = document.createElement('p');
            pFr.textContent = mensajes.fr;
            pFr.style.marginTop = '5px';
            toast.appendChild(pFr);
            
            // Add the source if the 'fuente' property exists
            if (mensajes.fuente) {
                const pFuente = document.createElement('p');
                pFuente.innerHTML = `<strong>Fuente:</strong> ${mensajes.fuente}`;
                pFuente.style.marginTop = '10px';
                pFuente.style.fontSize = '0.9em'; // Slightly smaller font for the source
                pFuente.style.color = '#ccc'; // Lighter color for better readability
                toast.appendChild(pFuente);
            }
            
            container.appendChild(toast);

            void toast.offsetWidth; 
            toast.classList.add('show');

            setTimeout(() => {
                toast.classList.remove('show');
                toast.addEventListener('transitionend', () => {
                    toast.remove();
                }, { once: true });
            }, duracion);
        }

        
// ================= CLUSTERS =================
// Función genérica para crear clusters con icono
function crearCluster(rutaIcono) {
    return L.markerClusterGroup({
        iconCreateFunction: cluster => {
            const count = cluster.getChildCount();
            return L.divIcon({
                html: `
                    <div class="cluster-icon">
                        <img src="${rutaIcono}" width="32" height="32"/>
                        <div class="cluster-count">${count}</div>
                    </div>`,
                className: 'custom-cluster',
                iconSize: [40, 40]
            });
        }
    });
}

// Función específica para el estilo de productos agro
function crearClusterAgro() {
    return L.markerClusterGroup({
        iconCreateFunction: cluster => {
            const count = cluster.getChildCount();
            return L.divIcon({
                html: `<div style="
                    background: linear-gradient(135deg, #b1d69fff, #b1d69fff);
                    color: white;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    width: 32px;
                    height: 32px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                    font-size: 14px;
                ">${count}</div>`,
                className: 'custom-cluster',
                iconSize: [40, 40]
            });
        }
    });
}

// Ejemplos de uso
const mercadosCluster              = crearCluster("icons/market.svg");
const escuelasCluster              = crearCluster("icons/escuelas_formacion.svg");
const centrosCluster               = crearCluster("icons/escuelas_formacion.svg");
const otrosCentrosCluster          = crearCluster("icons/otros_centros.svg");
const productosAgroCluster         = crearClusterAgro();
const hotelesCluster               = crearCluster("icons/hotel.svg");
const turismoCluster               = crearCluster("icons/turismo.svg");
const restaurantesCluster          = crearCluster("icons/restaurante.svg");
const campingsCluster              = crearCluster("icons/camping.svg");
const alberguesCluster             = crearCluster("icons/albergue.svg");
const refugiosCluster              = crearCluster("icons/refugio.svg");
const fortalezasCluster            = crearCluster("icons/castillo.svg");
const monumentosCluster            = crearCluster("icons/monumento.svg");
const monumentosReligiososCluster  = crearCluster("icons/monumentos_religiosos.svg");
const restosArqueologicosCluster   = crearCluster("icons/restos_arqueologicos.svg");
const balneariosCluster            = crearCluster("icons/spa.svg");
const museosCluster                = crearCluster("icons/museo.svg");
const arbolesCluster               = crearCluster("icons/arbol.svg");
const miradoresCluster             = crearCluster("icons/mirador.svg");
const glaciaresClusters            = crearCluster("icons/glaciar.svg");
const zonasBanosClusters           = crearCluster("icons/zona_bano.svg");
const piscinasClusters             = crearCluster("icons/piscina.svg");
const productoresClusters          = crearCluster("icons/productor.svg");
const comerciosClusters            = crearCluster("icons/tienda.svg");
const skiClusters                  = crearCluster("icons/ski.svg");
const empresasNieveClusters         = crearCluster("icons/empresas_nieve.svg");
const productoresProximidadClusters = crearCluster("icons/productor.svg");
const nucleosClaveClusters          = crearCluster("icons/marker.svg");
const puntosEscaladaClusters        = crearCluster("icons/escalada.svg");
const empresasEscaladaClusters      = crearCluster("icons/empresas_escalada.svg");
const viaFerrataClusters            = crearCluster("icons/via_ferrata.svg");
const empresasViaFerrataClusters    = crearCluster("icons/empresas_via_ferrata.svg");
const canyoningClusters             = crearCluster("icons/canyoning.svg");
const empresasCanyoningClusters     = crearCluster("icons/empresas_canyoning.svg");
const itinerariosAdaptadosClusters  = crearCluster("icons/itinerarios_adaptados.svg");
const itinerariosPedestresClusters  = crearCluster("icons/itinerarios_pedestres.svg");
const itinerariosEquestresClusters  = crearCluster("icons/itinerarios_equestres.svg");
const itinerariosTrailrunningClusters = crearCluster("icons/itinerarios_trailrunning.svg");
const bosquesClusters              = crearCluster("icons/bosque.svg");
// ================= CARGA GEOJSON =================
async function cargarLimites(){
    try{
        const data = await (await fetch('data/limites.geojson')).json();
        limitesLayer = L.geoJSON(data, { style:{ color:"#333", weight:4, opacity:1 }}).addTo(map);
        map.fitBounds(limitesLayer.getBounds());
    }catch(e){console.error(e);}
}

async function cargarProductosAgro(){
    try{
        const data = await (await fetch('data/productos_agro.geojson')).json();
        L.geoJSON(data,{
            pointToLayer:(feature, latlng)=>{
                const tipo = feature?.properties?.tipo_producto;
                const icono = getIconoProductoAgro(tipo);
                const marker = L.marker(latlng,{icon:icono});
                productosAgroCluster.addLayer(marker);
                productosMarkers.push({marker, props:feature.properties});
                return marker;
            },
            onEachFeature:(feature, layer)=>updatePopupProductosAgro(layer, feature.properties)
        });
        // NO agregar al mapa por defecto
    }catch(e){console.error(e);}
}

async function cargarGeoJSON(url, cluster, markersArray, icon, popupFn) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Cargando:", url, "features:", data.features.length);
        L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
                const marker = icon ? L.marker(latlng, { icon }) : L.marker(latlng);
                cluster.addLayer(marker);
                if (markersArray) markersArray.push({ marker, props: feature.properties });
                return marker;
            },
            onEachFeature: (feature, layer) => {
                if (popupFn) popupFn(layer, feature.properties);
            }
        });
        // NO agregar al mapa por defecto
        // map.addLayer(cluster);
    } catch (e) {
        console.error("Error loading GeoJSON:", url, e);
    }
}

async function cargarLineas(url, layerGroup, styleFn, popupFn) {
    try {
        const response = await fetch(url);
        const data = await response.json();

        // Crear la capa GeoJSON
        const geoJsonLayer = L.geoJSON(data, {
            style: styleFn, // Función para el estilo de las líneas
            onEachFeature: (feature, layer) => {
                if (popupFn) popupFn(layer, feature.properties); // Vincular popups si se proporciona
            }
        });

        // Si se proporciona un `layerGroup`, añadir la capa al grupo
        if (layerGroup) {
            layerGroup.addLayer(geoJsonLayer);
        } else {
            // Si no se proporciona un `layerGroup`, añadir directamente al mapa
            geoJsonLayer.addTo(map);
        }

        return geoJsonLayer; // Retornar la capa creada
    } catch (error) {
        console.error("Error al cargar las líneas GeoJSON:", error);
        return null;
    }
}

async function cargarCarreteras() {
    try {
        const data = await (await fetch('data/distribucion_logistica/rutas_distribucion.geojson')).json();

        // Capa de fondo gris ancho
        const fondoCarreteras = L.geoJSON(data, {
            style: {
                color: '#737373', // Gris claro para fondo
                weight: 6,
                opacity: 0.8,
                lineCap: 'round'
            },
            pane: 'carreterasPane' // Asignar el pane específico
        });

        // Capa principal de carreteras (sobre el fondo)
        const capaCarreteras = L.geoJSON(data, {
            style: {
                color: '#ffe14cff', // Color pastel moderno
                weight: 3,
                opacity: 1,
                lineCap: 'round'
            },
            pane: 'carreterasPane' // Asignar el pane específico
        });

        // Combinar ambas capas en un LayerGroup
        carreterasLayer = L.layerGroup([fondoCarreteras, capaCarreteras]);

    } catch (e) {
        console.error("Error cargando las carreteras:", e);
    }
}

async function cargarBuffersInfluencia() {
    try {
        const data = await (await fetch('data/distribucion_logistica/buffers_influencia.geojson')).json();

        // Definir estilos según el valor de distancia_ruta
        const estiloBuffer = (feature) => {
            const colores = {
                10: '#dfa6b4', // Color para distancia_ruta = 10
                30: '#b9d564', // Color para distancia_ruta = 30
                50: '#b2f7f1'  // Color para distancia_ruta = 50
            };
            const color = colores[feature.properties.distancia_ruta] || '#cccccc'; // Color por defecto
            return {
                fillColor: color,
                color: color,
                weight: 1,
                fillOpacity: 0.6,
                pane: 'buffersPane' // Asignar el pane específico
            };
        };

        // Crear la capa GeoJSON
        buffersInfluenciaLayer = L.geoJSON(data, {
            style: estiloBuffer
        });

    } catch (e) {
        console.error("Error cargando los buffers de influencia:", e);
    }
}

// Definir estiloVTT globalmente
const estiloVTT = (feature) => {
    const dificultad = feature.properties.grado_dificultad || '';
    let color;

    switch (dificultad.toLowerCase()) {
        case 'fácil / facile':
            color = 'green'; // Verde
            break;
        case 'intermedio / intermédiaire':
            color = 'blue'; // Azul
            break;
        case 'dificil / difficile':
            color = 'red'; // Roja
            break;
        case 'muy dificil / très difficile':
            color = 'black'; // Negra
            break;
        default:
            color = '#cccccc'; // Gris para valores desconocidos
    }

    return {
        color: color,
        weight: 3,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round'
    };
};

async function cargarCapaVTT() {
    try {
        const data = await (await fetch('data/turismo_activo/btt.geojson')).json();

        // Crear la capa GeoJSON y asignarla a la variable global
        vttLayer = L.geoJSON(data, {
            style: estiloVTT, // Usa la función global estiloVTT
            onEachFeature: (feature, layer) => updatePopupVTT(layer, feature.properties)
        });
        console.log('Capa VTT cargada correctamente.');
        initFiltersVTT();
    } catch (error) {
        console.error('Error al cargar la capa VTT:', error);
    }
}


// ================= GRUPO DE CAPAS DE DISTRIBUCIÓN Y LOGÍSTICA =================
async function inicializarCapasDistribucionLogistica() {
    await cargarCarreteras(); // Asegurarse de que la capa de carreteras esté cargada
    await cargarBuffersInfluencia(); // Asegurarse de que la capa de buffers esté cargada
    const capasExistentes = [
        { nombre: 'Rutas de distribución / Routes de distribution', layer: carreterasLayer },
        { nombre: 'Productores de proximidad / Producteurs de proximité', layer: productoresProximidadClusters },
        { nombre: 'Núcleos Clave / Noyaux Clés', layer: nucleosClaveClusters },
        { nombre: 'Buffers de influencia / Buffers d\'influence', layer: buffersInfluenciaLayer }
    ];

    const listaCapasExistentes = document.getElementById('lista-capas-existentes');
    const iconosCapas = {
        'Rutas de distribución / Routes de distribution': 'carretera.svg',
        'Productores de proximidad / Producteurs de proximité': 'productor.svg',
        'Núcleos Clave / Noyaux Clés': 'marker.svg',
        'Buffers de influencia / Buffers d\'influence': 'area.svg'
    };

    capasExistentes.forEach((capa) => {
        const item = document.createElement('li');
        item.classList.add('sidebar-checkboxes'); // Añadir la clase para aplicar el estilo

        const label = document.createElement('label');
        label.classList.add('styled-checkbox'); // Clase opcional para personalización adicional

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `capa-${capa.nombre.toLowerCase().replace(/\s+/g, '-')}`;
        checkbox.checked = map.hasLayer(capa.layer);
        checkbox.addEventListener('change', (e) => {
            if (e.target.checked) {
                map.addLayer(capa.layer);
            } else {
                map.removeLayer(capa.layer);
            }
            // Llamar a actualizarFiltrosAcordeon después de activar/desactivar la capa
            actualizarFiltrosAcordeon();
            actualizarLeyenda();
        });

        const icon = document.createElement('img');
        icon.src = `icons/${iconosCapas[capa.nombre]}`; // Usar el objeto para obtener la ruta del icono
        icon.width = 20;

        const text = document.createTextNode(` ${capa.nombre}`);

        label.appendChild(checkbox);
        label.appendChild(icon);
        label.appendChild(text);

        item.appendChild(label);
        listaCapasExistentes.appendChild(item);
    });

    // Botones para activar/desactivar todas las capas
    document.getElementById('activar-todas-capas').addEventListener('click', () => {
        capasExistentes.forEach((capa) => {
            map.addLayer(capa.layer);
            document.getElementById(`capa-${capa.nombre.toLowerCase().replace(/\s+/g, '-')}`).checked = true;
        });
        actualizarFiltrosAcordeon();
        actualizarLeyenda();
    });

    document.getElementById('desactivar-todas-capas').addEventListener('click', () => {
        capasExistentes.forEach((capa) => {
            map.removeLayer(capa.layer);
            document.getElementById(`capa-${capa.nombre.toLowerCase().replace(/\s+/g, '-')}`).checked = false;
        });
        actualizarFiltrosAcordeon();
        actualizarLeyenda();
    });
}


// ================= POPUPS =================
    //============== FUNCIONES GENÉRICAS PARA POPUPS ==============
        
        // Bind Popup genérico
        function bindPopupGenerico(layer, htmlContent, className = 'popup-generico', minWidth = 250, maxWidth = 500, maxHeight = 400) {
            layer.bindPopup(htmlContent, {
                className: className,
                minWidth: minWidth,
                maxWidth: maxWidth,
                maxHeight: maxHeight
            });
        }
        // Función para hacer clicables URLs y emails
        function makeClickable(value) {
            if (typeof value !== "string") return value;

            // Detectar URLs
            const urlPattern = /(https?:\/\/[^\s]+)/g;
            value = value.replace(urlPattern, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

            // Detectar emails
            const emailPattern = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
            value = value.replace(emailPattern, '<a href="mailto:$1">$1</a>');

            return value;
        }

        function popupSoloNombre(layer, props, className = 'popup-mercados', minWidth = 250, maxWidth = 400) {
            const nombre = props.nombre || props.Nom || props.Name || 'Sin nombre';
            layer.bindPopup(
                `<div class="${className}"><h3>${nombre}</h3></div>`,
                { className, minWidth, maxWidth }
            );
        }

        // Funciones para Boleanos y Fotos
        function generarBooleanos(props, booleanFields, titulo) {
            if (!booleanFields || booleanFields.length === 0) return '';

            let html = `<div class="popup-row"><b>${titulo}</b><div class="boolean-grid productores-boolean-grid">`;

            booleanFields.forEach(({ key, label }) => {
                // Verificar si el valor no es null o undefined
                if (props[key] !== null && props[key] !== undefined) {
                    const valor = props[key] === true; // Si es true, es "Disponible"
                    html += `<span class="boolean-tag${valor ? ' activo' : ''}">${label}</span>`;
                } else if (props[key] === false) {
                    // Si es false, mostrar como "No disponible"
                    html += `<span class="boolean-tag">${label}</span>`;
                }
            });

            html += `</div>
                <div class="popup-leyenda-boolean">🟩: Disponible / Oui<br>⬜: No disponible / Non</div>
            </div>`;

            return html;
        }

        function generarCarruselFotos(props, key, botonColor = "#20586aff") { // Azul claro por defecto
            if (!props[key]) return '';

            const fotosArray = props[key].split(',').map(f => f.trim()).filter(f => f !== '');
            if (fotosArray.length === 0) return '';

            const fotosId = `fotos-popup-${Math.random().toString(36).substring(2, 8)}`;
            let html = `
                <div class="popup-row">
                    <button class="btn-fotos" style="background-color: ${botonColor}; color: white; border: none; padding: 8px 12px; border-radius: 4px; cursor: pointer;" onclick="abrirPopupFotos('${fotosId}')">
                        Ver fotos / Voir les photos (${fotosArray.length})
                    </button>
                    <div id="${fotosId}" class="popup-fotos-overlay" style="display:none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.8); z-index: 1000; justify-content: center; align-items: center;">
                        <div class="popup-fotos-content" style="position: relative; background: white; padding: 20px; border-radius: 8px; max-width: 90%; max-height: 90%; overflow: auto;">
                            <span class="close-fotos" style="position: absolute; top: 10px; right: 10px; font-size: 24px; cursor: pointer; color: #333;" onclick="cerrarPopupFotos('${fotosId}')">&times;</span>
                            <div class="carousel-container" style="position: relative; text-align: center;">
                                <div class="carousel-slides">
                                    ${fotosArray.map((url, index) => `
                                        <div class="carousel-slide" style="${index === 0 ? 'display: block;' : 'display: none;'}">
                                            <img src="${url}" alt="Foto ${index + 1}" style="max-width: 100%; max-height: 80vh; border-radius: 8px;">
                                        </div>
                                    `).join('')}
                                </div>
                                <button class="carousel-prev" style="position: absolute; top: 50%; left: 10px; transform: translateY(-50%); background: rgba(0, 0, 0, 0.5); color: white; border: none; padding: 10px; cursor: pointer; border-radius: 50%;" onclick="plusSlide('${fotosId}', -1)">&#10094;</button>
                                <button class="carousel-next" style="position: absolute; top: 50%; right: 10px; transform: translateY(-50%); background: rgba(0, 0, 0, 0.5); color: white; border: none; padding: 10px; cursor: pointer; border-radius: 50%;" onclick="plusSlide('${fotosId}', 1)">&#10095;</button>
                                <div class="carousel-indicators" style="margin-top: 10px;">
                                    ${fotosArray.map((_, index) => `
                                        <span class="indicator" style="display: inline-block; width: 10px; height: 10px; margin: 0 5px; background: ${index === 0 ? '#ccc' : '#ccc'}; border-radius: 50%; cursor: pointer;" onclick="showSlide('${fotosId}', ${index})"></span>
                                    `).join('')}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

            return html;
        }
        // Función para abrir el popup de fotos
        function abrirPopupFotos(fotosId) {
            const popup = document.getElementById(fotosId);
            if (popup) {
                popup.style.display = 'flex';
            }
        }

        // Función para cerrar el popup de fotos
        function cerrarPopupFotos(fotosId) {
            const popup = document.getElementById(fotosId);
            if (popup) {
                popup.style.display = 'none';
            }
        }

        function showSlide(carouselId, index) {
            const container = document.getElementById(carouselId);
            if (!container) return;

            const slides = container.querySelectorAll(".carousel-slide");
            const indicators = container.querySelectorAll(".carousel-indicators .indicator"); // buscar correctamente

            // Asegurarse de que el índice esté dentro del rango
            if (index < 0) index = slides.length - 1;
            if (index >= slides.length) index = 0;

            // Mostrar solo la diapositiva activa
            slides.forEach((slide, i) => {
                slide.style.display = i === index ? "block" : "none";
            });

            // Actualizar los indicadores agregando/quitar la clase 'active'
            indicators.forEach((indicator, i) => {
                if (i === index) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });

            // Guardar el índice actual en el dataset del contenedor
            container.dataset.currentSlide = index;
        }


        function plusSlide(carouselId, n) {
            const container = document.getElementById(carouselId);
            if (!container) return;

            const slides = container.querySelectorAll(".carousel-slide");
            let current = parseInt(container.dataset.currentSlide || 0);
            let next = current + n;

            // Mostrar la diapositiva correspondiente
            showSlide(carouselId, next);
        }

        function getIconoRedSocial(redesSociales) {
            if (!redesSociales) return '';

            const iconos = {
                "Facebook": "fab fa-facebook",
                "Instagram": "fab fa-instagram",
                "Twitter": "fab fa-twitter", // Twitter (X)
                "X": "fab fa-x-twitter",    // X (anteriormente Twitter)
                "LinkedIn": "fab fa-linkedin",
                "YouTube": "fab fa-youtube",
                "TikTok": "fab fa-tiktok",
                "Flickr": "fab fa-flickr",  // Flickr
                "GoogleMyBusiness": "fas fa-map-marker-alt" // No hay un ícono específico, usamos un marcador
            };

            // Procesar las redes sociales
            const redesArray = redesSociales.split(",").map(r => r.trim()).filter(r => r !== "");
            if (redesArray.length === 0) return '';

            // Generar el HTML para las redes sociales
            return `
                <div class="popup-row">
                    <b>Redes sociales / Réseaux sociaux:</b>
                    <div class="redes-sociales-contenedor">
                        ${redesArray.map(red => {
                            const [nombre, url] = red.split(/:(.+)/).map(s => s.trim());
                            if (!url) return ""; // Si no hay URL, omitir
                            const validUrl = url.startsWith("http") ? url : `https://${url}`; // Asegurar prefijo http/https
                            const icono = iconos[nombre] || "fas fa-globe"; // Ícono genérico si no se encuentra
                            return `
                                <a href="${validUrl}" target="_blank" rel="noopener noreferrer" class="red-social">
                                    <i class="${icono}" title="${nombre}"></i>
                                </a>
                            `;
                        }).join("")}
                    </div>
                </div>`;
        }

    //============== ESTILOS CONCRETOS CAPAS =============

const estilo_itinerarios = (feature) => {
    const dificultad = feature.properties.dificultad || '';
    let color;

    switch (dificultad.toLowerCase()) {
        case 'muy fácil / très facile':
            color = 'green'; // Verde
            break;
        case 'fácil / facile':
            color = 'blue'; // Azul
            break;
        case 'media / moyenne':
            color = 'orange'; // Naranja
            break;
        case 'difícil / difficile':
            color = 'red'; // Roja
            break;
        case 'muy difícil / très difficile':
            color = 'black'; // Negra
            break;
        default:
            color = '#cccccc'; // Gris para valores desconocidos
    }

    return {
        color: color,
        weight: 3,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round'
    };
};

const estilo_rutas_arboledas = () => {
    return {
        color: '#228B22', // Verde bosque
        weight: 3,
        opacity: 0.8,
        lineCap: 'round',
        lineJoin: 'round'
    };
};

    //============= POPUPS ESPECÍFICOS =============
function updatePopupMercados(layer, props) {
    let html = `<div class="popup-mercados"><h3>${props.nombre || 'Sin nombre'}</h3>`;
    const titles = {
        nombre_tipo: "Tipo/Type",
        nombre_frecuencia: "Frecuencia / Fréquence",
        nombre_semana: "Semana / Semaine",
        nombre_dia: "Día / Jour",
        nombre_apertura: "Franja Horaria / Plage horaire",
        direccion: "Dirección / Adresse",
        horario: "Horario / Horaires",
        num_postes: "Nº postes",
        municipios_communes: "Municipio / Commune",
        comarca: "Comarca",
        provincia_departement: "Provincia / Departement"
    };

    // Tarjetas en la misma fila
    html += `
            <div class="tarjetas-fila">
            <div class="popup-number-card">
                <div class="number-value">${props.nombre_semana || '—'}</div>
                <div class="number-label">Semana / Semaine</div>
            </div>
            <div class="popup-number-card">
                <div class="number-value">${props.nombre_frecuencia || '—'}</div>
                <div class="number-label">Frecuencia / Fréquence</div>
            </div>
            <div class="popup-number-card">
                <div class="number-value">${props.nombre_apertura || '—'}</div>
                <div class="number-label">Franja Horaria / Plage horaire</div>
            </div>
        </div>
    `;

    // Mostrar días de la semana con el día actual coloreado
    if (props.nombre_dia) {
        const diasSemana = [
            "Lunes/Lundi",
            "Martes/Mardi",
            "Miércoles/Mercredi",
            "Jueves/Jeudi",
            "Viernes/Vendredi",
            "Sábado/Samedi",
            "Domingo/Dimanche"
        ];

        const diaActual = props.nombre_dia || ""; // Día actual
        html += `<div class="popup-row"><b>${titles.nombre_dia}:</b><div class="dias-semana">`;
        diasSemana.forEach(dia => {
            const activo = dia === diaActual ? "activo" : "";
            html += `<span class="dia-semana ${activo}">${dia}</span>`;
        });
        html += `</div></div>`;
    }

    // Mostrar otros campos normalmente
    for (let key in props) {
        if (!props.hasOwnProperty(key)) continue;
        if (["row_number", "nombre", "nombre_frecuencia", "nombre_semana", "nombre_apertura", "nombre_dia"].includes(key)) continue;
        if (key.toLowerCase().includes("coord") || key.toLowerCase().includes("id_")) continue;

        let val = makeClickable(props[key]);
        html += `<div class="popup-row"><b>${titles[key] || key}:</b> <span>${val}</span></div>`;
    }

    html += "</div>";
    layer.bindPopup(html, { className: 'popup-mercados', minWidth: 400, maxWidth: 600, maxHeight: 500 });
}

function updatePopupEscuelas(layer, props) {
    let html = `<div class="popup-escuelas">`;

    // Título del centro
    html += `<h3>${props.nombre_centro || 'Sin nombre'}</h3>`;

    // Etiqueta para "Tipo de centro"
    if (props.nombre_tipo_centro) {
        html += `
            <div class="etiquetas-contenedor">
                <span class="etiqueta-centro">${props.nombre_tipo_centro}</span>
            </div>`;
    }

    // Etiquetas para "Tipo de oferta"
    if (props.tipo_oferta) {
        const ofertas = Array.isArray(props.tipo_oferta)
            ? props.tipo_oferta
            : props.tipo_oferta.split(',').map(o => o.trim());
        html += `
            <div class="etiquetas-contenedor">
                ${ofertas.map(oferta => `
                    <span class="etiqueta-oferta">${oferta}</span>
                `).join('')}
            </div>`;
    }

    // Resto de los campos
    const titles = {
        nombre_tipo_centro: "Tipo",
        tipo_oferta: "Tipo estudios",
        oferta: "Oferta",
        email: "E-mail",
        telefono: "Teléfono",
        sitio_web: "Web",
        municipios_communes: "Municipio"
    };

    for (let key in props) {
        if (!props.hasOwnProperty(key)) continue;
        if (["row_number", "nombre_centro", "nombre_tipo_centro", "tipo_oferta"].includes(key)) continue;
        if (key.toLowerCase().includes("coord") || key.toLowerCase().includes("id_") || key.toLowerCase().includes("fid")) continue;

        let val = makeClickable(props[key]);
        if (Array.isArray(val)) {
            html += `<div class="popup-row"><b>${titles[key] || key}:</b><ul>${val.map(i => `<li>${makeClickable(i)}</li>`).join('')}</ul></div>`;
        } else {
            html += `<div class="popup-row"><b>${titles[key] || key}:</b> <span>${val}</span></div>`;
        }
    }

    html += "</div>";
    layer.bindPopup(html, { className: 'popup-escuelas', minWidth: 250, maxWidth: 400, maxHeight: 500 });
}

function updatePopupProductosAgro(layer, props){
    let html = `<div class="popup-productos"><h3>${props.producto || 'Sin nombre'}</h3>`;
    const titles = { producto: "Producto", tipo_producto: "Tipo de producto", comercializacion: "Comercialización", municipio_nombre: "Municipio/Commune", comarca_nombre: "Comarca", provincia: "Provincia/Departement"};
    
    // Mostrar todos los meses y colorear los de temporada
    const meses = [
        "enero","febrero","marzo","abril","mayo","junio",
        "julio","agosto","septiembre","octubre","noviembre","diciembre"
    ];
    let temporada = [];
    if (Array.isArray(props.meses_temporada)) {
        temporada = props.meses_temporada.map(m => normalizaTexto(m));
    } else if (typeof props.meses_temporada === "string") {
        temporada = props.meses_temporada.split(",").map(m => normalizaTexto(m));
    }

    html += `<div class="popup-row"><b>Temporada:</b><div class="meses-temporada">`;
    meses.forEach(mes => {
        const mesNorm = normalizaTexto(mes);
        const activo = temporada.includes(mesNorm);
        html += `<span class="mes-temporada${activo ? ' activo' : ''}">${mes.charAt(0).toUpperCase() + mes.slice(1)}</span>`;
    });
    html += `</div></div>`;

    // Resto de campos
    for(let key in props){
        if(!props.hasOwnProperty(key)) continue;
        if(["row_number","fid","producto","meses_temporada"].includes(key)) continue;
        if(key.toLowerCase().includes("coord") || key.toLowerCase().includes("id")) continue;
        let val = makeClickable(props[key]);
        if(Array.isArray(val)){
            html += `<div class="popup-row"><b>${titles[key] || key}:</b><ul>${val.map(i=>`<li>${makeClickable(i)}</li>`).join('')}</ul></div>`;
        } else {
            html += `<div class="popup-row"><b>${titles[key] || key}:</b> <span>${val}</span></div>`;
        }
    }
    html += "</div>";
    layer.bindPopup(html, { className:'popup-productos', minWidth:250, maxWidth:600 });
}


function updatePopupOficinasTurismo(layer, props) {
    let html = `<div class="popup-mercados"><h3>${props.nombre || 'Sin nombre'}</h3>`;
    
    const titles = {
        direccion: "Dirección / Adresse",
        telefono: "Teléfono / Téléphone",
        email: "E-mail / E-mail",
        web: "Web / Site",
        municipio: "Municipio/Commune",
        dia_semana: "Día de la semana / Jour de la semaine",
        horario: "Horario / Horaires"
    };

    // Mostrar solo los campos definidos en `titles`
    for (let key in titles) {
        if (!props.hasOwnProperty(key)) continue;
        const val = makeClickable(props[key]);
        if (val) {
            html += `<div class="popup-row"><b>${titles[key]}:</b> <span>${val}</span></div>`;
        }
    }

    // Generar sección de booleanos para apertura
    const booleanFields = [
        { key: "abierto_todo_año", label: "Abierto todo el año / Ouvert toute l'année" },
        { key: "abierto_navidad", label: "Abierto en Navidad / Ouvert à Noël" },
        { key: "abierto_semana_santa", label: "Abierto en Semana Santa / Ouvert à Pâques" },
        { key: "abierto_puentes", label: "Abierto en puentes / Ouvert pendant les ponts" }
    ];
    html += generarBooleanos(props, booleanFields, "Apertura / Ouverture");

    html += "</div>";

    layer.bindPopup(html, { className: 'popup-mercados', minWidth: 250, maxWidth: 600 });
}

function updatePopupAlojamientos(layer, props) {
    let html = `
    <div class="popup-productores" style="background:#fef3e0;padding:10px;border-radius:8px;">
        <h3 style="color:#8B4513; margin-bottom:8px;">${props.nom || props.nombre || 'Sin nombre'}</h3>`;

    const fieldsToShow = ["type", "adresse", "emails", "websites", "phones", "horarios", "tarifas"];

    const booleanFields = [
        { key: "permetanimaux", label: "Permite animales / Animaux acceptés" },
        { key: "accesible", label: "Accesible / Accessible" }
    ];

    const titles = {
        type: "Tipo / Type",
        emails: "E-mail",
        websites: "Sitio Web / Site Web",
        phones: "Teléfono / Phone",
        adresse: "Dirección / Adresse",
        horarios: "Horarios / Horaires",
        tarifas: "Tarifas / Tarifs",
    };

    function formatValue(value) {
        if (!value) return "—";
        let obj = value;
        if (typeof value === "string") {
            try { obj = JSON.parse(value); } catch { return makeClickable(value); }
        }
        if (typeof obj === "object") {
            const itemsSet = new Set();
            function extractValues(v) {
                if (!v || v === "NULL") return;
                if (Array.isArray(v)) v.forEach(sub => extractValues(sub));
                else if (typeof v === "object") Object.values(v).forEach(sub => extractValues(sub));
                else itemsSet.add(v);
            }
            extractValues(obj);
            if (itemsSet.size === 0) return "—";
            return `<ul style="margin:0; padding-left:20px;">${[...itemsSet].map(i => `<li>${makeClickable(i)}</li>`).join("")}</ul>`;
        }
        return makeClickable(value);
    }

    // Mostrar campos principales
    fieldsToShow.forEach(key => {
        if (props[key]) {
            html += `<div class="popup-row"><b>${titles[key] || key}:</b> ${formatValue(props[key])}</div>`;

            // Insertar redes sociales justo después de los teléfonos
            if (key === "phones" && props.redes_sociales) {
                html += `<div class="popup-row redes-sociales"> ${getIconoRedSocial(props.redes_sociales)}</div>`;
            }
        }
    });

    // Generar sección de booleanos
    html += generarBooleanos(props, booleanFields, "Servicios / Services");

    // Generar carrusel de fotos
    html += generarCarruselFotos(props, "fotos");

    html += "</div>";

    layer.bindPopup(html, {
        className: "popup-productores",
        minWidth: 450,
        maxWidth: 500,
        maxHeight: 500
    });
}

function updatePopupRestaurantes(layer, props) {
    let html = `<div class="popup-restaurantes" style="background:#fef3e0;padding:10px;border-radius:8px;">
                    <h3>${makeClickable(props.Nom) || makeClickable(props.nombre_establecimiento) || 'Sin nombre'}</h3>`;

    const titles = {
        direccion_establecimiento: "Dirección / Adresse",
        tipo_establecimiento: "Tipo / Type",
        etiqueta_calidad: "Etiquetas de calidad / Labels de qualité",
        descripcion_establecimiento: "Descripción establecimiento / Description de l'établissement",
        idiomas: "Idiomas hablados / Langues parlées",
        formas_pago: "Formas de pago / Moyens de paiement",
        horarios: "Horarios / Horaires",
        num_plazas_totales: "Nº plazas totales / Nbr de places totales",
        num_plazas_bar: "Nº plazas bar / Nbr de places au bar",
        num_plazas_mesas: "Nº plazas mesas / Nbr de places aux tables",
        num_plazas_terraza: "Nº plazas terraza / Nbr de places en terrasse"
    };

    const numericKeys = [
        "num_plazas_totales",
        "num_plazas_bar",
        "num_plazas_mesas",
        "num_plazas_terraza"
    ];

    // Mostrar campos definidos en titles
    for (let key of Object.keys(titles)) {
        const value = props[key];
        if (value !== undefined && value !== null && value !== '') {
            const label = titles[key];

            // Horarios en lista
            if (key === 'horarios') {
                let items = Array.isArray(value) ? value : value.split(',').map(s => s.trim());
                html += `<div class="popup-row"><b>${label}:</b><ul>`;
                items.forEach(item => html += `<li>${makeClickable(item)}</li>`);
                html += `</ul></div>`;

            // Campos numéricos → tarjetas visuales
            } else if (numericKeys.includes(key)) {
                html += `
                    <div class="popup-number-card">
                        <div class="number-value">${makeClickable(value)}</div>
                        <div class="number-label">${label}</div>
                    </div>`;

            // Campos normales → texto
            } else {
                html += `<div class="popup-row"><b>${label}:</b> <span>${makeClickable(value)}</span></div>`;
            }
        }
    }

    // Generar sección de booleanos
    const booleanFields = [
        { key: "animales_bienvenidos", label: "Animales bienvenidos / Animaux bienvenus" }
    ];
    html += generarBooleanos(props, booleanFields, "Servicios / Services");

        // Añadir redes sociales
    if (props.redes_sociales) {
        html += getIconoRedSocial(props.redes_sociales);
    }
    // Generar carrusel de fotos
    html += generarCarruselFotos(props, "fotos");
    html += "</div>";

    // Usar la función genérica para bindPopup
        layer.bindPopup(html, {
        className: "popup-restaurantes",
        minWidth: 450,
        maxWidth: 500,
        maxHeight: 500
    });
}


function updatePopupBalnearios(layer, props) {
    let html = `<div class="popup-productores" style="background:#E6FCFE;padding:10px;border-radius:8px;">
                    <h3>${makeClickable(props.Nom) || makeClickable(props.Nombre) || 'Sin nombre'}</h3>`;

    const titles = {
        tipo: "Tipo / Type",
        direccion_completa: "Dirección / Adresse",
        Email: "E-mail",
        Web: "Sitio Web / Site Web",
        Teléfono: "Teléfono / Phone",
        Descripción: "Descripción / Description",
        horarios: "Horarios de apertura / Horaires d'ouverture",
        Servicios: "Servicios / Services",
        descripcion_tarifa: "Tarifas / Tarifs",
    };

    // Mostrar campos normales
    for (let key of Object.keys(titles)) {
        if (props[key]) {
            html += `<div class="popup-row"><b>${titles[key]}:</b> ${makeClickable(props[key])}</div>`;
        }
    }

    // Generar sección de booleanos
    const booleanFields = [
        { key: "accesibilidad", label: "Accesibilidad adaptada / Accessibilité adaptée" }
    ];
    html += generarBooleanos(props, booleanFields, "Accesibilidad / Accessibilité");

    // Generar carrusel de fotos
    html += generarCarruselFotos(props, "Fotos");

    html += "</div>";

    bindPopupGenerico(layer, html, 'popup-productores', 400, 500, 500);
}


function updatePopupPatrimonioCultural(layer, props){
    let html = `<div class="popup-mercados" style="background:#E6FCFE;padding:10px;border-radius:8px;">
                    <h3>${makeClickable(props.Nom) || makeClickable(props.nombre) || 'Sin nombre'}</h3>`;

    const titles = {
        type: "Tipo / Type",
        Email: "E-mail",
        Website: "Sitio Web/Site Web",
        Phone: "Teléfono/Phone",
        Adresse2: "Dirección/Adresse",
        Commune: "Municipio / Commune",
        PermetAnim: "Permite Animales / Permet animaux",
    };

    for(let key of Object.keys(titles)){
        if(props[key]){
            html += `<div class="popup-row"><b>${titles[key]}:</b> <span>${makeClickable(props[key])}</span></div>`;
        }
    }

    html += "</div>";
    layer.bindPopup(html,{className:'popup-mercados', minWidth:250, maxWidth:400});
}

function updatePopupPiscinas(layer, props){
    let html = `<div class="popup-productores" style="background:#E6FCFE;padding:10px;border-radius:8px;">
                    <h3>${makeClickable(props.Nom) || makeClickable(props.nombre) || 'Sin nombre'}</h3>`;

    const titles = {
        dirección: "Dirección/Adresse",
        horarios: "Horarios de apertura / Horaires d'ouverture",
        precios: "Tarifas de acceso / Tarifs d'accès",
        servicios: "Servicios asociados / Services associés",
    };

    for(let key of Object.keys(titles)){
        if(props[key]){
            html += `<div class="popup-row"><b>${titles[key]}:</b> <span>${makeClickable(props[key])}</span></div>`;
        }
    }

    html += "</div>";
    bindPopupGenerico(layer, html, 'popup-productores', 300, 400, 400);
}

function updatePopupProductores(layer, props) {
    let html = `<div class="popup-productores"><h3>${makeClickable(props.nombre) || 'Sin nombre'}</h3>`;

    // Campos que se mostrarán en el popup
    const titles = {
        direccion: "Dirección / Adresse",
        tipo_productor: "Tipo de productor / Type de producteur",
        productos: "Tipo de producto / Type de produit",
        telefonos: "Teléfono / Téléphone",
        emails: "E-mail",
        urls: "URL de acceso / URL d'accès",
        persona_contacto: "Persona de contacto / Personne de contact",
        url_venta_on_line: "URL tienda online / URL boutique en ligne",
        horario: "Horario de visita / Horaires de visite",
        tarifas: "Tarifas de visita / Tarifs des visites",
        idiomas_hablados: "Idiomas hablados / Langues parlées",
        descripcion: "Descripción de la explotación / Description de l'exploitation",
    };

    // Mostrar solo los campos definidos en `titles`
    for (let key in titles) {
        if (!props.hasOwnProperty(key)) continue; // Verificar que la propiedad existe
        const value = props[key];
        if (value === null || value === undefined || value === '') continue; // Ignorar valores vacíos

        if (key === "productos") {
            // Mostrar productos como lista
            let items = Array.isArray(value) ? value : value.split(',').map(s => s.trim());
            html += `<div class="popup-row"><b>${titles[key]}:</b>
                        <div class="productos-grid">`;
            items.forEach(item => {
                html += `<div class="producto-item">${makeClickable(item)}</div>`;
            });
            html += `</div></div>`;
        } else {
            // Mostrar campos normales
            html += `<div class="popup-row"><b>${titles[key]}:</b> <span>${makeClickable(value)}</span></div>`;
        }
    }

    // Redes sociales con íconos
    if (props.redes_sociales) {
        html += getIconoRedSocial(props.redes_sociales);
    }

    // Generar sección de booleanos para "Punto de venta"
    const booleanFieldsTienda = [
        { key: "venta_mayor", label: "Venta mayorista / Vente en gros" },
        { key: "tienda_online", label: "Tienda online / Boutique en ligne" },
        { key: "venta_centro_produccion", label: "Venta en centro de producción / Vente dans le centre de production" },
        { key: "tienda", label: "Tienda / Boutique" }
    ];
    html += generarBooleanos(props, booleanFieldsTienda, "Punto de venta / Point de vente");

    // Generar sección de booleanos para "Servicios"
    const booleanFieldsServicios = [
        { key: "agricultura_ecologica", label: "Agricultura ecológica / Agriculture biologique" },
        { key: "restaurante", label: "Restaurante / Restaurant" }
    ];
    html += generarBooleanos(props, booleanFieldsServicios, "Servicios / Services");

    // Generar carrusel de fotos
    html += generarCarruselFotos(props, "fotos");

    html += "</div>";

    // Usar la función genérica para bindPopup
    bindPopupGenerico(layer, html, 'popup-productores', 300, 500, 500);
}

function updatePopupComercios(layer, props) {
    let html = `<div class="popup-comercios"><h3>${makeClickable(props.nombre_productor) || 'Sin nombre'}</h3>`;

    const titles = {
        direccion: "Dirección / Adresse",
        codigo_postal: "Código postal / Code postal",
        tipo_productor: "Tipo de comercio / Type de boutique",
        productos: "Tipo de producto / Type de produit",
        telefono: "Teléfono / Téléphone",
        url: "URL de acceso / URL d'accès",
        url_venta_on_line: "URL tienda online / URL boutique en ligne",
        persona_contacto: "Persona de contacto / Personne de contact",
        email: "E-mail",
        tienda: "Tienda / Boutique",
        horario: "Horario / Horaires",
        tarifas: "Tarifas / Tarifs",
        idiomas_hablados: "Idiomas hablados / Langues parlées",
        descripcion: "Descripción / Description",
    };

    // Mostrar campos definidos en `titles`
    for (let key in titles) {
        if (!props.hasOwnProperty(key)) continue;
        const value = props[key];
        if (value === null || value === undefined || value === '') continue;

        if (key === "productos") {
            // Mostrar productos como lista
            let items = Array.isArray(value) ? value : value.split(',').map(s => s.trim());
            html += `<div class="popup-row"><b>${titles[key]}:</b>
                        <div class="productos-grid">`;
            items.forEach(item => {
                html += `<div class="producto-item">${makeClickable(item)}</div>`;
            });
            html += `</div></div>`;
        } else {
            // Mostrar campos normales
            html += `<div class="popup-row"><b>${titles[key]}:</b> <span>${makeClickable(value)}</span></div>`;
        }
    }
    
    // Generar sección de booleanos
    const booleanFields = [
        { key: "animales_aceptados", label: "Animales aceptados / Animaux acceptés" },
        { key: "agricultura_ecologica", label: "Agricultura ecológica / Agriculture biologique" },
    ];
    html += generarBooleanos(props, booleanFields, "Servicios / Services");

    // Usar la función genérica para bindPopup
    bindPopupGenerico(layer, html, 'popup-comercios', 300, 500, 400);
}

function updatePopupSki(layer, props) {
    const name = props.nombre || 'Sin nombre';
    let html = `<div class="popup-ski"><h3>${makeClickable(name)}</h3>`;

    // Generar etiquetas para el campo `actividades`
    if (props.actividades) {
        const actividades = Array.isArray(props.actividades)
            ? props.actividades
            : props.actividades.split(',').map(a => a.trim());

        html += `<div class="etiquetas-actividades">`;
        actividades.forEach(actividad => {
            html += `<span class="etiqueta-actividad">${actividad}</span>`;
        });
        html += `</div>`;
    }

    const titles = {
        direccion: "Dirección / Adresse",
        Tipo: "Tipo de estación / Type de station",
        subtipo: "Subtipo de estación / Sous-type de station",
        telefono: "Teléfono / Téléphone",
        Email: "E-mail",
        Web: "Web",
        descricpion: "Descripción / Description",
        h_min: "Altitud mínima (m) / Altitude minimale (m)",
        km_esqui: "Km esquiables (km) / Km skiables (km)",
        p_verde: "Pistas verdes / Pistes vertes",
        p_azul: "Pistas azules / Pistes bleues",
        p_roja: "Pistas rojas / Pistes rouges",
        p_negra: "Pistas negras / Pistes noires",
        n_remontes: "Nº remontes / Nbr de remontées",
        tipo_locales_complementarios: "Locales complementarios / Locaux complémentaires"
    };

    // Mostrar campos definidos en `titles`
    for (let key in titles) {
        if (!props.hasOwnProperty(key)) continue;
        const value = props[key];
        if (!value || value === "" || value === null) continue;

        let displayValue = makeClickable(value);

        // Campos específicos con formato especial
        if (key === "Web") {
            displayValue = `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`;
        }

        if (key === "tipo_locales_complementarios") {
            // Procesar el campo como una lista separada por comas
            const tipos = Array.isArray(value) ? value : value.split(',').map(t => t.trim());
            displayValue = tipos.map(tipo => tipo.charAt(0).toUpperCase() + tipo.slice(1).replace(/_/g, ' ')).join(', ');
        }

        if (["p_verde", "p_azul", "p_roja", "p_negra"].includes(key)) {
            displayValue = `<span class="ski-pista ${key}">${value} Km</span>`;
        }

        if (key === "h_min") {
            const hMin = props.h_min;
            const hMax = props.h_max;
            const desnivel = props.desnivel;

            if (hMin || hMax || desnivel) {
                displayValue = `
                    ${hMin ? hMin + ' m' : '?'} – 
                    ${hMax ? hMax + ' m' : '?'}
                    ${desnivel ? ` (${desnivel} m de desnivel)` : ''}`;
                html += `<div class="popup-row"><b>Altitud / Dénivelé:</b><span>${displayValue}</span></div>`;
                continue;
            } else continue;
        }

        html += `<div class="popup-row"><b>${titles[key]}:</b><span>${displayValue}</span></div>`;
    }

    // Generar sección de booleanos
    const booleanFields = [
        { key: "accesibilidad_discapacidad", label: "Accesibilidad / Accessibilité" },
        { key: "accesibilidad_transporte_publico.1", label: "Accesibilidad al transporte público / Accessibilité aux transports publics" }
    ];
    html += generarBooleanos(props, booleanFields, "Servicios / Services");

    // Generar carrusel de fotos
    html += generarCarruselFotos(props, "Fotos");

    html += "</div>";

    // Usar la función genérica para bindPopup
    bindPopupGenerico(layer, html, 'popup-ski', 400, 700, 500);
}
function updatePopupEmpresasNieve(layer, props) {
    let html = `<div class="popup-empresas-nieve"><h3>${makeClickable(props.nombre) || 'Sin nombre'}</h3>`;

    const titles = {
        etiquetas: "Etiquetas / Labels",
        actividad: "Tipo de actividad / Type d'activité",
        direccion: "Dirección / Adresse",
        telefono: "Teléfono / Téléphone",
        email: "E-mail",
        web: "Web",
        descripcion: "Descripción / Description",
        servicios: "Servicios / Services",
        modo_pago: "Modo de pago / Mode de paiement",
        equipamiento: "Equipamiento / Équipement",
        accesibilidad_info: "Info accesibilidad / Info accessibilité",
    };

    // Mostrar campos definidos en `titles`
    for (let key in titles) {
        if (!props.hasOwnProperty(key)) continue;
        const value = props[key];
        if (!value || value === "" || value === null) continue;

        html += `<div class="popup-row"><b>${titles[key]}:</b><span>${makeClickable(value)}</span></div>`;
    }

    // Redes sociales con íconos
    if (props.redes_sociales) {
        html += getIconoRedSocial(props.redes_sociales);
    }

    // Generar sección de booleanos
    const booleanFields = [
        { key: "animales_bienvenidos", label: "Animales bienvenidos / Animaux bienvenus" },
        { key: "accesibilidad", label: "Accesibilidad / Accessibilité" }
    ];
    html += generarBooleanos(props, booleanFields, "Servicios / Services");

    // Generar carrusel de fotos
    html += generarCarruselFotos(props, "fotos");

    html += "</div>";

    // Usar la función genérica para bindPopup
    bindPopupGenerico(layer, html, 'popup-empresas-nieve', 400, 700, 500);
}

function updatePopupEscalada(layer, props) {
    // Función para capitalizar la primera letra de una cadena
    function capitalizarPrimeraLetra(texto) {
        if (!texto) return 'Sin nombre';
        return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    }

    // Normalizar el nombre
    const nombre = capitalizarPrimeraLetra(props.nombre);

    let html = `<div class="popup-escalada"><h3>${makeClickable(nombre)}</h3>`;

    // Campos que se mostrarán en el popup
    const titles = {
        tipo_via: "Tipo de vía / Type de voie",
        web: "Web / Site",
        numero_vias: "Número de vías / Nombre de voies",
        altitud: "Altura máxima (m) / Hauteur maximale (m)",
        desnivel: "Desnivel (m) / Dénivelé (m)",
        tiempo_acceso_minimo: "Tiempo de acceso mínimo / Temps d'accès minimum"
    };

    // Mostrar tarjetas para h_max y h_media
    if (props.h_max || props.h_media) {
        html += `
            <div class="popup-row">
                <div class="popup-number-card">
                    <div class="number-value">${props.h_max || '—'} m</div>
                    <div class="number-label">Altura máxima</div>
                </div>
                <div class="popup-number-card">
                    <div class="number-value">${props.h_media || '—'} m</div>
                    <div class="number-label">Altura media</div>
                </div>
            </div>`;
    }

    // Mostrar tarjetas para dif_maxima y dif_minima
    if (props.dif_maxima || props.dif_minima) {
        html += `
            <div class="popup-row">
                <div class="popup-number-card">
                    <div class="number-value">${props.dif_maxima || '—'}</div>
                    <div class="number-label">Dificultad máxima</div>
                </div>
                <div class="popup-number-card">
                    <div class="number-value">${props.dif_minima || '—'}</div>
                    <div class="number-label">Dificultad mínima</div>
                </div>
            </div>`;
    }

    // Iterar sobre los campos definidos en `titles`
    for (let key in titles) {
        if (!props.hasOwnProperty(key)) continue;
        const value = props[key];
        if (!value || value === "" || value === null) continue;

        html += `<div class="popup-row"><b>${titles[key]}:</b><span>${makeClickable(value)}</span></div>`;
    }

    // Usar la función genérica para bindPopup
    bindPopupGenerico(layer, html, 'popup-escalada', 400, 700, 500);
}

function updatePopupEmpresasEscalada(layer, props) {
    let html = `<div class="popup-empresas-escalada"><h3>${makeClickable(props.nombre) || 'Sin nombre'}</h3>`;

    const titles = {
        etiquetas: "Etiquetas / Labels",
        actividad: "Tipo de actividad / Type d'activité",
        direccion: "Dirección / Adresse",
        telefono: "Teléfono / Téléphone",
        email: "E-mail",
        web: "Web",
        descripcion: "Descripción / Description",
        servicios: "Servicios / Services",
        modo_pago: "Modo de pago / Mode de paiement",
        equipamiento: "Equipamiento / Équipement",
        accesibilidad_info: "Info accesibilidad / Info accessibilité",
    };

    // Mostrar campos definidos en `titles`
    for (let key in titles) {
        if (!props.hasOwnProperty(key)) continue;
        const value = props[key];
        if (!value || value === "" || value === null) continue;

        html += `<div class="popup-row"><b>${titles[key]}:</b><span>${makeClickable(value)}</span></div>`;
    }

    // Redes sociales con íconos
    if (props.redes_sociales) {
        html += getIconoRedSocial(props.redes_sociales);
    }

    // Generar sección de booleanos
    const booleanFields = [
        { key: "animales_bienvenidos", label: "Animales bienvenidos / Animaux bienvenus" },
        { key: "accesibilidad", label: "Accesibilidad / Accessibilité" }
    ];
    html += generarBooleanos(props, booleanFields, "Servicios / Services");

    // Generar carrusel de fotos
    html += generarCarruselFotos(props, "fotos");

    html += "</div>";

    // Usar la función genérica para bindPopup
    bindPopupGenerico(layer, html, 'popup-empresas-escalada', 400, 700, 500);
}

function updatePopupViasFerratas(layer, props) {
    // Función para capitalizar la primera letra de una cadena
    function capitalizarPrimeraLetra(texto) {
        if (!texto) return 'Sin nombre';
        return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
    }

    // Normalizar el nombre
    const nombre = capitalizarPrimeraLetra(props.nombre);

    let html = `<div class="popup-vias-ferratas"><h3>${makeClickable(nombre)}</h3>`;

    // Mostrar tarjetas para tiempos de acceso, recorrido y regreso
    if (props.tpo_acceso || props.tpo_recorr || props.tpo_regres) {
        html += `
            <div class="popup-row">
                <div class="popup-number-card">
                    <div class="number-value">${props.tpo_acceso || '—'}</div>
                    <div class="number-label">Tiempo acceso</div>
                </div>
                <div class="popup-number-card">
                    <div class="number-value">${props.tpo_recorr || '—'}</div>
                    <div class="number-label">Tiempo recorrido</div>
                </div>
                <div class="popup-number-card">
                    <div class="number-value">${props.tpo_regres || '—'}</div>
                    <div class="number-label">Tiempo regreso</div>
                </div>
            </div>`;
    }

    // Mostrar tarjetas para longitud equipada y desnivel
    if (props.long_equip || props.desnivel) {
        html += `
            <div class="popup-row">
                <div class="popup-number-card">
                    <div class="number-value">${props.long_equip || '—'} m</div>
                    <div class="number-label">Longitud equipada</div>
                </div>
                <div class="popup-number-card">
                    <div class="number-value">${props.desnivel || '—'} m</div>
                    <div class="number-label">Desnivel</div>
                </div>
            </div>`;
    }

    // Mostrar el campo Z
    if (props.z) {
        html += `
            <div class="popup-row">
                <div class="popup-number-card">
                    <div class="number-value">${props.z || '—'} m</div>
                    <div class="number-label">Altura (Z)</div>
                </div>
            </div>`;
    }

    // Mostrar descripción
    if (props.descripcion) {
        html += `
            <div class="popup-row">
                <b>Descripción / Description:</b>
                <span>${makeClickable(props.descripcion)}</span>
            </div>`;
    }

    // Mostrar email
    if (props.email) {
        html += `
            <div class="popup-row">
                <b>Email:</b>
                <span>${makeClickable(props.email)}</span>
            </div>`;
    }

    // Generar carrusel de fotos
    html += generarCarruselFotos(props, "fotos");

    // Mostrar husler como tarjeta al final
    if (props.husler) {
        let huslerLabel = '';
        let huslerColor = '';

        switch (props.husler) {
            case 'K1':
            case 'K2':
                huslerLabel = 'Fácil / Facile';
                huslerColor = '#43b581'; // Verde
                break;
            case 'K3':
            case 'K3+':
                huslerLabel = 'Medio / Moyen';
                huslerColor = '#f1c40f'; // Amarillo
                break;
            case 'K4':
            case 'K5':
                huslerLabel = 'Difícil / Difficile';
                huslerColor = '#e74c3c'; // Rojo
                break;
            case 'K6':
                huslerLabel = 'Extremo / Extrême';
                huslerColor = '#8e44ad'; // Morado oscuro
                break;
            default:
                huslerLabel = 'Desconocido / Inconnu';
                huslerColor = '#bdc3c7'; // Gris
        }

        html += `
            <div class="popup-row">
                <div class="popup-number-card" style="background: ${huslerColor}; color: white; border: none;">
                    <div class="number-value">${props.husler}</div>
                    <div class="number-label">${huslerLabel}</div>
                </div>
            </div>`;
    }

    html += "</div>";

    // Usar la función genérica para bindPopup
    bindPopupGenerico(layer, html, 'popup-vias-ferratas', 400, 700, 500);
}

function updatePopupCanyoning(layer, props) {
    let html = `<div class="popup-canyoning"><h3>${makeClickable(props.nombre) || 'Sin nombre'}</h3>`;

    // Tarjetas para las dificultades
    if (props.dificultad_vertical || props.dificultad_acuatica || props.dificultad_compromiso) {
        html += `
            <div class="popup-section">
                <h4>Dificultades / Difficultés</h4>
                <div class="popup-row">
                    ${props.dificultad_vertical ? `
                        <div class="popup-number-card">
                            <div class="number-value">${props.dificultad_vertical}</div>
                            <div class="number-label">Dificultad vertical / Difficulté verticale</div>
                        </div>` : ''}
                    ${props.dificultad_acuatica ? `
                        <div class="popup-number-card">
                            <div class="number-value">${props.dificultad_acuatica}</div>
                            <div class="number-label">Dificultad acuática / Difficulté aquatique</div>
                        </div>` : ''}
                    ${props.dificultad_compromiso ? `
                        <div class="popup-number-card">
                            <div class="number-value">${props.dificultad_compromiso}</div>
                            <div class="number-label">Dificultad compromiso / Difficulté d'engagement</div>
                        </div>` : ''}
                </div>
            </div>`;
    }

    // Tarjetas para tiempos (incluyendo tiempo total)
// Tarjetas para tiempos (incluyendo tiempo total)
    if (props.tpo_acceso || props.tpo_desc || props.tpo_regres || props.tiempo) {
        html += `
            <div class="popup-section">
                <h4>Tiempos / Temps</h4>
                <div class="popup-row">
                    ${props.tpo_acceso !== undefined ? `
                        <div class="popup-number-card">
                            <div class="number-value">
                                <i class="fas fa-arrow-right" style="color:#007bff; margin-right:5px;"></i>
                                ${props.tpo_acceso === 0 ? '0' : `${props.tpo_acceso} min`}
                            </div>
                            <div class="number-label">Tiempo acceso / Temps d'accès</div>
                        </div>` : ''}
                    ${props.tpo_desc !== undefined ? `
                        <div class="popup-number-card">
                            <div class="number-value">
                                <i class="fas fa-arrow-down" style="color:#28a745; margin-right:5px;"></i>
                                ${props.tpo_desc === 0 ? '0' : `${props.tpo_desc} min`}
                            </div>
                            <div class="number-label">Tiempo descenso / Temps de descente</div>
                        </div>` : ''}
                    ${props.tpo_regres !== undefined ? `
                        <div class="popup-number-card">
                            <div class="number-value">
                                <i class="fas fa-arrow-left" style="color:#dc3545; margin-right:5px;"></i>
                                ${props.tpo_regres === 0 ? '0' : `${props.tpo_regres} min`}
                            </div>
                            <div class="number-label">Tiempo regreso / Temps de retour</div>
                        </div>` : ''}
                    ${props.tiempo !== undefined ? `
                        <div class="popup-number-card">
                            <div class="number-value">
                                <i class="fas fa-clock" style="color:#6c757d; margin-right:5px;"></i>
                                ${props.tiempo === 0 ? '0' : `${props.tiempo} min`}
                            </div>
                            <div class="number-label">Tiempo total / Temps total</div>
                        </div>` : ''}
                </div>
            </div>`;
    }

    // Tarjetas para rápeles y descenso negativo
    if (props.numero_rapple || props.maximo_rapple || props.desn_neg) {
        html += `
            <div class="popup-section">
                <h4>Rápeles y descenso / Rappels et dénivelé</h4>
                <div class="popup-row">
                    ${props.numero_rapple ? `
                        <div class="popup-number-card">
                            <div class="number-value">${props.numero_rapple}</div>
                            <div class="number-label">Número de rápeles / Nombre de rappels</div>
                        </div>` : ''}
                    ${props.maximo_rapple ? `
                        <div class="popup-number-card">
                            <div class="number-value">${props.maximo_rapple} m</div>
                            <div class="number-label">Máximo rápel / Rappel maximal</div>
                        </div>` : ''}
                    ${props.desn_neg ? `
                        <div class="popup-number-card">
                            <div class="number-value">${props.desn_neg} m</div>
                            <div class="number-label">Descenso negativo / Dénivelé négatif</div>
                        </div>` : ''}
                </div>
            </div>`;
    }

    // Mostrar época óptima
    if (props.epoca_optima) {
        html += `
            <div class="popup-section">
                <h4>Época óptima / Période optimale</h4>
                <div class="popup-row">
                    <span>${makeClickable(props.epoca_optima)}</span>
                </div>
            </div>`;
    }

    // Mostrar observaciones con cambio de idioma
    // Mostrar observaciones en español y francés
    if (props.observaciones_es || props.observaciones_fr) {
        const observacionesEs = props.observaciones_es || 'Sin observaciones';
        const observacionesFr = props.observaciones_fr || 'Pas d\'observations';
        html += `
            <div class="popup-section">
                <h4>Observaciones / Observations</h4>
                <div class="popup-row">
                    <p><strong>Español:</strong> ${makeClickable(observacionesEs)}</p>
                    <p><strong>Français:</strong> ${makeClickable(observacionesFr)}</p>
                </div>
            </div>`;
    }

    html += "</div>";

    // Usar la función genérica para bindPopup
    bindPopupGenerico(layer, html, 'popup-canyoning', 400, 700, 500);
}

function updatePopupEmpresasCanyoning(layer, props) {
    let html = `<div class="popup-empresas-canyoning"><h3>${makeClickable(props.nombre) || 'Sin nombre'}</h3>`;

    const titles = {
        etiquetas: "Etiquetas / Labels",
        actividad: "Tipo de actividad / Type d'activité",
        direccion: "Dirección / Adresse",
        telefono: "Teléfono / Téléphone",
        email: "E-mail",
        web: "Web",
        descripcion: "Descripción / Description",
        servicios: "Servicios / Services",
        modo_pago: "Modo de pago / Mode de paiement",
        equipamiento: "Equipamiento / Équipement",
        accesibilidad_info: "Info accesibilidad / Info accessibilité",
    };

    // Mostrar campos definidos en `titles`
    for (let key in titles) {
        if (!props.hasOwnProperty(key)) continue;
        const value = props[key];
        if (!value || value === "" || value === null) continue;

        html += `<div class="popup-row"><b>${titles[key]}:</b><span>${makeClickable(value)}</span></div>`;
    }

    // Redes sociales con íconos
    if (props.redes_sociales) {
        html += getIconoRedSocial(props.redes_sociales);
    }

    // Generar sección de booleanos
    const booleanFields = [
        { key: "animales_bienvenidos", label: "Animales bienvenidos / Animaux bienvenus" },
        { key: "accesibilidad", label: "Accesibilidad / Accessibilité" }
    ];
    html += generarBooleanos(props, booleanFields, "Servicios / Services");

    // Generar carrusel de fotos
    html += generarCarruselFotos(props, "fotos");

    html += "</div>";

    // Usar la función genérica para bindPopup
    bindPopupGenerico(layer, html, 'popup-empresas-canyoning', 400, 700, 500);
}

function updatePopupVTT(layer, props) {
    let html = `<div class="popup-vtt"><h3>${props.nombre || 'Sin nombre'}</h3>`;

    // Tarjetas para desnivel positivo y negativo
    html += `
        <div class="popup-row">
            <div class="popup-number-card">
                <div class="number-value">
                    <i class="fas fa-arrow-up" style="color:green; margin-right:5px;"></i>
                    ${props.desnivel_positivo ? props.desnivel_positivo.toFixed(2) : '—'} m
                </div>
                <div class="number-label">Desnivel positivo / Dénivelé positif</div>
            </div>
            <div class="popup-number-card">
                <div class="number-value">
                    <i class="fas fa-arrow-down" style="color:red; margin-right:5px;"></i>
                    ${props.desnivel_negativo ? props.desnivel_negativo.toFixed(2) : '—'} m
                </div>
                <div class="number-label">Desnivel negativo / Dénivelé négatif</div>
            </div>
        </div>`;

    // Tarjetas para longitud y tiempo
    html += `
        <div class="popup-row">
            <div class="popup-number-card">
                <div class="number-value">
                    <i class="fas fa-ruler" style="color:gray; margin-right:5px;"></i>
                    ${props.longitud ? props.longitud.toFixed(2) : '—'} km
                </div>
                <div class="number-label">Longitud / Longueur</div>
            </div>
            <div class="popup-number-card">
                <div class="number-value">
                    <i class="fas fa-clock" style="color:gray; margin-right:5px;"></i>
                    ${props.tiempo ? props.tiempo.toFixed(2) : '—'} min
                </div>
                <div class="number-label">Tiempo / Temps</div>
            </div>
        </div>`;

    // Campos adicionales (solo si existen)
    const fields = {
        dificultad: "Dificultad / Difficulté",
        tipo_via: "Tipo de vía / Type de voie",
        itinerario: "Itinerario / Itinéraire",
        enlace_web: "Enlace web / Lien web",
        enlace_web_2: "Enlace web 2 / Lien web 2"
    };

    for (const [key, label] of Object.entries(fields)) {
        if (props[key]) {
            const value = key.startsWith("enlace") ? `<a href="${props[key]}" target="_blank" rel="noopener noreferrer">${label}</a>` : props[key];
            html += `
                <div class="popup-row">
                    <b>${label}:</b>
                    <span>${value}</span>
                </div>`;
        }
    }

    // Enlaces KML y GPX en la misma línea
    if (props.enlace_kml || props.enlace_gpx) {
        html += `
            <div class="popup-row" style="display: flex; gap: 10px;">
                ${props.enlace_kml ? `<a href="${props.enlace_kml}" target="_blank" rel="noopener noreferrer">KML</a>` : ''}
                ${props.enlace_gpx ? `<a href="${props.enlace_gpx}" target="_blank" rel="noopener noreferrer">GPX</a>` : ''}
            </div>`;
    }

    html += "</div>";

    // Usar la función genérica para bindPopup
    bindPopupGenerico(layer, html, 'popup-vtt', 400, 600, 500);
}

function updatePopupItinerarios(layer, props) {
    let html = `<div class="popup-itinerarios"><h3>${props.nombre || 'Sin nombre'}</h3>`;

    // Tarjeta para dificultad en una línea
    html += `
        <div class="popup-row">
            <div class="popup-number-card">
                <div class="number-value">${props.dificultad || '—'}</div>
                <div class="number-label">Dificultad / Difficulté</div>
            </div>
        </div>`;

    // Tarjetas para duración y distancia en otra línea
    html += `
        <div class="popup-row">
            <div class="popup-number-card">
                <div class="number-value">
                    <i class="fas fa-clock" style="color:gray; margin-right:5px;"></i>
                    ${props.duracion || '—'} min
                </div>
                <div class="number-label">Duración / Durée</div>
            </div>
            <div class="popup-number-card">
                <div class="number-value">
                    <i class="fas fa-ruler" style="color:gray; margin-right:5px;"></i>
                    ${props.distancia_km ? props.distancia_km.toFixed(2) : '—'} km
                </div>
                <div class="number-label">Distancia / Distance</div>
            </div>
        </div>`;

    // Mostrar campos definidos en `titles` (solo descripcion y paisaje)
    const titles = {
        descripcion: "Descripción / Description",
        paisaje: "Paisaje / Paysage"
    };

    for (let key in titles) {
        if (!props.hasOwnProperty(key)) continue;
        const value = props[key];
        if (!value || value === "" || value === null) continue;

        // Etiqueta centrada arriba y valor centrado abajo
        html += `
            <div class="popup-row" style="display: flex; flex-direction: column; align-items: center; text-align: center; margin-top: 10px;">
                <b style="margin-bottom: 5px; font-size: 1em;">${titles[key]}</b>
                <span style="max-width: 90%; font-size: 0.95em;">${makeClickable(value)}</span>
            </div>`;
    }

    // Carrusel de fotos
    if (props.fotos) {
        html += generarCarruselFotos(props, 'fotos');
    }

    // Enlaces GPX, KML y PDF
    if (props.url_gpx || props.url_kml || props.url_pdf) {
        html += `
            <div class="popup-row" style="display: flex; gap: 10px; justify-content: center;">
                ${props.url_gpx ? `<a href="${props.url_gpx}" target="_blank" rel="noopener noreferrer">GPX</a>` : ''}
                ${props.url_kml ? `<a href="${props.url_kml}" target="_blank" rel="noopener noreferrer">KML</a>` : ''}
                ${props.url_pdf ? `<a href="${props.url_pdf}" target="_blank" rel="noopener noreferrer">PDF</a>` : ''}
            </div>`;
    }

    html += "</div>";

    // Usar la función genérica para bindPopup
    bindPopupGenerico(layer, html, 'popup-itinerarios', 400, 500, 500);
}

function updatePopupArbolesSingulares(layer, props) {
    let html = `<div class="popup-arboles" style="background:#e6f7e6;padding:10px;border-radius:8px;">`;
    html += `<h3 style="color:#2c3e50; margin-bottom:8px;">${props.nombre_arbol || 'Sin nombre'}</h3>`;
    // Tarjetas para el nombre común y científico
    html += `
        <div class="popup-row">
            <div class="popup-number-card" style="background:#d4edda;color:#155724;">
                <div class="number-value">${props.nombre_comun_especie || '—'}</div>
                <div class="number-label">Nombre común / Nom commun</div>
            </div>
            <div class="popup-number-card" style="background:#d4edda;color:#155724;">
                <div class="number-value"><i>${props.nombre_cienifico_especie || '—'}</i></div>
                <div class="number-label">Nombre científico / Nom scientifique</div>
            </div>
        </div>`;

    // Tarjeta para la edad estimada
    html += `
        <div class="popup-row">
            <div class="popup-number-card" style="background:#d4edda;color:#155724;">
                <div class="number-value">${props.edad_estimada || '—'}</div>
                <div class="number-label">Edad estimada / Âge estimé</div>
            </div>
        </div>`;

    // Campos normales (ubicación y propiedad)
    const titles = {
        ubicacion: "Ubicación / Emplacement",
        propiedad: "Propiedad / Propriété"
    };

    for (let key in titles) {
        if (props[key]) {
            html += `
                <div class="popup-row">
                    <b>${titles[key]}:</b> <span>${props[key]}</span>
                </div>`;
        }
    }

    // Enlace de descarga (ficha técnica)
    if (props.ficha_tecnica) {
        html += `
            <div class="popup-row">
                <a href="${props.ficha_tecnica}" target="_blank" rel="noopener noreferrer" style="color:#155724;text-decoration:underline;">
                    Descargar ficha técnica / Télécharger la fiche technique
                </a>
            </div>`;
    }

    html += `</div>`;

    // Vincular el popup al layer
    layer.bindPopup(html, {
        className: "popup-arboles",
        minWidth: 300,
        maxWidth: 500
    });
}

function updatePopupArboledasSingulares(layer, props) {
    let html = `<div class="popup-arboles" style="background:#e6f7e6;padding:10px;border-radius:8px;">`;
    html += `<h3 style="color:#2c3e50; margin-bottom:8px;">${props.nombre_arboleda || 'Sin nombre'}</h3>`;
    // Tarjetas para el nombre común y científico
    html += `
        <div class="popup-row">
            <div class="popup-number-card" style="background:#d4edda;color:#155724;">
                <div class="number-value">${props.nomcomun_especie_dominante || '—'}</div>
                <div class="number-label">Nombre común especie dominante / Nom commun espèce dominante</div>
            </div>
            <div class="popup-number-card" style="background:#d4edda;color:#155724;">
                <div class="number-value"><i>${props.nomcientifico_especie_dominante || '—'}</i></div>
                <div class="number-label">Nombre científico especie dominante / Nom scientifique espèce dominante</div>
            </div>
        </div>`;

    // Tarjeta para la edad estimada
    html += `
        <div class="popup-row">
            <div class="popup-number-card" style="background:#d4edda;color:#155724;">
                <div class="number-value">${props.superficie_arboleda || '—'}</div>
                <div class="number-label">Superficie de la arboleda / Surface de la bosquet</div>
            </div>
        </div>`;

    // Campos normales (ubicación y propiedad)
    const titles = {
        ubicacion: "Ubicación / Emplacement",
        propiedad: "Propiedad / Propriété"
    };

    for (let key in titles) {
        if (props[key]) {
            html += `
                <div class="popup-row">
                    <b>${titles[key]}:</b> <span>${props[key]}</span>
                </div>`;
        }
    }

    // Enlace de descarga (ficha técnica)
    if (props.ficha_tecnica) {
        html += `
            <div class="popup-row">
                <a href="${props.ficha_tecnica}" target="_blank" rel="noopener noreferrer" style="color:#155724;text-decoration:underline;">
                    Descargar ficha técnica / Télécharger la fiche technique
                </a>
            </div>`;
    }

    html += `</div>`;

    // Vincular el popup al layer
    layer.bindPopup(html, {
        className: "popup-arboles",
        minWidth: 300,
        maxWidth: 500
    });
}

// ================= FILTROS DINÁMICOS =================

// Mercados
function initFilters() {
    const filtroIds = ['filtro-tipo-mercado','filtro-frecuencia','filtro-semana','filtro-dia','filtro-apertura'];
    const keys = ['nombre_tipo','nombre_frecuencia','nombre_semana','nombre_dia','nombre_apertura'];

    keys.forEach((key,i)=>{
        const filtro = document.getElementById(filtroIds[i]);
        let valores = [...new Set(markers.map(m=>m.props[key]).filter(v=>v))];

        if(key==='nombre_dia') valores = ordenarSegunLista(valores, ordenDias);
        if(key==='nombre_semana') valores = ordenarSegunLista(valores, ordenSemanas);
        if(key!=='nombre_dia' && key!=='nombre_semana') valores.sort();

        valores.forEach(v=>{
            const o = document.createElement('option');
            o.value = v;
            o.textContent = v;
            filtro.appendChild(o);
        });
    });

    filtroIds.forEach(id => document.getElementById(id).addEventListener('change', filtrarMarcadores));
}

// Escuelas
function initFiltersCentros() {
    const filtroIds = ['filtro-tipo-centro','filtro-tipo-oferta'];
    const keys = ['nombre_tipo_centro','tipo_oferta'];

    keys.forEach((key,i)=>{
        const filtro = document.getElementById(filtroIds[i]);
        let valores = [];

        markersCentros.forEach(m=>{
            if(key==='tipo_oferta' && Array.isArray(m.props[key])){
                valores.push(...m.props[key]);
            } else if(m.props[key]){
                valores.push(m.props[key]);
            }
        });

        valores = [...new Set(valores)].sort();

        valores.forEach(v=>{
            const o = document.createElement('option');
            o.value = v;
            o.textContent = v;
            filtro.appendChild(o);
        });
    });

    filtroIds.forEach(id => document.getElementById(id).addEventListener('change', filtrarCentros));
}

// Productos Agro
function initFiltersProductosAgro() {
    const filtroIds = ['filtro-tipo-producto', 'filtro-comercializacion-producto', 'filtro-temporada-producto'];
    const keys = ['tipo_producto', 'comercializacion', 'meses_temporada'];

    const ordenMeses = [
        "enero","febrero","marzo","abril","mayo","junio",
        "julio","agosto","septiembre","octubre","noviembre","diciembre"
    ];

    keys.forEach((key, i) => {
        const filtro = document.getElementById(filtroIds[i]);
        let valores = [];

        productosMarkers.forEach(m => {
            if (key === 'meses_temporada') {
                if (Array.isArray(m.props[key])) valores.push(...m.props[key]);
                else if (typeof m.props[key] === "string") valores.push(...m.props[key].split(","));
            } else if (m.props[key]) {
                valores.push(m.props[key]);
            }
        });

        // Eliminar duplicados normalizando texto
        valores = [...new Set(valores.map(v => normalizaTexto(v)))];

        // Ordenar meses si es el caso
        if(key==='meses_temporada') {
            valores.sort((a,b)=>ordenMeses.indexOf(a) - ordenMeses.indexOf(b));
        } else valores.sort();

        // Mostrar con capital inicial
        valores.forEach(v=>{
            const o = document.createElement('option');
            o.value = v;
            o.textContent = v.charAt(0).toUpperCase() + v.slice(1);
            filtro.appendChild(o);
        });
    });

    // Asociar eventos de cambio al filtro
    filtroIds.forEach(id => document.getElementById(id).addEventListener('change', filtrarProductosAgro));
}

function initFiltersProductores() {
    const filtroIds = [
        'filtro-productos-productor',
        'filtro-tipo-productor',
        'filtro-tienda-productor',
        'filtro-agroeco-productor',
        'filtro-restautante-productor',
        'filtro-venta-mayor-productor',
        'filtro-tienda-online-productor',
        'filtro-venta-centro-produccion-productor'
    ];
    const keys = ['productos', 'tipo_productor'];

    keys.forEach((key, i) => {
        const filtro = document.getElementById(filtroIds[i]);
        let valores = [];

        productoresMarkers.forEach(m => {
            if(Array.isArray(m.props[key])) valores.push(...m.props[key]);
        });

        // Normalizamos y eliminamos duplicados
        valores = [...new Set(valores.map(v => normalizaTexto(v)))].sort();

        valores.forEach(v => {
            const o = document.createElement('option');
            o.value = v;
            o.textContent = v.charAt(0).toUpperCase() + v.slice(1);
            filtro.appendChild(o);
        });
    });

    // Asociar evento de cambio a todos los filtros
    filtroIds.forEach(id => document.getElementById(id).addEventListener('change', filtrarProductores));
}

function initFiltersProductoresProximidad() {
    const filtroIds = ['filtro-distancia-proximidad', 'filtro-tipo-producto-proximidad'];
    const keys = ['distance', 'productos']; // Campos en el GeoJSON

    keys.forEach((key, i) => {
        const filtro = document.getElementById(filtroIds[i]);

        // Limpiar las opciones existentes
        filtro.innerHTML = '<option value="">Todos/Tous</option>';

        if (key === 'distance') {
            // Añadir rangos de distancia manualmente
            const rangos = [
                { value: '0-10000', label: '0 - 10 km' },
                { value: '10001-30000', label: '11 - 30 km' },
                { value: '31000-50000', label: '31 - 50 km' },
                { value: '50001-', label: 'Más de 50 km / Plus de 50 km' } // Nuevo rango
            ];

            rangos.forEach(rango => {
                const option = document.createElement('option');
                option.value = rango.value;
                option.textContent = rango.label;
                filtro.appendChild(option);
            });
        } else if (key === 'productos') {
            const valores = [...new Set(
                productoresProximidadMarkers.flatMap(m => {
                    if (Array.isArray(m.props[key])) return m.props[key];
                    if (typeof m.props[key] === "string") return m.props[key].split(",");
                    return [];
                })
                .map(v => normalizaTexto(v.trim()))
                .filter(v => v)
            )].sort();

            valores.forEach(valor => {
                const option = document.createElement('option');
                option.value = valor;
                option.textContent = valor.charAt(0).toUpperCase() + valor.slice(1);
                filtro.appendChild(option);
            });
        }
    });

    // Asociar evento de cambio a los filtros
    filtroIds.forEach(id => document.getElementById(id).addEventListener('change', filtrarProductoresProximidad));
}

function initFiltersComercios() {
    const filtroIds = ['filtro-productos-comercios', 'filtro-tipo-comercios', 'filtro-animales-comercios', 'filtro-agroeco-comercios'];
    const keys = ['productos', 'tipo_productor'];

    keys.forEach((key, i) => {
        const filtro = document.getElementById(filtroIds[i]);
        let valores = [];

        comerciosMarkers.forEach(m => {
            if(Array.isArray(m.props[key])) valores.push(...m.props[key]);
        });

        // Normalizamos y eliminamos duplicados
        valores = [...new Set(valores.map(v => normalizaTexto(v)))].sort();

        valores.forEach(v => {
            const o = document.createElement('option');
            o.value = v;
            o.textContent = v.charAt(0).toUpperCase() + v.slice(1);
            filtro.appendChild(o);
        });
    });
    

    // Asociar evento de cambio
    filtroIds.forEach(id => document.getElementById(id).addEventListener('change', filtrarComercios));
}

function initFiltersRestaurantes() {
    const filtroIds = ['filtro-tipo-restaurante', 'filtro-etiqueta-restaurante'];
    const keys = ['tipo_establecimiento', 'etiqueta_calidad'];

    keys.forEach((key, i) => {
        const filtro = document.getElementById(filtroIds[i]);
        let valores = [];

        restaurantesMarkers.forEach(m => {
            if(Array.isArray(m.props[key])) valores.push(...m.props[key]);
        });

        // Normalizamos y eliminamos duplicados
        valores = [...new Set(valores.map(v => normalizaTexto(v)))].sort();

        valores.forEach(v => {
            const o = document.createElement('option');
            o.value = v;
            o.textContent = v.charAt(0).toUpperCase() + v.slice(1);
            filtro.appendChild(o);
        });
    });
    

    // Asociar evento de cambio
    filtroIds.forEach(id => document.getElementById(id).addEventListener('change', fitlrarRestaurantes));
}

function initFiltersEmpresasNieve() {
    const filtroIds = ['filtro-tipo-actividad-nieve', 'filtro-accesibilidad-empresa-nieve'];
    const keys = ['actividad', 'accesibilidad'];

    keys.forEach((key, i) => {
        const filtro = document.getElementById(filtroIds[i]);

        // Limpiar las opciones existentes
        filtro.innerHTML = '<option value="">Todos/Tous</option>';

        let valores = [];

        empresasNieveMarkers.forEach(m => {
            if (key === 'actividad') {
                valores.push(m.props[key]);
            } else if (key === 'accesibilidad') {
                valores.push(m.props[key] ? "true" : "false");
            }
        });

        // Normalizamos y eliminamos duplicados
        valores = [...new Set(valores.map(v => normalizaTexto(v)))].sort();

        valores.forEach(v => {
            const o = document.createElement('option');
            o.value = v;
            o.textContent = key === 'accesibilidad'
                ? (v === "true" ? "Sí/Oui" : "No/Non")
                : v.charAt(0).toUpperCase() + v.slice(1);
            filtro.appendChild(o);
        });
    });

    // Asociar evento de cambio al filtro
    filtroIds.forEach(id => document.getElementById(id).addEventListener('change', filtrarEmpresasNieve));
}

function initFiltersSki() {
    const filtroTipoSki = document.getElementById('filtro-tipo-ski');
    let valores = [];

    // Recorrer los marcadores de Ski para obtener los valores únicos del tipo
    skiMarkers.forEach(m => {
        if (m.props.tipo) {
            const tipos = m.props.tipo.split(',').map(t => normalizaTexto(t.trim())); // Dividir y normalizar
            valores.push(...tipos);
        }
    });

    // Eliminar duplicados y ordenar alfabéticamente
    valores = [...new Set(valores)].sort();

    // Añadir las opciones al filtro
    valores.forEach(valor => {
        const option = document.createElement('option');
        option.value = valor;
        option.textContent = valor.charAt(0).toUpperCase() + valor.slice(1);
        filtroTipoSki.appendChild(option);
    });

    // Asociar el evento de cambio al filtro
    filtroTipoSki.addEventListener('change', filtrarSki);
}

function initFiltersPuntosEscalada() {
    const filtroTipoVia = document.getElementById('filtro-tipo-via-escalada');
    const filtroDif = document.getElementById('filtro-dificultad-escalada');
    let valores = [];

    // Poblar select de tipo de vía
    puntosEscaladaMarkers.forEach(m => {
        if (m.props.tipo_via) {
            const tipos = m.props.tipo_via.split(',').map(t => normalizaTexto(t.trim()));
            valores.push(...tipos);
        }
    });

    valores = [...new Set(valores)].sort();
    valores.forEach(valor => {
        const option = document.createElement('option');
        option.value = valor;
        option.textContent = valor.charAt(0).toUpperCase() + valor.slice(1);
        filtroTipoVia.appendChild(option);
    });

    // Poblar select de dificultad (escala francesa)
    const gradosFranceses = [
        '3', '4a', '4b', '4c',
        '5a', '5b', '5c',
        '6a', '6a+', '6b', '6b+', '6c', '6c+',
        '7a', '7a+', '7b', '7b+', '7c', '7c+',
        '8a', '8a+', '8b', '8b+', '8c', '8c+',
        '9a', '9a+', '9b', '9b+', '9c'
    ];

    gradosFranceses.forEach(g => {
        const option = document.createElement('option');
        option.value = g;
        option.textContent = g;
        filtroDif.appendChild(option);
    });

    // Asociar eventos
    filtroTipoVia.addEventListener('change', filtrarPuntosEscalada);
    filtroDif.addEventListener('change', filtrarPuntosEscalada);
    document.getElementById('filtro-tiempo-acceso-escalada').addEventListener('input', filtrarPuntosEscalada);
    document.getElementById('filtro-desnivel-escalada').addEventListener('input', filtrarPuntosEscalada);
}

function initFiltersCanyoning() {
    const filtroVertical = document.getElementById('filtro-dificultad-vertical-canyoning');
    const filtroAcuatica = document.getElementById('filtro-dificultad-acuatica-canyoning');
    const filtroCompromiso = document.getElementById('filtro-dificultad-compromiso-canyoning');
    const filtroNivelGeneral = document.getElementById('filtro-nivel-general-canyoning');

    if (!filtroVertical || !filtroAcuatica || !filtroCompromiso || !filtroNivelGeneral) {
        console.error("Los elementos de filtro para Canyoning no están disponibles en el DOM.");
        return;
    }

    // Guardamos listas completas para repoblar fácilmente
    const dificultadesVertical = ['V1','V2','V3','V4','V5','V6','V7'];
    const dificultadesAcuatica = ['A1','A2','A3','A4','A5','A6','A7'];
    const dificultadesCompromiso = ['I','II','III','IV','V','VI'];

    // Función auxiliar para poblar select
    function poblarSelect(select, opciones) {
        select.innerHTML = '<option value="">Todas</option>';
        opciones.forEach(op => {
            const option = document.createElement('option');
            option.value = op;
            option.textContent = op;
            select.appendChild(option);
        });
    }

    // Inicial
    poblarSelect(filtroVertical, dificultadesVertical);
    poblarSelect(filtroAcuatica, dificultadesAcuatica);
    poblarSelect(filtroCompromiso, dificultadesCompromiso);

    // --- NUEVO: cuando cambia el nivel general ---
    filtroNivelGeneral.addEventListener('change', () => {
        const nivel = filtroNivelGeneral.value;
        let vRange = dificultadesVertical;
        let aRange = dificultadesAcuatica;
        let cRange = dificultadesCompromiso;

        if (nivel === 'facil') {
            vRange = dificultadesVertical.slice(0, 2);   // V1-V2
            aRange = dificultadesAcuatica.slice(0, 2);   // A1-A2
            cRange = dificultadesCompromiso.slice(0, 2); // I-II
        } else if (nivel === 'intermedio') {
            vRange = dificultadesVertical.slice(2, 5);   // V3-V5
            aRange = dificultadesAcuatica.slice(2, 5);   // A3-A5
            cRange = dificultadesCompromiso.slice(2, 4); // III-IV
        } else if (nivel === 'dificil') {
            vRange = dificultadesVertical.slice(5, 7);   // V6-V7
            aRange = dificultadesAcuatica.slice(5, 7);   // A6-A7
            cRange = dificultadesCompromiso.slice(4, 6); // V-VI
        }

        poblarSelect(filtroVertical, vRange);
        poblarSelect(filtroAcuatica, aRange);
        poblarSelect(filtroCompromiso, cRange);

        // Después de cambiar opciones, aplicar filtro
        filtrarPuntosCanyoning();
    });

    // Eventos de los otros filtros
    [filtroVertical, filtroAcuatica, filtroCompromiso].forEach(f =>
        f.addEventListener('change', filtrarPuntosCanyoning)
    );

    document.getElementById('filtro-tiempo-acceso-canyoning').addEventListener('input', filtrarPuntosCanyoning);
    document.getElementById('filtro-tiempo-total-canyoning').addEventListener('input', filtrarPuntosCanyoning);
    document.getElementById('filtro-numero-rapeles-canyoning').addEventListener('input', filtrarPuntosCanyoning);
}

function initFiltersVTT() {
    const filtroIds = ['filtro-grado-dificultad', 'filtro-tipo-via'];
    const keys = ['grado_dificultad', 'tipo_via'];

    // Orden específico para el filtro de grado_dificultad
    const ordenDificultad = [
        'facil / facile',
        'intermedio / intermediaire',
        'dificil / difficile',
        'muy dificil / tres difficile'
    ];

    // Limpiar los filtros antes de poblarlos
    filtroIds.forEach(id => {
        const filtro = document.getElementById(id);
        filtro.innerHTML = '<option value="">Todos / Tous</option>';
    });

    // Recorrer las features de la capa para obtener valores únicos
    const valoresUnicos = {};
    keys.forEach(key => (valoresUnicos[key] = new Set()));

    vttLayer.eachLayer(layer => {
        const props = layer.feature.properties;
        keys.forEach(key => {
            if (props[key]) {
                valoresUnicos[key].add(props[key]);
            }
        });
    });

    // Poblar los filtros con los valores únicos
    keys.forEach((key, i) => {
        const filtro = document.getElementById(filtroIds[i]);
        let valores = Array.from(valoresUnicos[key]);

        // Ordenar según el orden deseado para grado_dificultad
        if (key === 'grado_dificultad') {
            valores.sort((a, b) => {
                const indexA = ordenDificultad.indexOf(normalizaTexto(a));
                const indexB = ordenDificultad.indexOf(normalizaTexto(b));
                return indexA - indexB;
            });
        } else {
            valores.sort(); // Orden alfabético para otros filtros
        }

        // Añadir las opciones al filtro
        valores.forEach(valor => {
            const option = document.createElement('option');
            option.value = valor;
            option.textContent = valor.charAt(0).toUpperCase() + valor.slice(1);
            filtro.appendChild(option);
        });
    });

    // Asociar eventos de cambio a los filtros
    filtroIds.forEach(id => document.getElementById(id).addEventListener('change', filtrarVTT));

    // Asociar eventos de entrada a los nuevos campos numéricos
    ['filtro-longitud-min', 'filtro-tiempo-max', 'filtro-desnivel-positivo-min', 'filtro-desnivel-negativo-max']
        .forEach(id => document.getElementById(id).addEventListener('input', filtrarVTT));
}

function initFiltersItinerariosAdaptados() {
    const filtroDificultad = document.getElementById('filtro-dificultad-itinerarios-adaptados');
    const filtroPaisaje = document.getElementById('filtro-paisaje-itinerarios-adaptados');

    // Reiniciar selects
    filtroDificultad.innerHTML = '<option value="">Todas / Toutes</option>';
    filtroPaisaje.innerHTML = '<option value="">Todos / Tous</option>';

    // Sets donde guardamos los valores que realmente existen
    let dificultades = new Set();
    let paisajes = new Set();

    // Recoger valores reales de los itinerarios
    itinerariosAdaptadosMarkers.forEach(({ props }) => {
        // --- DIFICULTAD ---
        if (props.dificultad) {
            dificultades.add(props.dificultad.toLowerCase().trim());
        }
        // --- PAISAJE ---
        if (props.paisaje) {
            props.paisaje
                .split(',')
                .map(p => normalizaTexto(p.trim()))
                .forEach(p => paisajes.add(p));
        }
    });
    
    // ORDEN FIJO PARA DIFICULTAD
    const ORDEN_DIFICULTAD = [
        "muy fácil / très facile",
        "fácil / facile",
        "medio / moyenne",
        "difícil / difficile",
        "muy difícil / très difficile"
    ];

    // Añadir dificultades en el orden correcto
    ORDEN_DIFICULTAD
        .map(d => d.toLowerCase())
        .filter(d => dificultades.has(d))
        .forEach(d => {
            const option = document.createElement('option');
            option.value = d;
            option.textContent = d
                .split('/')
                .map(p => p.trim())
                .map(p => p.charAt(0).toUpperCase() + p.slice(1))
                .join(' / ');
            filtroDificultad.appendChild(option);
        });

    // Añadir paisajes (orden alfabético)
    [...paisajes].sort().forEach(p => {
        const option = document.createElement('option');
        option.value = p;
        option.textContent = p.charAt(0).toUpperCase() + p.slice(1);
        filtroPaisaje.appendChild(option);
    });

    // Eventos del filtro
    filtroDificultad.addEventListener('change', filtrarItinerariosAdaptados);
    filtroPaisaje.addEventListener('change', filtrarItinerariosAdaptados);
    document.getElementById('filtro-distancia-itinerarios-adaptados')
        .addEventListener('input', filtrarItinerariosAdaptados);
}

function initFiltersItinerariosPedestres() {
    const filtroDificultad = document.getElementById('filtro-dificultad-itinerarios-pedestres');
    const filtroPaisaje = document.getElementById('filtro-paisaje-itinerarios-pedestres');

    // Reiniciar selects
    filtroDificultad.innerHTML = '<option value="">Todas / Toutes</option>';
    filtroPaisaje.innerHTML = '<option value="">Todos / Tous</option>';

    // Sets donde guardamos los valores que realmente existen (ya normalizados)
    let dificultades = new Set();
    let paisajes = new Set();

    // Recoger valores reales de los itinerarios
    itinerariosPedestresMarkers.forEach(({ props }) => {
        // --- DIFICULTAD ---
        if (props.dificultad) {
            dificultades.add(normalizaTexto(String(props.dificultad)));
        }

        // --- PAISAJE ---
        if (props.paisaje) {
            props.paisaje
                .split(',')
                .map(p => normalizaTexto(p.trim()))
                .forEach(p => paisajes.add(p));
        }
    });

    // ORDEN FIJO PARA DIFICULTAD (texto legible en español/francés)
    const ORDEN_DIFICULTAD = [
        "Muy fácil / Très facile",
        "Fácil / Facile",
        "Medio / Moyenne",
        "Difícil / Difficile",
        "Muy difícil / Très difficile"
    ];

    // Añadir dificultades en el orden correcto, usando normalizaTexto() para comparar
    ORDEN_DIFICULTAD
        .map(d => ({ raw: d, norm: normalizaTexto(d) }))
        .filter(d => dificultades.has(d.norm))
        .forEach(d => {
            const option = document.createElement('option');
            option.value = d.norm; // value normalizado (para comparar después)
            option.textContent = d.raw; // texto legible tal cual
            filtroDificultad.appendChild(option);
        });

    // Añadir paisajes (orden alfabético por el texto normalizado)
    [...paisajes].sort().forEach(p => {
        const option = document.createElement('option');
        option.value = p; // ya normalizado
        option.textContent = p.charAt(0).toUpperCase() + p.slice(1);
        filtroPaisaje.appendChild(option);
    });

    // Eventos del filtro
    filtroDificultad.addEventListener('change', filtrarItinerariosPedestres);
    filtroPaisaje.addEventListener('change', filtrarItinerariosPedestres);
    document.getElementById('filtro-distancia-itinerarios-pedestres')
        .addEventListener('input', filtrarItinerariosPedestres);
}

function initFiltersItinerariosEquestres() {
    const filtroDificultad = document.getElementById('filtro-dificultad-itinerarios-equestres');
    const filtroPaisaje = document.getElementById('filtro-paisaje-itinerarios-equestres');

    // Reiniciar selects
    filtroDificultad.innerHTML = '<option value="">Todas / Toutes</option>';
    filtroPaisaje.innerHTML = '<option value="">Todos / Tous</option>';

    // Sets donde guardamos los valores que realmente existen (ya normalizados)
    let dificultades = new Set();
    let paisajes = new Set();

    // Recoger valores reales de los itinerarios
    itinerariosEquestresMarkers.forEach(({ props }) => {
        // --- DIFICULTAD ---
        if (props.dificultad) {
            dificultades.add(normalizaTexto(String(props.dificultad)));
        }

        // --- PAISAJE ---
        if (props.paisaje) {
            props.paisaje
                .split(',')
                .map(p => normalizaTexto(p.trim()))
                .forEach(p => paisajes.add(p));
        }
    });

    // ORDEN FIJO PARA DIFICULTAD (texto legible en español/francés)
    const ORDEN_DIFICULTAD = [
        "Muy fácil / Très facile",
        "Fácil / Facile",
        "Medio / Moyenne",
        "Difícil / Difficile",
        "Muy difícil / Très difficile"
    ];

    // Añadir dificultades en el orden correcto, usando normalizaTexto() para comparar
    ORDEN_DIFICULTAD
        .map(d => ({ raw: d, norm: normalizaTexto(d) }))
        .filter(d => dificultades.has(d.norm))
        .forEach(d => {
            const option = document.createElement('option');
            option.value = d.norm; // value normalizado (para comparar después)
            option.textContent = d.raw; // texto legible tal cual
            filtroDificultad.appendChild(option);
        });

    // Añadir paisajes (orden alfabético por el texto normalizado)
    [...paisajes].sort().forEach(p => {
        const option = document.createElement('option');
        option.value = p; // ya normalizado
        option.textContent = p.charAt(0).toUpperCase() + p.slice(1);
        filtroPaisaje.appendChild(option);
    });

    // Eventos del filtro
    filtroDificultad.addEventListener('change', filtrarItinerariosEquestres);
    filtroPaisaje.addEventListener('change', filtrarItinerariosEquestres);
    document.getElementById('filtro-distancia-itinerarios-equestres')
        .addEventListener('input', filtrarItinerariosEquestres);
}

function initFiltersItinerariosTrail() {
    const filtroDificultad = document.getElementById('filtro-dificultad-itinerarios-trail');
    const filtroPaisaje = document.getElementById('filtro-paisaje-itinerarios-trail');

    // Reiniciar selects
    filtroDificultad.innerHTML = '<option value="">Todas / Toutes</option>';
    filtroPaisaje.innerHTML = '<option value="">Todos / Tous</option>';

    // Sets donde guardamos los valores que realmente existen (ya normalizados)
    let dificultades = new Set();
    let paisajes = new Set();

    // Recoger valores reales de los itinerarios
    itinerariosTrailrunningMarkers.forEach(({ props }) => {
        // --- DIFICULTAD ---
        if (props.dificultad) {
            dificultades.add(normalizaTexto(String(props.dificultad)));
        }

        // --- PAISAJE ---
        if (props.paisaje) {
            props.paisaje
                .split(',')
                .map(p => normalizaTexto(p.trim()))
                .forEach(p => paisajes.add(p));
        }
    });

    // ORDEN FIJO PARA DIFICULTAD (texto legible en español/francés)
    const ORDEN_DIFICULTAD = [
        "Muy fácil / Très facile",
        "Fácil / Facile",
        "Medio / Moyenne",
        "Difícil / Difficile",
        "Muy difícil / Très difficile"
    ];

    // Añadir dificultades en el orden correcto, usando normalizaTexto() para comparar
    ORDEN_DIFICULTAD
        .map(d => ({ raw: d, norm: normalizaTexto(d) }))
        .filter(d => dificultades.has(d.norm))
        .forEach(d => {
            const option = document.createElement('option');
            option.value = d.norm; // value normalizado (para comparar después)
            option.textContent = d.raw; // texto legible tal cual
            filtroDificultad.appendChild(option);
        });

    // Añadir paisajes (orden alfabético por el texto normalizado)
    [...paisajes].sort().forEach(p => {
        const option = document.createElement('option');
        option.value = p; // ya normalizado
        option.textContent = p.charAt(0).toUpperCase() + p.slice(1);
        filtroPaisaje.appendChild(option);
    });

    // Eventos del filtro
    filtroDificultad.addEventListener('change', filtrarItinerariosTrail);
    filtroPaisaje.addEventListener('change', filtrarItinerariosTrail);
    document.getElementById('filtro-distancia-itinerarios-trail')
        .addEventListener('input', filtrarItinerariosTrail);
}

function filtrarProductosAgro() {
    const tipoProducto = normalizaTexto(document.getElementById('filtro-tipo-producto').value);
    const comercializacion = normalizaTexto(document.getElementById('filtro-comercializacion-producto').value);
    const temporada = normalizaTexto(document.getElementById('filtro-temporada-producto').value);

    productosAgroCluster.clearLayers();

    productosMarkers.forEach(({ marker, props }) => {
        // Normaliza los datos del marcador
        const tipoNorm = normalizaTexto(props.tipo_producto);
        const comercialNorm = normalizaTexto(props.comercializacion);

        // Temporada puede ser array o string
        let temporadaNorm = [];
        if (Array.isArray(props.meses_temporada)) {
            temporadaNorm = props.meses_temporada.map(m => normalizaTexto(m));
        } else if (typeof props.meses_temporada === "string") {
            temporadaNorm = props.meses_temporada.split(",").map(m => normalizaTexto(m));
        }

        const temporadaMatch = !temporada || temporadaNorm.includes(temporada);

        if (
            (!tipoProducto || tipoNorm === tipoProducto) &&
            (!comercializacion || comercialNorm === comercializacion) &&
            temporadaMatch
        ) {
            productosAgroCluster.addLayer(marker);
        }
    });
}

function filtrarCentros(){
    const tipoCentro = document.getElementById('filtro-tipo-centro').value;
    const tipoOferta = document.getElementById('filtro-tipo-oferta').value;

    centrosCluster.clearLayers();

    markersCentros.forEach(({marker, props})=>{
        const ofertaMatch = !tipoOferta || (Array.isArray(props.tipo_oferta) ? props.tipo_oferta.includes(tipoOferta) : props.tipo_oferta === tipoOferta);
        if((!tipoCentro || props.nombre_tipo_centro === tipoCentro) && ofertaMatch){
            centrosCluster.addLayer(marker);
        }
    });
}

function filtrarProductores(){
    const productosFiltro = normalizaTexto(document.getElementById('filtro-productos-productor').value);
    const tipoFiltro = normalizaTexto(document.getElementById('filtro-tipo-productor').value);
    const tiendaFiltro = document.getElementById('filtro-tienda-productor').value;
    const agroecoFiltro = document.getElementById('filtro-agroeco-productor').value;
    const restauranteFiltro = document.getElementById('filtro-restautante-productor').value;
    const ventaMayorFiltro = document.getElementById('filtro-venta-mayor-productor').value;
    const tiendaOnlineFiltro = document.getElementById('filtro-tienda-online-productor').value;
    const ventaCentroProduccionFiltro = document.getElementById('filtro-venta-centro-produccion-productor').value;

    productoresClusters.clearLayers();

    productoresMarkers.forEach(({marker, props})=>{
        const productos = (props.productos || []).map(v => normalizaTexto(v));
        const tipos = (props.tipo_productor || []).map(v => normalizaTexto(v));

        const productosMatch = !productosFiltro || productos.includes(productosFiltro);
        const tipoMatch = !tipoFiltro || tipos.includes(tipoFiltro);

        // Filtrado por booleanos
        const tiendaMatch = tiendaFiltro === "" || (!!props.tienda === (tiendaFiltro === "true"));
        const agroecoMatch = agroecoFiltro === "" || (!!props.agricultura_ecologica === (agroecoFiltro === "true"));
        const restauranteMatch = restauranteFiltro === "" || (!!props.restaurante === (restauranteFiltro === "true"));
        const ventaMayorMatch = ventaMayorFiltro === "" || (!!props.venta_mayor === (ventaMayorFiltro === "true"));
        const tiendaOnlineMatch = tiendaOnlineFiltro === "" || (!!props.tienda_online === (tiendaOnlineFiltro === "true"));
        const ventaCentroProduccionMatch = ventaCentroProduccionFiltro === "" || (!!props.venta_centro_produccion === (ventaCentroProduccionFiltro === "true"));

        if(productosMatch && tipoMatch && tiendaMatch && agroecoMatch && restauranteMatch && ventaMayorMatch && tiendaOnlineMatch && ventaCentroProduccionMatch){
            productoresClusters.addLayer(marker);
        }
    });
}

function filtrarProductoresProximidad() {
    const distanciaFiltro = document.getElementById('filtro-distancia-proximidad').value;
    const tipoProductoFiltro = normalizaTexto(document.getElementById('filtro-tipo-producto-proximidad').value);

    productoresProximidadClusters.clearLayers();

    productoresProximidadMarkers.forEach(({ marker, props }) => {
        const distancia = props.distance || 0;

        // Normalizamos y procesamos los productos
        let productos = [];
        if (Array.isArray(props.productos)) {
            productos = props.productos.map(p => normalizaTexto(p));
        } else if (typeof props.productos === "string") {
            productos = props.productos.split(",").map(p => normalizaTexto(p.trim()));
        }

        const distanciaMatch = (() => {
            if (!distanciaFiltro) return true;
            const [min, max] = distanciaFiltro.split('-').map(Number);
            if (!max) return distancia >= min; // Manejar el caso de "50001-"
            return distancia >= min && distancia <= max;
        })();

        const productoMatch = !tipoProductoFiltro || productos.includes(tipoProductoFiltro);

        if (distanciaMatch && productoMatch) {
            productoresProximidadClusters.addLayer(marker);
        }
    });
}

function filtrarComercios(){
    const comerciosFiltro = normalizaTexto(document.getElementById('filtro-productos-comercios').value);
    const tipoFiltro = normalizaTexto(document.getElementById('filtro-tipo-comercios').value);

    comerciosClusters.clearLayers();

    comerciosMarkers.forEach(({marker, props})=>{
        const comercios = (props.productos || []).map(v => normalizaTexto(v));
        const tipos = (props.tipo_productor || []).map(v => normalizaTexto(v));

        const productosMatch = !comerciosFiltro || comercios.includes(comerciosFiltro);
        const tipoMatch = !tipoFiltro || tipos.includes(tipoFiltro);

        // Filtrado por booleanos
        const animalesMatch = (() => {
            const val = document.getElementById('filtro-animales-comercios').value;
            return val === "" || (!!props.animales_aceptados === (val === "true"));
        })();
        const agroecoMatch = (() => {
            const val = document.getElementById('filtro-agroeco-comercios').value;
            return val === "" || (!!props.agricultura_ecologica === (val === "true"));
        })();

        if(animalesMatch && agroecoMatch && productosMatch && tipoMatch){
        //  

        if(productosMatch && tipoMatch){
            comerciosClusters.addLayer(marker);
        }
    }});
}

function fitlrarRestaurantes(){
    const tipoFiltro = normalizaTexto(document.getElementById('filtro-tipo-restaurante').value);
    const etiquetaFiltro = normalizaTexto(document.getElementById('filtro-etiqueta-restaurante').value);
    restaurantesCluster.clearLayers();

    restaurantesMarkers.forEach(({marker, props})=>{
        const tipos = (props.tipo_establecimiento || []).map(v => normalizaTexto(v));
        const etiquetas = (props.etiqueta_calidad || []).map(v => normalizaTexto(v));
        const tipoMatch = !tipoFiltro || tipos.includes(tipoFiltro);
        const etiquetaMatch = !etiquetaFiltro || etiquetas.includes(etiquetaFiltro);
        if(tipoMatch && etiquetaMatch){
            restaurantesCluster.addLayer(marker);
        }
    });
}

function filtrarEmpresasNieve() {
    const actividadFiltro = normalizaTexto(document.getElementById('filtro-tipo-actividad-nieve').value);
    const accesibilidadFiltro = document.getElementById('filtro-accesibilidad-empresa-nieve').value;

    // Limpiar el cluster antes de aplicar los filtros
    empresasNieveClusters.clearLayers();

    empresasNieveMarkers.forEach(({ marker, props }) => {
        // Normalizar y procesar los datos del marcador
        const actividades = Array.isArray(props.actividad)
            ? props.actividad.map(v => normalizaTexto(v))
            : [normalizaTexto(props.actividad)];
        const actividadMatch = !actividadFiltro || actividades.includes(actividadFiltro);

        // Convertir el valor del filtro de accesibilidad a booleano
        const accesibilidadMatch = accesibilidadFiltro === "" || 
            (!!props.accesibilidad === (accesibilidadFiltro === "true"));

        // Si el marcador cumple con los filtros, se agrega al cluster
        if (actividadMatch && accesibilidadMatch) {
            empresasNieveClusters.addLayer(marker);
        }
    });
}

function filtrarSki() {
    const tipoSeleccionado = normalizaTexto(document.getElementById('filtro-tipo-ski').value);

    // Limpiar el cluster antes de aplicar los filtros
    skiClusters.clearLayers();

    // Filtrar los marcadores según el tipo seleccionado
    skiMarkers.forEach(({ marker, props }) => {
        const tipos = props.tipo
            ? props.tipo.split(',').map(t => normalizaTexto(t.trim())) // Dividir y normalizar
            : [];

        // Verificar si el tipo seleccionado está en la lista de tipos del marcador
        if (!tipoSeleccionado || tipos.includes(tipoSeleccionado)) {
            skiClusters.addLayer(marker);
        }
    });
}

function filtrarPuntosEscalada() {
    const tipoSeleccionado = normalizaTexto(document.getElementById('filtro-tipo-via-escalada').value);
    const tiempoMaximo = parseFloat(document.getElementById('filtro-tiempo-acceso-escalada').value);
    const desnivelMinimo = parseFloat(document.getElementById('filtro-desnivel-escalada').value);
    const difSeleccionada = document.getElementById('filtro-dificultad-escalada').value;

    const gradosFranceses = [
        '3', '4a', '4b', '4c',
        '5a', '5b', '5c',
        '6a', '6a+', '6b', '6b+', '6c', '6c+',
        '7a', '7a+', '7b', '7b+', '7c', '7c+',
        '8a', '8a+', '8b', '8b+', '8c', '8c+',
        '9a', '9a+', '9b', '9b+', '9c'
    ];

    const gradoIndex = g => {
        if (!g) return -1;
        const idx = gradosFranceses.indexOf(normalizaTexto(g));
        return idx >= 0 ? idx : -1;
    };

    const difIdx = difSeleccionada ? gradoIndex(difSeleccionada) : -1;

    puntosEscaladaClusters.clearLayers();

    puntosEscaladaMarkers.forEach(({ marker, props }) => {
        // --- Tipo de vía ---
        const tipos = props.tipo_via
            ? props.tipo_via.split(',').map(t => normalizaTexto(t.trim()))
            : [];
        const tipoMatch = !tipoSeleccionado || tipos.includes(tipoSeleccionado);

        // --- Tiempo de acceso ---
        const tiempoAcceso = props.tiempo_acceso_minimo !== null ? parseFloat(props.tiempo_acceso_minimo) : null;
        const tiempoMatch = !tiempoMaximo || (tiempoAcceso !== null && tiempoAcceso <= tiempoMaximo);

        // --- Desnivel ---
        const desnivel = props.desnivel !== null ? parseFloat(props.desnivel) : null;
        const desnivelMatch = !desnivelMinimo || (desnivel !== null && desnivel >= desnivelMinimo);

        // --- Dificultad ---
        let dificultadMatch = true;
        const minIdx = gradoIndex(props.dif_minima);
        const maxIdx = gradoIndex(props.dif_maxima);

        if (difIdx !== -1) {
            // Si el usuario selecciona una dificultad concreta
            if (minIdx === -1 && maxIdx === -1) {
                // No tiene dificultad → no mostrar
                dificultadMatch = false;
            } else {
                const min = minIdx !== -1 ? minIdx : maxIdx;
                const max = maxIdx !== -1 ? maxIdx : minIdx;
                dificultadMatch = (difIdx >= min && difIdx <= max);
            }
        } else {
            // Si no se selecciona ningún grado → mostrar todas (incluyendo sin dificultad)
            dificultadMatch = true;
        }

        // --- Añadir si cumple todos los criterios ---
        if (tipoMatch && tiempoMatch && desnivelMatch && dificultadMatch) {
            puntosEscaladaClusters.addLayer(marker);
        }
    });
}

function actualizarOpcionesDisponibles() {
    const vSel = document.getElementById('filtro-dificultad-vertical-canyoning').value || null;
    const aSel = document.getElementById('filtro-dificultad-acuatica-canyoning').value || null;
    const cSel = document.getElementById('filtro-dificultad-compromiso-canyoning').value || null;
    const nivelGeneral = document.getElementById('filtro-nivel-general-canyoning').value || null;

    const verticalDisponibles = new Set();
    const acuaticasDisponibles = new Set();
    const compromisosDisponibles = new Set();

    canyoningMarkers.forEach(({ props }) => {
        const v = props.dificultad_vertical;
        const a = props.dificultad_acuatica;
        const c = props.dificultad_compromiso;

        // Transformar a valores numéricos para nivel general
        const mapV = { V1:1,V2:2,V3:3,V4:4,V5:5,V6:6,V7:7 };
        const mapA = { A1:1,A2:2,A3:3,A4:4,A5:5,A6:6,A7:7 };
        const mapC = { I:1,II:2,III:3,IV:4,V:5,VI:6 };

        const vVal = mapV[v] || null;
        const aVal = mapA[a] || null;
        const cVal = mapC[c] || null;

        const tercioV = Math.ceil(7/3);
        const tercioA = Math.ceil(7/3);
        const tercioC = Math.ceil(6/3);

        // --- Comprobar coincidencia con filtros ---
        let match = true;
        if (vSel && v !== vSel) match = false;
        if (aSel && a !== aSel) match = false;
        if (cSel && c !== cSel) match = false;

        if (nivelGeneral) {
            if (nivelGeneral === 'facil' && (!(vVal <= tercioV && aVal <= tercioA && cVal <= tercioC))) match = false;
            if (nivelGeneral === 'intermedio' && (!((vVal > tercioV && vVal <= tercioV*2) &&
                                                   (aVal > tercioA && aVal <= tercioA*2) &&
                                                   (cVal > tercioC && cVal <= tercioC*2)))) match = false;
            if (nivelGeneral === 'dificil' && (!(vVal > tercioV*2 || aVal > tercioA*2 || cVal > tercioC*2))) match = false;
        }

        // --- Agregar valores disponibles si coinciden ---
        if (match) {
            if (v) verticalDisponibles.add(v);
            if (a) acuaticasDisponibles.add(a);
            if (c) compromisosDisponibles.add(c);
        }
    });

    function poblarSelectConDisponibles(select, disponibles) {
        const currentValue = select.value;
        select.innerHTML = '<option value="">Todas</option>';
        Array.from(disponibles).sort().forEach(op => {
            const option = document.createElement('option');
            option.value = op;
            option.textContent = op;
            select.appendChild(option);
        });
        if (disponibles.has(currentValue)) {
            select.value = currentValue;
        } else {
            select.value = "";
        }
    }

    poblarSelectConDisponibles(document.getElementById('filtro-dificultad-vertical-canyoning'), verticalDisponibles);
    poblarSelectConDisponibles(document.getElementById('filtro-dificultad-acuatica-canyoning'), acuaticasDisponibles);
    poblarSelectConDisponibles(document.getElementById('filtro-dificultad-compromiso-canyoning'), compromisosDisponibles);
}


function filtrarPuntosCanyoning() {
    const tiempoAccesoMax = parseFloat(document.getElementById('filtro-tiempo-acceso-canyoning').value) || null;
    const tiempoTotalMax = parseFloat(document.getElementById('filtro-tiempo-total-canyoning').value) || null;
    const dificultadVertical = document.getElementById('filtro-dificultad-vertical-canyoning').value || null;
    const dificultadAcuatica = document.getElementById('filtro-dificultad-acuatica-canyoning').value || null;
    const dificultadCompromiso = document.getElementById('filtro-dificultad-compromiso-canyoning').value || null;
    const numeroRapelesMax = parseInt(document.getElementById('filtro-numero-rapeles-canyoning').value) || null;
    const nivelGeneral = document.getElementById('filtro-nivel-general-canyoning').value || null;

    canyoningClusters.clearLayers();

    canyoningMarkers.forEach(({ marker, props }) => {
        const tiempoAcceso = props.tpo_acceso ? parseFloat(props.tpo_acceso) : null;
        const tiempoTotal = props.tiempo ? parseFloat(props.tiempo) : null;
        const numeroRapeles = props.maximo_rapple ? parseInt(props.maximo_rapple) : null;

        const v = props.dificultad_vertical;
        const a = props.dificultad_acuatica;
        const c = props.dificultad_compromiso;

        // --- Transformar a valores numéricos ---
        const mapV = { V1:1, V2:2, V3:3, V4:4, V5:5, V6:6, V7:7 };
        const mapA = { A1:1, A2:2, A3:3, A4:4, A5:5, A6:6, A7:7 };
        const mapC = { I:1, II:2, III:3, IV:4, V:5, VI:6 };

        const vVal = mapV[v] || null;
        const aVal = mapA[a] || null;
        const cVal = mapC[c] || null;

        // --- Filtrado base ---
        const tiempoAccesoMatch = tiempoAccesoMax === null || (tiempoAcceso && tiempoAcceso <= tiempoAccesoMax);
        const tiempoTotalMatch = tiempoTotalMax === null || (tiempoTotal && tiempoTotal <= tiempoTotalMax);
        const numeroRapelesMatch = numeroRapelesMax === null || (numeroRapeles && numeroRapeles <= numeroRapelesMax);
        const dificultadVerticalMatch = !dificultadVertical || dificultadVertical === v;
        const dificultadAcuaticaMatch = !dificultadAcuatica || dificultadAcuatica === a;
        const dificultadCompromisoMatch = !dificultadCompromiso || dificultadCompromiso === c;

        // --- Nivel general (Fácil / Intermedio / Difícil) ---
        let nivelMatch = true;
        if (nivelGeneral) {
            const tercioV = Math.ceil(7 / 3); // ≈3
            const tercioA = Math.ceil(7 / 3);
            const tercioC = Math.ceil(6 / 3); // =2


            if (nivelGeneral === 'facil') {
                nivelMatch =
                    (vVal && vVal <= tercioV) &&
                    (aVal && aVal <= tercioA) &&
                    (cVal && cVal <= tercioC);
            } else if (nivelGeneral === 'intermedio') {
                nivelMatch =
                    (vVal && vVal > tercioV && vVal <= tercioV * 2) &&
                    (aVal && aVal > tercioA && aVal <= tercioA * 2) &&
                    (cVal && cVal > tercioC && cVal <= tercioC * 2);
            } else if (nivelGeneral === 'dificil') {
                nivelMatch =
                    (vVal && vVal > tercioV * 2) ||
                    (aVal && aVal > tercioA * 2) ||
                    (cVal && cVal > tercioC * 2);
            }
        }

        // --- Resultado final ---
        if (
            tiempoAccesoMatch &&
            tiempoTotalMatch &&
            numeroRapelesMatch &&
            dificultadVerticalMatch &&
            dificultadAcuaticaMatch &&
            dificultadCompromisoMatch &&
            nivelMatch
        ) {
            canyoningClusters.addLayer(marker);
        }
    });

    if (canyoningClusters.getLayers().length === 0) {
        console.warn("No se encontraron resultados para los filtros aplicados.");
    }
    // Actualizar las opciones disponibles en los selectores
    actualizarOpcionesDisponibles();
}
function filtrarVTT() {
    const gradoDificultad = normalizaTexto(document.getElementById('filtro-grado-dificultad').value);
    const tipoVia = normalizaTexto(document.getElementById('filtro-tipo-via').value);
    const longitudMax = parseFloat(document.getElementById('filtro-longitud-min').value) || null; // Cambiar a longitud máxima
    const tiempoMax = parseFloat(document.getElementById('filtro-tiempo-max').value) || null;
    const desnivelPositivoMax = parseFloat(document.getElementById('filtro-desnivel-positivo-min').value) || null; // Cambiar a desnivel positivo máximo
    const desnivelNegativoMax = parseFloat(document.getElementById('filtro-desnivel-negativo-max').value) || null;

    vttLayer.clearLayers();

    fetch('data/turismo_activo/btt.geojson')
        .then(response => response.json())
        .then(data => {
            const rutasFiltradas = data.features.filter(feature => {
                const props = feature.properties;

                const dificultad = normalizaTexto(props.grado_dificultad || '');
                const tipo = normalizaTexto(props.tipo_via || '');
                const longitud = parseFloat(props.longitud) || 0;
                const tiempo = parseFloat(props.tiempo) || 0;
                const desnivelPositivo = parseFloat(props.desnivel_positivo) || 0;
                const desnivelNegativo = parseFloat(props.desnivel_negativo) || 0;

                const dificultadMatch = !gradoDificultad || dificultad === gradoDificultad;
                const tipoMatch = !tipoVia || tipo === tipoVia;
                const longitudMatch = !longitudMax || longitud <= longitudMax; // Cambiar a "menor o igual"
                const tiempoMatch = !tiempoMax || tiempo <= tiempoMax;
                const desnivelPositivoMatch = !desnivelPositivoMax || desnivelPositivo <= desnivelPositivoMax; // Cambiar a "menor o igual"
                const desnivelNegativoMatch = !desnivelNegativoMax || desnivelNegativo <= desnivelNegativoMax;

                return (
                    dificultadMatch &&
                    tipoMatch &&
                    longitudMatch &&
                    tiempoMatch &&
                    desnivelPositivoMatch &&
                    desnivelNegativoMatch
                );
            });

            if (rutasFiltradas.length === 0) {
                console.warn('No se encontraron rutas que coincidan con los filtros.');
                return;
            }

            L.geoJSON(rutasFiltradas, {
                style: estiloVTT,
                onEachFeature: (feature, layer) => updatePopupVTT(layer, feature.properties)
            }).addTo(vttLayer);
        })
        .catch(error => console.error('Error al filtrar las rutas VTT:', error));
}

function filtrarItinerariosPedestres() {
    // Normalizamos el valor seleccionado (ahora los option.value están normalizados)
    const dificultadSeleccionada = normalizaTexto(document.getElementById('filtro-dificultad-itinerarios-pedestres').value);
    const distanciaMaxima = parseFloat(document.getElementById('filtro-distancia-itinerarios-pedestres').value);
    const paisajeSeleccionado = normalizaTexto(document.getElementById('filtro-paisaje-itinerarios-pedestres').value);

    itinerariosPedestresClusters.clearLayers();

    itinerariosPedestresMarkers.forEach(({ marker, props }) => {
        // Normalizar la dificultad del propio marker
        const dificultadMarker = props.dificultad ? normalizaTexto(String(props.dificultad)) : "";

        const dificultadMatch = !dificultadSeleccionada || dificultadMarker === dificultadSeleccionada;
        const distanciaMatch = !distanciaMaxima || (props.distancia_km && parseFloat(props.distancia_km) <= distanciaMaxima);

        // Limpieza y división más robusta del campo paisaje
        const paisajes = props.paisaje
            ? props.paisaje
                .split(',')
                .map(p => normalizaTexto(p.trim()))
                .filter(p => p.length > 0)
            : [];

        // Coincidencia flexible: permite que "bosque" coincida con "bosque y río" o similares
        const paisajeMatch = !paisajeSeleccionado ||
            paisajes.some(p => p.includes(paisajeSeleccionado) || paisajeSeleccionado.includes(p));

        if (dificultadMatch && distanciaMatch && paisajeMatch) {
            itinerariosPedestresClusters.addLayer(marker);
        }
    });
}


function filtrarItinerariosAdaptados() {
    // Normalizamos el valor seleccionado (ahora los option.value están normalizados)
    const dificultadSeleccionada = normalizaTexto(document.getElementById('filtro-dificultad-itinerarios-adaptados').value);
    const distanciaMaxima = parseFloat(document.getElementById('filtro-distancia-itinerarios-adaptados').value);
    const paisajeSeleccionado = normalizaTexto(document.getElementById('filtro-paisaje-itinerarios-adaptados').value);
    itinerariosAdaptadosClusters.clearLayers();

    itinerariosAdaptadosMarkers.forEach(({ marker, props }) => {
        // Normalizar la dificultad del propio marker
        const dificultadMarker = props.dificultad ? normalizaTexto(String(props.dificultad)) : "";

        const dificultadMatch = !dificultadSeleccionada || dificultadMarker === dificultadSeleccionada;
        const distanciaMatch = !distanciaMaxima || (props.distancia_km && parseFloat(props.distancia_km) <= distanciaMaxima);

        // Limpieza y división más robusta del campo paisaje
        const paisajes = props.paisaje
            ? props.paisaje
                .split(',')
                .map(p => normalizaTexto(p.trim()))
                .filter(p => p.length > 0)
            : [];

        // Coincidencia flexible: permite que "bosque" coincida con "bosque y río" o similares
        const paisajeMatch = !paisajeSeleccionado ||
            paisajes.some(p => p.includes(paisajeSeleccionado) || paisajeSeleccionado.includes(p));

        if (dificultadMatch && distanciaMatch && paisajeMatch) {
            itinerariosAdaptadosClusters.addLayer(marker);
        }
    });
}

function filtrarItinerariosEquestres() {
    // Normalizamos el valor seleccionado (ahora los option.value están normalizados)
    const dificultadSeleccionada = normalizaTexto(document.getElementById('filtro-dificultad-itinerarios-equestres').value);
    const distanciaMaxima = parseFloat(document.getElementById('filtro-distancia-itinerarios-equestres').value);
    const paisajeSeleccionado = normalizaTexto(document.getElementById('filtro-paisaje-itinerarios-equestres').value);
    itinerariosEquestresClusters.clearLayers();

    itinerariosEquestresMarkers.forEach(({ marker, props }) => {
        // Normalizar la dificultad del propio marker
        const dificultadMarker = props.dificultad ? normalizaTexto(String(props.dificultad)) : "";

        const dificultadMatch = !dificultadSeleccionada || dificultadMarker === dificultadSeleccionada;
        const distanciaMatch = !distanciaMaxima || (props.distancia_km && parseFloat(props.distancia_km) <= distanciaMaxima);

        // Limpieza y división más robusta del campo paisaje
        const paisajes = props.paisaje
            ? props.paisaje
                .split(',')
                .map(p => normalizaTexto(p.trim()))
                .filter(p => p.length > 0)
            : [];

        // Coincidencia flexible: permite que "bosque" coincida con "bosque y río" o similares
        const paisajeMatch = !paisajeSeleccionado ||
            paisajes.some(p => p.includes(paisajeSeleccionado) || paisajeSeleccionado.includes(p));

        if (dificultadMatch && distanciaMatch && paisajeMatch) {
            itinerariosEquestresClusters.addLayer(marker);
        }
    });
}

function filtrarItinerariosTrail() {
    // Normalizamos el valor seleccionado (ahora los option.value están normalizados)
    const dificultadSeleccionada = normalizaTexto(document.getElementById('filtro-dificultad-itinerarios-trail').value);
    const distanciaMaxima = parseFloat(document.getElementById('filtro-distancia-itinerarios-trail').value);
    const paisajeSeleccionado = normalizaTexto(document.getElementById('filtro-paisaje-itinerarios-trail').value);
    itinerariosTrailrunningClusters.clearLayers();

    itinerariosTrailrunningMarkers.forEach(({ marker, props }) => {
        // Normalizar la dificultad del propio marker
        const dificultadMarker = props.dificultad ? normalizaTexto(String(props.dificultad)) : "";

        const dificultadMatch = !dificultadSeleccionada || dificultadMarker === dificultadSeleccionada;
        const distanciaMatch = !distanciaMaxima || (props.distancia_km && parseFloat(props.distancia_km) <= distanciaMaxima);

        // Limpieza y división más robusta del campo paisaje
        const paisajes = props.paisaje
            ? props.paisaje
                .split(',')
                .map(p => normalizaTexto(p.trim()))
                .filter(p => p.length > 0)
            : [];

        // Coincidencia flexible: permite que "bosque" coincida con "bosque y río" o similares
        const paisajeMatch = !paisajeSeleccionado ||
            paisajes.some(p => p.includes(paisajeSeleccionado) || paisajeSeleccionado.includes(p));

        if (dificultadMatch && distanciaMatch && paisajeMatch) {
            itinerariosTrailrunningClusters.addLayer(marker);
        }
    });
}


// ================= FILTROS =================
// ================= FILTROS EN EL MAPA =================
const FiltrosControl = L.Control.extend({
    options: { position: 'topright' },
    onAdd: function(map) {
        const container = L.DomUtil.create('div', 'filtros-mapa-control');
        container.innerHTML = `
            <div class="filtro-capa">
                <button class="toggle-filtros" data-capa="mercados">MERCADOS/MARCHÉS</button>
                <div class="contenedor-filtros" data-capa="mercados" style="display:none;">
                    <label>Tipo/Type:</label>
                    <select id="filtro-tipo-mercado"><option value="">Todos/Tous</option></select>
                    <label>Frecuencia/Fréquence:</label>
                    <select id="filtro-frecuencia"><option value="">Todos/Tous</option></select>
                    <label>Semana/Semaine:</label>
                    <select id="filtro-semana"><option value="">Todos/Tous</option></select>
                    <label>Día/Jour:</label>
                    <select id="filtro-dia"><option value="">Todos/Tous</option></select>
                    <label>Horario apertura/Horaires:</label>
                    <select id="filtro-apertura"><option value="">Todos/Tous</option></select>
                    <button class="btn-limpiar-filtros" data-capa="mercados" type="button">Limpiar filtros / Nettoyer les filtres</button>
                </div>

                <button class="toggle-filtros" data-capa="escuelas">ESCUELAS DE FORMACIÓN/ÉCOLES</button>
                <div class="contenedor-filtros" data-capa="escuelas" style="display:none;">
                    <label>Tipo centro/Type centre:</label>
                    <select id="filtro-tipo-centro"><option value="">Todos/Tous</option></select>
                    <label>Estudios ofertados/Études proposées:</label>
                    <select id="filtro-tipo-oferta"><option value="">Todos/Tous</option></select>
                    <button class="btn-limpiar-filtros" data-capa="escuelas" type="button">Limpiar filtros / Nettoyer les filtres</button>
                </div>

                <button class="toggle-filtros" data-capa="restaurantes">RESTAURANTES / RESTAURANTS</button>
                <div class="contenedor-filtros" data-capa="restaurantes" style="display:none;">
                    <label>Tipo de restaurante / Type de restaurant:</label>
                    <select id="filtro-tipo-restaurante"><option value="">Todos/Tous</option></select>
                    <label>Etiquetas de calidad / Étiquettes de qualité:</label>
                    <select id="filtro-etiqueta-restaurante"><option value="">Todos/Tous</option></select>
                    <button class="btn-limpiar-filtros" data-capa="restaurantes" type="button">Limpiar filtros / Nettoyer les filtres</button>
                </div>

                <button class="toggle-filtros" data-capa="productos">PRODUCTOS AGROALIMENTARIOS / PRODUITS AGROALIMENTAIRES</button>
                <div class="contenedor-filtros" data-capa="productos" style="display:none;">
                    <label>Tipo de producto/Type de produit:</label>
                    <select id="filtro-tipo-producto"><option value="">Todos/Tous</option></select>
                    <label>Comercialización/Commercialisation:</label>
                    <select id="filtro-comercializacion-producto"><option value="">Todos/Tous</option></select>
                    <label>Temporada/Saison:</label>
                    <select id="filtro-temporada-producto"><option value="">Todos/Tous</option></select>
                    <button class="btn-limpiar-filtros" data-capa="productos" type="button">Limpiar filtros / Nettoyer les filtres</button>
                </div>

                <button class="toggle-filtros" data-capa="productores">PRODUCTORES / PRODUCTEURS </button>
                <div class="contenedor-filtros" data-capa="productores" style="display:none;">
                    <label>Productos / Produits:</label>
                    <select id="filtro-productos-productor"><option value="">Todos/Tous</option></select>
                    <label>Tipo de productor / Type de producteur:</label>
                    <select id="filtro-tipo-productor"><option value="">Todos/Tous</option></select>
                    <label>Tienda / Boutique:</label>
                    <select id="filtro-tienda-productor">
                        <option value="">Todos/Tous</option>
                        <option value="true">Sí/Oui</option>
                        <option value="false">No/Non</option>
                    </select>
                    <label>Agricultura ecológica / Agriculture biologique:</label>
                    <select id="filtro-agroeco-productor">
                        <option value="">Todos/Tous</option>
                        <option value="true">Sí/Oui</option>
                        <option value="false">No/Non</option>
                    </select>
                    <label>Restaurante / Restaurant:</label>
                    <select id="filtro-restautante-productor">
                        <option value="">Todos/Tous</option>
                        <option value="true">Sí/Oui</option>
                        <option value="false">No/Non</option>
                    </select>
                    <label>Venta mayorista / Vente en gros:</label>
                    <select id="filtro-venta-mayor-productor">
                        <option value="">Todos/Tous</option>
                        <option value="true">Sí/Oui</option>
                        <option value="false">No/Non</option>
                    </select>
                    <label>Tienda online / Boutique en ligne:</label>
                    <select id="filtro-tienda-online-productor">
                        <option value="">Todos/Tous</option>
                        <option value="true">Sí/Oui</option>
                        <option value="false">No/Non</option>
                    </select>
                    <label>Venta en centro de producción / Vente au centre de production:</label>
                    <select id="filtro-venta-centro-produccion-productor">
                        <option value="">Todos/Tous</option>
                        <option value="True">Sí/Oui</option>
                        <option value="false">No/Non</option>
                    </select>
                    <button class="btn-limpiar-filtros" data-capa="productores" type="button">Limpiar filtros / Nettoyer les filtres</button>
                </div>

                <button class="toggle-filtros" data-capa="comercios">TIENDAS / BOUTIQUES </button>
                <div class="contenedor-filtros" data-capa="comercios" style="display:none;">
                    <label>Productos / Produits:</label>
                    <select id="filtro-productos-comercios"><option value="">Todos/Tous</option></select>
                    <label>Tipo de tienda / Type de Boutique:</label>
                    <select id="filtro-tipo-comercios"><option value="">Todos/Tous</option></select>
                    <label>Animales aceptados / Animaux acceptés:</label>
                    <select id="filtro-animales-comercios">
                        <option value="">Todos/Tous</option>
                        <option value="true">Sí/Oui</option>
                        <option value="false">No/Non</option>
                    </select> 
                    <label>Agricultura ecológica / Agriculture biologique:</label>
                    <select id="filtro-agroeco-comercios">
                        <option value="">Todos/Tous</option>
                        <option value="true">Sí/Oui</option>
                        <option value="false">No/Non</option>
                    </select>
                    <button class="btn-limpiar-filtros" data-capa="comercios" type="button">Limpiar filtros / Nettoyer les filtres</button>
                </div>

                <button class="toggle-filtros" data-capa="empresas-nieve">EMPRESAS DE NIEVE / ENTREPRISES DE NEIGE</button>
                <div class="contenedor-filtros" data-capa="empresas-nieve" style="display:none;">
                    <label>Tipo de actividad / Type d'activité:</label>
                    <select id="filtro-tipo-actividad-nieve">
                        <option value="">Todos/Tous</option>
                    </select>
                <label>Accesibilidad / Accessibilité:</label>
                <select id="filtro-accesibilidad-empresa-nieve">
                    <option value="">Todos/Tous</option>
                    <option value="true">Sí/Oui</option>
                    <option value="false">No/Non</option>
                </select>
                    <button class="btn-limpiar-filtros" data-capa="empresas-nieve" type="button">Limpiar filtros / Nettoyer les filtres</button>
                </div>

                <button class="toggle-filtros" data-capa="productores-proximidad">PRODUCTORES DE PROXIMIDAD</button>
                <div class="contenedor-filtros" data-capa="productores-proximidad" style="display:none;">
                <label>Distancia / Distance:</label>
                <select id="filtro-distancia-proximidad">
                    <option value="">Todos/Tous</option>
                </select>
                <label>Tipo de producto / Type de produit:</label>
                <select id="filtro-tipo-producto-proximidad">
                    <option value="">Todos/Tous</option>
                </select>
                    <button class="btn-limpiar-filtros" data-capa="productores-proximidad" type="button">Limpiar filtros / Nettoyer les filtres</button>
                </div>
                <button class="toggle-filtros" data-capa="ski">ESTACIONES DE SKI / STATIONS DE SKI</button>
                <div class="contenedor-filtros" data-capa="ski" style="display:none;">
                    <label>Tipo de estación / Type de station:</label>
                    <select id="filtro-tipo-ski">
                        <option value="">Todos/Tous</option>
                    </select>
                    <button class="btn-limpiar-filtros" data-capa="ski" type="button">Limpiar filtros / Nettoyer les filtres</button>
                </div>

                <button class="toggle-filtros" data-capa="puntos-escalada">PUNTOS DE ESCALADA / POINTS D'ESCALADE</button>
                <div class="contenedor-filtros" data-capa="puntos-escalada" style="display:none;">
                    <label>Tipo de vía / Type de voie:</label>
                    <select id="filtro-tipo-via-escalada">
                        <option value="">Todos/Tous</option>
                    </select>
                    <label>Dificultad / Difficulté:</label>
                    <select id="filtro-dificultad-escalada">
                        <option value="">Todas / Toutes</option>
                    </select>
                    <label>Tiempo de acceso (min) / Temps d'accès (min):</label>
                    <input type="number" id="filtro-tiempo-acceso-escalada" placeholder="Ej: 30">
                    <label>Desnivel máximo (m) / Dénivelé maximal (m):</label>
                    <input type="number" id="filtro-desnivel-escalada" placeholder="Ej: 100">
                    <p>
                        <button class="btn-limpiar-filtros" data-capa="puntos-escalada" type="button">Limpiar filtros / Nettoyer les filtres</button>
                    </p>
                </div>

                <!-- Filtros para Canyoning -->
                <button class="toggle-filtros" data-capa="puntos-canyoning">CANYONING / CANYONING</button>
                <div class="contenedor-filtros" data-capa="puntos-canyoning" style="display:none;">
                    <label>Nivel general / Niveau général:</label>
                    <select id="filtro-nivel-general-canyoning">
                        <option value="">Todos / Tous</option>
                        <option value="facil">Fácil / Facile</option>
                        <option value="intermedio">Intermedio / Intermédiaire</option>
                        <option value="dificil">Difícil / Difficile</option>
                    </select>
                    <label>Dificultad vertical / Difficulté verticale:</label>
                    <select id="filtro-dificultad-vertical-canyoning">
                        <option value="">Todas / Toutes</option>
                    </select>
                    <label>Dificultad acuática / Difficulté aquatique:</label>
                    <select id="filtro-dificultad-acuatica-canyoning">
                        <option value="">Todas / Toutes</option>
                    </select>
                    <label>Dificultad de compromiso / Difficulté d'engagement:</label>
                    <select id="filtro-dificultad-compromiso-canyoning">
                        <option value="">Todas / Toutes</option>
                    </select>
                    <p style="text-align: center">
                    <label>Tiempo total (min) / Temps total (min):</label>
                    <input type="number" id="filtro-tiempo-total-canyoning" placeholder="Ej: 120">
                    <label>Tiempo de acceso (min) / Temps d'accès (min):</label>
                    <input type="number" id="filtro-tiempo-acceso-canyoning" placeholder="Ej: 30">
                    </p>
                    <p style="text-align: center">
                    <label>Maxima altitud de rápeles / Altitude maximale des rappels (m):</label>
                    <input type="number" id="filtro-numero-rapeles-canyoning" placeholder="Ej: 50">
                    </p>
                    <button class="btn-limpiar-filtros" data-capa="puntos-canyoning" type="button">Limpiar filtros / Nettoyer les filtres</button>
                </div>
                <button class="toggle-filtros" data-capa="itinerarios-btt">ITINERARIOS BTT / ITINÉRAIRES VTT</button>
                <div class="contenedor-filtros" data-capa="itinerarios-btt" style="display:none;">
                    <label>Grado de dificultad / Niveau de difficulté:</label>
                    <select id="filtro-grado-dificultad">
                        <option value="">Todos / Tous</option>
                    </select>
                    <label>Tipo de vía / Type de voie:</label>
                    <select id="filtro-tipo-via">
                        <option value="">Todos / Tous</option>
                    </select>
                    <p style="text-align: center">
                    <label>Longitud mínima (km) / Longueur minimale (km):</label>
                    <input type="number" id="filtro-longitud-min" placeholder="Ej: 5">
                    <label>Tiempo máximo (min) / Temps maximal (min):</label>
                    <input type="number" id="filtro-tiempo-max" placeholder="Ej: 3">
                    <label>Desnivel positivo mínimo (m) / Dénivelé positif minimal (m):</label>
                    <input type="number" id="filtro-desnivel-positivo-min" placeholder="Ej: 100">
                    <label>Desnivel negativo máximo (m) / Dénivelé négatif maximal (m):</label>
                    <input type="number" id="filtro-desnivel-negativo-max" placeholder="Ej: 200">
                    </p>
                    <p>
                    <button class="btn-limpiar-filtros" data-capa="itinerarios-btt" type="button">Limpiar filtros / Nettoyer les filtres</button>
                    </p>
                </div>
                <button class="toggle-filtros" data-capa="itinerarios-adaptados">ITINERARIOS ADAPTADOS / ITINÉRAIRES ADAPTÉS</button>
                <div class="contenedor-filtros" data-capa="itinerarios-adaptados" style="display:none;">
                    <label>Dificultad / Difficulté:</label>
                    <select id="filtro-dificultad-itinerarios-adaptados">
                        <option value="">Todas / Toutes</option>
                    </select>
                    <label>Distancia máxima (km) / Distance maximale (km):</label>
                    <input type="number" id="filtro-distancia-itinerarios-adaptados" placeholder="Ej: 10">
                    <label>Paisaje / Paysage:</label>
                    <select id="filtro-paisaje-itinerarios-adaptados">
                        <option value="">Todos / Tous</option>
                    </select>
                    <button class="btn-limpiar-filtros" data-capa="itinerarios-adaptados" type="button">Limpiar filtros / Nettoyer les filtres</button>
                </div>
                <button class="toggle-filtros" data-capa="itinerarios-pedestres">ITINERARIOS PEDESTRES / ITINÉRAIRES PÉDESTRES</button>
                <div class="contenedor-filtros" data-capa="itinerarios-pedestres" style="display:none;">
                    <label>Dificultad / Difficulté:</label>
                    <select id="filtro-dificultad-itinerarios-pedestres">
                        <option value="">Todas / Toutes</option>
                    </select>
                    <label>Distancia máxima (km) / Distance maximale (km):</label>
                    <input type="number" id="filtro-distancia-itinerarios-pedestres" placeholder="Ej: 10">
                    <label>Paisaje / Paysage:</label>
                    <select id="filtro-paisaje-itinerarios-pedestres">
                        <option value="">Todos / Tous</option>
                    </select>
                    <button class="btn-limpiar-filtros" data-capa="itinerarios-pedestres" type="button">Limpiar filtros / Nettoyer les filtres</button>
                </div>
                <button class="toggle-filtros" data-capa="itinerarios-equestres">ITINERARIOS EQUESTRES / ITINÉRAIRES ÉQUESTRES</button>
                <div class="contenedor-filtros" data-capa="itinerarios-equestres" style="display:none;">
                    <label>Dificultad / Difficulté:</label>
                    <select id="filtro-dificultad-itinerarios-equestres">
                        <option value="">Todas / Toutes</option>
                    </select>
                    <label>Distancia máxima (km) / Distance maximale (km):</label>
                    <input type="number" id="filtro-distancia-itinerarios-equestres" placeholder="Ej: 10">
                    <label>Paisaje / Paysage:</label>
                    <select id="filtro-paisaje-itinerarios-equestres">
                        <option value="">Todos / Tous</option>
                    </select>
                    <button class="btn-limpiar-filtros" data-capa="itinerarios-equestres" type="button">Limpiar filtros / Nettoyer les filtres</button>
                </div>
                <button class="toggle-filtros" data-capa="itinerarios-trailrunning">ITINERARIOS TRAIL / ITINÉRAIRES TRAIL</button>
                <div class="contenedor-filtros" data-capa="itinerarios-trailrunning" style="display:none;">
                    <label>Dificultad / Difficulté:</label>
                    <select id="filtro-dificultad-itinerarios-trail">
                        <option value="">Todas / Toutes</option>
                    </select>
                    <label>Distancia máxima (km) / Distance maximale (km):</label>
                    <input type="number" id="filtro-distancia-itinerarios-trail" placeholder="Ej: 10">
                    <label>Paisaje / Paysage:</label>
                    <select id="filtro-paisaje-itinerarios-trail">
                        <option value="">Todos / Tous</option>
                    </select>
                    <button class="btn-limpiar-filtros" data-capa="itinerarios-trailrunning" type="button">Limpiar filtros / Nettoyer les filtres</button>
                </div>
            </div>
        `;
        L.DomEvent.disableClickPropagation(container);
        return container;
    }
});

const filtrosControl = new FiltrosControl();
map.addControl(filtrosControl);

function initAcordeonFiltros(){
    // Hide all filter buttons and containers at startup
    document.querySelectorAll('.filtros-mapa-control .toggle-filtros').forEach(btn => {
        btn.style.display = 'none';
        const contenedor = btn.nextElementSibling;
        contenedor.style.display = 'none';
    });

    // Existing accordion logic
    document.querySelectorAll('.filtros-mapa-control .toggle-filtros').forEach(btn => {
        btn.addEventListener('click', () => {
            const contenedor = btn.nextElementSibling;
            const isVisible = contenedor.style.display === 'block';
            contenedor.style.display = isVisible ? 'none' : 'block';
            btn.textContent = btn.textContent.replace(isVisible ? '▲' : '▼', isVisible ? '▼' : '▲');
        });
    });
}

document.querySelectorAll('.btn-limpiar-filtros').forEach(btn => {
    btn.addEventListener('click', () => {
        const capa = btn.dataset.capa;
        const contenedor = btn.closest('.contenedor-filtros');

        // Limpiar todos los selectores
        contenedor.querySelectorAll('select').forEach(sel => {
            sel.value = "";
        });

        // Limpiar todos los campos de entrada (input)
        contenedor.querySelectorAll('input').forEach(input => {
            input.value = "";
        });

        // Ejecutar el filtrado correspondiente
        if (capa === "mercados") filtrarMarcadores();
        else if (capa === "escuelas") filtrarCentros();
        else if (capa === "productos") filtrarProductosAgro();
        else if (capa === "productores") filtrarProductores();
        else if (capa === "comercios") filtrarComercios();
        else if (capa === "restaurantes") fitlrarRestaurantes();
        else if (capa === "empresas-nieve") filtrarEmpresasNieve();
        else if (capa === "productores-proximidad") filtrarProductoresProximidad();
        else if (capa === "ski") filtrarSki();
        else if (capa === "puntos-escalada") filtrarPuntosEscalada();
        else if (capa === "puntos-canyoning") filtrarPuntosCanyoning();
        else if (capa === "itinerarios-btt") filtrarVTT();
        else if (capa === "itinerarios-adaptados") filtrarItinerariosAdaptados();
        else if (capa === "itinerarios-pedestres") filtrarItinerariosPedestres();
        else if (capa === "itinerarios-equestres") filtrarItinerariosEquestres();
        else if (capa === "itinerarios-trailrunning") filtrarItinerariosTrail();});
});

// ================= ACTUALIZACIÓN DINÁMICA DE FILTROS =================
// Actualizamos acordeón para mostrar solo capas activas
function actualizarFiltrosAcordeon() {
    document.querySelectorAll('.filtros-mapa-control .filtro-capa > .toggle-filtros').forEach(btn => {
        const capa = btn.dataset.capa;
        let capaActiva = false;

        if (capa === 'mercados') capaActiva = map.hasLayer(mercadosCluster);
        else if (capa === 'escuelas') capaActiva = map.hasLayer(centrosCluster);
        else if (capa === 'productos') capaActiva = map.hasLayer(productosAgroCluster);
        else if (capa === 'productores') capaActiva = map.hasLayer(productoresClusters);
        else if (capa === 'productores-proximidad') capaActiva = map.hasLayer(productoresProximidadClusters); // Nueva capa
        else if (capa === 'comercios') capaActiva = map.hasLayer(comerciosClusters);
        else if (capa === 'restaurantes') capaActiva = map.hasLayer(restaurantesCluster);
        else if (capa === 'empresas-nieve') capaActiva = map.hasLayer(empresasNieveClusters);
        else if (capa === 'ski') capaActiva = map.hasLayer(skiClusters);
        else if (capa === 'puntos-escalada') capaActiva = map.hasLayer(puntosEscaladaClusters);
        else if (capa === 'puntos-canyoning') capaActiva = map.hasLayer(canyoningClusters);
        else if (capa === 'itinerarios-btt') capaActiva = map.hasLayer(vttLayer);
        else if (capa === 'itinerarios-adaptados') capaActiva = map.hasLayer(itinerariosAdaptadosClusters);
        else if (capa === 'itinerarios-pedestres') capaActiva = map.hasLayer(itinerariosPedestresClusters);
        else if (capa === 'itinerarios-trailrunning') capaActiva = map.hasLayer(itinerariosTrailrunningClusters);
        else if (capa === 'itinerarios-equestres') capaActiva = map.hasLayer(itinerariosEquestresClusters);

        const contenedor = btn.nextElementSibling;

        if (capaActiva) {
            btn.style.display = 'block';        // Mostrar botón
            contenedor.style.display = 'none';  // Oculto hasta hacer clic
            // Inicializar filtros si no tienen opciones (para no duplicar)
            if (capa === 'mercados' && document.getElementById('filtro-tipo-mercado').options.length <= 1) initFilters();
            else if (capa === 'escuelas' && document.getElementById('filtro-tipo-centro').options.length <= 1) initFiltersCentros();
            else if (capa === 'productos' && document.getElementById('filtro-tipo-producto').options.length <= 1) initFiltersProductosAgro();
            else if (capa === 'productores' && document.getElementById('filtro-productos-productor').options.length <= 1) initFiltersProductores();
            else if (capa === 'productores-proximidad' && document.getElementById('filtro-distancia-proximidad').options.length <= 1) initFiltersProductoresProximidad(); // Nueva capa
            else if (capa === 'productores-proximidad' && document.getElementById('filtro-tipo-producto-proximidad').options.length <= 1) initFiltersProductoresProximidad(); // Nueva capa
            else if (capa === 'comercios' && document.getElementById('filtro-productos-comercios').options.length <= 1) initFiltersComercios();
            else if (capa === 'restaurantes' && document.getElementById('filtro-tipo-restaurante').options.length <= 1) initFiltersRestaurantes();
            else if (capa === 'empresas-nieve' && document.getElementById('filtro-tipo-actividad-nieve').options.length <= 1) initFiltersEmpresasNieve();
            else if (capa === 'ski' && document.getElementById('filtro-tipo-ski').options.length <= 1) initFiltersSki();
            else if (capa === 'puntos-escalada' && document.getElementById('filtro-tipo-via-escalada').options.length <= 1) initFiltersPuntosEscalada();
            else if (capa === 'puntos-canyoning' && document.getElementById('filtro-dificultad-vertical-canyoning').options.length <= 1) initFiltersCanyoning();
            else if (capa === 'puntos-canyoning' && document.getElementById('filtro-dificultad-acuatica-canyoning').options.length <= 1) initFiltersCanyoning();
            else if (capa === 'puntos-canyoning' && document.getElementById('filtro-dificultad-compromiso-canyoning').options.length <= 1) initFiltersCanyoning();
            else if (capa === 'itinerarios-btt' && document.getElementById('filtro-grado-dificultad').options.length <= 1) initFiltersVTT();
            else if (capa === 'itinerarios-btt' && document.getElementById('filtro-tipo-via').options.length <= 1) initFiltersVTT();
            else if (capa === 'itinerarios-adaptados' && document.getElementById('filtro-dificultad-itinerarios-adaptados').options.length <= 1) initFiltersItinerariosAdaptados();
            else if (capa === 'itinerarios-adaptados' && document.getElementById('filtro-paisaje-itinerarios-adaptados').options.length <= 1) initFiltersItinerariosAdaptados();
            else if (capa === 'itinerarios-pedestres' && document.getElementById('filtro-dificultad-itinerarios-pedestres').options.length <= 1) initFiltersItinerariosPedestres();
            else if (capa === 'itinerarios-pedestres' && document.getElementById('filtro-paisaje-itinerarios-pedestres').options.length <= 1) initFiltersItinerariosPedestres();
            else if (capa === 'itinerarios-equestres' && document.getElementById('filtro-dificultad-itinerarios-equestres').options.length <= 1) initFiltersItinerariosEquestres();
            else if (capa === 'itinerarios-equestres' && document.getElementById('filtro-paisaje-itinerarios-equestres').options.length <= 1) initFiltersItinerariosEquestres();
            else if (capa === 'itinerarios-trailrunning' && document.getElementById('filtro-dificultad-itinerarios-trail').options.length <= 1) initFiltersItinerariosTrail();
            else if (capa === 'itinerarios-trailrunning' && document.getElementById('filtro-paisaje-itinerarios-trail').options.length <= 1) initFiltersItinerariosTrail();

        } else {
            btn.style.display = 'none';        // Ocultar botón
            contenedor.style.display = 'none';  // Ocultar contenedor
        }
    });
}



// Modificar los eventos de checkboxes para llamar a actualizarFiltrosAcordeon()
['mercados','escuelas','otros','productos', 'productores', 'comercios', 'restaurantes', 'empresas-nieve', 'ski', 'puntos-escalada', 'puntos-canyoning', 'itinerarios-adaptados', 'itinerarios-pedestres', 'itinerarios-equestres', 'itinerarios-trailrunning'].forEach(tipo=>{
    const checkbox = document.getElementById('cb-'+tipo);
    if(checkbox){
        checkbox.addEventListener('change', e=>{
            const capaMap = 
                {'mercados':mercadosCluster,
                'escuelas':centrosCluster,
                'otros':otrosCentrosCluster,
                'productores': productoresClusters, 
                'comercios': comerciosClusters, 
                'restaurantes': restaurantesCluster, 
                'empresas-nieve': empresasNieveClusters, 
                'ski': skiClusters, 
                'puntos-escalada': puntosEscaladaClusters, 
                'puntos-canyoning': canyoningClusters, 
                'itinerarios-btt': vttLayer, 
                'itinerarios-adaptados': itinerariosAdaptadosClusters,
                'itinerarios-pedestres': itinerariosPedestresClusters,
                'itinerarios-equestres': itinerariosEquestresClusters,
                'itinerarios-trailrunning': itinerariosTrailrunningClusters};
            if(e.target.checked) map.addLayer(capaMap[tipo]); else map.removeLayer(capaMap[tipo]);
            actualizarLeyenda();
            actualizarFiltrosAcordeon();
        });
    }
});


// ================= SIDEBAR =================
window.addEventListener('load', function(){
    // Crear el control sidebar y hacerlo accesible globalmente
    window.sidebar = L.control.sidebar({ container: "sidebar"}).addTo(map);

    // -------------------------------
    // PANEL HOME
    // -------------------------------
    sidebar.addPanel({
        id: "home",
        tab: '<i class="fas fa-home"></i>',
        title: 'BIENVENIDO / BIENVENUE',
        pane: `
            <h3>Sobre el GEOPORTAL:</h3>
            <p>Este es un GEOPORTAL borrador en el que puede encontrarse toda la información recopilada del sector agroalimentario y turístico del territorio de la AECT:</p>
            <ul>
                <li> Departement des Pyrénées Atlantiques (France) </li>
                <li> Departement des Hautes Pyrénées (France) </li> 
                <li> Provincia de Huesca (España) </li>
                <li> Comarca de las Cinco Villas (Provincia de Zaragoza-España)</li>
            </ul>

            <h3>À propos du GEOPORTAIL :</h3>
            <p>Ce GEOPORTAIL provisoire vous permet de trouver toutes les informations recueillies sur le secteur agroalimentaire et touristique du territoire du GECT.</p>
            <ul>
                <li> Departement des Pyrénées Atlantiques (France) </li>
                <li> Departement des Hautes Pyrénées (France) </li> 
                <li> Provincia de Huesca (España) </li>
                <li> Comarca de las Cinco Villas (Provincia de Zaragoza-España)</li>
            </ul>
            <div class = "div-acordeones"></div>
            <h3>Navegación / Navigation:</h3>
            <p>Utilice los enlaces siguientes para navegar por los diferentes paneles de información disponibles en el geoportal.</p>
            <p>Utilisez les liens suivants pour naviguer entre les différents panneaux d'information disponibles dans le géoportail.</p>
            <!-- Enlaces a los paneles -->
            <div class="home-links">
                <a href="#" class="home-link" data-panel="agro">
                    <i class="fas fa-seedling"></i>
                    <span>Sector agroalimentario / Secteur agroalimentaire</span>
                </a>
                <a href="#" class="home-link" data-panel="turismo">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>Turismo / Tourisme</span>
                </a>
                <a href="#" class="home-link" data-panel="turismonatural">
                    <i class="fas fa-leaf"></i>
                    <span>Turismo Natural / Tourisme Naturel</span>
                </a>
                <a href="#" class="home-link" data-panel="turismoaventura">
                    <i class="fas fa-hiking"></i>
                    <span>Turismo Activo / Tourisme Actif</span>
                </a>
                <a href="#" class="home-link" data-panel="distribucion-logistica">
                    <i class="fas fa-truck-moving"></i>
                    <span>Distribución y logística / Distribution et logistique</span>
                </a>
                <a href="#" class="home-link" data-panel="contacto">
                    <i class="fas fa-envelope"></i>
                    <span>Contacto / Contact</span>
                </a>
            </div>
        `
    });

    sidebar.addPanel({
        id:'agro',
        tab:'<i class="fas fa-seedling"></i>',
        title:'Agroalimentación',
        pane:`
            <h3>Sector Agroalimentario y Escuelas de Formación / Secteur Agroalimentaire et Écoles de Formation</h3>
            <p> <b>Español: </b> <p> En el marco del proyecto <a href= "https://for-alimenta.eu/">FOR-ALIMENTA </a> aquí se recoge la información disponible del territorio del sector agroalimentario y educativo relacionado. Puede activar o desactivar las diferentes capas mediante los checkboxes disponibles a continuación. </p>
            <p> <b>Français: </b> <p> Dans le cadre du projet <a href= "https://for-alimenta.eu/">FOR-ALIMENTA </a> ce panneau recueille les informations disponibles sur le territoire du secteur agroalimentaire et éducatif connexe. Vous pouvez activer ou désactiver les différentes couches à l'aide des cases à cocher ci-dessous.</p> </p>
            <div class = "div-acordeones"></div>
            <div class="accordion">
            <!-- Grupo 1 -->
                <div class="accordion-item">
                    <button class="accordion-header">
                        Sector Agroalimentario / Secteur agroalimentaire
                        <span class="arrow">▶</span>
                    </button>
                    <div class="accordion-content">
                        <div class="sidebar-checkboxes">
                            <h5> Productores y Productos Agroalimentarios / Producteurs et Produits Agroalimentaires </h5>
                                <label><input type="checkbox" id="cb-productores" checked> <img src="icons/productor.svg" width="20"> Productores y artesanos / Producteurs et artisans </label>
                                <label><input type="checkbox" id="cb-productos" checked> <img src="icons/frutas.svg" width="20"> Patrimonio Agroalimentario / Patrimoine agroalimentaire</label>
                            <h5> Comercios y mercados / Commerces et marchés </h5>
                                <label><input type="checkbox" id="cb-comercios" checked> <img src="icons/tienda.svg" width="20"> Tiendas y comercios / Boutiques et commerces </label>
                                <label><input type="checkbox" id="cb-mercados" checked> <img src="icons/market.svg" width="20"> Mercados / Marchés</label>
                            <h5> Restauración / Restauration </h5>
                                <label><input type="checkbox" id="cb-restaurantes" checked> <img src="icons/restaurante.svg" width="20"> Restaurantes / Restaurants</label>

                        </div>
                    </div>
                </div>
            </div>
            <div class = "div-acordeones"></div>
            <div class="accordion">
            <!-- Grupo 1 -->
                <div class="accordion-item">
                    <button class="accordion-header">
                        Escuelas de formación agroalimentarias / Écoles de formation agroalimentaires
                        <span class="arrow">▶</span>
                    </button>
                    <div class="accordion-content">
                        <div class="sidebar-checkboxes">
                            <label><input type="checkbox" id="cb-escuelas" checked> <img src="icons/escuelas_formacion.svg" width="20"> Escuelas / Écoles </label>
                            <label><input type="checkbox" id="cb-otros" checked> <img src="icons/otros_centros.svg" width="20"> Otros Centros / Autre Centres</label>
                        </div>
                    </div>
                </div>
            </div>
        `
    });

    sidebar.addPanel({
        id:'turismo',
        tab:'<i class="fas fa-map-marker-alt"></i>',
        title:"Turismo / Tourisme",
        pane:`
            <div class="accordion">
                <!-- Grupo 1 -->
                    <div class="accordion-item">
                        <button class="accordion-header">
                            Equipamientos turísticos/Équipements touristiques
                            <span class="arrow">▶</span>
                        </button>
                        <div class="accordion-content">
                            <div class="sidebar-checkboxes">
                                <label><input type="checkbox" id="cb-oficinas-turismo"> <img src="icons/turismo.svg" width="20"> Oficinas Turismo / Offices de tourisme</label>
                            </div>
                        </div>
                    </div>
            </div>
            <div class = "div-acordeones"></div>
            <div class="accordion">
                <!-- Grupo 1 -->
                    <div class="accordion-item">
                        <button class="accordion-header">
                            Patrimonio Cultural / Patrimoine culturel
                            <span class="arrow">▶</span>
                        </button>
                        <div class="accordion-content">
                            <div class="sidebar-checkboxes">
                                <label><input type="checkbox" id="cb-fortalezas"> <img src="icons/castillo.svg" width="20"> Fortalezas y castillos / Forteresses et châteaux</label>
                                <label><input type="checkbox" id="cb-monumentos"> <img src="icons/monumento.svg" width="20"> Monumentos / Monuments </label>
                                <label><input type="checkbox" id="cb-monumentos-religiosos"> <img src="icons/monumentos_religiosos.svg" width="20"> Monumentos religiosos / Monuments religieux</label>
                                <label><input type="checkbox" id="cb-restos-arqueologicos"> <img src="icons/restos_arqueologicos.svg" width="20"> Restos arqueológicos / Vestiges archéologiques</label>
                                <label><input type="checkbox" id="cb-museos" checked> <img src="icons/museo.svg" width="20"> Museos / Musées</label>
                            </div>
                        </div>
                    </div>
            </div>
            <div class = "div-acordeones"></div>
            <div class="accordion">
                <!-- Grupo 2 -->
                    <div class="accordion-item">
                        <button class="accordion-header">
                            Alojamientos/Hébergements
                            <span class="arrow">▶</span>
                        </button>
                        <div class="accordion-content">
                            <div class="sidebar-checkboxes">
                                <label><input type="checkbox" id="cb-hoteles"> <img src="icons/hotel.svg" width="20"> Hoteles / Hôtels</label>
                                <label><input type="checkbox" id="cb-campings"> <img src="icons/camping.svg" width="20"> Campings</label>
                                <label><input type="checkbox" id="cb-albergues"> <img src="icons/albergue.svg" width="20"> Albergues / Auberges</label>
                                <label><input type="checkbox" id="cb-refugios"> <img src="icons/refugio.svg" width="20"> Refugios / Refuges</label>
                            </div>
                        </div>
                    </div>
                
            </div>
            <div class = "div-acordeones"></div>
            <div class="accordion">
                <!-- Grupo 2 -->
                    <div class="accordion-item">
                        <button class="accordion-header">
                            Turismo del bienestar / Tourisme bien-être
                            <span class="arrow">▶</span>
                        </button>
                        <div class="accordion-content">
                            <div class="sidebar-checkboxes">
                                <label><input type="checkbox" id="cb-balnearios" checked> <img src="icons/spa.svg" width="20"> Balnearios</label>
                                <label><input type="checkbox" id="cb-piscinas"> <img src="icons/piscina.svg" width="20"> Piscinas / Piscines</label>
                            </div>
                        </div>
                    </div>
            </div>
        `
    });

    sidebar.addPanel({
        id:'turismonatural',
        tab:'<i class="fas fa-leaf"></i>',
        title:"Turismo natural / Tourisme naturel",
        pane:`
             
            <div class="accordion">
                <!-- Grupo 2 -->
                    <div class="accordion-item">
                        <button class="accordion-header">
                            Elementos naturales destacados / Éléments naturels remarquables
                            <span class="arrow">▶</span>
                        </button>
                        <div class="accordion-content">
                            <div class="sidebar-checkboxes">
                                <label><input type="checkbox" id="cb-miradores" checked> <img src="icons/mirador.svg" width="20"> Miradores / Belvédères</label>
                                <label><input type="checkbox" id="cb-glaciares" checked> <img src="icons/glaciar.svg" width="20"> Glaciares / Glaciers</label>
                            </div>
                        </div>
                    </div>
            </div>
            <div class = "div-acordeones"></div>
            <div class="accordion">
                <!-- Grupo 2 -->
                    <div class="accordion-item">
                        <button class="accordion-header">
                            Arboles y arboledas / Arbres et bosquets
                            <span class="arrow">▶</span>
                        </button>
                        <div class="accordion-content">
                            <div class="sidebar-checkboxes">
                                <label><input type="checkbox" id="cb-arboles" checked> <img src="icons/arbol.svg" width="20"> Árboles emblemáticos / Arbres emblématiques</label>
                                <label><input type="checkbox" id="cb-arboledas" checked> <img src="icons/bosque.svg" width="20"> Arboledas / Bosquets</label>
                                <label><input type= "checkbox" id= "cb-rutas-arboles" checked> <img src="icons/camino_bosque.svg" width="20"> Rutas de árboles / Itinéraires des arbres</label>
                            </div>
                        </div>
                    </div>
            </div>
            <div class = "div-acordeones"></div>
            <div class="accordion">
                <!-- Grupo 2 -->
                    <div class="accordion-item">
                        <button class="accordion-header">
                            Otros / Autres
                            <span class="arrow">▶</span>
                        </button>
                        <div class="accordion-content">
                            <div class="sidebar-checkboxes">
                                <label><input type="checkbox" id="cb-zonasbano" checked> <img src="icons/zona_bano.svg" width="20"> Zonas de Baño / Zones de baignade</label>
                            </div>
                        </div>
                    </div>
            </div>
        `
    });


    
    sidebar.addPanel({
        id: 'turismoaventura',
        tab: '<i class="fas fa-hiking"></i>',
        title: "Turismo activo/ Tourisme actif",
        pane: `
            <div class="accordion">
                <!-- Deportes invernales -->
                <div class="accordion-item">
                    <button class="accordion-header">
                        Deportes invernales / Sports d'hiver
                        <span class="arrow">▶</span>
                    </button>
                    <div class="accordion-content">
                        <div class="sidebar-checkboxes">
                            <label><input type="checkbox" id="cb-ski" checked> <img src="icons/ski.svg" width="20"> Estaciones de esquí / Stations de ski</label>
                            <label><input type="checkbox" id="cb-empresas-nieve" checked> <img src="icons/empresas_nieve.svg" width="20"> Empresas de turismo de invierno / Entreprises de tourisme d'hiver</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="div-acordeones"></div>
            <!-- Escalada y Vías ferratas -->
            <div class="accordion">
                <div class="accordion-item">
                    <button class="accordion-header">
                        Escalada y Vías ferratas / Escalade et via ferrata
                        <span class="arrow">▶</span>
                    </button>
                    <div class="accordion-content">
                        <div class="sidebar-checkboxes">
                            <h5> Puntos de escalada y vías ferratas / Points d'escalade et via ferrata </h5>
                            <label><input type="checkbox" id="cb-puntos-escalada" checked> <img src="icons/escalada.svg" width="20"> Puntos de escalada / Points d'escalade</label>
                            <label><input type="checkbox" id="cb-vias-ferratas" checked> <img src="icons/via_ferrata.svg" width="20"> Vías ferratas / Via ferrata</label>
                            <h5> Empresas de escalada y vías ferratas / Entreprises d'escalade et via ferrata </h5>
                            <label><input type="checkbox" id="cb-empresas-escalada" checked> <img src="icons/empresas_escalada.svg" width="20"> Empresas de escalada / Entreprises d'escalade</label>
                            <label><input type="checkbox" id="cb-empresas-via-ferrata" checked> <img src="icons/empresas_via_ferrata.svg" width="20"> Empresas de Vías Ferratas / Entreprises de Via Ferrata</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="div-acordeones"></div>
            <div class="accordion">
                <div class="accordion-item">
                    <button class="accordion-header">
                        Canyoning / Canyoning
                        <span class="arrow">▶</span>
                    </button>
                    <div class="accordion-content">
                        <div class="sidebar-checkboxes">
                            <label><input type="checkbox" id="cb-puntos-canyoning" checked> <img src="icons/canyoning.svg" width="20"> Puntos de Canyoning / Points de Canyoning</label>
                            <label><input type="checkbox" id="cb-empresas-canyoning" checked> <img src="icons/empresas_canyoning.svg" width="20"> Empresas de Canyoning / Entreprises de Canyoning</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class="div-acordeones"></div>
            <div class="accordion">
                <div class="accordion-item">
                    <button class="accordion-header">
                        Itinerarios / Itinéraires (Point)
                        <span class="arrow">▶</span>
                    </button>
                    <div class="accordion-content">
                        <div class="sidebar-checkboxes">
                            <label><input type="checkbox" id="cb-itinerarios-btt" checked> <img src="icons/btt.svg" width="20"> Itinerarios BTT / Itinéraires VTT</label>
                            <label><input type="checkbox" id = "cb-itinerarios-adaptados" checked> <img src="icons/itinerarios_adaptados.svg" width="20"> Itinerarios adaptados / Itinéraires adaptés</label>
                            <label><input type="checkbox" id = "cb-itinerarios-pedestres" checked> <img src="icons/itinerarios_pedestres.svg" width="20"> Itinerarios pedestres / Itinéraires pédestres</label>
                            <label><input type="checkbox" id = "cb-itinerarios-equestres" checked> <img src="icons/itinerarios_equestres.svg" width="20"> Itinerarios equestres / Itinéraires équestres</label>
                            <label><input type="checkbox" id = "cb-itinerarios-trailrunning" checked> <img src="icons/itinerarios_trailrunning.svg" width="20"> Itinerarios trailrunning / Itinéraires trailrunning</label>
                        </div>
                    </div>
                </div>
            </div>

            <div class="div-acordeones"></div>
            <div class="accordion">
                <div class="accordion-item">
                    <button class="accordion-header">
                        Itinerarios / Itinéraires (Tracks)
                        <span class="arrow">▶</span>
                    </button>
                    <div class="accordion-content">
                        <div class="sidebar-checkboxes">
                            <label><input type="checkbox" id = "cb-itinerarios-pedestres-tracks" checked> <img src="icons/itinerarios_pedestres.svg" width="20"> Tracks de Itinerarios pedestres / Traces d'Itinéraires pédestres</label>
                        </div>
                    </div>
                </div>
            </div>
        `
    });

    sidebar.addPanel({
        id: 'distribucion-logistica',
        tab: '<i class="fas fa-truck-moving"></i>', // Icono moderno de camión de reparto
        title: 'Distribución / Distribution',
        pane: `
            <div class = "div-acordeones"></div>
            <h4>Red de distribución de productos agroalimentarios del Pirineo Central y sus Somontanos / Réseau de distribution des produits agroalimentaires des Pyrénées centrales et leurs Piémonts </h4>
            <p> <b>Español</b>: <p>Este conjunto de capas muestra una ruta de posible distribución de productos agroalimentarios locales a través de diferentes localidades claves. Estas localidades han sido escogidas debido a su importancia territorial, su ubicación estratégica y/o la densidad de productores censados cercanos</p></p>
            <p> <b>Français</b>: <p>Ce groupe de couches montre un itinéraire de distribution possible des produits agroalimentaires locaux à travers différentes localités clés. Ces localités ont été choisies en raison de leur importance territoriale, de leur emplacement stratégique et/ou de la densité des producteurs recensés à proximité.</p></p>
            <div class="panel-contenido">
                <!-- Botones fuera del grupo -->
                <div class="botones-control-capas">
                    <button id="activar-todas-capas" class="btn-activar-todo">Activar Mapa / Activer la carte</button>
                    <button id="desactivar-todas-capas" class="btn-desactivar-todo">Desactivar Mapa / Désactiver la carte</button>
                </div>

                <!-- Grupo de capas -->
                <div class="accordion">
                    <div class="accordion-item">
                        <button class="accordion-header">
                            Capas de distribución y logística / Couches de distribution et logistique
                            <span class="arrow">▶</span>
                        </button>
                        <div class="accordion-content">
                            <ul id="lista-capas-existentes" class="lista-capas">
                                <!-- Aquí se añadirán dinámicamente las capas -->
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        `
    });


    sidebar.addPanel({
        id: 'contacto',
        tab: '<i class="fas fa-envelope"></i>',
        title: 'Contacto',
        pane: `
            <div style="text-align: center;">
            <h3>Contacto / Contact</h3>
            <p>Si observa algún error en la información presente en este GEOPORTAL o posee información que crea de importancia, por favor, póngase en contacto con nosotros a través del siguiente correo electrónico:</p>
            <p>Si vous remarquez une erreur dans les informations présentes sur ce GEOPORTAL ou si vous disposez d'informations que vous jugez importantes, veuillez nous contacter à l'adresse électronique suivante :</p>
            <h3>Email:</h3>
            <h2><b>contact@pirineos-pyrenees.eu</b></h2>
            </div>

        `
    });

    document.addEventListener("click", function (e) {
    const link = e.target.closest(".home-link");
    if (link) {
        e.preventDefault();
        const panelId = link.dataset.panel;
        if (window.sidebar && panelId) {
            window.sidebar.open(panelId);
        }
    }
    });
    
    
    document.querySelectorAll('.accordion-header').forEach(header=>{
        header.addEventListener('click', ()=>{
            const item = header.parentElement;
            const content = header.nextElementSibling;
            const arrow = header.querySelector('.arrow');

            // Si quieres que solo se abra uno a la vez:
            document.querySelectorAll('.accordion-item').forEach(i=>{
                if(i !== item){
                    i.querySelector('.accordion-content').style.maxHeight = null;
                    i.querySelector('.accordion-content').classList.remove('open');
                    i.querySelector('.arrow').textContent = '▶';
                }
            });

            // Alternar el panel actual
            if(content.classList.contains('open')){
                content.style.maxHeight = null;
                content.classList.remove('open');
                arrow.textContent = '▶';
            } else {
                content.style.maxHeight = content.scrollHeight + 'px';
                content.classList.add('open');
                arrow.textContent = '▼';
            }
        });
    });

    sidebar.open('home');

    // ================= SINCRONIZAR CHECKBOXES =================
    function sincronizarCheckboxes(){
        document.getElementById('cb-mercados').checked = map.hasLayer(mercadosCluster);
        document.getElementById('cb-escuelas').checked = map.hasLayer(centrosCluster);
        document.getElementById('cb-otros').checked = map.hasLayer(otrosCentrosCluster);
        document.getElementById('cb-productos').checked = map.hasLayer(productosAgroCluster);
        document.getElementById('cb-oficinas-turismo').checked = map.hasLayer(turismoCluster);
        document.getElementById('cb-restaurantes').checked = map.hasLayer(restaurantesCluster); 
        document.getElementById('cb-hoteles').checked = map.hasLayer(hotelesCluster);
        document.getElementById('cb-campings').checked = map.hasLayer(campingsCluster);
        document.getElementById('cb-albergues').checked = map.hasLayer(alberguesCluster);
        document.getElementById('cb-refugios').checked = map.hasLayer(refugiosCluster);
        document.getElementById('cb-fortalezas').checked = map.hasLayer(fortalezasCluster);
        document.getElementById('cb-monumentos').checked = map.hasLayer(monumentosCluster);
        document.getElementById('cb-monumentos-religiosos').checked = map.hasLayer(monumentosReligiososCluster);
        document.getElementById('cb-restos-arqueologicos').checked = map.hasLayer(restosArqueologicosCluster);
        document.getElementById('cb-balnearios').checked = map.hasLayer(balneariosCluster);
        document.getElementById('cb-museos').checked = map.hasLayer(museosCluster);
        document.getElementById('cb-arboles').checked = map.hasLayer(arbolesCluster);
        document.getElementById('cb-miradores').checked = map.hasLayer(miradoresCluster);
        document.getElementById('cb-glaciares').checked = map.hasLayer(glaciaresClusters);
        document.getElementById('cb-zonasbano').checked = map.hasLayer(zonasBanosClusters);
        document.getElementById('cb-piscinas').checked = map.hasLayer(piscinasClusters);
        document.getElementById('cb-productores').checked = map.hasLayer(productoresClusters);
        document.getElementById('cb-comercios').checked = map.hasLayer(comerciosClusters);
        document.getElementById('cb-ski').checked = map.hasLayer(skiClusters);
        document.getElementById('cb-empresas-nieve').checked = map.hasLayer(empresasNieveClusters);
        document.getElementById('cb-puntos-escalada').checked = map.hasLayer(puntosEscaladaClusters);
        document.getElementById('cb-empresas-escalada').checked = map.hasLayer(empresasEscaladaClusters);
        document.getElementById('cb-vias-ferratas').checked = map.hasLayer(viaFerrataClusters);
        document.getElementById('cb-empresas-via-ferrata').checked = map.hasLayer(empresasViaFerrataClusters);
        document.getElementById('cb-puntos-canyoning').checked = map.hasLayer(canyoningClusters);
        document.getElementById('cb-empresas-canyoning').checked = map.hasLayer(empresasCanyoningClusters);
        document.getElementById('cb-itinerarios-btt').checked = vttLayer && map.hasLayer(vttLayer);
        document.getElementById('cb-itinerarios-adaptados').checked = vttLayer && map.hasLayer(itinerariosAdaptadosClusters);
        document.getElementById('cb-itinerarios-pedestres').checked = vttLayer && map.hasLayer(itinerariosPedestresClusters);
        document.getElementById('cb-itinerarios-equestres').checked = vttLayer && map.hasLayer(itinerariosEquestresClusters);
        document.getElementById('cb-itinerarios-trailrunning').checked = vttLayer && map.hasLayer(itinerariosTrailrunningClusters);
        document.getElementById('cb-itinerarios-pedestres-tracks').checked = vttLayer && map.hasLayer(itinerariosPedestresTracksMarkers);
        document.getElementById('cb-arboledas').checked = map.hasLayer(bosquesClusters);
        document.getElementById('cb-rutas-arboles').checked = map.hasLayer(rutasArboledasLayer);
    }

    sincronizarCheckboxes();
    
    // ================= EVENTOS CHECKBOXES =================
    const capasMap = {
    'mercados': mercadosCluster,
    'escuelas': centrosCluster,
    'otros': otrosCentrosCluster,
    'productos': productosAgroCluster,
    'oficinas-turismo': turismoCluster,
    'restaurantes': restaurantesCluster,
    'hoteles': hotelesCluster,
    'campings': campingsCluster,
    'albergues': alberguesCluster,
    'refugios': refugiosCluster,
    'fortalezas': fortalezasCluster,
    'monumentos': monumentosCluster,
    'monumentos-religiosos': monumentosReligiososCluster,
    'restos-arqueologicos': restosArqueologicosCluster,
    'museos': museosCluster,
    'balnearios': balneariosCluster,
    'arboles': arbolesCluster,
    'miradores': miradoresCluster,
    'glaciares': glaciaresClusters,
    'zonasbano': zonasBanosClusters,
    'piscinas': piscinasClusters,
    'productores': productoresClusters,
    'comercios': comerciosClusters,
    'ski': skiClusters,
    'empresas-nieve': empresasNieveClusters,
    'productores-proximidad': productoresProximidadClusters,
    'puntos-escalada': puntosEscaladaClusters,
    'empresas-escalada': empresasEscaladaClusters,
    'vias-ferratas': viaFerrataClusters,
    'empresas-via-ferrata': empresasViaFerrataClusters,
    'puntos-canyoning': canyoningClusters,
    'empresas-canyoning': empresasCanyoningClusters,
    'itinerarios-btt': vttLayer,
    'itinerarios-adaptados': itinerariosAdaptadosClusters,
    'itinerarios-pedestres': itinerariosPedestresClusters,
    'itinerarios-equestres': itinerariosEquestresClusters,
    'itinerarios-trailrunning': itinerariosTrailrunningClusters,
    'itinerarios-pedestres-tracks': itinerariosPedestresTracksMarkers,
    'arboledas': bosquesClusters,
    'rutas-arboles': rutasArboledasLayer
    };

    // ================= EVENTOS CHECKBOXES =================
    // ... (tu objeto capasMap y la lista de capas permanecen igual) ...

    const fuentesMostradas = {};
    const mensajesAviso = {
        'mercados': 
            {fuente: 'Tourisme 64 - Info Web' },
        'piscinas': {
            es: "La capa de piscinas posee también información sobre centros polideportivos, en algunos casos puede que estos centros no dispongan de las instalaciones correspondientes", 
            fr: "La couche « piscines » contient également des informations sur les centres sportifs polyvalents. Dans certains cas, ces centres peuvent ne pas disposer des installations correspondantes.",
            fuente: "IGN España - Francia"},

        'arboles': { 
            es: "Información correspondiente únicamente a la provincia de Huesca y comarca de las Cinco Villas", 
            fr: "Informations concernant uniquement la province de Huesca et la région des Cinco Villas.", 
            fuente: 'IGN España'},

        'albergues': { es: "Información del departamento Pyrénées-Atlantiques, Provincia de Huesca y Comarca de las Cinco Villas", 
            fr: "Informations concernant uniquement le Béarn (Pyrénées Atlantiques), Huesca et la région des Cinco Villas.", 
            fuente: 'IGN España y Tourisme 64' },

        'hoteles': { 
            es: "Información correspondiente únicamente al departamento Pyrénées-Atlantiques", 
            fr: "Informations concernant uniquement le département des Pyrénées-Atlantiques", 
            fuente: 'Tourisme 64'},

        'productores': 
            { es: "Información del departamento Pyrénées-Atlantiques, Provincia de Huesca y Comarca de las Cinco Villas", 
            fr: "Informations du département des Pyrénées-Atlantiques, de la province de Huesca et de la région des Cinco Villas.", 
            fuente: "Tourisme 64 / Pon Aragón en tu mesa" },

        'comercios': 
            { es: "Información del departamento Pyrénées-Atlantiques, Provincia de Huesca y Comarca de las Cinco Villas", 
            fr: "Informations du département des Pyrénées-Atlantiques, de la province de Huesca et de la région des Cinco Villas.", 
            fuente: "Tourisme 64 / Pon Aragón en tu mesa" },

        'zonasbano': 
        { es: "Información correspondiente únicamente a la provincia de Huesca y comarca de las Cinco Villas", 
            fr: "Informations concernant uniquement la province de Huesca et la région des Cinco Villas.", 
            fuente: 'Confederación Hidrográfica del Ebro'},

        'fortalezas': { 
            es: "Información correspondiente únicamente a la provincia de Huesca y comarca de las Cinco Villas", 
            fr: "Informations concernant uniquement la province de Huesca et la région des Cinco Villas.", 
            fuente: 'IGN España'},

        'productos': 
            { es: "Información correspondiente únicamente a la provincia de Huesca y comarca de las Cinco Villas", 
            fr: "Informations concernant uniquement la province de Huesca et la région des Cinco Villas.", 
                fuente: "Patrimonio Agroalimentario - CIGA"},

        'escuelas': 
            {fuente: "Sitios Web Escuelas / Sites Web Écoles"},

        'otros': 
            {fuente: "Sitios Web Otros centros / Sites Web Autres Centres"},

        'restos-arqueologicos': 
            { fuente: "IGN España-France"},

        'campings': 
            {fuente: "IGN España-France / Tourisme 64"},

        'monumentos': 
            {fuente: "IGN España-France"},

        'monumentos-religiosos': 
            {fuente: "IGN España-France"},

        'museos': 
            {fuente: "IGN España-France"},

        'miradores': 
            {fuente: "IGN España-France"},

        'glaciares': 
            {fuente: "IGN España - France"},

        'balnearios': 
            {es: "Información correspondiente únicamente a la provincia de Huesca y comarca de las Cinco Villas", 
            fr: "Informations concernant uniquement la province de Huesca et la région des Cinco Villas.", 
            fuente: 'IGN España'},

        'refugios': 
            {fuente: "IGN España - France"},

        'camping': 
            {fuente: "IGN España - France / Tourisme 64"},

        'restaurantes': 
            {fuente: "65 - SIREN / 64 - Tourisme 64 / Huesca - AragonOpenData"},
        // Agrega aquí los identificadores y mensajes para cualquier otra capa

        'oficinas-turismo':
            {fuente: "IGN España - France"},

        'ski':
            {es: "Información correspondiente a Pirineos Atlánticos y provincia de Huesca", 
            fr: "Informations concernant les Pyrénées-Atlantiques et la province de Huesca.", 
            fuente: 'Tourisme 64 / Observatorio de Montaña (OMS)' },

        'empresas-nieve':
            {es: "Información correspondiente a Pirineos Atlánticos",
            fr: "Informations concernant les Pyrénées-Atlantiques et la province de Huesca.",
            fuente: 'Tourisme 64' },
        
        'puntos-escalada':
            {fuente: 'IGN France / Observatorio de Montaña (OMS)'},

        'empresas-escalada':
            {es: "Información correspondiente a Pirineos Atlánticos",
            fr: "Informations concernant les Pyrénées-Atlantiques.",
            fuente: 'Tourisme 64' },
        'vias-ferratas':
            {fuente: 'IGN France / Observatorio de Montaña (OMS) / Open Street Map (OSM)'},

        'empresas-via-ferrata':
            {es: "Información correspondiente a Pirineos Atlánticos",
            fr: "Informations concernant les Pyrénées-Atlantiques.",
            fuente: 'Tourisme 64' },

        'puntos-canyoning':
            {fuente: 'IGN France / Observatorio de Montaña (OMS) / Open Street Map (OSM)'},

        'empresas-canyoning':
            {es: "Información correspondiente a Pirineos Atlánticos",
            fr: "Informations concernant les Pyrénées-Atlantiques.",
            fuente: 'Tourisme 64' },
        'itinerarios-adaptados':
            {es: "Información correspondiente a Pirineos Atlánticos",
            fr: "Informations concernant les Pyrénées-Atlantiques.",
            fuente: 'Tourisme 64' },
        'itinerarios-pedestres':
            {es: "Información correspondiente a Pirineos Atlánticos",
            fr: "Informations concernant les Pyrénées-Atlantiques.",
            fuente: 'Tourisme 64' },
        'itinerarios-equestres':
            {es: "Información correspondiente a Pirineos Atlánticos",
            fr: "Informations concernant les Pyrénées-Atlantiques.",
            fuente: 'Tourisme 64' },
        'itinerarios-trailrunning':
            {es: "Información correspondiente a Pirineos Atlánticos",
            fr: "Informations concernant les Pyrénées-Atlantiques.",
            fuente: 'Tourisme 64' },
        'itinerarios-pedestres-tracks':
            {es: "Información correspondiente a Pirineos Atlánticos y provincia de Huesca",
            fr: "Informations concernant les Pyrénées-Atlantiques et la province de Huesca.",
            fuente: 'Tourisme 64, Observatorio de Montaña (OMS)' },
        'arboledas':
            { 
            es: "Información correspondiente únicamente a la provincia de Huesca y comarca de las Cinco Villas", 
            fr: "Informations concernant uniquement la province de Huesca et la région des Cinco Villas.", 
            fuente: 'IGN España' },
        'rutas-arboles':
            { 
            es: "Información correspondiente únicamente a la provincia de Huesca y comarca de las Cinco Villas", 
            fr: "Informations concernant uniquement la province de Huesca et la région des Cinco Villas.", 
            fuente: 'IGN España' }
    };

    ['mercados','escuelas','otros','productos','oficinas-turismo','restaurantes','hoteles', 'campings', 'albergues', 'refugios', 'fortalezas','monumentos','monumentos-religiosos','restos-arqueologicos', 'balnearios', 'museos', 'arboles', 'miradores', 'glaciares', 'zonasbano', 'piscinas', 'productores', 'comercios', 'ski', 'empresas-nieve', 'productores-proximidad', 'puntos-escalada', 'empresas-escalada', 'vias-ferratas', 'empresas-via-ferrata', 'puntos-canyoning', 'empresas-canyoning', 'itinerarios-adaptados', 'itinerarios-pedestres', 'itinerarios-equestres', 'itinerarios-trailrunning', 'itinerarios-pedestres-tracks', 'arboledas', 'rutas-arboles'].forEach(tipo => {
    const checkbox = document.getElementById('cb-' + tipo);
    if (checkbox) {
        checkbox.addEventListener('change', e => {
            if (e.target.checked) {
                map.addLayer(capasMap[tipo]);
                if (mensajesAviso[tipo]) {
                    mostrarAvisoModerno(mensajesAviso[tipo]);
                }
            } else {
                map.removeLayer(capasMap[tipo]);
            }
            actualizarFiltrosAcordeon();
            actualizarLeyenda()
        });
    }
    const checkbox_btt = document.getElementById('cb-itinerarios-btt');
    if (checkbox_btt) {
        checkbox_btt.addEventListener('change', e => {
            if (e.target.checked) {
                map.addLayer(vttLayer);
            } else {
                map.removeLayer(vttLayer);
            }
            actualizarFiltrosAcordeon();
            actualizarLeyenda();
        });
    }
});

}); // Fin de window.addEventListener('load')

// ================= ESCALA =================
L.control.scale({ position:'bottomleft', metric:true, imperial:false, maxWidth:120 }).addTo(map);

// ================= LEYENDA =================
const leyenda = L.control({position:'bottomright'});
leyenda.onAdd = map=>{
    const div = L.DomUtil.create('div','leyenda');
    div.innerHTML = `<h3>Leyenda / Légende</h3>`;
    return div;
};
leyenda.addTo(map);

const etiquetasProductos = {
    "Bulbos, rizomas y similares": "Bulbos, rizomas y similares / Bulbes, rhizomes et similaires",
    "Cereales": "Maiz y Cereal / Maïs et céréales",
    "Frutas y hortalizas de fruto": "Frutas y hortalizas de fruto / Fruits et legumes-fruits",
    "Hortalizas de hoja y tallo": "Hortalizas de hoja y tallo / Légumes-feuilles-tiges",
    "Legumbres": "Legumbres / Légumes",
    "Raices y tubérculos": "Raices y tubérculos / Racines et tubercules"
};

function actualizarLeyenda(){
    const div = document.querySelector('.leyenda');
    if(!div) return;
    let html = `<h3>LEYENDA / LÉGENDE</h3>`;

    if(map.hasLayer(mercadosCluster)) html+=`<img src="icons/market.svg" width="18"> Mercados de la AECT/Marchés du GECT<br>`;
    if(map.hasLayer(centrosCluster)) html+=`<img src="icons/escuelas_formacion.svg" width="18"> Escuelas de formación/Écoles de formation<br>`;
    if(map.hasLayer(otrosCentrosCluster)) html+=`<img src="icons/otros_centros.svg" width="18"> Otros Centros de interés/Autres centres d'intérêt<br>`;
    if(map.hasLayer(productosAgroCluster)){
        html+=`<strong>Productos Agroalimentarios/Produits agroalimentaires:</strong><br>`;
        for(let tipo in iconsProductosAgro){
            html+=`<img src="${iconsProductosAgro[tipo].options.iconUrl}" width="18"> ${etiquetasProductos[tipo] || tipo}<br>`;
        }
    }
    if(map.hasLayer(limitesLayer)) html+=`<span style="display:inline-block;width:18px;height:3px;background:#333;margin-right:5px;"></span> Territorio AECT / Territoire du GECT<br>`;
    if(map.hasLayer(turismoCluster)) html+=`<img src="icons/turismo.svg" width="18"> Oficinas de Turismo / Bureaux de Tourisme<br>`;
    if(map.hasLayer(restaurantesCluster)) html+=`<img src="icons/restaurante.svg" width="18"> Restaurantes / Restaurants<br>`;
    if(map.hasLayer(hotelesCluster)) html+=`<img src="icons/hotel.svg" width="18"> Hoteles / Hôtels <br>`;
    if(map.hasLayer(campingsCluster)) html+=`<img src="icons/camping.svg" width="18"> Campings<br>`;
    if(map.hasLayer(alberguesCluster)) html+=`<img src="icons/albergue.svg" width="18"> Albergues / Auberge <br>`;
    if(map.hasLayer(refugiosCluster)) html+=`<img src="icons/refugio.svg" width="18"> Refugios / Refuges <br>`;
    if(map.hasLayer(fortalezasCluster)) html+=`<img src="icons/castillo.svg" width="18"> Fortalezas y Castillos / Forteresses et châteaux<br>`;
    if(map.hasLayer(monumentosCluster)) html+=`<img src="icons/monumento.svg" width="18"> Monumentos<br>`;
    if(map.hasLayer(monumentosReligiososCluster)) html+=`<img src="icons/monumentos_religiosos.svg" width="18"> Monumentos religiosos / Monuments religieux<br>`;
    if(map.hasLayer(restosArqueologicosCluster)) html+=`<img src="icons/restos_arqueologicos.svg" width="18"> Restos arqueológicos / Vestiges archéologiques<br>`;
    if(map.hasLayer(balneariosCluster)) html += `<img src="icons/spa.svg" width="18"> Balnearios<br>`;
    if(map.hasLayer(museosCluster)) html += `<img src="icons/museo.svg" width="18"> Museos / Musees<br>`;
    if(map.hasLayer(arbolesCluster)) html += `<img src="icons/arbol.svg" width="18"> Arboles Emblemáticos / Arbres emblématiques<br>`;
    if(map.hasLayer(miradoresCluster)) html += `<img src="icons/mirador.svg" width="18"> Miradores / Belvédères<br>`;
    if(map.hasLayer(glaciaresClusters)) html += `<img src="icons/glaciar.svg" width="18"> Glaciares / Glaciers<br>`;
    if(map.hasLayer(zonasBanosClusters)) html += `<img src="icons/zona_bano.svg" width="18"> Zonas de Baño / Zones de baignade<br>`;
    if(map.hasLayer(piscinasClusters)) html += `<img src="icons/piscina.svg" width="18"> Piscinas / Piscines <br>`;
    if(map.hasLayer(productoresClusters)) html += `<img src="icons/productor.svg" width="18"> Productores y artesanos / Producteurs et aritsans <br>`;
    if(map.hasLayer(comerciosClusters)) html += `<img src="icons/tienda.svg" width="18"> Tiendas y comercios / Boutiques et commerces <br>`;
    if(map.hasLayer(skiClusters)) html += `<img src="icons/ski.svg" width="18"> Estaciones de esquí / Stations de ski <br>`;
    if(map.hasLayer(empresasNieveClusters)) html += `<img src="icons/empresas_nieve.svg" width="18"> Empresas de turismo de invierno / Entreprises de tourisme d'hiver <br>`;
    if(map.hasLayer(productoresProximidadClusters)) html += `<img src="icons/productor.svg" width="18"> Productores de proximidad / Producteurs de proximité <br>`;
    if(map.hasLayer(nucleosClaveClusters)) html += `<img src="icons/marker.svg" width="18"> Núcleos Clave / Noyaux Clés <br>`;
    if(map.hasLayer(puntosEscaladaClusters)) html += `<img src="icons/escalada.svg" width="18"> Puntos de escalada / Points d'escalade <br>`;
    if(map.hasLayer(empresasEscaladaClusters)) html += `<img src="icons/empresas_escalada.svg" width="18"> Empresas de escalada / Entreprises d'escalade <br>`;
    if(map.hasLayer(viaFerrataClusters)) html += `<img src="icons/via_ferrata.svg" width="18"> Vías ferratas / Via ferrata <br>`;
    if(map.hasLayer(empresasViaFerrataClusters)) html += `<img src="icons/empresas_via_ferrata.svg" width="18"> Empresas de Vías Ferratas / Entreprises de Via Ferrata <br>`;
    if(map.hasLayer(canyoningClusters)) html += `<img src="icons/canyoning.svg" width="18"> Puntos de Canyoning / Points de Canyoning <br>`;
    if(map.hasLayer(empresasCanyoningClusters)) html += `<img src="icons/empresas_canyoning.svg" width="18"> Empresas de Canyoning / Entreprises de Canyoning <br>`;
    if(map.hasLayer(itinerariosAdaptadosClusters)) html += `<img src="icons/itinerarios_adaptados.svg" width="18"> Itinerarios adaptados / Itinéraires adaptés <br>`;
    if(map.hasLayer(itinerariosPedestresClusters)) html += `<img src="icons/itinerarios_pedestres.svg" width="18"> Itinerarios pedestres / Itinéraires pédestres <br>`;
    if(map.hasLayer(itinerariosEquestresClusters)) html += `<img src="icons/itinerarios_equestres.svg" width="18"> Itinerarios equestres / Itinéraires équestres <br>`;
    if(map.hasLayer(itinerariosTrailrunningClusters)) html += `<img src="icons/itinerarios_trailrunning.svg" width="18"> Itinerarios trailrunning / Itinéraires trailrunning <br>`;
    if(map.hasLayer(bosquesClusters)) html += `<img src="icons/bosque.svg" width="18"> Arboledas / Bosquets <br>`;
    if (map.hasLayer(carreterasLayer)) {
        html += `
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <div style="width: 30px; height: 6px; background: #737373; border-radius: 3px; margin-right: 5px; position: relative;">
                    <div style="width: 30px; height: 3px; background: #ffe14cff; position: absolute; top: 1.5px; left: 0;"></div>
                </div>
                Rutas de distribución / Routes de distribution
            </div>
        `;
    }
    
    if (map.hasLayer(buffersInfluenciaLayer)) {
        html += `
            <strong>Áreas de influencia / Zones d'influence: </strong><br>
            <span style="display:inline-block;width:18px;height:18px;background:#dfa6b4;margin-right:5px;"></span> 10 km<br>
            <span style="display:inline-block;width:18px;height:18px;background:#b9d564;margin-right:5px;"></span> 30 km<br>
            <span style="display:inline-block;width:18px;height:18px;background:#b2f7f1;margin-right:5px;"></span> 50 km<br>
        `;
    }

        if (map.hasLayer(rutasArboledasLayer)) {
        html += `
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <div style="width: 30px; height: 4px; background: #228B22; margin-right: 5px;"></div>
                Rutas de árboles / Itinéraires des arbres
            </div>
        `;
    }

    if (map.hasLayer(vttLayer)) {
        html += `<p style="text-align: center"><strong>Itinerarios BTT / Itinéraires VTT:</strong><br>`;
        html += `
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <div style="width: 30px; height: 4px; background: green; margin-right: 5px;"></div>
                Fácil / Facile
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <div style="width: 30px; height: 4px; background: blue; margin-right: 5px;"></div>
                Intermedio / Intermédiaire
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <div style="width: 30px; height: 4px; background: red; margin-right: 5px;"></div>
                Difícil / Difficile
            </div>
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <div style="width: 30px; height: 4px; background: black; margin-right: 5px;"></div>
                Muy difícil / Très difficile
            </div>
        `;
    }

    if (map.hasLayer(itinerariosPedestresTracksMarkers)) {
    html += `<p style="text-align: center"><strong>Itinerarios Pedestres (Tracks) / Itinéraires Pédestres (Traces):</strong></p>`;
    html += `
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
            <div style="width: 30px; height: 4px; background: green; margin-right: 5px;"></div>
            Muy fácil / Très facile
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
            <div style="width: 30px; height: 4px; background: blue; margin-right: 5px;"></div>
            Fácil / Facile
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
            <div style="width: 30px; height: 4px; background: orange; margin-right: 5px;"></div>
            Media / Moyenne
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
            <div style="width: 30px; height: 4px; background: red; margin-right: 5px;"></div>
            Difícil / Difficile
        </div>
        <div style="display: flex; align-items: center; margin-bottom: 5px;">
            <div style="width: 30px; height: 4px; background: black; margin-right: 5px;"></div>
            Muy difícil / Très difficile
        </div>
    `;
}
    div.innerHTML = html;
}

map.on('overlayadd overlayremove', actualizarLeyenda);


// ================= BOTÓN RESTAURAR MAPA =================
// Añade el botón al control de filtros (puedes ajustar el lugar si lo prefieres)
document.addEventListener('DOMContentLoaded', () => {
    const filtros = document.querySelector('.filtros-mapa-control');
    if (filtros) {
        const btn = document.createElement('button');
        btn.id = 'btn-restaurar-mapa';
        btn.textContent = 'Reiniciar / Réinitialiser';
        btn.style.margin = '10px 0';
        filtros.prepend(btn);

        btn.addEventListener('click', () => {
            // Quitar todas las capas excepto limitesLayer
            Object.values({
                mercadosCluster, centrosCluster, otrosCentrosCluster, productosAgroCluster,
                turismoCluster, restaurantesCluster, hotelesCluster, campingsCluster,
                alberguesCluster, refugiosCluster, fortalezasCluster, monumentosCluster,
                monumentosReligiososCluster, restosArqueologicosCluster, balneariosCluster,
                museosCluster, arbolesCluster, miradoresCluster, glaciaresClusters,
                zonasBanosClusters, piscinasClusters, productoresClusters, comerciosClusters, skiClusters,
                empresasNieveClusters, productoresProximidadClusters, carreterasLayer, nucleosClaveClusters, 
                buffersInfluenciaLayer, puntosEscaladaClusters, empresasEscaladaClusters,  viaFerrataClusters, 
                empresasViaFerrataClusters, canyoningClusters, empresasCanyoningClusters, vttLayer, itinerariosAdaptadosClusters, 
                itinerariosPedestresClusters, itinerariosEquestresClusters, itinerariosTrailrunningClusters, itinerariosPedestresTracksMarkers, bosquesClusters, rutasArboledasLayer
            }).forEach(capa => {
                if (map.hasLayer(capa)) map.removeLayer(capa);
            });
            // Añadir solo limitesLayer si no está
            if (!map.hasLayer(limitesLayer)) map.addLayer(limitesLayer);
            // Centrar el mapa en los límites
            if (limitesLayer) map.fitBounds(limitesLayer.getBounds());
            // Actualizar leyenda y filtros
            actualizarLeyenda();
            actualizarFiltrosAcordeon();

            // Desmarcar todos los checkboxes del sidebar
            document.querySelectorAll('.sidebar-checkboxes input[type="checkbox"]').forEach(cb => {
                cb.checked = false;
            });
            // Sincronizar checkboxes
            if (typeof sincronizarCheckboxes === 'function') sincronizarCheckboxes();
        });
    }
});
// ================= INICIALIZACIÓN =================
async function initMap(){
    // Crear panes personalizados
        map.createPane('carreterasPane'); // Pane para carreteras
        map.getPane('carreterasPane').style.zIndex = 500; // Por encima de buffers

        map.createPane('buffersPane'); // Pane para buffers de influencia
        map.getPane('buffersPane').style.zIndex = 400; // Más bajo

    // Cargar datos
    await cargarLimites();
    await cargarBuffersInfluencia();
    await cargarCapaVTT();
    await Promise.all([
        cargarGeoJSON('data/mercados_aect.geojson', mercadosCluster, markers, marketIconMercados, updatePopupMercados),
        cargarGeoJSON('data/escuelas_formacion.geojson', centrosCluster, markersCentros, marketIconEscuelas, updatePopupEscuelas),
        cargarGeoJSON('data/oficinas_turismo.geojson', turismoCluster, turismoMarkers, turismoIcon, updatePopupOficinasTurismo),
        cargarGeoJSON('data/alojamientos/hoteles_64.geojson', hotelesCluster, hotelesMarkers, hotelesIcon, updatePopupAlojamientos),
        cargarGeoJSON('data/alojamientos/campings.geojson', campingsCluster, campingsMarkers, campingIcon, updatePopupAlojamientos),
        cargarGeoJSON('data/alojamientos/albergues_64_Huesca.geojson', alberguesCluster, alberguesMarkers, albergueIcon, updatePopupAlojamientos),
        cargarGeoJSON('data/alojamientos/refugios.geojson', refugiosCluster, refugiosMarkers, refugioIcon, updatePopupAlojamientos),
        cargarGeoJSON('data/patrimonio_cultural/fortalezas_castillos_Huesca.geojson', fortalezasCluster, fortalezasMarkers, castilloIcon, updatePopupPatrimonioCultural),
        cargarGeoJSON('data/patrimonio_cultural/monumentos.geojson', monumentosCluster, monumentosMarkers, monumentoIcon, updatePopupPatrimonioCultural),
        cargarGeoJSON('data/patrimonio_cultural/monumentos_religiosos.geojson', monumentosReligiososCluster, monumentosReligiososMarkers, monumentoReligiosoIcon, updatePopupPatrimonioCultural),
        cargarGeoJSON('data/patrimonio_cultural/restos_arqueologicos.geojson', restosArqueologicosCluster, restosArqueologicosMarkers, restosArqueologicosIcon, updatePopupPatrimonioCultural),
        cargarGeoJSON('data/otros_centros.geojson', otrosCentrosCluster, null, marketIconOtrosCentros, popupSoloNombre),
        cargarGeoJSON('data/restaurantes/restaurantes.geojson', restaurantesCluster, restaurantesMarkers, restaurantesIcon, updatePopupRestaurantes),
        cargarGeoJSON('data/equipamiento/balnearios_64_Huesca.geojson', balneariosCluster, balneariosMarkers, balneariosIcon, updatePopupBalnearios),
        cargarGeoJSON('data/equipamiento/museos.geojson', museosCluster, museosMarkers, museosIcon, popupSoloNombre),
        cargarGeoJSON('data/turismo_natural/arboles_emblematicos_huesca.geojson', arbolesCluster, arbolesMarkers, arbolesIcon, updatePopupArbolesSingulares),
        cargarGeoJSON('data/turismo_natural/miradores.geojson', miradoresCluster, miradoresMarkers, miradoresIcon, popupSoloNombre),
        cargarGeoJSON('data/turismo_natural/glaciares_Huesca.geojson', glaciaresClusters, glaciaresMarkers, glaciaresIcon, popupSoloNombre),
        cargarGeoJSON('data/turismo_natural/zonas_bano_Huesca.geojson', zonasBanosClusters, zonasBanosMarkers, zonaBanoIcon, popupSoloNombre),
        cargarGeoJSON('data/equipamiento/piscinas.geojson', piscinasClusters, piscinasMarkers, piscinasIcon, updatePopupPiscinas),
        cargarGeoJSON('data/productores/productores_64.geojson', productoresClusters, productoresMarkers, productorIcon, updatePopupProductores),
        cargarGeoJSON('data/productores/comercios_64.geojson', comerciosClusters, comerciosMarkers, comerciosIcon, updatePopupComercios),
        cargarGeoJSON('data/turismo_activo/ski_huesca_64.geojson', skiClusters, skiMarkers, skiIcon, updatePopupSki),
        cargarGeoJSON('data/turismo_activo/empresas_nieve_64.geojson', empresasNieveClusters, empresasNieveMarkers, empresasNieveIcon, updatePopupEmpresasNieve),
        cargarGeoJSON('data/productores/productores_proximidad.geojson', productoresProximidadClusters, productoresProximidadMarkers, productorIcon, updatePopupProductores),
        cargarGeoJSON('data/distribucion_logistica/poblaciones_clave.geojson', nucleosClaveClusters, nucleosclaveMarkers, nucleosClaveIcon, popupSoloNombre),
        cargarGeoJSON('data/turismo_activo/puntos_escalada.geojson', puntosEscaladaClusters, puntosEscaladaMarkers, puntosEscaladaIcon, updatePopupEscalada),
        cargarGeoJSON('data/turismo_activo/escalada_empresas_64.geojson', empresasEscaladaClusters, empresasEscaladaMarkers, empresasEscaladasIcon, updatePopupEmpresasEscalada),
        cargarGeoJSON('data/turismo_activo/vias_ferratas.geojson', viaFerrataClusters, viaFerrataMarkers, viaFerrataIcon, updatePopupViasFerratas),
        cargarGeoJSON('data/turismo_activo/vias_ferratas_empresas.geojson', empresasViaFerrataClusters, empresasViaFerrataMarkers, viaFerrataEmpresasIcon, updatePopupEmpresasEscalada),
        cargarGeoJSON('data/turismo_activo/canyoning.geojson', canyoningClusters, canyoningMarkers, canyoningIcon, updatePopupCanyoning),
        cargarGeoJSON('data/turismo_activo/empresas_canyoning.geojson', empresasCanyoningClusters, empresasCanyoningMarkers, empresasCanyoningIcon, updatePopupEmpresasCanyoning),
        cargarGeoJSON('data/turismo_activo/itinerarios_64/itinerarios_adaptados.geojson', itinerariosAdaptadosClusters, itinerariosAdaptadosMarkers, itinerariosadaptadosIcon, updatePopupItinerarios),
        cargarGeoJSON('data/turismo_activo/itinerarios_64/itinerarios_pedestre.geojson', itinerariosPedestresClusters, itinerariosPedestresMarkers, itinerariospedestresIcon, updatePopupItinerarios),
        cargarGeoJSON('data/turismo_activo/itinerarios_64/itinerarios_equestre.geojson', itinerariosEquestresClusters, itinerariosEquestresMarkers, itinerariosequestresIcon, updatePopupItinerarios),
        cargarGeoJSON('data/turismo_activo/itinerarios_64/itinerarios_trail.geojson', itinerariosTrailrunningClusters, itinerariosTrailrunningMarkers, ittinerariostrailrunningIcon, updatePopupItinerarios),
        cargarLineas('data/turismo_activo/itinerarios_64/itinerarios_pedestre_tracks.geojson', itinerariosPedestresTracksMarkers, estilo_itinerarios,  updatePopupItinerarios),
        cargarGeoJSON('data/turismo_natural/arboledas_singulares.geojson', bosquesClusters, bosquesMarkers, bosqueIcon, updatePopupArboledasSingulares),
        cargarLineas('data/turismo_natural/rutas_arboles_arboledas.geojson', rutasArboledasLayer, estilo_rutas_arboledas, updatePopupItinerarios),
        cargarCarreteras(),
        cargarProductosAgro(),

    ]);

    // Inicializar sidebar y acordeones
    await inicializarCapasDistribucionLogistica()
    map.fitBounds(limitesLayer.getBounds());
    initAcordeonFiltros();
    actualizarFiltrosAcordeon();  
    actualizarLeyenda();
    
}
initMap();