// ================= MAPA =================
var map = L.map("contenedor-mapa").setView([42.8486, -0.3145], 9);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

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
const turismoIcon = L.icon({
    iconUrl: 'icons/turismo.svg', // añade el icono que quieras
    iconSize: [32,32],
    iconAnchor: [16,32],
    popupAnchor: [0,-32]
});

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

// ================= CLUSTERS =================
const mercadosCluster = L.markerClusterGroup({
    iconCreateFunction: cluster => {
        const count = cluster.getChildCount();
        return L.divIcon({
            html:`<div class="cluster-icon"><img src="icons/market.svg"/><div class="cluster-count">${count}</div></div>`,
            className:'custom-cluster', iconSize:[40,40]
        });
    }
});

const escuelasCluster = L.markerClusterGroup({
    iconCreateFunction: cluster => {
        const count = cluster.getChildCount();
        return L.divIcon({
            html:`<div class="cluster-icon"><img src="icons/escuelas_formacion.svg"/><div class="cluster-count">${count}</div></div>`,
            className:'custom-cluster', iconSize:[40,40]
        });
    }
});

const centrosCluster = L.markerClusterGroup({
    iconCreateFunction: cluster => {
        const count = cluster.getChildCount();
        return L.divIcon({
            html:`<div class="cluster-icon"><img src="icons/escuelas_formacion.svg"/><div class="cluster-count">${count}</div></div>`,
            className:'custom-cluster', iconSize:[40,40]
        });
    }
});

const otrosCentrosCluster = L.markerClusterGroup({
    iconCreateFunction: cluster => {
        const count = cluster.getChildCount();
        return L.divIcon({
            html:`<div class="cluster-icon"><img src="icons/otros_centros.svg"/><div class="cluster-count">${count}</div></div>`,
            className:'custom-cluster', iconSize:[40,40]
        });
    }
});

const productosAgroCluster = L.markerClusterGroup({
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
            className: 'custom-cluster', iconSize: [40, 40]
        });
    }
});

const turismoCluster = L.markerClusterGroup({
    iconCreateFunction: cluster => {
        const count = cluster.getChildCount();
        return L.divIcon({
            html:`<div class="cluster-icon"><img src="icons/turismo.svg"/><div class="cluster-count">${count}</div></div>`,
            className:'custom-cluster', iconSize:[40,40]
        });
    }
});

// ================= CARGA GEOJSON =================
async function cargarLimites(){
    try{
        const data = await (await fetch('data/limites.geojson')).json();
        limitesLayer = L.geoJSON(data, { style:{ color:"#333", weight:4, opacity:1 }}).addTo(map);
        map.fitBounds(limitesLayer.getBounds());
    }catch(e){console.error(e);}
}

async function cargarMercados(){
    try{
        const data = await (await fetch('data/mercados_aect.geojson')).json();
        L.geoJSON(data,{
            pointToLayer:(feature, latlng)=>{
                const marker = L.marker(latlng,{icon:marketIconMercados});
                markers.push({marker, props:feature.properties});
                mercadosCluster.addLayer(marker);
                return marker;
            },
            onEachFeature:(feature, layer)=>updatePopupMercados(layer, feature.properties)
        });
        // NO agregar al mapa por defecto
    }catch(e){console.error(e);}
}

async function cargarEscuelas(){
    try{
        const data = await (await fetch('data/escuelas_formacion.geojson')).json();
        L.geoJSON(data,{
            pointToLayer:(feature,latlng)=>{
                const marker = L.marker(latlng,{icon:marketIconEscuelas});
                centrosCluster.addLayer(marker);
                markersCentros.push({marker, props:feature.properties});
                return marker;
            },
            onEachFeature:(feature, layer)=>updatePopupEscuelas(layer, feature.properties)
        });
        // NO agregar al mapa por defecto
    }catch(e){console.error(e);}
}

async function cargarOtrosCentros(){
    try{
        const data = await (await fetch('data/otros_centros.geojson')).json();
        L.geoJSON(data,{
            pointToLayer:(feature, latlng)=>{
                const marker = L.marker(latlng,{icon:marketIconOtrosCentros});
                otrosCentrosCluster.addLayer(marker);
                return marker;
            },
            onEachFeature:(feature, layer)=>{
                const nombre = feature.properties.Name || 'Sin nombre';
                layer.bindPopup(`<div class="popup-mercados"><h3>${nombre}</h3></div>`);
            }
        });
        // NO agregar al mapa por defecto
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

async function cargarOficinasTurismo(){
    try{
        const data = await (await fetch('data/oficinas_turismo.geojson')).json();
        L.geoJSON(data,{
            pointToLayer:(feature, latlng)=>{
                const marker = L.marker(latlng, {icon: turismoIcon});
                turismoCluster.addLayer(marker);
                turismoMarkers.push({marker, props: feature.properties});
                return marker;
            },
            onEachFeature:(feature, layer)=>updatePopupOficinasTurismo(layer, feature.properties)
        });
        // NO agregar al mapa por defecto
    }catch(e){ console.error(e); }
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

                <button class="toggle-filtros" data-capa="productos">PRODUCTOS AGROALIMENTARIOS</button>
                <div class="contenedor-filtros" data-capa="productos" style="display:none;">
                    <label>Tipo de producto/Type de produit:</label>
                    <select id="filtro-tipo-producto"><option value="">Todos/Tous</option></select>
                    <label>Comercialización/Commercialisation:</label>
                    <select id="filtro-comercializacion-producto"><option value="">Todos/Tous</option></select>
                    <label>Temporada/Saison:</label>
                    <select id="filtro-temporada-producto"><option value="">Todos/Tous</option></select>
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

        const contenedor = btn.nextElementSibling;

        if(capaActiva){
            btn.style.display = 'block';        // Mostrar botón
            contenedor.style.display = 'none';  // Oculto hasta hacer click
            // Inicializar filtros si no tienen opciones (para no duplicar)
            if(capa === 'mercados' && document.getElementById('filtro-tipo-mercado').options.length <= 1) initFilters();
            else if(capa === 'escuelas' && document.getElementById('filtro-tipo-centro').options.length <= 1) initFiltersCentros();
            else if(capa === 'productos' && document.getElementById('filtro-tipo-producto').options.length <= 1) initFiltersProductosAgro();
        } else {
            btn.style.display = 'none';        // Ocultar botón
            contenedor.style.display = 'none';  // Ocultar contenedor
        }
    });
}



// Modificar los eventos de checkboxes para llamar a actualizarFiltrosAcordeon()
['mercados','escuelas','otros','productos'].forEach(tipo=>{
    const checkbox = document.getElementById('cb-'+tipo);
    if(checkbox){
        checkbox.addEventListener('change', e=>{
            const capaMap = {'mercados':mercadosCluster,'escuelas':centrosCluster,'otros':otrosCentrosCluster,'productos':productosAgroCluster};
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
            <h3> Mercados y escuelas/Marchés et écoles</h3>
            <div class="sidebar-checkboxes">
                <label><input type="checkbox" id="cb-mercados"> <img src="icons/market.svg" width="20"> Mercados</label>
                <label><input type="checkbox" id="cb-escuelas"> <img src="icons/escuelas_formacion.svg" width="20"> Escuelas</label>
                <label><input type="checkbox" id="cb-otros"> <img src="icons/otros_centros.svg" width="20"> Otros Centros</label>
            </div>
            <h3> Productos Agroalimentarios/<br>Produits Agroalimentaires </h3>
            <div class= "sidebar-checkboxes">
                <label><input type="checkbox" id="cb-productos"> <img src="icons/bulbos.svg" width="20"> Productos Agro</label>
            </div>
        `
    });

    sidebar.addPanel({
        id:'turismo',
        tab:'<i class="fas fa-map-marker-alt"></i>',
        title:"Turismo/Tourisme",
        pane:`
            <h3> Oficinas de Turismo / Bureaux de Tourisme </h3>
            <div class="sidebar-checkboxes">
                <label><input type="checkbox" id="cb-oficinas-turismo"> <img src="icons/turismo.svg" width="20"> Oficinas Turismo</label>
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
            <h3>Contacto / Contact</h3>
            <p>Si observa algún error en la información presente en el GEOPORTAL, por favor, póngase en contacto con nosotros a través del siguiente correo electrónico:</p>
            <p>Si vous constatez une erreur dans les informations présentées sur le GEOPORTAIL, veuillez nous contacter à l'adresse e-mail suivante :</p>
            <h3><b>Email:</b> stage@pirineos-pyrenees.eu</h3>
        `
    });

    sidebar.open('home');

    // ================= SINCRONIZAR CHECKBOXES =================
    function sincronizarCheckboxes(){
        document.getElementById('cb-mercados').checked = map.hasLayer(mercadosCluster);
        document.getElementById('cb-escuelas').checked = map.hasLayer(centrosCluster);
        document.getElementById('cb-otros').checked = map.hasLayer(otrosCentrosCluster);
        document.getElementById('cb-productos').checked = map.hasLayer(productosAgroCluster);
        document.getElementById('cb-oficinas-turismo').checked = map.hasLayer(turismoCluster);
    }

    sincronizarCheckboxes();

    // ================= EVENTOS CHECKBOXES =================
  const capasMap = {
        'mercados': mercadosCluster,
        'escuelas': centrosCluster,
        'otros': otrosCentrosCluster,
        'productos': productosAgroCluster,
        'oficinas-turismo': turismoCluster
    };

    ['mercados','escuelas','otros','productos','oficinas-turismo'].forEach(tipo=>{
        const checkbox = document.getElementById('cb-'+tipo);
        if(checkbox){
            checkbox.addEventListener('change', e=>{
                if(e.target.checked) map.addLayer(capasMap[tipo]);
                else map.removeLayer(capasMap[tipo]);
                actualizarLeyenda();
                actualizarFiltrosAcordeon();
            });
        }
    });

});

// ================= ESCALA =================
L.control.scale({ position:'bottomleft', metric:true, imperial:false, maxWidth:120 }).addTo(map);

// ================= LEYENDA =================
const leyenda = L.control({position:'bottomright'});
leyenda.onAdd = map=>{
    const div = L.DomUtil.create('div','leyenda');
    div.innerHTML = `<h3>Leyenda</h3>`;
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
    if(map.hasLayer(limitesLayer)) html+=`<span style="display:inline-block;width:18px;height:3px;background:#333;margin-right:5px;"></span> Limites AECT<br>`;
    if(map.hasLayer(turismoCluster)) html+=`<img src="icons/turismo.svg" width="18"> Oficinas de Turismo / Bureaux de Tourisme<br>`;

    div.innerHTML = html;
}

map.on('overlayadd overlayremove', actualizarLeyenda);

// ================= INICIALIZACIÓN =================
async function initMap(){
    await cargarLimites();         // solo esta capa visible al inicio
    await cargarMercados();
    await cargarEscuelas();
    await cargarOtrosCentros();
    await cargarProductosAgro();
    await cargarOficinasTurismo(); 

    // Inicia filtros y acordeón
    initFilters();             
    initFiltersCentros();      
    initFiltersProductosAgro();
    initAcordeonFiltros();
    actualizarFiltrosAcordeon();  
    actualizarLeyenda();
}
initMap();