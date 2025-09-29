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
let limitesLayer;
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


// ================= FUNCIÓN PARA MOSTRAR AVISOS MODERNOS =================


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
// ================= POPUPS =================

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
        html+=`<div class="popup-row"><b>${titles[key]||key}:</b> <span>${props[key]}</span></div>`;
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
        if(Array.isArray(props[key])){
            html+=`<div class="popup-row"><b>${titles[key]||key}:</b><ul>${props[key].map(i=>`<li>${i}</li>`).join('')}</ul></div>`;
        }else html+=`<div class="popup-row"><b>${titles[key]||key}:</b> <span>${props[key]}</span></div>`;
    }
    html+="</div>";
    layer.bindPopup(html,{className:'popup-escuelas',minWidth:250,maxWidth:400});
}

function updatePopupProductosAgro(layer, props){
    let html = `<div class="popup-productos"><h3>${props.producto || 'Sin nombre'}</h3>`;
    const titles = { producto: "Producto", tipo_producto: "Tipo de producto", comercializacion: "Comercialización", meses_temporada: "Temporada", municipio_nombre: "Municipio/Commune", comarca_nombre: "Comarca", provincia: "Provincia/Departement"};
    for(let key in props){
        if(!props.hasOwnProperty(key)) continue;
        if(["row_number","fid","producto"].includes(key)) continue;
        if(key.toLowerCase().includes("coord") || key.toLowerCase().includes("id")) continue;
        if(Array.isArray(props[key])){
            html += `<div class="popup-row"><b>${titles[key] || key}:</b><ul>${props[key].map(i=>`<li>${i}</li>`).join('')}</ul></div>`;
        } else {
            html += `<div class="popup-row"><b>${titles[key] || key}:</b> <span>${props[key]}</span></div>`;
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
        html+=`<div class="popup-row"><b>${titles[key]||key}:</b> <span>${props[key]}</span></div>`;
    }
    html += "</div>";
    layer.bindPopup(html,{className:'popup-mercados',minWidth:250,maxWidth:600});
}

function updatePopupAlojamientos(layer, props){
    let html = `<div class="popup-mercados" style="background:#fef3e0;padding:10px;border-radius:8px;">
                    <h3>${props.Nom || props.nombre || 'Sin nombre'}</h3>`;

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
            html += `<div class="popup-row"><b>${titles[key]}:</b> <span>${props[key]}</span></div>`;
        }
    }

    html += "</div>";
    layer.bindPopup(html,{className:'popup-mercados', minWidth:250, maxWidth:400});
}

function updatePopupRestaurantes(layer, props){
    let html = `<div class="popup-restaurantes" style="background:#fef3e0;padding:10px;border-radius:8px;">
                    <h3>${props.Nom || props.nombre_establecimiento || 'Sin nombre'}</h3>`;

    const titles = {
        direccion_establecimiento: "Dirección/Adresse",
        tipo_establecimiento: "Tipo / Type",
        etiqueta_calidad: "Etiquetas de calidad / Labels de qualité",
        descripcion_establecimiento: "Descripción establecimiento / Description de l'établissement",
        idiomas: "Idiomas hablados / Langues parlées",
        formas_pago: "Formas de pago / Moyens de paiement",
        animales_bienvenidos: "Animales bienvenidos / Animaux bienvenus",
        num_plazas_totales: "Nº plazas totales / Nbr de places totales",
        num_plazas_bar: "Nº plazas bar / Nbr de places au bar",
        num_plazas_mesas: "Nº plazas mesas / Nbr de places aux tables",
        num_plazas_terraza: "Nº plazas terraza / Nbr de places en terrasse",
    };

    for(let key of Object.keys(titles)){
        if(props[key]){
            html += `<div class="popup-row"><b>${titles[key]}:</b> <span>${props[key]}</span></div>`;
        }
    }

    html += "</div>";
    layer.bindPopup(html,{className:'popup-restaurantes', minWidth:250, maxWidth:400});
}
function updatePopupPatrimonioCultural(layer, props){
    let html = `<div class="popup-mercados" style="background:#E6FCFE;padding:10px;border-radius:8px;">
                    <h3>${props.Nom || props.nombre || 'Sin nombre'}</h3>`;

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
            html += `<div class="popup-row"><b>${titles[key]}:</b> <span>${props[key]}</span></div>`;
        }
    }

    html += "</div>";
    layer.bindPopup(html,{className:'popup-mercados', minWidth:250, maxWidth:400});
}

function updatePopupPiscinas(layer, props){
    let html = `<div class="popup-mercados" style="background:#fef3e0;padding:10px;border-radius:8px;">
                    <h3>${props.Nom || props.nombre || 'Sin nombre'}</h3>`;

    const titles = {
        dirección: "Dirección/Adresse",
        horarios: "Horarios de apertura / Horaires d'ouverture",
        precios: "Tarifas de acceso / Tarifs d'accès",
        servicios: "Servicios asociados / Services associés",
    };

    for(let key of Object.keys(titles)){
        if(props[key]){
            html += `<div class="popup-row"><b>${titles[key]}:</b> <span>${props[key]}</span></div>`;
        }
    }

    html += "</div>";
    layer.bindPopup(html,{className:'popup-mercados', minWidth:250, maxWidth:400});
}

function updatePopupProductores(layer, props){
    let html = `<div class="popup-productores"><h3>${props.nombre_productor||'Sin nombre'}</h3>`;
    const titles = {
        direccion:"Dirección / Adresse", 
        tipo_productor: "Tipo de productor / Type de producteur",
        productos:"Tipo de producto / Type de produit", 
        telefonos: "Teléfono / Téléphone",
        urls:"URL de acceso / URL d'accès", 
        emails: "E-mail",
        tienda: "Tienda / Boutique",
        horario:"Horario de visita / Horaires de visite", 
        tarifas:"Tarifas de visita / Tarifs des visites",
        idiomas_hablados:"Idiomas hablados / Langues parlées", 
        descripcion:"Descripción de la explotación / Description de l'exploitation",
        agricultura_ecologica: "Agricultura Ecológica"
    };

    const skipKeys = ["row_number", "nombre", "nombre_productor", "animales_aceptados"];

    for(let key in props){
        if(!props.hasOwnProperty(key)) continue;
        if(skipKeys.includes(key)) continue;
        if(key.toLowerCase().includes("coord") || key.toLowerCase().includes("id")) continue;

        if(key === "productos" && props[key]){
            let items = Array.isArray(props[key]) ? props[key] : props[key].split(',').map(s => s.trim());
            html += `<div class="popup-row"><b>${titles[key]||key}:</b>
                        <div class="productos-grid">`;
            items.forEach(item => {
                html += `<div class="producto-item">${item}</div>`;
            });
            html += `</div></div>`;
        } else {
            html+=`<div class="popup-row"><b>${titles[key]||key}:</b> <span>${props[key]}</span></div>`;
        }
    }

    html+="</div>";
    layer.bindPopup(html,{
        className:'popup-productores', 
        minWidth:300, 
        maxWidth:500, 
        maxHeight:400 // limita altura total del popup
    });
}

function updatePopupComercios(layer, props){
    let html = `<div class="popup-comercios"><h3>${props.nombre_productor||'Sin nombre'}</h3>`;
    const titles = {
        direccion:"Dirección / Adresse", 
        tipo_productor: "Tipo de comercio / Type de boutique",
        productos:"Tipo de producto / Type de produit", 
        telefonos: "Teléfono / Téléphone",
        urls:"URL de acceso / URL d'accès", 
        emails: "E-mail",
        tienda: "Tienda / Boutique",
        horario:"Horario / Horaires", 
        tarifas:"Tarifas / Tarifs",
        idiomas_hablados:"Idiomas hablados / Langues parlées", 
        descripcion:"Descripción / Description ",
    };

    const skipKeys = ["row_number", "nombre", "nombre_productor", "animales_aceptados", "agricultura_ecologica"];

    for(let key in props){
        if(!props.hasOwnProperty(key)) continue;
        if(skipKeys.includes(key)) continue;
        if(key.toLowerCase().includes("coord") || key.toLowerCase().includes("id")) continue;

        if(key === "productos" && props[key]){
            let items = Array.isArray(props[key]) ? props[key] : props[key].split(',').map(s => s.trim());
            html += `<div class="popup-row"><b>${titles[key]||key}:</b>
                        <div class="productos-grid">`;
            items.forEach(item => {
                html += `<div class="producto-item">${item}</div>`;
            });
            html += `</div></div>`;
        } else {
            html+=`<div class="popup-row"><b>${titles[key]||key}:</b> <span>${props[key]}</span></div>`;
        }
    }

    html+="</div>";
    layer.bindPopup(html,{
        className:'popup-comercios', 
        minWidth:300, 
        maxWidth:500, 
        maxHeight:400 // limita altura total del popup
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
    const filtroIds = ['filtro-productos-productor', 'filtro-tipo-productor'];
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
    

    // Asociar evento de cambio
    filtroIds.forEach(id => document.getElementById(id).addEventListener('change', filtrarProductores));
}

function initFiltersComercios() {
    const filtroIds = ['filtro-productos-comercios', 'filtro-tipo-comercios'];
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

function filtrarProductosAgro(){
    const tipoProducto = document.getElementById('filtro-tipo-producto').value;
    const comercializacion = document.getElementById('filtro-comercializacion-producto').value;
    const temporada = document.getElementById('filtro-temporada-producto').value;

    productosAgroCluster.clearLayers();

    productosMarkers.forEach(({marker, props})=>{
        const temporadaMatch = !temporada || (Array.isArray(props.meses_temporada) ? props.meses_temporada.includes(temporada) : (props.meses_temporada || "").split(",").includes(temporada));
        if((!tipoProducto || props.tipo_producto === tipoProducto) &&
           (!comercializacion || props.comercializacion === comercializacion) &&
           temporadaMatch) {
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

    productoresClusters.clearLayers();

    productoresMarkers.forEach(({marker, props})=>{
        const productos = (props.productos || []).map(v => normalizaTexto(v));
        const tipos = (props.tipo_productor || []).map(v => normalizaTexto(v));

        const productosMatch = !productosFiltro || productos.includes(productosFiltro);
        const tipoMatch = !tipoFiltro || tipos.includes(tipoFiltro);

        if(productosMatch && tipoMatch){
            productoresClusters.addLayer(marker);
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

        if(productosMatch && tipoMatch){
            comerciosClusters.addLayer(marker);
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
                </div>

                <button class="toggle-filtros" data-capa="escuelas">ESCUELAS DE FORMACIÓN/ÉCOLES</button>
                <div class="contenedor-filtros" data-capa="escuelas" style="display:none;">
                    <label>Tipo centro/Type centre:</label>
                    <select id="filtro-tipo-centro"><option value="">Todos/Tous</option></select>
                    <label>Estudios ofertados/Études proposées:</label>
                    <select id="filtro-tipo-oferta"><option value="">Todos/Tous</option></select>
                </div>

                <button class="toggle-filtros" data-capa="productos">PRODUCTOS AGROALIMENTARIOS / PRODUITS AGROALIMENTAIRES</button>
                <div class="contenedor-filtros" data-capa="productos" style="display:none;">
                    <label>Tipo de producto/Type de produit:</label>
                    <select id="filtro-tipo-producto"><option value="">Todos/Tous</option></select>
                    <label>Comercialización/Commercialisation:</label>
                    <select id="filtro-comercializacion-producto"><option value="">Todos/Tous</option></select>
                    <label>Temporada/Saison:</label>
                    <select id="filtro-temporada-producto"><option value="">Todos/Tous</option></select>
                </div>

                <button class="toggle-filtros" data-capa="productores">PRODUCTORES / PRODUCTEURS </button>
                <div class="contenedor-filtros" data-capa="productores" style="display:none;">
                    <label>Productos / Produits:</label>
                    <select id="filtro-productos-productor"><option value="">Todos/Tous</option></select>
                    <label>Tipo de productor / Type de producteur:</label>
                    <select id="filtro-tipo-productor"><option value="">Todos/Tous</option></select>
                </div>

                <button class="toggle-filtros" data-capa="comercios">TIENDAS / BOUTIQUES </button>
                <div class="contenedor-filtros" data-capa="comercios" style="display:none;">
                    <label>Productos / Produits:</label>
                    <select id="filtro-productos-comercios"><option value="">Todos/Tous</option></select>
                    <label>Tipo de tienda / Type de Boutique:</label>
                    <select id="filtro-tipo-comercios"><option value="">Todos/Tous</option></select>
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



// ================= ACTUALIZACIÓN DINÁMICA DE FILTROS =================
// Actualizamos acordeón para mostrar solo capas activas
function actualizarFiltrosAcordeon() {
    document.querySelectorAll('.filtros-mapa-control .filtro-capa > .toggle-filtros').forEach(btn => {
        const capa = btn.dataset.capa;
        let capaActiva = false;

        if(capa === 'mercados') capaActiva = map.hasLayer(mercadosCluster);
        else if(capa === 'escuelas') capaActiva = map.hasLayer(centrosCluster);
        else if(capa === 'productos') capaActiva = map.hasLayer(productosAgroCluster);
        else if (capa === 'productores') capaActiva = map.hasLayer(productoresClusters);
        else if (capa === 'comercios') capaActiva = map.hasLayer(comerciosClusters);
        const contenedor = btn.nextElementSibling;

        if(capaActiva){
            btn.style.display = 'block';        // Mostrar botón
            contenedor.style.display = 'none';  // Oculto hasta hacer click
            // Inicializar filtros si no tienen opciones (para no duplicar)
            if(capa === 'mercados' && document.getElementById('filtro-tipo-mercado').options.length <= 1) initFilters();
            else if(capa === 'escuelas' && document.getElementById('filtro-tipo-centro').options.length <= 1) initFiltersCentros();
            else if(capa === 'productos' && document.getElementById('filtro-tipo-producto').options.length <= 1) initFiltersProductosAgro();
            else if(capa === 'productores' && document.getElementById('filtro-productos-productor').options.length <= 1) initFiltersProductores();
            else if(capa === 'comercios' && document.getElementById('filtro-productos-comercios').options.length <= 1) initFiltersComercios();

        } else {
            btn.style.display = 'none';        // Ocultar botón
            contenedor.style.display = 'none';  // Ocultar contenedor
        }
    });
}



// Modificar los eventos de checkboxes para llamar a actualizarFiltrosAcordeon()
['mercados','escuelas','otros','productos', 'productores', 'comercios'].forEach(tipo=>{
    const checkbox = document.getElementById('cb-'+tipo);
    if(checkbox){
        checkbox.addEventListener('change', e=>{
            const capaMap = {'mercados':mercadosCluster,'escuelas':centrosCluster,'otros':otrosCentrosCluster,'productos':productosAgroCluster, 'productores': productoresClusters, 'comercios': comerciosClusters};
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
                                <label><input type="checkbox" id="cb-piscinas"> <img src="icons/piscina.svg" width="20"> Piscinas / Piscines</label>
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
        pane:``
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
    'comercios': comerciosClusters
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

        'albergues': { es: "Información correspondiente únicamente al Bearn (Pyrénées Atlantiques), Huesca y comarca de las Cinco Villas", 
            fr: "Informations concernant uniquement le Béarn (Pyrénées Atlantiques), Huesca et la région des Cinco Villas.", 
            fuente: 'IGN España y Tourisme 64' },

        'hoteles': { 
            es: "Información correspondiente únicamente al departamento Pyrénées-Atlantiques", 
            fr: "Informations concernant uniquement le département des Pyrénées-Atlantiques", 
            fuente: 'Tourisme 64'},

        'productores': 
            { es: "Información correspondiente únicamente al departamento Pyrénées-Atlantiques", 
            fr: "Informations concernant uniquement le département des Pyrénées-Atlantiques", 
            fuent: "Tourisme 64" },

        'comercios': 
            { es: "Información correspondiente únicamente al departamento Pyrénées-Atlantiques", 
            fr: "Informations concernant uniquement le département des Pyrénées-Atlantiques", 
            fuente: "Tourisme 64" },

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
            {fuente: "IGN España - France"}
    };

    ['mercados','escuelas','otros','productos','oficinas-turismo','restaurantes','hoteles', 'campings', 'albergues', 'refugios', 'fortalezas','monumentos','monumentos-religiosos','restos-arqueologicos', 'balnearios', 'museos', 'arboles', 'miradores', 'glaciares', 'zonasbano', 'piscinas', 'productores', 'comercios'].forEach(tipo => {
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
    div.innerHTML = html;
}

map.on('overlayadd overlayremove', actualizarLeyenda);

// ================= INICIALIZACIÓN =================
async function initMap(){
    await cargarLimites();
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
        cargarGeoJSON('data/equipamiento/balnearios_Huesca.geojson', balneariosCluster, balneariosMarkers, balneariosIcon, popupSoloNombre),
        cargarGeoJSON('data/equipamiento/museos.geojson', museosCluster, museosMarkers, museosIcon, popupSoloNombre),
        cargarGeoJSON('data/turismo_natural/arboles_emblematicos_huesca.geojson', arbolesCluster, arbolesMarkers, arbolesIcon, popupSoloNombre),
        cargarGeoJSON('data/turismo_natural/miradores.geojson', miradoresCluster, miradoresMarkers, miradoresIcon, popupSoloNombre),
        cargarGeoJSON('data/turismo_natural/glaciares_Huesca.geojson', glaciaresClusters, glaciaresMarkers, glaciaresIcon, popupSoloNombre),
        cargarGeoJSON('data/turismo_natural/zonas_bano_Huesca.geojson', zonasBanosClusters, zonasBanosMarkers, zonaBanoIcon, popupSoloNombre),
        cargarGeoJSON('data/equipamiento/piscinas.geojson', piscinasClusters, piscinasMarkers, piscinasIcon, updatePopupPiscinas),
        cargarGeoJSON('data/productores/productores_64.geojson', productoresClusters, productoresMarkers, productorIcon, updatePopupProductores),
        cargarGeoJSON('data/productores/comercios_64.geojson', comerciosClusters, comerciosMarkers, comerciosIcon, updatePopupComercios),
        cargarGeoJSON('data/productos_agro.geojson', productosAgroCluster, productosMarkers, null, updatePopupProductosAgro) // productos agroalimentarios: icono se decide en pointToLayer
    ]);
    map.fitBounds(limitesLayer.getBounds());
    actualizarLeyenda();
    initAcordeonFiltros();
    actualizarFiltrosAcordeon();  
    actualizarLeyenda();
}
initMap();