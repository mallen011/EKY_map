//html elements//


//counties functions for hover abilities//
var counties;
  function highlightFeature(e){
    var layer = e.target;
    layer.setStyle({
      fillColor: "#e0e0eb",
      weight: 2,
      color: "#143887",
      dashArray: '1',
//     fillOpacity: .3
   }
 );
   if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
  }
}

  function resetHighlight(e){
    counties.resetStyle(e.target);
  }

  function zoomToFeature(e){
    map.fitBounds(e.target.getBounds());
  }

  function countiesonEachFeature(feature, layer){
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    }
  );
  }

//map deets//
var map = L.map('map', {
  center: [37.589378, -84.383000],
  zoom: 8.2,
  minZoom: 8.25,
  maxZoom: 18,
  zoomDelta: 0.25,
  zoomSnap: 0,
  attributionControl: true,
//  layers: [grocery, farmer, GeoportailFrance_orthos]
});


//basemap//
var france = L.tileLayer('https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER=ORTHOIMAGERY.ORTHOPHOTOS&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}', {
	attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
	bounds: [[-75, -180], [81, 180]],
	minZoom: 2,
	maxZoom: 10,
	apikey: 'choisirgeoportail',
	format: 'image/jpeg',
	style: 'normal',
  opacity: .6
}).addTo(map);

//scale//
L.control.scale({position: "bottomright"}).addTo(map);

//**geoJSONs**//

//counties//
function melissastylez(feature) {
    return {
        fillColor: "#e0e0eb",
        weight: .5,
        color: "#143887",
        dashArray: '1',
 //      fillOpacity: .3
      }
    };

var counties = L.geoJson(countiesJSON,
  {
    style: melissastylez,
    onEachFeature: countiesonEachFeature
  }
).addTo(map);
  map.fitBounds(counties.getBounds());

//GROCERY STORES//
var gs_icon = new L.Icon(
  {iconUrl: "C:/Users/Clown Baby/Desktop/GIS/grocery blue.svg",
   iconSize: [40, 40]
  });

function pop (feature, layer) {
  layer.bindPopup(
    "Name: " + feature.properties.name + "" + "</p>"
  + "Address: " + feature.properties.address + "" + "</p>"
  + "Phone number: " + feature.properties.phone_numb + "" + "</p>"
  + "Snap/EBT benefits?: " + feature.properties.snap_ebt_b + "" + "</p>"
  + "Senior vouchers?: " + feature.properties.senior_vou + "" + "</p>"
  + "WIC benefits?: " + feature.properties.wic_yes_no + "" + "</p>"
  + "Additional notes: " + feature.properties.additional + "" + "</p>"
);
  layer.setIcon(gs_icon)
};

var grocery = L.geoJson(gsJSON, {
  onEachFeature: pop
});

//FARMERS MARKETS//
var fm_icon = new L.Icon(
  {iconUrl: "C:/Users/Clown Baby/Desktop/GIS/farmers green.svg",
   iconSize: [40, 40]});

function pop2 (feature, layer) {
  layer.bindPopup(
    "Name: " + feature.properties.name + "" + "<p>"
   + "Farmers market or produce stall?: " + feature.properties.farmers_ma + "" + "<p>"
   + "Address: " + feature.properties.address + "" + "<p>"
   + "Phone number: " + feature.properties.phone_numb + "" + "<p>"
   + "Snap benefits?: " + feature.properties.snap_benef + "" + "<p>"
   + "Senior vouchers?: " + feature.properties.senior_vou + "" + "<p>"
   + "WIC benefits?: " + feature.properties.wic_yes_no + "" + "<p>"
   + "Additional notes: " + feature.properties.additional + "" + "<p>"
);
  layer.setIcon(fm_icon)
};

var farmer = L.geoJson(fmJSON, {
  onEachFeature: pop2
});

//recycling centers//
//style icons by atts//
function iconByMats(feature){
  var calculatedSize = (feature.properties.num_mat / 13) * 40;

  // create icons
  return L.icon({
    iconUrl: "C:/Users/Clown Baby/Desktop/GIS/noun_recycling center_368073.svg",
    iconSize: [calculatedSize, calculatedSize]
  });
}


var recycle = L.geoJSON(recycle1,  {
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, {icon: iconByMats(feature)});
  }
});

//var recycle_icon = new L.Icon(
//  {iconUrl: "C:/Users/Clown Baby/Desktop/GIS/arrow.svg",
//   iconSize: [40, 40]});

//function pop3 (feature, layer) {
//  layer.bindPopup(
//    "Name: " + feature.properties.name + "" + "<p>"
//   + "Address: " + feature.properties.Address + "" + "<p>"
//   + "Type of facility: " + feature.properties.type + "" + "<p>"
//   + "Services: " + feature.properties.Function + "" + "<p>"
//   + "Contact: " + feature.properties.Contact + "" + "<p>"
//   + "Phone number: " + feature.properties.phone + "" + "<p>"
//   + "Area served: " + feature.properties.serves + "" + "<p>"
//   + "Additional notes: " + feature.properties.additional + "" + "<p>"
//   + "Website: " + feature.properties.website + ""
//);
//  layer.setIcon(recycle_icon)
//};

//var recycle = L.geoJson(recycle1, {
//  onEachFeature: pop3
//});

//Search filter control for counties//
var poiLayers = L.layerGroup([counties]).addTo(map);

var searchControl = new L.Control.Search({
    container: 'findbox',
		layer: poiLayers,
		propertyName: 'cntyname',
		marker: false,
		moveToLocation: function(latlng, title, map) {
			//map.fitBounds( latlng.layer.getBounds() );
			var zoom = map.getBoundsZoom(latlng.layer.getBounds());
  			map.setView(latlng, zoom); // access the zoom
		}
	});

	searchControl.on('search:locationfound', function(e) {
		e.layer.setStyle({fillColor: '#3f0', color: '#0f0'});
		if(e.layer._popup)
			e.layer.openPopup();
	}).on('search:collapsed', function(e) {

		poiLayers.eachLayer(function(layer) {	//restore feature color
			poiLayers.resetStyle(layer);
		});
	});

	map.addControl( searchControl );  //inizialize search control


//roads//

//L.tileLayer.wms("http://localhost:8080/geoserver/wms", {
//    layers: 'web_map:1111ekygspoly',
//    format: 'image/png',
//    transparent: true
//}).addTo(map);

//L.tileLayer.wms("http://localhost:8080/geoserver/wms", {
//    layers: 'web_map:1eky_fmpoly',
//    format: 'image/png',
//    transparent: true
//}).addTo(map);

//L.tileLayer.wms("http://localhost:8080/geoserver/wms", {
//    layers: 'web_map:1ekypopulation',
//    format: 'image/png',
//    transparent: true
//}).addTo(map);

var roads = L.tileLayer.wms("http://localhost:8080/geoserver/wms", {
    layers: 'web_map:1eky_roads',
    format: 'image/png',
    transparent: true
}).addTo(map);

var baseMaps = {
    "France Geoportal": france,
};

var overlayMaps = {
"Roads": roads,
"<div id='my-div-id'><img src='C:/Users/Clown Baby/Desktop/GIS/grocery blue.svg' style= 'width: 42px; height: 42px'/>Grocery stores</div>": grocery,
"<div id='my-div-id'><img src='C:/Users/Clown Baby/Desktop/GIS/farmers green.svg' style= 'width: 42px; height: 42px'/>Farmers markets and produce stalls</div>": farmer,
"<div id='my-div-id'><img src='C:/Users/Clown Baby/Desktop/GIS/noun_recycling center_368073.svg' style= 'width: 42px; height: 42px'/>  Recycling centers</div>": recycle,
};

L.control.layers(baseMaps, overlayMaps, {
  collapsed: false
}).addTo(map);
