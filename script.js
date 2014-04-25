var map = L.mapbox.map('map', 'djohnson.map-4vq3wnwk', {minZoom: 6, maxZoom: 15})
	.setView([41.85, -87.8], 10);

var oldTractsGeo,
	newTractsGeo,
	oldTracts,
	newTracts,
	changedTracts,
	closeTooltip,
	colors = ['#FEA','#97B6C1','#8C9AC1','#E2FFD7','#8A9BCC','#B27667'],
	layerGroup = L.layerGroup(),
	newLayer,
	popup = new L.Popup({ autoPan: false }),
	layers = [],
	sigChanges = [];
// Get 2000 tract data
$.ajax({
	url: 'data/json/2000.json',
	dataType: 'json',
	success: function (json) {
		oldTracts = json;
	}
});
// Get 2010 tract data
$.ajax({
	url: 'data/json/2010.json',
	dataType: 'json',
	success: function (json) {
		newTracts = json;
		drawMap()
	}
});
// Get 2000 tract geo data, ready to be called on click of 2010 tracts
$.ajax({
	url: 'data/geo/il_tracts_2000.json',
	async: false,
	dataType: 'json',
	success: function (json) {
		oldTractsGeo = json;
	}
});
// 2000 tracts
$.ajax({
	url: 'data/json/changed_2010.json',
	async: false,
	dataType: 'json',
		success: function (json) {
		changedTracts = json;
	}
});
// 2010 tracts
$.ajax({
	url: 'data/geo/il_tracts.json',
	async: false,
	dataType: 'json',
	success: function (json) {
		newTractsGeo = json;
	}
});

function getStyle(feature) {
	return {
		weight: 2,
		opacity: .3,
		color: '#5A6981',
		fillOpacity: 0.0,
		fillColor: '#fff'
	};
}
function clearLayers(array){
	_.each(array, function(l, i) {
		map.removeLayer(l);
	});
	array = []
}
function hashTracts(id) {
	newData = newTracts[id];
	var IDs = _.pluck(newData, 'geoid'),
		selected,
		features = topojson.feature(oldTractsGeo, oldTractsGeo.objects.tl_2010_17_tract00).features,
		newFeatures = topojson.feature(newTractsGeo, newTractsGeo.objects.il_tracts).features;

	_.each(IDs, function(iden, i) {
		selected = _(features).findWhere({id: iden}),
		newLayer = L.geoJson(selected,  {
			style: {weight: 0,
			opacity: 1,
			color: colors[i],
			fillOpacity: .7,
			fillColor: colors[i]
			} 
		});
		layerGroup.addLayer(newLayer, true);
		// Push to layers array to clear later
		layers.push(newLayer);
		if (i == IDs.length - 1){map.addLayer(layerGroup,true)}
	});
}
function showOldTracts(e) {
	clearLayers(layers)
	window.location.hash = '#'+e.target.feature.id;
	// Uncomment below line to zoom to bounds on click
	map.fitBounds(e.target.getBounds(),{paddingBottomRight:[320,50],paddingTopRight:[200,200]});
	newData = newTracts[e.target.feature.id];
	var IDs = _.pluck(newData, 'geoid'),
		selected,
		features = topojson.feature(oldTractsGeo, oldTractsGeo.objects.tl_2010_17_tract00).features;

	_.each(IDs, function(iden, i) {
		selected = _(features).findWhere({id: iden}),
		newLayer = L.geoJson(selected,  {
			style: {weight: 0,
			opacity: 1,
			color: colors[i],
			fillOpacity: .7,
			fillColor: colors[i]
			} 
		});
		layerGroup.addLayer(newLayer, true);
		// Push to layers array to clear later
		layers.push(newLayer);
		if (i == IDs.length - 1){map.addLayer(layerGroup,true)}
	});
}
function onEachFeature(feature, layer) {
	var hash = window.location.hash.replace(/#/, '');
	if (feature.id == hash){
		map.fitBounds(layer.getBounds(),{paddingBottomRight:[320,50],paddingTopRight:[200,200]});
		hashTracts(feature.id)
	}
	layer.on({
		mousemove: mousemove,
		mouseout: mouseout,
		click: showOldTracts
	});
}
function mousemove(e) {
	var layer = e.target,
		newData = newTracts[layer.feature.id],
		rows = [],
		table;

	_.each(newData, function(x, i) {
		if (i == 0){rows.push('<tr style=background-color:'+colors[i]+';><td class="year">2000</td><td>'+ x.geoid +'</td>'+
			'<td>'+ x.poppct +'</td><td>'+ x.areapct +'</tr>')
		} else {
			rows.push('<tr style=background-color:'+colors[i]+';border-bottom:none;>'+
				'<td class="year" style=border-bottom: none;></td><td>'+ x.geoid +'</td>'+
				'<td>'+ x.poppct +'</td><td>'+ x.areapct +'</tr>')
		}
		if (i == newData.length - 1){
			createTooltip();
		}
	});
	function createTooltip() {
		var formatRows = rows.join();
			table = '<table>'+
			'<th>Year</th><th>GEOID</th><th>% Pop</th><th>% Area</th>' +
			'<tr class="two"><td class="year">2010</td><td>' +layer.feature.id + '</td><td>100</td>'+
			'<td>100</td></tr>'+ rows +'</table>';
		popup.setLatLng(e.latlng);
		popup.setContent(table);
	}


	if (!popup._map) popup.openOn(map);
	window.clearTimeout(closeTooltip);
	
	// highlight feature
	layer.setStyle({
		weight: 4,
		color: '#5A6981',
		opacity: 0.8
	});
	
	if (!L.Browser.ie && !L.Browser.opera) {
		layer.bringToFront();
		}
}
function mouseout(e) {
	layer.resetStyle(e.target);
	closeTooltip = window.setTimeout(function() {
		map.closePopup();
	}, 100);
} 
function drawAllTracts() {
	clearLayers(sigChanges)
	var topoFeatures = topojson.feature(newTractsGeo, newTractsGeo.objects.il_tracts).features;
	layer = L.geoJson(topoFeatures, {
	  style: getStyle,
	  onEachFeature: onEachFeature
	}).addTo(map);
	sigChanges.push(layer)
}
function drawSigTracts() {
	clearLayers(sigChanges)
	var topoFeatures = topojson.feature(newTractsGeo, newTractsGeo.objects.il_tracts).features;
	_.each(changedTracts, function(x, i) {
		selectedFeature = _(topoFeatures).findWhere({id: x});
		layer = L.geoJson(selectedFeature,  {
			style: getStyle,
			onEachFeature: onEachFeature
		}).addTo(map);
		sigChanges.push(layer)
	});
}

function updateMap(type){
	clearLayers(layers)
	clearLayers(sigChanges)
	if (type == 'sig'){
		drawSigTracts();
	} else {
		drawAllTracts();
	}
}

function drawMap(){
	if (window.location.hash){
		$('.switcher a').removeClass('active');
		$('.switcher a.all').addClass('active');
		drawAllTracts();
	} else {
		drawSigTracts();
	}
}

// Bring up the about panel
$('.switcher a').click(function() {
	window.location.hash = '';
	map.setView([40.4, -88], 7);
	$('.switcher a').removeClass('active');
	$(this).addClass('active');
	updateMap($(this).attr('type'))
});

// Bring up the about panel
$('.about').click(function() {
	$('#about').toggleClass('active');
});
// Reposition map on IL icon click
$('img.il').click(function() {
	map.setView([40.4, -88], 7);
});