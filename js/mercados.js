// ================= MAPA =================
var map = L.map("contenedor-mapa").setView([42.8486, -0.3145], 9);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);


// ================= ICONOS =================

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
const DEFAULT_ICON_AGRO = iconsProductosAgro["Legumbres"] || marketIconMercados;

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

    // Función para obtener el ícono de la red social
    function getIconoRedSocial(nombre) {
        const iconos = {
            "Facebook": "fab fa-facebook",
            "Instagram": "fab fa-instagram",
            "Twitter": "fab fa-twitter",
            "LinkedIn": "fab fa-linkedin",
            "YouTube": "fab fa-youtube",
            "TikTok": "fab fa-tiktok",
            "GoogleMyBusiness": "fas fa-map-marker-alt" // No hay un ícono específico, usamos un marcador
        };
        return iconos[nombre] || "fas fa-globe"; // Ícono genérico
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

function updatePopupMercados(layer, props){
    let html = `<div class="popup-mercados"><h3>${props.nombre||'Sin nombre'}</h3>`;
    const titles = {nombre_tipo:"Tipo/Type", nombre_frecuencia:"Frecuencia / Fréquence", nombre_semana:"Semana / Semaine", nombre_dia:"Día / Jour", nombre_apertura:"Franja Horaria / Plage horaire", direccion:"Dirección / Adresse", horario:"Horario / Horaires", num_postes:"Nº postes", municipios_communes:"Municipio / Commune", comarca:"Comarca", provincia_departement:"Provincia / Departement"};
    for(let key in props){
        if(!props.hasOwnProperty(key)) continue;
        if(["row_number","nombre"].includes(key)) continue;
        if(key.toLowerCase().includes("coord")||key.toLowerCase().includes("id_")) continue;
        let val = makeClickable(props[key]);
        html+=`<div class="popup-row"><b>${titles[key]||key}:</b> <span>${val}</span></div>`;
    }
    html+="</div>";
    layer.bindPopup(html,{className:'popup-mercados',minWidth:250,maxWidth:600});
}

function updatePopupEscuelas(layer, props){
    let html = `<div class="popup-escuelas"><h3>${props.nombre_centro||'Sin nombre'}</h3>`;
    const titles = {nombre_tipo_centro:"Tipo", tipo_oferta:"Tipo estudios", oferta:"Oferta", email:"E-mail", telefono:"Teléfono", sitio_web:"Web", municipios_communes:"Municipio"};
    for(let key in props){
        if(!props.hasOwnProperty(key)) continue;
        if(["row_number","nombre_centro"].includes(key)) continue;
        if(key.toLowerCase().includes("coord")||key.toLowerCase().includes("id_")||key.toLowerCase().includes("fid")) continue;
        let val = makeClickable(props[key]);
        if(Array.isArray(val)){
            html+=`<div class="popup-row"><b>${titles[key]||key}:</b><ul>${val.map(i=>`<li>${makeClickable(i)}</li>`).join('')}</ul></div>`;
        }else html+=`<div class="popup-row"><b>${titles[key]||key}:</b> <span>${val}</span></div>`;
    }
    html+="</div>";
    layer.bindPopup(html,{className:'popup-escuelas',minWidth:250,maxWidth:400});
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


function updatePopupOficinasTurismo(layer, props){
    let html = `<div class="popup-mercados"><h3>${props.nombre || 'Sin nombre'}</h3>`;
    const titles = {
        nombre_tipo: "Tipo/Type",
        direccion: "Dirección",
        telefono: "Teléfono",
        email: "E-mail",
        web: "Web",
        municipio: "Municipio/Commune"
    };
    for(let key in props){
        if(!props.hasOwnProperty(key)) continue;
        if(["row_number","nombre"].includes(key)) continue;
        if(key.toLowerCase().includes("coord")||key.toLowerCase().includes("id_")) continue;
        const val = makeClickable(props[key]);
        html+=`<div class="popup-row"><b>${titles[key]||key}:</b> <span>${val}</span></div>`;
    }
    html += "</div>";
    layer.bindPopup(html,{className:'popup-mercados',minWidth:250,maxWidth:600});
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

    fieldsToShow.forEach(key => {
        if (props[key]) {
            html += `<div class="popup-row"><b>${titles[key] || key}:</b> ${formatValue(props[key])}</div>`;
        }
    });

    html += `<div class="popup-row"><b>Servicios / Services</b>
        <div class="boolean-grid productores-boolean-grid">`;
    booleanFields.forEach(({key, label}) => {
        const valor = props[key] === true;
        html += `<span class="boolean-tag${valor ? ' activo' : ''}">${label}</span>`;
    });
    html += `</div>
        <div class="popup-leyenda-boolean">🟩: Disponible / Oui<br>⬜: No disponible / Non</div>
    </div>`;

    html += "</div>";

    layer.bindPopup(html, {
        className: "popup-productores",
        minWidth: 400,
        maxWidth: 500,
        maxHeight: 500
    });
}


function updatePopupRestaurantes(layer, props){
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

    // Solo recorremos las claves definidas en titles
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

    const booleanFields = [
        { key: "animales_bienvenidos", label: "Animales bienvenidos / Animaux bienvenus" }
    ];
    html += `<div class="popup-row">
        <div class="boolean-grid productores-boolean-grid">`;
    booleanFields.forEach(({key, label}) => {
        const valor = props[key] === true;
        html += `<span class="boolean-tag${valor ? ' activo' : ''}">${label}</span>`;
    });
    html += `</div>
        <div class="popup-leyenda-boolean">🟩: Disponible / disponible<br>⬜: No disponible / Non disponible</div
        </div>`;
    html += "</div>";

    layer.bindPopup(html, {
        className: 'popup-restaurantes', 
        minWidth: 500, 
        maxWidth: 400, 
        maxHeight: 400
    });
}


function updatePopupBalnearios(layer, props){
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
        Fotos: "Fotos / Photos"
    };

    for(let key of Object.keys(titles)){
        if(props[key]){
            let displayValue = props[key];

            // Web como enlace (ya no hace falta comprobar, usamos makeClickable)
            displayValue = makeClickable(displayValue);

            // Fotos — carrusel
            if(key === "Fotos"){
                const fotosArray = props[key].split(",").map(f => f.trim()).filter(f => f !== "");
                if(fotosArray.length > 0){
                    const fotosId = `fotos-popup-${Math.random().toString(36).substring(2, 8)}`;

                    displayValue = `
                        <button class="btn-fotos" onclick="document.getElementById('${fotosId}').style.display='flex'; showSlide('${fotosId}',0);">
                            Ver fotos (${fotosArray.length})
                        </button>
                        <div id="${fotosId}" class="popup-fotos-overlay" style="display:none">
                            <div class="popup-fotos-content">
                                <span class="close-fotos" onclick="document.getElementById('${fotosId}').style.display='none'">&times;</span>
                                <div class="carousel-container">
                                    ${fotosArray.map((url, i) => `<img class="carousel-slide" src="${url}" style="display:none">`).join('')}
                                    <button class="prev-slide" onclick="plusSlide('${fotosId}', -1)">&#10094;</button>
                                    <button class="next-slide" onclick="plusSlide('${fotosId}', 1)">&#10095;</button>
                                </div>
                            </div>
                        </div>
                    `;
                }
            }

            html += `<div class="popup-row"><b>${titles[key]}:</b> <span>${displayValue}</span></div>`;
        }
    }

    const booleanFieldsTienda = [
        { key: "accesibilidad", label: "Accesibilidad adaptada / Accessibilité adaptée" },
    ];

    html += `<div class="popup-row">
                <div class="boolean-grid productores-boolean-grid">`;
    booleanFieldsTienda.forEach(({key, label}) => {
        const valor = props[key] === true;
        html += `<span class="boolean-tag${valor ? ' activo' : ''}">${label}</span>`;
    });
    html += `</div></div>`;

    html += `<div class="popup-leyenda-boolean">🟩: Disponible / disponible<br>⬜: No disponible / Non disponible</div>`;

    layer.bindPopup(html, {className:'popup-productores', minWidth:250, maxWidth:400});
}

// Funciones para el carrusel (sin cambios)
function showSlide(carouselId, index){
    const container = document.getElementById(carouselId);
    if(!container) return;
    const slides = container.querySelectorAll(".carousel-slide");
    slides.forEach((slide,i)=> slide.style.display = i===index ? "block" : "none");
    container.dataset.currentSlide = index;
}

function plusSlide(carouselId, n){
    const container = document.getElementById(carouselId);
    if(!container) return;
    const slides = container.querySelectorAll(".carousel-slide");
    let current = parseInt(container.dataset.currentSlide || 0);
    let next = current + n;
    if(next < 0) next = slides.length-1;
    if(next >= slides.length) next = 0;
    showSlide(carouselId, next);
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
    let html = `<div class="popup-productores" style="background:#fef3e0;padding:10px;border-radius:8px;">
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
    layer.bindPopup(html,{className:'popup-productores', minWidth:250, maxWidth:400});
}

function updatePopupProductores(layer, props){
    let html = `<div class="popup-productores"><h3>${makeClickable(props.nombre_productor) || 'Sin nombre'}</h3>`;
    const titles = {
        direccion:"Dirección / Adresse", 
        tipo_productor: "Tipo de productor / Type de producteur",
        productos:"Tipo de producto / Type de produit", 
        telefonos: "Teléfono / Téléphone",
        emails: "E-mail",
        urls:"URL de acceso / URL d'accès", 
        persona_contacto: "Persona de contacto / Personne de contact",
        url_venta_on_line:"URL tienda online / URL boutique en ligne",
        horario:"Horario de visita / Horaires de visite", 
        tarifas:"Tarifas de visita / Tarifs des visites",
        idiomas_hablados:"Idiomas hablados / Langues parlées", 
        descripcion:"Descripción de la explotación / Description de l'exploitation"
    };

    const skipKeys = ["row_number", "nombre", "nombre_productor", "animales_aceptados",
        "tienda", "agricultura_ecologica", "restaurante", "venta_mayor", "tienda_online", "venta_centro_produccion"];

    for(let key in props){
        if(!props.hasOwnProperty(key)) continue;
        if(skipKeys.includes(key)) continue;
        if(key.toLowerCase().includes("coord") || key.toLowerCase().includes("id")) continue;
        if(props[key] === null || props[key] === undefined || props[key] === '') continue;

        if(key === "productos"){
            let items = Array.isArray(props[key]) ? props[key] : props[key].split(',').map(s => s.trim());
            html += `<div class="popup-row"><b>${titles[key]||key}:</b>
                        <div class="productos-grid">`;
            items.forEach(item => {
                html += `<div class="producto-item">${makeClickable(item)}</div>`;
            });
            html += `</div></div>`;
        } else {
            html += `<div class="popup-row"><b>${titles[key]||key}:</b> <span>${makeClickable(props[key])}</span></div>`;
        }
    }

    const booleanFieldsTienda = [
        { key: "venta_mayor", label: "Venta mayorista / Vente en gros" },
        { key: "tienda_online", label: "Tienda online / Boutique en ligne" },
        { key: "venta_centro_produccion", label: "Venta en centro de producción / Vente dans le centre de production" },
        { key: "tienda", label: "Tienda / Boutique" }
    ];

    html += `<div class="popup-row"><b>Punto de venta / Point de vente</b>
        <div class="boolean-grid productores-boolean-grid">`;
    booleanFieldsTienda.forEach(({key, label}) => {
        const valor = props[key] === true;
        html += `<span class="boolean-tag${valor ? ' activo' : ''}">${label}</span>`;
    });
    html += `</div>
        <div class="popup-leyenda-boolean">🟩: Disponible / disponible<br>⬜: No disponible / Non disponible</div>
    </div>`;

    const booleanFieldsServicios = [
        { key: "agricultura_ecologica", label: "Agricultura ecológica / Agriculture biologique" },
        { key: "restaurante", label: "Restaurante / Restaurant" },
    ];

    html += `<div class="popup-row"><b>Servicios / Services</b>
        <div class="boolean-grid productores-boolean-grid">`;
    booleanFieldsServicios.forEach(({key, label}) => {
        const valor = props[key] === true;
        html += `<span class="boolean-tag${valor ? ' activo' : ''}">${label}</span>`;
    });
    html += `</div>
        <div class="popup-leyenda-boolean">🟩: Disponible / disponible<br>⬜: No disponible / Non disponible</div>
    </div>`;

    html += "</div>";

    layer.bindPopup(html, {
        className: 'popup-productores',
        minWidth: 300,
        maxWidth: 500,
        maxHeight: 500
    });
}

function updatePopupComercios(layer, props){
    let html = `<div class="popup-comercios"><h3>${makeClickable(props.nombre_productor) || 'Sin nombre'}</h3>`;
    const titles = {
        direccion:"Dirección / Adresse", 
        codigo_postal:"Código postal / Code postal",
        tipo_productor: "Tipo de comercio / Type de boutique",
        productos:"Tipo de producto / Type de produit", 
        telefono: "Teléfono / Téléphone",
        url:"URL de acceso / URL d'accès", 
        url_venta_on_line:"URL tienda online / URL boutique en ligne",
        persona_contacto: "Persona de contacto / Personne de contact",
        email: "E-mail",
        tienda: "Tienda / Boutique",
        horario:"Horario / Horaires", 
        tarifas:"Tarifas / Tarifs",
        idiomas_hablados:"Idiomas hablados / Langues parlées", 
        descripcion:"Descripción / Description ",
        agricultura_ecologica: "Agricultura Ecológica /Agriculture Ecologique",
        restaurante: "Restaurante",
        venta_mayor: "Venta mayorista",
        tienda_online: "Tienda online",
        venta_centro_produccion: "Venta en centro de producción"
    };

    const skipKeys = ["row_number", "nombre", "nombre_productor", "animales_aceptados"];

    for(let key in props){
        if(!props.hasOwnProperty(key)) continue;
        if(skipKeys.includes(key)) continue;
        if(key.toLowerCase().includes("coord") || key.toLowerCase().includes("id")) continue;
        if(props[key] === null || props[key] === undefined || props[key] === '') continue;

        if(key === "productos"){
            let items = Array.isArray(props[key]) ? props[key] : props[key].split(',').map(s => s.trim());
            html += `<div class="popup-row"><b>${titles[key]||key}:</b>
                        <div class="productos-grid">`;
            items.forEach(item => {
                html += `<div class="producto-item">${makeClickable(item)}</div>`;
            });
            html += `</div></div>`;
        } else {
            html+=`<div class="popup-row"><b>${titles[key]||key}:</b> <span>${makeClickable(props[key])}</span></div>`;
        }
    }

    // Campos booleanos
    const booleanFields = [
        { key: "animales_aceptados", label: "Animales aceptados / Animaux acceptés" },
        { key: "agricultura_ecologica", label: "Agricultura ecológica / Agriculture biologique" },
    ];

    html += `<div class="popup-row"><b>Servicios / Services:</b>
        <div class="boolean-grid comercios-boolean-grid">`;
    booleanFields.forEach(({key, label}) => {
        const valor = props[key] === true;
        html += `<span class="boolean-tag${valor ? ' activo' : ''}">${label}</span>`;
    });
    html += `</div>
    <div class="popup-leyenda-boolean">🟩 Disponible / Disponible<br>⬜ No disponible / Non disponible</div>
    </div>`;

    html+="</div>";
    layer.bindPopup(html,{
        className:'popup-comercios', 
        minWidth:300, 
        maxWidth:500, 
        maxHeight:400
    });
}

function updatePopupSki(layer, props){
    const name = props.Nombre || 'Sin nombre';
    let html = `<div class="popup-ski"><h3>${makeClickable(name)}</h3>`;
    const titles = {
        direccion: "Dirección / Adresse",
        Tipo: "Tipo de estación / Type de station",
        subtipo: "Subitpo de estación / Sous-type de station",
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
        Fotos: "Fotos / Photos"
    };

    for (let key in titles) {
        if (!props.hasOwnProperty(key)) continue;
        let value = props[key];
        if (!value || value === "" || value === null) continue;

        if (key === "km_esqui") {
            html += `
                <div style="
                    margin:15px 0; 
                    padding:12px; 
                    background:linear-gradient(135deg, #a1c4fd, #c2e9fb); 
                    border-radius:10px; 
                    text-align:center; 
                    box-shadow:0 3px 8px rgba(0,0,0,0.2);
                ">
                    <h4 style="margin:0 0 6px 0;">${titles[key]}</h4>
                    <p style="margin:0; font-weight:700; font-size:18px;">${value} km</p>
                </div>
            `;
            continue;
        }

        let displayValue = makeClickable(value);

        if (key === "Web") {
            displayValue = `<a href="${value}" target="_blank" rel="noopener noreferrer">${value}</a>`;
        }

        if (["p_verde","p_azul","p_roja","p_negra"].includes(key)) {
            displayValue = `<span class="ski-pista ${key}">${value} Km</span>`;
        }

        if (key === "Fotos") {
            const fotosArray = value.split(",").map(f => f.trim()).filter(f => f !== "");
            if (fotosArray.length > 0) {
                const fotosHTML = fotosArray.map(url => `<img src="${url}" alt="foto">`).join("");
                const fotosId = `fotos-popup-${Math.random().toString(36).substring(2, 8)}`;
                displayValue = `
                    <button class="btn-fotos" onclick="document.getElementById('${fotosId}').style.display='flex'">
                        Ver fotos (${fotosArray.length})
                    </button>
                    <div id="${fotosId}" class="popup-fotos-overlay" style="display:none">
                        <div class="popup-fotos-content">
                            <span class="close-fotos" onclick="document.getElementById('${fotosId}').style.display='none'">&times;</span>
                            ${fotosHTML}
                        </div>
                    </div>
                `;
            }
        }

        if (key === "h_min") {
            const hMin = props.h_min;
            const hMax = props.h_max;
            const desnivel = props.desnivel;

            if (hMin || hMax || desnivel) {
                displayValue = `
                    ${hMin ? hMin + ' m' : '?'} – 
                    ${hMax ? hMax + ' m' : '?'}
                    ${desnivel ? ` (${desnivel} m de desnivel)` : ''}
                `;
                html += `<div class="popup-row"><b>Altitud / Dénivelé:</b><span>${displayValue}</span></div>`;
                delete props.h_max;
                delete props.desnivel;
                continue;
            } else continue;
        }

        html += `<div class="popup-row"><b>${titles[key]}:</b><span>${displayValue}</span></div>`;
    }

    html += "</div>";
    layer.bindPopup(html, { className: 'popup-ski', minWidth: 400, maxWidth: 700, maxHeight: 500 });
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
        redes_sociales: "Redes sociales / Réseaux sociaux",
        descripcion: "Descripción / Description",
        servicios: "Servicios / Services",
        modo_pago: "Modo de pago / Mode de paiement",
        equipamiento: "Equipamiento / Équipement",
        accesibilidad: "Accesibilidad / Accessibilité",
        animales_bienvenidos: "Animales bienvenidos / Animaux bienvenus",
        accesibilidad_info: "Info accesibilidad / Info accessibilité",
        fotos: "Fotos / Photos"
    };

    for (let key in titles) {
        if (!props.hasOwnProperty(key)) continue;
        let value = props[key];
        if (!value || value === "" || value === null) continue;

        let displayValue = makeClickable(value);

        // Redes sociales con íconos
        if (key === "redes_sociales") {
            const redesArray = value.split(",").map(r => r.trim()).filter(r => r !== "");
            if (redesArray.length > 0) {
                displayValue = `
                    <div class="redes-sociales-contenedor">
                        ${redesArray.map(red => {
                            const [nombre, url] = red.split(/:(.+)/).map(s => s.trim());
                            if (!url) return ""; // Si no hay URL, omitir
                            const validUrl = url.startsWith("http") ? url : `https://${url}`; // Asegurar prefijo http/https
                            const icono = getIconoRedSocial(nombre);
                            return `
                                <a href="${validUrl}" target="_blank" rel="noopener noreferrer" class="red-social">
                                    <i class="${icono}" title="${nombre}"></i>
                                </a>
                            `;
                        }).join("")}
                    </div>
                `;
            }
        }

        // Fotos (carrusel)
        if (key === "fotos") {
            const fotosArray = value.split(",").map(f => f.trim()).filter(f => f !== "");
            if (fotosArray.length > 0) {
                const fotosId = `fotos-popup-${Math.random().toString(36).substring(2, 8)}`;
                displayValue = `
                    <button class="btn-fotos" onclick="document.getElementById('${fotosId}').style.display='flex'">
                        Ver fotos (${fotosArray.length})
                    </button>
                    <div id="${fotosId}" class="popup-fotos-overlay" style="display:none">
                        <div class="popup-fotos-content">
                            <span class="close-fotos" onclick="document.getElementById('${fotosId}').style.display='none'">&times;</span>
                            ${fotosArray.map(url => `<img src="${url}" alt="foto">`).join("")}
                        </div>
                    </div>
                `;
            }
        }

        html += `<div class="popup-row"><b>${titles[key]}:</b><span>${displayValue}</span></div>`;
    }

    // Campos booleanos
    const booleanFields = [
        { key: "animales_bienvenidos", label: "Animales bienvenidos / Animaux bienvenus" },
        { key: "accesibilidad", label: "Accesibilidad / Accessibilité" }
    ];

    html += `<div class="popup-row"><b>Servicios / Services:</b>
        <div class="boolean-grid comercios-boolean-grid">`;
    booleanFields.forEach(({ key, label }) => {
        const valor = props[key] === true;
        html += `<span class="boolean-tag${valor ? ' activo' : ''}">${label}</span>`;
    });
    html += `</div>
        <div class="popup-leyenda-boolean">🟩: Disponible / Oui<br>⬜: No disponible / Non</div>
    </div>`;

    html += "</div>";

    layer.bindPopup(html, {
        className: 'popup-empresas-nieve',
        minWidth: 400,
        maxWidth: 700,
        maxHeight: 500
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
                { value: '0-10000', label: '0 - 10,000 m' },
                { value: '10001-30000', label: '10,001 - 30,000 m' },
                { value: '31000-50000', label: '31,000 - 50,000 m' }
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

function filtrarMarcadores(){
    const tipo = document.getElementById('filtro-tipo-mercado').value;
    const frecuencia = document.getElementById('filtro-frecuencia').value;
    const semana = document.getElementById('filtro-semana').value;
    const dia = document.getElementById('filtro-dia').value;
    const apertura = document.getElementById('filtro-apertura').value;

    mercadosCluster.clearLayers(); // Limpiar cluster

    markers.forEach(({marker, props})=>{
        if((!tipo || props.nombre_tipo === tipo) &&
           (!frecuencia || props.nombre_frecuencia === frecuencia) &&
           (!semana || props.nombre_semana === semana) &&
           (!dia || props.nombre_dia === dia) &&
           (!apertura || props.nombre_apertura === apertura)) {
               mercadosCluster.addLayer(marker);
        }
    });
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

document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.btn-limpiar-filtros').forEach(btn => {
        btn.addEventListener('click', () => {
            const capa = btn.dataset.capa;
            const contenedor = btn.closest('.contenedor-filtros');
            contenedor.querySelectorAll('select').forEach(sel => {
                sel.value = "";
            });
            // Ejecuta el filtrado correspondiente
            if (capa === "mercados") filtrarMarcadores();
            else if (capa === "escuelas") filtrarCentros();
            else if (capa === "productos") filtrarProductosAgro();
            else if (capa === "productores") filtrarProductores();
            else if (capa === "comercios") filtrarComercios();
            else if (capa === "restaurantes") fitlrarRestaurantes();
            else if (capa === "empresas-nieve") filtrarEmpresasNieve();
            else if (capa === "productores-proximidad") filtrarProductoresProximidad();
        });
    });
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
        } else {
            btn.style.display = 'none';        // Ocultar botón
            contenedor.style.display = 'none';  // Ocultar contenedor
        }
    });
}



// Modificar los eventos de checkboxes para llamar a actualizarFiltrosAcordeon()
['mercados','escuelas','otros','productos', 'productores', 'comercios', 'restaurantes', 'empresas-nieve'].forEach(tipo=>{
    const checkbox = document.getElementById('cb-'+tipo);
    if(checkbox){
        checkbox.addEventListener('change', e=>{
            const capaMap = {'mercados':mercadosCluster,'escuelas':centrosCluster,'otros':otrosCentrosCluster,'productos':productosAgroCluster, 'productores': productoresClusters, 'comercios': comerciosClusters, 'restaurantes': restaurantesCluster, 'empresas-nieve': empresasNieveClusters};
            if(e.target.checked) map.addLayer(capaMap[tipo]); else map.removeLayer(capaMap[tipo]);
            actualizarLeyenda();
            actualizarFiltrosAcordeon();
        });
    }
});

// ================= SIDEBAR =================
window.addEventListener('load', function(){
    const sidebar = L.control.sidebar({ container: "sidebar" }).addTo(map);

    sidebar.addPanel({
        id: "home",
        tab: '<i class="fas fa-home"></i>',
        title: 'BIENVENIDO / BIENVENUE',
        pane:`<h3>Sobre el GEOPORTAL:</h3>
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
              `
    });

    sidebar.addPanel({
        id:'agro',
        tab:'<i class="fas fa-seedling"></i>',
        title:'Agroalimentación',
        pane:`
            <div class="accordion">
            <!-- Grupo 1 -->
                <div class="accordion-item">
                    <button class="accordion-header">
                        Sector Agroalimentario / Secteur agroalimentaire
                        <span class="arrow">▶</span>
                    </button>
                    <div class="accordion-content">
                        <div class="sidebar-checkboxes">
                            <label><input type="checkbox" id="cb-productores" checked> <img src="icons/productor.svg" width="20"> Productores y artesanos / Producteurs et artisans </label><br>
                            <label><input type="checkbox" id="cb-comercios" checked> <img src="icons/tienda.svg" width="20"> Tiendas y comercios / Boutiques et commerces </label><br>
                            <label><input type="checkbox" id="cb-productos" checked> <img src="icons/frutas.svg" width="20"> Patrimonio Agroalimentario / Patrimoine agroalimentaire</label>

                        </div>
                    </div>
                </div>
            </div>
            <div class = "div-acordeones"></div>
            <div class="accordion">
            <!-- Grupo 1 -->
                <div class="accordion-item">
                    <button class="accordion-header">
                        Mercados y Escuelas / Marchés et écoles
                        <span class="arrow">▶</span>
                    </button>
                    <div class="accordion-content">
                        <div class="sidebar-checkboxes">
                            <label><input type="checkbox" id="cb-mercados" checked> <img src="icons/market.svg" width="20"> Mercados / Marchés</label><br>
                            <label><input type="checkbox" id="cb-escuelas" checked> <img src="icons/escuelas_formacion.svg" width="20"> Escuelas / Écoles </label><br>
                            <label><input type="checkbox" id="cb-otros" checked> <img src="icons/otros_centros.svg" width="20"> Otros Centros / Autre Centres</label>
                        </div>
                    </div>
                </div>
            </div>
            <div class = "div-acordeones"></div>
            <div class="accordion">
                <!-- Grupo 3 -->
                <div class="accordion-item">
                    <button class="accordion-header">
                        Restaurantes/Restaurants
                        <span class="arrow">▶</span>
                    </button>
                    <div class="accordion-content">
                        <div class="sidebar-checkboxes">
                            <label><input type="checkbox" id="cb-restaurantes" checked> <img src="icons/restaurante.svg" width="20"> Restaurantes / Restaurants</label>
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
                                <label><input type="checkbox" id="cb-fortalezas"> <img src="icons/castillo.svg" width="20"> Fortalezas y castillos / Forteresses et châteaux</label><br>
                                <label><input type="checkbox" id="cb-monumentos"> <img src="icons/monumento.svg" width="20"> Monumentos / Monuments </label><br>
                                <label><input type="checkbox" id="cb-monumentos-religiosos"> <img src="icons/monumentos_religiosos.svg" width="20"> Monumentos religiosos / Monuments religieux</label><br>
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
                                <label><input type="checkbox" id="cb-arboles" checked> <img src="icons/arbol.svg" width="20"> Árboles emblemáticos / Arbres emblématiques</label>
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
        id:'turismoaventura',
        tab:'<i class="fas fa-hiking"></i>',
        title:"Turismo de aventura/Tourisme d'aventure",
        pane:`
            <div class="accordion">
                <!-- Grupo 2 -->
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
                    </div>`
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
    'productores-proximidad': productoresProximidadClusters
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
    };

    ['mercados','escuelas','otros','productos','oficinas-turismo','restaurantes','hoteles', 'campings', 'albergues', 'refugios', 'fortalezas','monumentos','monumentos-religiosos','restos-arqueologicos', 'balnearios', 'museos', 'arboles', 'miradores', 'glaciares', 'zonasbano', 'piscinas', 'productores', 'comercios', 'ski', 'empresas-nieve', 'productores-proximidad'].forEach(tipo => {
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
            <strong>Buffers de influencia:</strong><br>
            <span style="display:inline-block;width:18px;height:18px;background:#dfa6b4;margin-right:5px;"></span> 10 km<br>
            <span style="display:inline-block;width:18px;height:18px;background:#b9d564;margin-right:5px;"></span> 30 km<br>
            <span style="display:inline-block;width:18px;height:18px;background:#b2f7f1;margin-right:5px;"></span> 50 km<br>
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
                empresasNieveClusters, productoresProximidadClusters, carreterasLayer, nucleosClaveClusters, buffersInfluenciaLayer
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
        cargarGeoJSON('data/turismo_natural/arboles_emblematicos_huesca.geojson', arbolesCluster, arbolesMarkers, arbolesIcon, popupSoloNombre),
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
        cargarCarreteras(),
        cargarProductosAgro(),

    ]);

    // Inicializar sidebar y acordeones
    await inicializarCapasDistribucionLogistica()
    map.fitBounds(limitesLayer.getBounds());
    actualizarLeyenda();
    initAcordeonFiltros();
    actualizarFiltrosAcordeon();  
    actualizarLeyenda();
}
initMap();

