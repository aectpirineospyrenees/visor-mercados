// ================= MAPA =================
var map = L.map("contenedor-mapa").setView([42.8486, -0.3145], 9);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '&copy; OpenStreetMap contributors' }).addTo(map);

// ================= ICONOS =================
const marketIconMercados = L.icon({ iconUrl: 'icons/market.svg', iconSize:[32,32], iconAnchor:[16,32], popupAnchor:[0,-32] });
const marketIconEscuelas = L.icon({ iconUrl: 'icons/escuelas_formacion.svg', iconSize:[32,32], iconAnchor:[16,32], popupAnchor:[0,-32] });
const marketIconOtrosCentros = L.icon({ iconUrl: 'icons/otros_centros.svg', iconSize:[32,32], iconAnchor:[16,32], popupAnchor:[0,-32] });
const iconsProductosAgro = {
    "Bulbos, rizomas y similares": L.icon({ iconUrl: 'icons/bulbos.svg', iconSize:[32,32], iconAnchor:[16,32], popupAnchor:[0,-32] }),
    "Cereales": L.icon({ iconUrl: 'icons/cereales.svg', iconSize:[32,32], iconAnchor:[16,32], popupAnchor:[0,-32] }),
    "Frutas y hortalizas de fruto": L.icon({ iconUrl: 'icons/frutas.svg', iconSize:[32,32], iconAnchor:[16,32], popupAnchor:[0,-32] }),
    "Hortalizas de hoja y tallo": L.icon({ iconUrl: 'icons/hortalizas.svg', iconSize:[32,32], iconAnchor:[16,32], popupAnchor:[0,-32] }),
    "Legumbres": L.icon({ iconUrl: 'icons/legumbres.svg', iconSize:[32,32], iconAnchor:[16,32], popupAnchor:[0,-32] }),
    "Raices y tubérculos": L.icon({ iconUrl: 'icons/tuberculos.svg', iconSize:[32,32], iconAnchor:[16,32], popupAnchor:[0,-32] })
};

// Fallback seguro (usa un icono existente de tu set)
const DEFAULT_ICON_AGRO = iconsProductosAgro["Legumbres"] || marketIconMercados;

// Normaliza texto: quita tildes, pasa a minúsculas, recorta
function normalizaTexto(s){
    return (s || "").toString()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .toLowerCase().trim();
}

// Mapa de alias -> clave canónica de iconsProductosAgro
const aliasTipoProducto = {
    "bulbos, rizomas y similares": "Bulbos, rizomas y similares",
    "cereales": "Cereales",
    "frutas y hortalizas de fruto": "Frutas y hortalizas de fruto",
    "hortalizas de hoja y tallo": "Hortalizas de hoja y tallo",
    "legumbres": "Legumbres",
    "raices y tuberculos": "Raices y tubérculos", // sin tildes
    "raíces y tubérculos": "Raices y tubérculos"  // con tildes
};

function getIconoProductoAgro(tipo){
    const keyNorm = normalizaTexto(tipo);
    const canonica = aliasTipoProducto[keyNorm];
    const icono = canonica ? iconsProductosAgro[canonica] : null;
    return icono || DEFAULT_ICON_AGRO; // siempre devolvemos un L.icon válido
}

// ================= VARIABLES =================
let limitesLayer;
let markers = [];
let markersCentros = [];
let productosMarkers = [];
let mercadosLayer, escuelasLayer, centrosLayer, otrosCentrosLayer, productosAgroLayer;
const ordenDias = ["Lunes/Lundi","Martes/Mardi","Miércoles/Mercredi","Jueves/Jeudi","Viernes/Vendredi","Sábado/Samedi","Domingo/Dimanche"];
const ordenSemanas = ["Primera semana del mes/Première semaine du mois","Segunda semana del mes/Deuxième semaine du mois","Tercera semana del mes/Troisième semaine du mois","Cuarta semana del mes/Quatrième semaine du mois","Todas las semanas/Toutes les semaines"];

function ordenarSegunLista(array, listaReferencia) {
    return array.sort((a,b)=>{ let iA = listaReferencia.indexOf(a); let iB = listaReferencia.indexOf(b); if(iA===-1)iA=array.length; if(iB===-1)iB=array.length; return iA-iB; });
}

// ================= CLUSTERS =================
const mercadosCluster = L.markerClusterGroup({
    iconCreateFunction: cluster => {
        const count = cluster.getChildCount();
        return L.divIcon({ html:`<div class="cluster-icon"><img src="icons/market.svg"/><div class="cluster-count">${count}</div></div>`, className:'custom-cluster', iconSize:[40,40] });
    }
});
const escuelasCluster = L.markerClusterGroup({
    iconCreateFunction: cluster => {
        const count = cluster.getChildCount();
        return L.divIcon({ html:`<div class="cluster-icon"><img src="icons/escuelas_formacion.svg"/><div class="cluster-count">${count}</div></div>`, className:'custom-cluster', iconSize:[40,40] });
    }
});
const centrosCluster = L.markerClusterGroup({
    iconCreateFunction: cluster => {
        const count = cluster.getChildCount();
        return L.divIcon({ html:`<div class="cluster-icon"><img src="icons/escuelas_formacion.svg"/><div class="cluster-count">${count}</div></div>`, className:'custom-cluster', iconSize:[40,40] });
    }
});

const otrosCentrosCluster = L.markerClusterGroup({
    iconCreateFunction: cluster => {
        const count = cluster.getChildCount();
        return L.divIcon({ html:`<div class="cluster-icon"><img src="icons/otros_centros.svg"/><div class="cluster-count">${count}</div></div>`, className:'custom-cluster', iconSize:[40,40] });
    }
});


const productosAgroCluster = L.markerClusterGroup({
    iconCreateFunction: cluster => {
        const count = cluster.getChildCount();
        return L.divIcon({
            html: `
                <div style="
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
                ">
                    ${count}
                </div>
            `,
            className: 'custom-cluster',
            iconSize: [40, 40]
        });
    }
});


// ================= CARGA GEOJSON =================
async function cargarLimites() {
    try { const data = await (await fetch('data/limites.geojson')).json();
        limitesLayer = L.geoJSON(data, { style:{ color:"#333", weight:4, opacity:1 }}).addTo(map);
        map.fitBounds(limitesLayer.getBounds());
    } catch(e){console.error(e);}
}

async function cargarMercados() {
    try { const data = await (await fetch('data/mercados_aect.geojson')).json();
        mercadosLayer = L.geoJSON(data, {
            pointToLayer: (feature, latlng)=>{
                const marker = L.marker(latlng,{icon:marketIconMercados});
                markers.push({marker, props:feature.properties});
                mercadosCluster.addLayer(marker);
                return marker;
            },
            onEachFeature:(feature, layer)=>updatePopupMercados(layer, feature.properties)
        });
        map.addLayer(mercadosCluster);
    } catch(e){console.error(e);}
}

async function cargarEscuelas() {
    try { const data = await (await fetch('data/escuelas_formacion.geojson')).json();
        escuelasLayer = L.geoJSON(data, {
            pointToLayer:(feature, latlng)=>{
                const marker = L.marker(latlng,{icon:marketIconEscuelas});
                escuelasCluster.addLayer(marker);
                return marker;
            },
            onEachFeature:(feature, layer)=>updatePopupEscuelas(layer, feature.properties)
        });
        map.addLayer(escuelasCluster);
    } catch(e){console.error(e);}
}

async function cargarOtrosCentros() {
    try {
        const data = await (await fetch('data/otros_centros.geojson')).json();
        otrosCentrosLayer = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
                const marker = L.marker(latlng, { icon: marketIconOtrosCentros });
                otrosCentrosCluster.addLayer(marker);
                return marker;
            },
            onEachFeature: (feature, layer) => {
                const nombre = feature.properties.Name || 'Sin nombre';
                layer.bindPopup(`<div class="popup-mercados"><h3>${nombre}</h3></div>`, { className: 'popup-mercados', minWidth: 250, maxWidth: 400 });
            }
        });
        map.addLayer(otrosCentrosCluster);
    } catch(e) { console.error(e); }
}

async function cargarProductosAgro() {
    try {
        const data = await (await fetch('data/productos_agro.geojson')).json();
        productosAgroLayer = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
                const tipo = feature?.properties?.tipo_producto;
                const icono = getIconoProductoAgro(tipo);
                // ¡Ojo! Si pasas icon: undefined se rompe Leaflet; por eso siempre pasamos un icono válido.
                const marker = L.marker(latlng, { icon: icono });
                productosMarkers.push({ marker, props: feature.properties }); // 👈 añadir esto
                productosAgroCluster.addLayer(marker);
                return marker;
            },
            onEachFeature: (feature, layer) => {
                updatePopupProductosAgro(layer, feature.properties || {});
            }
        });
        map.addLayer(productosAgroCluster);
    } catch(e) { console.error(e); }
}


// ================= CARGA GEOJSON CENTROS =================
async function cargarCentros() {
    try {
        const data = await (await fetch('data/escuelas_formacion.geojson')).json();
        centrosLayer = L.geoJSON(data, {
            pointToLayer: (feature, latlng) => {
                const marker = L.marker(latlng, { icon: marketIconEscuelas });
                markersCentros.push({ marker, props: feature.properties });
                centrosCluster.addLayer(marker);
                return marker;
            },
            onEachFeature: (feature, layer) => updatePopupEscuelas(layer, feature.properties)
        });
        map.addLayer(centrosCluster);
    } catch (e) { console.error(e); }
}

// ================= POPUPS =================
function updatePopupMercados(layer, props){
    let html = `<div class="popup-mercados"><h3>${props.nombre||'Sin nombre'}</h3>`;
    const titles = {nombre_tipo:"Tipo/Type", nombre_frecuencia:"Frecuencia", nombre_semana:"Semana", nombre_dia:"Día", nombre_apertura:"Horario", direccion:"Dirección", horario:"Horario", num_postes:"Nº postes", municipios_communes:"Municipio", comarca:"Comarca", provincia_departement:"Provincia"};
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
        } else html+=`<div class="popup-row"><b>${titles[key]||key}:</b> <span>${props[key]}</span></div>`;
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


// ================= FILTROS =================
// FILTROS MERCADOS
function filtrarMarcadores(){
    const filtroTipo = document.getElementById('filtro-tipo-mercado').value;
    const filtroFrecuencia = document.getElementById('filtro-frecuencia').value;
    const filtroSemana = document.getElementById('filtro-semana').value;
    const filtroDia = document.getElementById('filtro-dia').value;
    const filtroApertura = document.getElementById('filtro-apertura').value;

    mercadosCluster.clearLayers();

    markers.forEach(({marker, props})=>{
        let mostrar = true;
        if(filtroTipo && props.nombre_tipo!=filtroTipo) mostrar=false;
        if(filtroFrecuencia && props.nombre_frecuencia!=filtroFrecuencia) mostrar=false;
        if(filtroSemana && props.nombre_semana!=filtroSemana) mostrar=false;
        if(filtroDia && props.nombre_dia!=filtroDia) mostrar=false;
        if(filtroApertura && props.nombre_apertura!=filtroApertura) mostrar=false;
        if(mostrar) mercadosCluster.addLayer(marker);
    });
}

function initFilters(){
    const filtroIds = ['filtro-tipo-mercado','filtro-frecuencia','filtro-semana','filtro-dia','filtro-apertura'];
    const keys = ['nombre_tipo','nombre_frecuencia','nombre_semana','nombre_dia','nombre_apertura'];

    keys.forEach((key,i)=>{
        const filtro = document.getElementById(filtroIds[i]);
        let valores = [...new Set(markers.map(m=>m.props[key]).filter(v=>v))];
        if(key==='nombre_dia') valores = ordenarSegunLista(valores, ordenDias);
        if(key==='nombre_semana') valores = ordenarSegunLista(valores, ordenSemanas);
        if(key!=='nombre_dia' && key!=='nombre_semana') valores.sort();
        valores.forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent=v; filtro.appendChild(o); });
    });
    filtroIds.forEach(id=>document.getElementById(id).addEventListener('change', filtrarMarcadores));
}

// FILTROS CENTROS FORMACIÓN
function filtrarCentros() {
    const filtroTipoCentro = document.getElementById('filtro-tipo-centro').value;
    const filtroTipoOferta = document.getElementById('filtro-tipo-oferta').value;

    centrosCluster.clearLayers();

    markersCentros.forEach(({ marker, props }) => {
        let mostrar = true;

        if (filtroTipoCentro && props.nombre_tipo_centro != filtroTipoCentro) mostrar = false;

        if (filtroTipoOferta) {
            if (!props.tipo_oferta || !props.tipo_oferta.some(oferta => oferta === filtroTipoOferta)) mostrar = false;
        }

        if (mostrar) centrosCluster.addLayer(marker);
    });
}

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

        valores = [...new Set(valores)];
        valores.sort();

        valores.forEach(v=>{ const o=document.createElement('option'); o.value=v; o.textContent=v; filtro.appendChild(o); });
    });

    filtroIds.forEach(id => document.getElementById(id).addEventListener('change', filtrarCentros));
}

// FILTRAR PRODUCTOS AGROALIMENTARIOS

function filtrarProductosAgro() {
    const filtroTipo = document.getElementById('filtro-tipo-producto').value;
    const filtroComercializacion = document.getElementById('filtro-comercializacion-producto').value;
    const filtroTemporada = document.getElementById('filtro-temporada-producto').value;

    productosAgroCluster.clearLayers();

    productosMarkers.forEach(({ marker, props }) => {
        let mostrar = true;

        // Tipo producto
        if (filtroTipo && props.tipo_producto !== filtroTipo) mostrar = false;

        // Comercialización
        if (filtroComercializacion && props.comercializacion !== filtroComercializacion) mostrar = false;

        // Temporada (puede ser array o string separado por comas)
        if (filtroTemporada) {
            let meses = [];
            if (Array.isArray(props.meses_temporada)) {
                meses = props.meses_temporada;
            } else if (typeof props.meses_temporada === "string") {
                meses = props.meses_temporada.split(",").map(m => m.trim());
            }

            // mostrar si al menos coincide uno
            if (!meses.some(m => normalizaTexto(m) === normalizaTexto(filtroTemporada))) {
                mostrar = false;
            }
        }

        if (mostrar) productosAgroCluster.addLayer(marker);
    });
}

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

        // Normalizar, quitar espacios, valores únicos
        valores = [...new Set(valores.map(v => v.trim()))];

        // Ordenar si es temporada
        if (key === 'meses_temporada') {
            valores.sort((a,b)=>{
                const aNorm = normalizaTexto(a);
                const bNorm = normalizaTexto(b);
                return ordenMeses.indexOf(aNorm) - ordenMeses.indexOf(bNorm);
            });
        } else {
            valores.sort();
        }

        // Crear opciones del select
        valores.forEach(v => {
            const o = document.createElement('option');
            o.value = v;
            o.textContent = v;
            filtro.appendChild(o);
        });
    });

    filtroIds.forEach(id => document.getElementById(id).addEventListener('change', filtrarProductosAgro));
}


// ================= INICIALIZACIÓN =================
async function initMap(){
    await cargarLimites();
    await cargarMercados();
    await cargarEscuelas();
    await cargarCentros();
    await cargarOtrosCentros();
    await cargarProductosAgro();
    initFilters();
    initFiltersCentros();
    initFiltersProductosAgro();

    const basemaps = { "Open Street Map": osm };
    const overlayMaps = { 
        "Mercados AECT/Marchés GECT": mercadosCluster, 
        "Escuelas de Formación/Écoles de formation": centrosCluster,
        "Otros Centros de Interés/Autres centres d'intérêt": otrosCentrosCluster,
        "Productos Agroalimentarios/Produits agroalimentaires": productosAgroCluster,
        "Límites AECT/Limites GECT": limitesLayer
    };
    L.control.layers(basemaps, overlayMaps).addTo(map);
    L.control.scale({
        position: 'bottomleft',   // puedes poner 'bottomright', 'topleft', etc.
        metric: true,             // muestra metros/kilómetros
        imperial: false,          // desactiva millas/yardas si quieres solo métrico
        maxWidth: 120             // ancho máximo en píxeles
    }).addTo(map);
    actualizarLeyenda()
}
initMap();

// ================= LEYENDA DINÁMICA =================
const leyenda = L.control({ position: 'bottomright' });

leyenda.onAdd = map => {
    const div = L.DomUtil.create('div', 'leyenda');
    div.innerHTML = `<h3>Leyenda</h3>`;
    return div;
};

leyenda.addTo(map);

// Función para actualizar la leyenda según capas visibles
const etiquetasProductos = {
    "Bulbos, rizomas y similares": "Bulbos, rizomas y similares / Bulbes, rhizomes et similaires",
    "Cereales": "Maiz y Cereal / Maïs et céréales",
    "Frutas y hortalizas de fruto": "Frutas y hortalizas de fruto / Fruits et legumes-fruits",
    "Hortalizas de hoja y tallo": "Hortalizas de hoja y tallo / Légumes-feuilles-tiges",
    "Legumbres": "Legumbres / Légumes",
    "Raices y tubérculos": "Raices y tubérculos / Racines et tubercules"
};
function actualizarLeyenda() {
    const div = document.querySelector('.leyenda');
    if (!div) return;
    
    let html = `<h3>LEYENDA / LÉGENDE</h3>`;

    // Mercados
    if (typeof mercadosCluster !== 'undefined' && map.hasLayer(mercadosCluster)) {
        html += `<img src="icons/market.svg" width="18" height="18"> Mercados / Marchés<br>`;
    }

    // Escuelas / Centros de Formación
    if (typeof centrosCluster !== 'undefined' && map.hasLayer(centrosCluster)) {
        html += `<img src="icons/escuelas_formacion.svg" width="18" height="18"> Escuelas / Écoles<br>`;
    }

    // Otros Centros
    if (typeof otrosCentrosCluster !== 'undefined' && map.hasLayer(otrosCentrosCluster)) {
        html += `<img src="icons/otros_centros.svg" width="18" height="18"> Otros centros de interés / Autres centres d'intérêt<br>`;
    }

    // Productos Agro
    if (typeof productosAgroCluster !== 'undefined' && map.hasLayer(productosAgroCluster)) {
       html += `<div style="margin-top:8px; font-weight:bold;">Productos Agroalimentarios / Produits agroalimentaires:</div>`; // espacio arriba
        for (let tipo in iconsProductosAgro) {
            const etiqueta = etiquetasProductos[tipo] || tipo; // usa etiqueta personalizada si existe
            html += `<img src="${iconsProductosAgro[tipo].options.iconUrl}" width="18" height="18"> ${etiqueta}<br>`;
        }
    }

    // Límites
    if (typeof limitesLayer !== 'undefined' && map.hasLayer(limitesLayer)) {
        html += `<div style="margin-top:8px; font-weight:bold;">Limites territoriales/Limites du territoire:</div>`; // espacio arriba
        html += `<span style="display:inline-block;width:18px;height:3px;background:#333;margin-right:5px;"></span> Territorio de la AECT / Territoire du GECT<br>`;
    }

    div.innerHTML = html;
}

// Actualiza la leyenda al activar o desactivar capas
map.on('overlayadd overlayremove', actualizarLeyenda);
