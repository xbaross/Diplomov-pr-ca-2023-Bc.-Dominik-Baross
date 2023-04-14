var epsg5514 = 'EPSG:5514';
proj4.defs(
    epsg5514,
    "+proj=krovak +lat_0=49.5 +lon_0=24.83333333333333 +alpha=30.28813972222222 +k=0.9999 +x_0=0 +y_0=0 +ellps=bessel +towgs84=589,76,480,0,0,0,0 +units=m +no_defs +type=crs"
  );
  ol.proj.proj4.register(proj4);

var krovakProj = ol.proj.get(epsg5514);

if (!ol.proj.get(epsg5514)) {
    console.error("Failed to register projection in OpenLayers");
} else {
    console.log(krovakProj);
}


var mapView = new ol.View ({
    center: ol.proj.fromLonLat([18.3530, 47.8218], krovakProj),
    //center: [2043084.833043, 6077183.304041],
    projection: krovakProj,
    zoom: 13
});

//var mapView = new ol.View ({
//    center: ol.proj.fromLonLat([18.3530, 47.8218]),
//    zoom: 13
//});

var map = new ol.Map ({
    target: 'map',
    view: mapView,
    controls:[]
});

var osmTile = new ol.layer.Tile ({
    title: 'Open Street Map',
    type: 'base',
    visible: true,
    source: new ol.source.OSM()
});

var noneTile = new ol.layer.Tile({
    title: 'None',
    type: 'base',
    visible: false
});

/* ZBGIS */
var capabilitiesUrl = 'https://zbgisws.skgeodesy.sk/zbgis_wmts_new/service.svc/get?SERVICE=WMTS&VERSION=1.0.0&REQUEST=GetCapabilities';
var parser = new ol.format.WMTSCapabilities();

var baseGroup = new ol.layer.Group({
    title: 'Base Maps',
    fold: true,
    layers: [osmTile,noneTile,]
});

fetch(capabilitiesUrl).then(function(response) {
    return response.text();
  }).then(function(capabilitiesText) {
    //console.log(capabilitiesText);
    var capabilities = parser.read(capabilitiesText);
    //console.log(result);
    var options = ol.source.WMTS.optionsFromCapabilities(capabilities, {
      layer: 'WMS_zbgis_wmts_new',
      matrixSet: 'default028mm',
      crossOrigin: 'anonymous',
    });
    //var wmtsLayer = new ol.layer.wmtsLayer("https://zbgisws.skgeodesy.sk/zbgis_wmts_new/service.svc/get?", options);
    var zbgisTile = new ol.layer.Tile({
      title: 'ZBGIS WMTS',
      type: 'base',
      visible: true,
      source: new ol.source.WMTS(options)
    })
    baseGroup.getLayers().push(zbgisTile);
  });
  
/* ZBGIS */

map.addLayer(baseGroup);

// start : vrstvy-Širšie vzťahy

var ModranyDSTile = new ol.layer.Tile({
    title: "Hranica Modrany",
    source: new ol.source.TileWMS({
        url: 'https://www.gis.atapex.sk/geoserver/dbaross/wms',
        params: {'LAYERS':'	dbaross:hranica_md', 'TILED': true},
        serverType: 'geoserver',
        visible: true
    })
});

var SusediaDSTile = new ol.layer.Tile({
    title: "Susedné obce",
    source: new ol.source.TileWMS({
        url: 'https://www.gis.atapex.sk/geoserver/dbaross/wms',
        params: {'LAYERS':'	dbaross:sus_obc_md', 'TILED': true},
        serverType: 'geoserver',
        visible: true
    })
});

var overlayGroup = new ol.layer.Group({
    title: 'Širšie vzťahy',
    fold: true,
    layers: [SusediaDSTile,ModranyDSTile]
});

map.addLayer(overlayGroup);

// end : vrstvy-Širšie vzťahy

// start : vrstvy-Parcely

var EDSTile = new ol.layer.Tile({
    title: "E",
    source: new ol.source.TileWMS({
        url: 'https://www.gis.atapex.sk/geoserver/dbaross/wms',
        params: {'LAYERS':'	dbaross:e_parcely_md', 'TILED': true},
        serverType: 'geoserver',
        visible: true
    })
});

var CDSTile = new ol.layer.Tile({
    title: "C",
    source: new ol.source.TileWMS({
        url: 'https://www.gis.atapex.sk/geoserver/dbaross/wms',
        params: {'LAYERS':'	dbaross:c_parcely_md', 'TILED': true},
        serverType: 'geoserver',
        visible: true
    })
});

var overlayGroup = new ol.layer.Group({
    title: 'Parcely',
    fold: true,
    layers: [CDSTile,EDSTile]
});

map.addLayer(overlayGroup);

// end: vrstvy-Parcely

// start : vrstvy-Body

var StromyDSTile = new ol.layer.Tile({
    title: "Stromy",
    source: new ol.source.TileWMS({
        url: 'https://www.gis.atapex.sk/geoserver/dbaross/wms',
        params: {'LAYERS':'	dbaross:stromy_md', 'TILED': true},
        serverType: 'geoserver',
        visible: true
    })
});

var StlpyDSTile = new ol.layer.Tile({
    title: "Stĺpy",
    source: new ol.source.TileWMS({
        url: 'https://www.gis.atapex.sk/geoserver/dbaross/wms',
        params: {'LAYERS':'	dbaross:stlpy_md', 'TILED': true},
        serverType: 'geoserver',
        visible: true
    })
});

var KryDSTile = new ol.layer.Tile({
    title: "Kry",
    source: new ol.source.TileWMS({
        url: 'https://www.gis.atapex.sk/geoserver/dbaross/wms',
        params: {'LAYERS':'	dbaross:kry_md', 'TILED': true},
        serverType: 'geoserver',
        visible: true
    })
});

var overlayGroup = new ol.layer.Group({
    title: 'Bodové vrstvy',
    fold: true,
    layers: [StromyDSTile,StlpyDSTile,KryDSTile]
});

map.addLayer(overlayGroup);

// end : vrstvy-Body

// start : switcher , position

var layerSwitcher = new ol.control.LayerSwitcher({
    activationMode: 'click',
    startActive: false,
    groupSelectStyle: 'children'
});

map.addControl(layerSwitcher);

var mousePosition = new ol.control.MousePosition({
    className: 'mousePosition',
    projection: 'EPSG:5514',
    coordinateFormat: function(coordinate){return ol.coordinate.format(coordinate, '{x} , {y}', 6)}
});

map.addControl(mousePosition);

// end : switcher

// start : home

var homeButton = document.createElement('button');
homeButton.innerHTML = '<img src="resources/images/home.svg" alt="" style="width:20px;height:20px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
homeButton.className = 'myButton';

var homeElement = document.createElement('div');
homeElement.className = 'homeButtonDiv';
homeElement.appendChild(homeButton);

var homeControl = new ol.control.Control({
    element: homeElement
})

homeButton.addEventListener("click", () => {
    location.href = "index.html";
})

map.addControl(homeControl);

// end : home

// start : fullscreen

var fsButton = document.createElement('button');
fsButton.innerHTML = '<img src="resources/images/fullscreen.svg" alt="" style="width:20px;height:20px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
fsButton.className = 'myButton';

var fsElement = document.createElement('div');
fsElement.className = 'fsButtonDiv';
fsElement.appendChild(fsButton);

var fsControl = new ol.control.Control({
    element: fsElement
})

fsButton.addEventListener("click", () => {
    var mapEle = document.getElementById("map");
    if (mapEle.requestFullscreen) {
        mapEle.requestFullscreen();
    } else if (mapEle.msRequestFullscreen) {
        mapEle.msRequestFullscreen();
    } else if (mapEle.mozRequestFullscreen) {
        mapEle.mozRequestFullscreen();
    } else if (mapEle.webkitRequestFullscreen) {
        mapEle.webkitRequestFullscreen();
    }
})

map.addControl(fsControl);

// end : fullscreen

// start : scalebar

var scaleControl = new ol.control.ScaleLine({
    bar: true,
    text: true
});
map.addControl(scaleControl);

// end : scalebar

// start : popup

var container = document.getElementById('popup');
var content = document.getElementById('popup-content');
var closer = document.getElementById('popup-closer');

var popup = new ol.Overlay({
    element: container,
    autoPan: true,
    autoPanAnimation : {
        duration: 250,
    },
});

map.addOverlay(popup);

closer.onclick = function(){
    popup.setPosition(undefined);
    closer.blur();
    return false;
};

// popup : bodové vrstvy

var featureInfoButton = document.createElement('button');
featureInfoButton.innerHTML = '<img src="resources/images/identify.svg" alt="" style="width:20x;height:20px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
featureInfoButton.className = 'myButton';
featureInfoButton.id = 'featureInfoButton';

var featureInfoElement = document.createElement('div');
featureInfoElement.className = 'featureInfoDiv';
featureInfoElement.appendChild(featureInfoButton);

var featureInfoControl = new ol.control.Control({
    element: featureInfoElement
})

var featureInfoFlag = false;
featureInfoButton.addEventListener("click", () => {
    featureInfoButton.classList.toggle('clicked');
    featureInfoFlag = !featureInfoFlag;
})

map.addControl(featureInfoControl);

map.on('singleclick', function (evt){
    if (featureInfoFlag) {
    content.innerHTML = '';
    var resolution = mapView.getResolution();

    var url = StromyDSTile.getSource().getFeatureInfoUrl(evt.coordinate, resolution,mapView.getProjection(), {
        'INFO_FORMAT': 'application/json',
        'propertyName': 'kategoria,vyska,obvod'
    });

    if (url){
        $.getJSON(url, function (data){
            var feature = data.features[0];
            var props = feature.properties;
            content.innerHTML = "<h3> Kategória </h3> <p>" + props.kategoria.toUpperCase() + "</p> <br> <h3> Výška v m </h3> <p>" +
            props.vyska + "</p> <br> <h3> Obvod v cm </h3> <p>" + 
            props.obvod + "</p>";
            popup.setPosition(evt.coordinate);
        })
    } else {
        popup.setPosition(undefined);
    }
}
});

map.on('singleclick', function (evt){
    if (featureInfoFlag) {
    content.innerHTML = '';
    var resolution = mapView.getResolution();

    var url = StlpyDSTile.getSource().getFeatureInfoUrl(evt.coordinate, resolution,mapView.getProjection(), {
        'INFO_FORMAT': 'application/json',
        'propertyName': 'typ_stlpa,siet'
    });

    if (url){
        $.getJSON(url, function (data){
            var feature = data.features[0];
            var props = feature.properties;
            content.innerHTML = "<h3> Typ stĺpu </h3> <p>" + props.typ_stlpa.toUpperCase() + "</p> <br> <h3> Sieť </h3> <p>" +
            props.siet.toUpperCase() + "</p>";
            popup.setPosition(evt.coordinate);
        })
    } else {
        popup.setPosition(undefined);
    }
}
});

map.on('singleclick', function (evt){
    if (featureInfoFlag) {
    content.innerHTML = '';
    var resolution = mapView.getResolution();

    var url = KryDSTile.getSource().getFeatureInfoUrl(evt.coordinate, resolution,mapView.getProjection(), {
        'INFO_FORMAT': 'application/json',
        'propertyName': 'kategoria,vyska,vymera'
    });

    if (url){
        $.getJSON(url, function (data){
            var feature = data.features[0];
            var props = feature.properties;
            content.innerHTML = "<h3> Kategória </h3> <p>" + props.kategoria.toUpperCase() + "</p> <br> <h3> Výška v m </h3> <p>" +
            props.vyska + "</p> <br> <h3> Výmera v m2 </h3> <p>" + 
            props.vymera + "</p>";
            popup.setPosition(evt.coordinate);
        })
    } else {
        popup.setPosition(undefined);
    }
}
});

// popup : parcely

map.on('singleclick', function (evt){
    if (featureInfoFlag) {
    content.innerHTML = '';
    var resolution = mapView.getResolution();

    var url = CDSTile.getSource().getFeatureInfoUrl(evt.coordinate, resolution,mapView.getProjection(), {
        'INFO_FORMAT': 'application/json',
        'propertyName': 'ck,cp,rozloha'
    });

    if (url){
        $.getJSON(url, function (data){
            var feature = data.features[0];
            var props = feature.properties;
            content.innerHTML = "<h3> Číslo katastrálneho územia </h3> <p>" + props.ck + "</p> <br> <h3> Číslo parcely </h3> <p>" +
            props.cp + "</p> <br> <h3> Rozloha v m2 </h3> <p>" +
            props.rozloha + "</p>";
            popup.setPosition(evt.coordinate);
        })
    } else {
        popup.setPosition(undefined);
    }
}
});


map.on('singleclick', function (evt){
    if (featureInfoFlag) {
    content.innerHTML = '';
    var resolution = mapView.getResolution();

    var url = EDSTile.getSource().getFeatureInfoUrl(evt.coordinate, resolution,mapView.getProjection(), {
        'INFO_FORMAT': 'application/json',
        'propertyName': 'ck,cp,rozloha'
    });

    if (url){
        $.getJSON(url, function (data){
            var feature = data.features[0];
            var props = feature.properties;
            content.innerHTML = "<h3> Číslo katastrálneho územia </h3> <p>" + props.ck + "</p> <br> <h3> Číslo parcely </h3> <p>" +
            props.cp + "</p> <br> <h3> Rozloha v m2 </h3> <p>" +
            props.rozloha + "</p>";
            popup.setPosition(evt.coordinate);
        })
    } else {
        popup.setPosition(undefined);
    }
}
});

// popup : širšie vzťahy

map.on('singleclick', function (evt){
    if (featureInfoFlag) {
    content.innerHTML = '';
    var resolution = mapView.getResolution();

    var url = ModranyDSTile.getSource().getFeatureInfoUrl(evt.coordinate, resolution,mapView.getProjection(), {
        'INFO_FORMAT': 'application/json',
        'propertyName': 'stat,kraj,okres,obec'
    });

    if (url){
        $.getJSON(url, function (data){
            var feature = data.features[0];
            var props = feature.properties;
            content.innerHTML = "<h3> Štát </h3> <p>" + props.stat.toUpperCase() + "</p> <br> <h3> Kraj </h3> <p>" +
            props.kraj.toUpperCase() + "</p> <br> <h3> Okres</h3> <p>" + 
            props.okres.toUpperCase() + "</p> <br> <h3> Obec </h3> <p>" +
            props.obec.toUpperCase() + "</p>";
            popup.setPosition(evt.coordinate);
        })
    } else {
        popup.setPosition(undefined);
    }
}
});

map.on('singleclick', function (evt){
    if (featureInfoFlag) {
    content.innerHTML = '';
    var resolution = mapView.getResolution();

    var url = SusediaDSTile.getSource().getFeatureInfoUrl(evt.coordinate, resolution,mapView.getProjection(), {
        'INFO_FORMAT': 'application/json',
        'propertyName': 'štát,kraj,okres,obec'
    });

    if (url){
        $.getJSON(url, function (data){
            var feature = data.features[0];
            var props = feature.properties;
            content.innerHTML = "<h3> Štát </h3> <p>" + props.štát.toUpperCase() + "</p> <br> <h3> Kraj </h3> <p>" +
            props.kraj.toUpperCase() + "</p> <br> <h3> Okres</h3> <p>" + 
            props.okres.toUpperCase() + "</p> <br> <h3> Obec </h3> <p>" +
            props.obec.toUpperCase() + "</p>";
            popup.setPosition(evt.coordinate);
        })
    } else {
        popup.setPosition(undefined);
    }
}
});

// end: popup

// start : measure
var lengthButton = document.createElement('button');
lengthButton.innerHTML = '<img src="resources/images/measure-length.png" alt="" style="width:17px;height:17px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
lengthButton.className = 'myButton';
lengthButton.id = 'lengthButton';

var lengthElement = document.createElement('div');
lengthElement.className = 'lengthButtonDiv';
lengthElement.appendChild(lengthButton);

var lengthControl = new ol.control.Control({
    element: lengthElement
})

var lengthFlag = false;
lengthButton.addEventListener("click", () => {
    // disableOtherInteraction('lengthButton');
    lengthButton.classList.toggle('clicked');
    lengthFlag = !lengthFlag;
    document.getElementById("map").style.cursor = "default";
    if (lengthFlag) {
        map.removeInteraction(draw);
        addInteraction('LineString');
    } else {
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
        while (elements.length > 0) elements[0].remove();
    }

})

map.addControl(lengthControl);

var areaButton = document.createElement('button');
areaButton.innerHTML = '<img src="resources/images/measure-area.png" alt="" style="width:17px;height:17px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
areaButton.className = 'myButton';
areaButton.id = 'areaButton';


var areaElement = document.createElement('div');
areaElement.className = 'areaButtonDiv';
areaElement.appendChild(areaButton);

var areaControl = new ol.control.Control({
    element: areaElement
})

var areaFlag = false;
areaButton.addEventListener("click", () => {
    // disableOtherInteraction('areaButton');
    areaButton.classList.toggle('clicked');
    areaFlag = !areaFlag;
    document.getElementById("map").style.cursor = "default";
    if (areaFlag) {
        map.removeInteraction(draw);
        addInteraction('Polygon');
    } else {
        map.removeInteraction(draw);
        source.clear();
        const elements = document.getElementsByClassName("ol-tooltip ol-tooltip-static");
        while (elements.length > 0) elements[0].remove();
    }
})

map.addControl(areaControl);

/**
 * Message to show when the user is drawing a polygon.
 * @type {string}
 */
var continuePolygonMsg = 'Kliknite na pokračovanie polygónu, Dvojitým kliknutím ukončíte polygón';

/**
 * Message to show when the user is drawing a line.
 * @type {string}
 */
var continueLineMsg = 'Kliknite na pokračovanie polygónu, Dvojitým kliknutím ukončíte polygón';

var draw; // global so we can remove it later

var source = new ol.source.Vector();
var vector = new ol.layer.Vector({
    source: source,
    style: new ol.style.Style({
        fill: new ol.style.Fill({
            color: 'rgba(255, 255, 255, 0.2)',
        }),
        stroke: new ol.style.Stroke({
            color: '#ffcc33',
            width: 2,
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#ffcc33',
            }),
        }),
    }),
});

map.addLayer(vector);

function addInteraction(intType) {

    draw = new ol.interaction.Draw({
        source: source,
        type: intType,
        style: new ol.style.Style({
            fill: new ol.style.Fill({
                color: 'rgba(200, 200, 200, 0.6)',
            }),
            stroke: new ol.style.Stroke({
                color: 'rgba(0, 0, 0, 0.5)',
                lineDash: [10, 10],
                width: 2,
            }),
            image: new ol.style.Circle({
                radius: 5,
                stroke: new ol.style.Stroke({
                    color: 'rgba(0, 0, 0, 0.7)',
                }),
                fill: new ol.style.Fill({
                    color: 'rgba(255, 255, 255, 0.2)',
                }),
            }),
        }),
    });
    map.addInteraction(draw);

    createMeasureTooltip();
    createHelpTooltip();

    /**
     * Currently drawn feature.
     * @type {import("../src/ol/Feature.js").default}
     */
    var sketch;

    /**
     * Handle pointer move.
     * @param {import("../src/ol/MapBrowserEvent").default} evt The event.
     */
    var pointerMoveHandler = function (evt) {
        if (evt.dragging) {
            return;
        }
        /** @type {string} */
        var helpMsg = 'Click to start drawing';

        if (sketch) {
            var geom = sketch.getGeometry();
            // if (geom instanceof ol.geom.Polygon) {
            //   helpMsg = continuePolygonMsg;
            // } else if (geom instanceof ol.geom.LineString) {
            //   helpMsg = continueLineMsg;
            // }
        }

        //helpTooltipElement.innerHTML = helpMsg;
        //helpTooltip.setPosition(evt.coordinate);

        //helpTooltipElement.classList.remove('hidden');
    };

    map.on('pointermove', pointerMoveHandler);

    // var listener;
    draw.on('drawstart', function (evt) {
        // set sketch
        sketch = evt.feature;

        /** @type {import("../src/ol/coordinate.js").Coordinate|undefined} */
        var tooltipCoord = evt.coordinate;

        //listener = sketch.getGeometry().on('change', function (evt) {
        sketch.getGeometry().on('change', function (evt) {
            var geom = evt.target;
            var output;
            if (geom instanceof ol.geom.Polygon) {
                output = formatArea(geom);
                tooltipCoord = geom.getInteriorPoint().getCoordinates();
            } else if (geom instanceof ol.geom.LineString) {
                output = formatLength(geom);
                tooltipCoord = geom.getLastCoordinate();
            }
            measureTooltipElement.innerHTML = output;
            measureTooltip.setPosition(tooltipCoord);
        });
    });

    draw.on('drawend', function () {
        measureTooltipElement.className = 'ol-tooltip ol-tooltip-static';
        measureTooltip.setOffset([0, -7]);
        // unset sketch
        sketch = null;
        // unset tooltip so that a new one can be created
        measureTooltipElement = null;
        createMeasureTooltip();
        //ol.Observable.unByKey(listener);
    });
}

/**
 * The help tooltip element.
 * @type {HTMLElement}
 */
var helpTooltipElement;

/**
 * Overlay to show the help messages.
 * @type {Overlay}
 */
var helpTooltip;

/**
 * Creates a new help tooltip
 */
function createHelpTooltip() {
    if (helpTooltipElement) {
        helpTooltipElement.parentNode.removeChild(helpTooltipElement);
    }
    helpTooltipElement = document.createElement('div');
    helpTooltipElement.className = 'ol-tooltip hidden';
    helpTooltip = new ol.Overlay({
        element: helpTooltipElement,
        offset: [15, 0],
        positioning: 'center-left',
    });
    map.addOverlay(helpTooltip);
}

// map.getViewport().addEventListener('mouseout', function () {
//     helpTooltipElement.classList.add('hidden');
// });

/**
* The measure tooltip element.
* @type {HTMLElement}
*/
var measureTooltipElement;


/**
* Overlay to show the measurement.
* @type {Overlay}
*/
var measureTooltip;

/**
 * Creates a new measure tooltip
 */

function createMeasureTooltip() {
    if (measureTooltipElement) {
        measureTooltipElement.parentNode.removeChild(measureTooltipElement);
    }
    measureTooltipElement = document.createElement('div');
    measureTooltipElement.className = 'ol-tooltip ol-tooltip-measure';
    measureTooltip = new ol.Overlay({
        element: measureTooltipElement,
        offset: [0, -15],
        positioning: 'bottom-center',
    });
    map.addOverlay(measureTooltip);
}

/**
 * Format length output.
 * @param {LineString} line The line.
 * @return {string} The formatted length.
 */
var formatLength = function (line) {
    var length = ol.sphere.getLength(line);
    var output;
    if (length > 100) {
        output = Math.round((length / 1000) * 100) / 100 + ' ' + 'km';
    } else {
        output = Math.round(length * 100) / 100 + ' ' + 'm';
    }
    return output;
};

/**
 * Format area output.
 * @param {Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
var formatArea = function (polygon) {
    var area = ol.sphere.getArea(polygon);
    var output;
    if (area > 10000) {
        output = Math.round((area / 1000000) * 100) / 100 + ' ' + 'km<sup>2</sup>';
    } else {
        output = Math.round(area * 100) / 100 + ' ' + 'm<sup>2</sup>';
    }
    return output;
};
// end: measure

// start : attribute query

var geojson;
var featureOverlay;

var qryButton = document.createElement('button');
qryButton.innerHTML = '<img src="resources/images/query.svg" alt="" style="width:17px;height:17px;filter:brightness(0) invert(1);vertical-align:middle"></img>';
qryButton.className = 'myButton';
qryButton.id = 'qryButton';

var qryElement = document.createElement('div');
qryElement.className = 'myButtonDiv';
qryElement.appendChild(qryButton);

var qryControl = new ol.control.Control({
    element: qryElement
})

var qryFlag = false;
qryButton.addEventListener("click", () => {
    // disableOtherInteraction('lengthButton');
    qryButton.classList.toggle('clicked');
    qryFlag = !qryFlag;
    document.getElementById("map").style.cursor = "default";
    if (qryFlag) {
        if (geojson) {
            geojson.getSource().clear();
            map.removeLayer(geojson);
        }

        if (featureOverlay) {
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }
        document.getElementById("attQueryDiv").style.display = "block";

        bolIdentify = false;

        addMapLayerList();
    } else {
        document.getElementById("attQueryDiv").style.display = "none";
        document.getElementById("attListDiv").style.display = "none";

        if (geojson) {
            geojson.getSource().clear();
            map.removeLayer(geojson);
        }

        if (featureOverlay) {
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }
    }

})

map.addControl(qryControl);

function addMapLayerList() {
    $(document).ready(function () {
        $.ajax({
            type: "GET",
            url: "https://www.gis.atapex.sk/geoserver/dbaross/wfs?request=getCapabilities",
            dataType: "xml",
            success: function (xml) {
                var select = $('#selectLayer');
                select.append("<option class='ddindent' value=''></option>");
                $(xml).find('FeatureType').each(function () {
                    $(this).find('Name').each(function () {
                        var value = $(this).text();
                        select.append("<option class='ddindent' value='" + value + "'>" + value + "</option>");
                    });
                });
            }
        });
    });

};

$(function () {
    document.getElementById("selectLayer").onchange = function () {
        var select = document.getElementById("selectAttribute");
        while (select.options.length > 0) {
            select.remove(0);
        }
        var value_layer = $(this).val();
        $(document).ready(function () {
            $.ajax({
                type: "GET",
                url: "https://www.gis.atapex.sk/geoserver/dbaross/wfs?service=WFS&request=DescribeFeatureType&version=1.1.0&typeName=" + value_layer,
                dataType: "xml",
                success: function (xml) {

                    var select = $('#selectAttribute');
                    //var title = $(xml).find('xsd\\:complexType').attr('name');
                    //	alert(title);
                    select.append("<option class='ddindent' value=''></option>");
                    $(xml).find('xsd\\:sequence').each(function () {

                        $(this).find('xsd\\:element').each(function () {
                            var value = $(this).attr('name');
                            //alert(value);
                            var type = $(this).attr('type');
                            //alert(type);
                            if (value != 'geom' && value != 'the_geom') {
                                select.append("<option class='ddindent' value='" + type + "'>" + value + "</option>");
                            }
                        });

                    });
                }
            });
        });
    }
    document.getElementById("selectAttribute").onchange = function () {
        var operator = document.getElementById("selectOperator");
        while (operator.options.length > 0) {
            operator.remove(0);
        }

        var value_type = $(this).val();
        // alert(value_type);
        var value_attribute = $('#selectAttribute option:selected').text();
        operator.options[0] = new Option('Select operator', "");

        if (value_type == 'xsd:short' || value_type == 'xsd:int' || value_type == 'xsd:double') {
            var operator1 = document.getElementById("selectOperator");
            operator1.options[1] = new Option('Greater than', '>');
            operator1.options[2] = new Option('Less than', '<');
            operator1.options[3] = new Option('Equal to', '=');
        }
        else if (value_type == 'xsd:string') {
            var operator1 = document.getElementById("selectOperator");
            operator1.options[1] = new Option('Like', 'Like');
            operator1.options[2] = new Option('Equal to', '=');
        }
    }

    document.getElementById('attQryRun').onclick = function () {
        map.set("isLoading", 'YES');

        if (featureOverlay) {
            featureOverlay.getSource().clear();
            map.removeLayer(featureOverlay);
        }

        var layer = document.getElementById("selectLayer");
        var attribute = document.getElementById("selectAttribute");
        var operator = document.getElementById("selectOperator");
        var txt = document.getElementById("enterValue");

        if (layer.options.selectedIndex == 0) {
            alert("Select Layer");
        } else if (attribute.options.selectedIndex == -1) {
            alert("Select Attribute");
        } else if (operator.options.selectedIndex <= 0) {
            alert("Select Operator");
        } else if (txt.value.length <= 0) {
            alert("Enter Value");
        } else {
            var value_layer = layer.options[layer.selectedIndex].value;
            var value_attribute = attribute.options[attribute.selectedIndex].text;
            var value_operator = operator.options[operator.selectedIndex].value;
            var value_txt = txt.value;
            if (value_operator == 'Like') {
                value_txt = "%25" + value_txt + "%25";
            }
            else {
                value_txt = value_txt;
            }
            var url = "https://www.gis.atapex.sk/geoserver/dbaross/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=" + value_layer + "&CQL_FILTER=" + value_attribute + "+" + value_operator + "+'" + value_txt + "'&outputFormat=application/json"
            // console.log(url);
            newaddGeoJsonToMap(url);
            newpopulateQueryTable(url);
            setTimeout(function () { newaddRowHandlers(url); }, 300);
            map.set("isLoading", 'NO');
        }
    }
});

function newaddGeoJsonToMap(url) {

    if (geojson) {
        geojson.getSource().clear();
        map.removeLayer(geojson);
    }

    var style = new ol.style.Style({
        // fill: new ol.style.Fill({
        //   color: 'rgba(0, 255, 255, 0.7)'
        // }),
        stroke: new ol.style.Stroke({
            color: '#FFFF00',
            width: 3
        }),
        image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
                color: '#FFFF00'
            })
        })
    });

    geojson = new ol.layer.Vector({
        source: new ol.source.Vector({
            url: url,
            format: new ol.format.GeoJSON()
        }),
        style: style,

    });

    geojson.getSource().on('addfeature', function () {
        map.getView().fit(
            geojson.getSource().getExtent(),
            { duration: 1590, size: map.getSize(), maxZoom: 21 }
        );
    });
    map.addLayer(geojson);
};

function newpopulateQueryTable(url) {
    if (typeof attributePanel !== 'undefined') {
        if (attributePanel.parentElement !== null) {
            attributePanel.close();
        }
    }
    $.getJSON(url, function (data) {
        var col = [];
        col.push('id');
        for (var i = 0; i < data.features.length; i++) {

            for (var key in data.features[i].properties) {

                if (col.indexOf(key) === -1) {
                    col.push(key);
                }
            }
        }

        var table = document.createElement("table");

        table.setAttribute("class", "table table-bordered table-hover table-condensed");
        table.setAttribute("id", "attQryTable");
        // CREATE HTML TABLE HEADER ROW USING THE EXTRACTED HEADERS ABOVE.

        var tr = table.insertRow(-1);                   // TABLE ROW.

        for (var i = 0; i < col.length; i++) {
            var th = document.createElement("th");      // TABLE HEADER.
            th.innerHTML = col[i];
            tr.appendChild(th);
        }

        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < data.features.length; i++) {
            tr = table.insertRow(-1);
            for (var j = 0; j < col.length; j++) {
                var tabCell = tr.insertCell(-1);
                if (j == 0) { tabCell.innerHTML = data.features[i]['id']; }
                else {
                    tabCell.innerHTML = data.features[i].properties[col[j]];
                }
            }
        }

        // var tabDiv = document.createElement("div");
        var tabDiv = document.getElementById('attListDiv');

        var delTab = document.getElementById('attQryTable');
        if (delTab) {
            tabDiv.removeChild(delTab);
        }

        tabDiv.appendChild(table);

        document.getElementById("attListDiv").style.display = "block";
    });

};

var highlightStyle = new ol.style.Style({
    fill: new ol.style.Fill({
      color: 'rgba(255,0,255,0.3)',
    }),
    stroke: new ol.style.Stroke({
        color: '#FF00FF',
        width: 3,
    }),
    image: new ol.style.Circle({
        radius: 10,
        fill: new ol.style.Fill({
            color: '#FF00FF'
        })
    })
});


var featureOverlay = new ol.layer.Vector({
    source: new ol.source.Vector(),
    map: map,
    style: highlightStyle
});

function newaddRowHandlers() {
    var table = document.getElementById("attQryTable");
    var rows = document.getElementById("attQryTable").rows;
    var heads = table.getElementsByTagName('th');
    var col_no;
    for (var i = 0; i < heads.length; i++) {
        // Take each cell
        var head = heads[i];
        if (head.innerHTML == 'id') {
            col_no = i + 1;
        }

    }
    for (i = 0; i < rows.length; i++) {
        rows[i].onclick = function () {
            return function () {
                featureOverlay.getSource().clear();

                $(function () {
                    $("#attQryTable td").each(function () {
                        $(this).parent("tr").css("background-color", "white");
                    });
                });
                var cell = this.cells[col_no - 1];
                var id = cell.innerHTML;
                $(document).ready(function () {
                    $("#attQryTable td:nth-child(" + col_no + ")").each(function () {
                        if ($(this).text() == id) {
                            $(this).parent("tr").css("background-color", "#d1d8e2");
                        }
                    });
                });

                var features = geojson.getSource().getFeatures();

                for (i = 0; i < features.length; i++) {
                    if (features[i].getId() == id) {
                        featureOverlay.getSource().addFeature(features[i]);

                        featureOverlay.getSource().on('addfeature', function () {
                            map.getView().fit(
                                featureOverlay.getSource().getExtent(),
                                { duration: 1500, size: map.getSize(), maxZoom: 24 }
                            );
                        });

                    }
                }
            };
        }(rows[i]);
    }
}

// end : attribute query