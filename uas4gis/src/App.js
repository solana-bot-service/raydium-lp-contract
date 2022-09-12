import logo from './logo.svg';
import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import * as turf from '@turf/turf'
import { PulsingDot } from './mapComponents/pulseingDot';
import { InfoBar } from './mapLayouts/InfoBar/InfoBar';
import { LayersTOC } from './mapLayouts/LayersTOC/LayersTOC';
import { BaseMaps } from './mapLayouts/BaseMaps/BaseMaps';
import { SidebarMenu } from './mapLayouts/SidebarMenu/SidebarMenu';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhbG9lbXBob2wiLCJhIjoiY2w0a3JidXJtMG0yYTNpbnhtdnd6cGh0dCJ9.CpVWidx8WhlkRkdK1zTIbw';

function App() {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const draw = useRef(null);

  const start = [101.1803, 14.6515];
  const [_zoom, _bearing, _pitch] = [15, -108, 76]
  const [lng, setLng] = useState(start[0]);
  const [lat, setLat] = useState(start[1]);
  const [zoom, setZoom] = useState(_zoom); //15
  const [bearing, setBearing] = useState(_bearing); //-108
  const [pitch, setPitch] = useState(_pitch); //76

  const mapIds = {
    'nkrafa-ortho-layer' : 'ภาพถ่ายออร์โธ รร.นนก.มวกเหล็ก',
    'nkrafa-dem-layer' : 'ชั้นความสูง DEM',
    provinces: 'ขอบเขตจังหวัด',
    roads : 'ถนน',
    buildings: 'อาคาร'
  }

  useEffect(() => {
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // style: 'mapbox://styles/mapbox/streets-v11',
      style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
      center: [lng, lat],
      pitch: pitch,
      bearing: bearing,
      zoom: zoom,
    });

    map.current.addControl(new mapboxgl.FullscreenControl());
    map.current.addControl(new mapboxgl.NavigationControl());

    if (!draw.current) draw.current = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        // line_string: true,
        // combine_features: true,
        // uncombine_features: true,        
      polygon: true,
      trash: true
      },
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      // defaultMode: 'draw_polygon'
      });
    map.current.addControl(draw.current);
    

  });

  useEffect(() => {
    if (!map.current) return; // wait for map to initialize
    const size = 200;

    // This implements `StyleImageInterface`
    // to draw a pulsing dot icon on the map

    map.current.on('load', () => {

      const layerList = document.getElementById('basemaps_menu');
      const inputs = layerList.getElementsByTagName('input');

      for (const input of inputs) {
        input.onclick = (layer) => {
          const layerId = layer.target.id;
          map.current.setStyle('mapbox://styles/mapbox/' + layerId);
        };
      }
      
      // map.current.addSource('dot-point', {
      //   'type': 'geojson',
      //   'data': {
      //     'type': 'FeatureCollection',
      //     'features': [{
      //       'type': 'Feature',
      //       'geometry': {
      //         'type': 'Point',
      //         'coordinates': [lng, lat] // icon position [lng, lat]
      //       }
      //     }]
      //   }
      // });
      // map.current.addLayer({
      //   'id': 'layer-with-pulsing-dot',
      //   'type': 'symbol',
      //   'source': 'dot-point',
      //   'layout': {
      //     'icon-image': 'pulsing-dot'
      //   }
      // });

      ////https://sppsim.rtaf.mi.th/geoserver/uas4gis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=uas4gis%3AProvince&outputFormat=application%2Fjson


      // map.current.addSource('museums', {
      //   type: 'vector',
      //   url: 'mapbox://mapbox.2opop9hr'
      // });

      // map.current.addLayer({
      //   'id': 'museums',
      //   'type': 'circle',
      //   'source': 'museums',
      //   'layout': {
      //     // Make the layer visible by default.
      //     'visibility': 'visible'
      //     },
      //     'paint': {
      //       'circle-radius': 8,
      //       'circle-color': 'rgba(55,148,179,1)'
      //       },
      //     'source-layer': 'museum-cusco'
      //   });

      // Add the Mapbox Terrain v2 vector tileset. Read more about
      // the structure of data in this tileset in the documentation:
      // https://docs.mapbox.com/vector-tiles/reference/mapbox-terrain-v2/
      // map.current.addSource('contours', {
      // type: 'vector',
      // url: 'mapbox://mapbox.mapbox-terrain-v2'
      // });
      // map.current.addLayer({
      //   'id': 'contours',
      //   'type': 'line',
      //   'source': 'contours',
      //   'source-layer': 'contour',
      //   'layout': {
      //     // Make the layer visible by default.
      //     'visibility': 'visible',
      //     'line-join': 'round',
      //     'line-cap': 'round'
      //   },
      //   'paint': {
      //   'line-color': '#877b59',
      //   'line-width': 1
      // }
      // });
    });

    function toggleTerrain(event) {
       event.checked ? map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 }) : map.current.setTerrain();
    }

    const visibleLayers = ['nkrafa-ortho-layer']//['provinces']

    var loadSource = () => {
      if (map.current.isStyleLoaded()) {


        // When a click event occurs on a feature in the states layer,
        // open a popup at the location of the click, with description
        // HTML from the click event's properties.
        map.current.on('click', 'provinces', (e) => {
          new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(e.features[0].properties.name_t)
          .addTo(map.current);
          });
          
          // Change the cursor to a pointer when
          // the mouse is over the states layer.
          map.current.on('mouseenter', 'provinces', () => {
          map.current.getCanvas().style.cursor = 'pointer';
          });
          
          // Change the cursor back to a pointer
          // when it leaves the states layer.
          map.current.on('mouseleave', 'provinces', () => {
          map.current.getCanvas().style.cursor = '';
          });
        

        if (!map.current.getSource('mapbox-dem')) map.current.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
        // add the DEM source as a terrain layer with exaggerated height
        map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });

        //Province
        if (!map.current.getSource('provinces_source')) map.current.addSource('provinces_source', {
          type: 'geojson',
          // Use a URL for the value for the `data` property.
          data: 'http://sppsim.rtaf.mi.th/geoserver/uas4gis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=uas4gis%3AProvince&outputFormat=application%2Fjson'//'http://localhost:8080/geoserver/uas4gis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=uas4gis%3AProvince&outputFormat=application%2Fjson'//'http://sppsim.rtaf.mi.th/geoserver/uas4gis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=uas4gis%3AProvince&outputFormat=application%2Fjson' 
        });


        // MARK:- DEM

        if (!map.current.getSource('nkrafa-dem')) map.current.addSource('nkrafa-dem', {
          "type": "raster-dem",
          "url": "mapbox://chaloemphol.aqjbpzug",
          "tileSize": 256
      });

        if (!map.current.getLayer('nkrafa-dem-layer')) map.current.addLayer(
          {
          'id': 'nkrafa-dem-layer',
          'type': 'hillshade',
          'source': 'nkrafa-dem',
          'paint': {}
          }
          );
        // MARK:- RASTER

        if (!map.current.getSource('nkrafa-ortho-src')) map.current.addSource('nkrafa-ortho-src', {
          "type": "raster",
          "url": "mapbox://chaloemphol.6hmfuluu", //"mapbox://chaloemphol.8ts25qif",
          "tileSize": 256
      });

        if (!map.current.getLayer('nkrafa-ortho-layer')) map.current.addLayer(
          {
          'id': 'nkrafa-ortho-layer',
          'type': 'raster',
          'source': 'nkrafa-ortho-src',
          'paint': {}
          }
          );

        // if (!map.current.getSource('nkrafa-ortho-src')) map.current.addSource('nkrafa-ortho-src', {
        //   'type': 'raster',
        //   // use the tiles option to specify a WMS tile source URL
        //   // https://docs.mapbox.com/mapbox-gl-js/style-spec/sources/
        //   'tiles': [
        //     'http://localhost:8080/geoserver/uas4gis/wms?bbox={bbox-epsg-4326}&format=image/png&service=WMS&version=1.1.1&request=GetMap&srs=EPSG:4326&transparent=true&width=512&height=512&layers=uas4gis%3AMapPlan_Orthomosaic_export_ThuAug25215405728558_mask'
        //   ],//http://localhost:8080/geoserver/uas4gis/wms?service=WMS&version=1.1.0&request=GetMap&layers=uas4gis%3AMapPlan_Orthomosaic_export_ThuAug25215405728558_mask&bbox=101.18050176466429%2C14.645264282309714%2C101.19264152666247%2C14.660350813379504&width=617&height=768&srs=EPSG%3A4326&styles=&format=application/openlayers#toggle
        //   'tileSize': 512
        //   });

        // if (!map.current.getLayer('nkrafa-ortho-layer')) map.current.addLayer(
        //   {
        //   'id': 'nkrafa-ortho-layer',
        //   'type': 'raster',
        //   'source': 'nkrafa-ortho-src',
        //   'paint': {}
        //   }
        //   );

          

        // Add a province layer to visualize the polygon.
        if (!map.current.getLayer('provinces')) map.current.addLayer({
            'id': 'provinces',
            'type': 'fill',
            'source': 'provinces_source', // reference the data source
            'layout': {},
            'paint': {
              'fill-color': '#0080ff', // blue color fill
              'fill-opacity': 0.1
            }
          });
        if (!visibleLayers.includes('provinces')) map.current.setLayoutProperty(
          'provinces',
          'visibility',
          'none'
        );


        // //Amphoe
        // if (!map.current.getSource('amphoes')) map.current.addSource('amphoes', {
        //   type: 'geojson',
        //   // Use a URL for the value for the `data` property.
        //   data: 'http://localhost:8080/geoserver/uas4gis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=uas4gis%3AAmphoe&outputFormat=application%2Fjson'// 'http://sppsim.rtaf.mi.th/geoserver/uas4gis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=uas4gis%3AAmphoe&outputFormat=application%2Fjson'
        // });

        // // Add amphoes layer to visualize the polygon.
        // if (!map.current.getLayer('amphoes')) map.current.addLayer({
        //     'id': 'amphoes',
        //     'type': 'line',
        //     'source': 'amphoes', // reference the data source
        //     'layout': {},
        //     'paint': {
        //       'line-color': '#800',
        //       'line-width': 2
        //     }
        // });
        // if (!visibleLayers.includes('amphoes')) map.current.setLayoutProperty(
        //   'amphoes',
        //   'visibility',
        //   'none'
        // );

        // //Tambol
        // if (!map.current.getSource('tambols')) map.current.addSource('tambols', {
        //   type: 'geojson',
        //   // Use a URL for the value for the `data` property.
        //   data: 'http://localhost:8080/geoserver/uas4gis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=uas4gis%3ATambon&outputFormat=application%2Fjson'
        // });

        // // Add tambols layer to visualize the polygon.
        // if (!map.current.getLayer('tambols')) map.current.addLayer({
        //     'id': 'tambols',
        //     'type': 'line',
        //     'source': 'tambols', // reference the data source
        //     'layout': {},
        //     'paint': {
        //       'line-color': '#080',
        //       'line-width': 1
        //     }
        //   });
        //   if (!visibleLayers.includes('tambols')) map.current.setLayoutProperty(
        //     'tambols',
        //     'visibility',
        //     'none'
        //   );

        // // Add a black outline around the polygon.
        // if (!map.current.getLayer('provinces_outline')) map.current.addLayer({
        //   'id': 'provinces_outline',
        //   'type': 'line',
        //   'source': 'provinces_source',
        //   'layout': {},
        //   'paint': {
        //     'line-color': '#000',
        //     'line-width': 1
        //   }
        // });

        // add a sky layer that will show when the map is highly pitched

        // //Roads
        if (!map.current.getSource('roads-source')) map.current.addSource('roads-source', {
          type: 'geojson',
          // Use a URL for the value for the `data` property.
          data: 'http://sppsim.rtaf.mi.th/geoserver/uas4gis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=uas4gis%3Aroad_line&outputFormat=application%2Fjson'
        });

        // Add tambols layer to visualize the polygon.
        if (!map.current.getLayer('roads')) map.current.addLayer({
            'id': 'roads',
            'type': 'line',
            'source': 'roads-source', // reference the data source
            'layout': {},
            'paint': {
              'line-color': '#1E90FF',
              'line-width': 10
            }
          });
          if (!visibleLayers.includes('roads')) map.current.setLayoutProperty(
            'roads',
            'visibility',
            'none'
          );


        // //Buildings
        if (!map.current.getSource('buildings-source')) map.current.addSource('buildings-source', {
          type: 'geojson',
          // Use a URL for the value for the `data` property.
          data: 'http://sppsim.rtaf.mi.th/geoserver/uas4gis/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=uas4gis%3Abuilding&outputFormat=application%2Fjson'
        });

        // Add tambols layer to visualize the polygon.
        if (!map.current.getLayer('buildings')) map.current.addLayer({
            'id': 'buildings',
            'type': 'fill',
            'source': 'buildings-source', // reference the data source,
            'layout': {},
            'paint': {
              'fill-color': '#FFFF00', // blue color fill
              'fill-opacity': 0.5
            }
          });
          if (!visibleLayers.includes('buildings')) map.current.setLayoutProperty(
            'buildings',
            'visibility',
            'none'
          );


          //SKY
        if (!map.current.getLayer('sky')) map.current.addLayer({
          'id': 'sky',
          'type': 'sky',
          'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });

        map.current.off('data', loadSource);
      }
    }

    map.current.on('data', loadSource);

      // After the last frame rendered before the map enters an "idle" state.
    map.current.on('idle', () => {


        const layers = document.getElementById('menu');

        if (!document.getElementById('toggleTerrain')) {
          const toggleTerrainCB = document.createElement('input');
          toggleTerrainCB.type = 'checkbox';
          toggleTerrainCB.id = 'toggleTerrain'; // need unique Ids!
          toggleTerrainCB.checked = map.current.getTerrain() ? 'checked' : '';
          toggleTerrainCB.onclick = (e) => toggleTerrain(e.target);
          layers.appendChild(toggleTerrainCB);
          const toggleTerrainLabel = document.createElement("label");
          toggleTerrainLabel.innerText = "Toggle Terrain"
          toggleTerrainLabel.htmlFor =  "toggleTerrain" ;
          layers.appendChild(toggleTerrainLabel);
        }

        // If these two layers were not added to the map, abort
        if (['nkrafa-ortho-layer', 'nkrafa-dem-layer', 'provinces', 'roads', 'buildings' ].some(l => !map.current.getLayer(l))) {
          return;
        }

        // Enumerate ids of the layers.
        const toggleableLayerIds = ['nkrafa-ortho-layer', 'nkrafa-dem-layer', 'provinces', 'roads', 'buildings']; //'contours', 'museums',
        //['provinces', 'amphoes', 'tambols', 'sky', 'nkrafa-ortho-layer']; //'contours', 'museums',

        // Set up the corresponding toggle button for each layer.
        for (const id of toggleableLayerIds) {
          // Skip layers that already have a button set up.
          if (document.getElementById(id)) {
            continue;
          }

          // Create a link.
          const link = document.createElement('a');

          link.id = id;
          link.href = '#';
          link.textContent = mapIds[id] || id;
          link.className = visibleLayers.includes(id) ? 'active' : '';

          // Show or hide layer when the toggle is clicked.
          link.onclick = function (e) {
            const clickedLayer = this.id;
            e.preventDefault();
            e.stopPropagation();

            const visibility = map.current.getLayoutProperty(
              clickedLayer,
              'visibility'
            );

            // Toggle layer visibility by changing the layout object's visibility property.
            if (visibility === 'visible') {
              map.current.setLayoutProperty(clickedLayer, 'visibility', 'none');
              this.className = '';
            } else {
              this.className = 'active';
              map.current.setLayoutProperty(
                clickedLayer,
                'visibility',
                'visible'
              );
            }
          };
        layers.appendChild(link);
      }

      // map.current.setLayoutProperty('provinces', 'text-field', [
      //     'format',
      //     ['get', 'name_e'],
      //     { 'font-scale': 1.2 }]);

    });

    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
      setBearing(map.current.getBearing().toFixed(2));
      setPitch(map.current.getPitch().toFixed(2));
    });

    //draw tools
    map.current.on('draw.create', updateArea);
    map.current.on('draw.delete', updateArea);
    map.current.on('draw.update', updateArea);
 
function updateArea(e) {
    const data = draw.current.getAll();
    const answer = document.getElementById('calculated-area');
    if (data.features.length > 0) {
    const area = turf.area(data);
    // Restrict the area to 2 decimal points.
    const rounded_area = Math.round(area * 100) / 100;
    answer.innerHTML = `<p><strong>${rounded_area}</strong></p><p>square meters</p>`;
    } else {
    answer.innerHTML = '';
    if (e.type !== 'draw.delete')
    alert('Click the map to draw a polygon.');
    }
}



    // let isAtStart = true;
    
    document.getElementById('titleblock').addEventListener('click', () => {
      // depending on whether we're currently at point a or b, aim for
      // point a or b
      // const target = isAtStart ? end : start;
      
      // and now we're at the opposite point
      // isAtStart = !isAtStart;
      
      map.current.flyTo({
        // These options control the ending camera position: centered at
        // the target, at zoom level 9, and north up.
        center: start,
        zoom: _zoom,
        bearing: _bearing,
        pitch: _pitch,
        
        // These options control the flight curve, making it move
        // slowly and zoom out almost completely before starting
        // to pan.
        speed: 0.5, // make the flying slow
        curve: 1, // change the speed at which it zooms out
        
        // This can be any easing function: it takes a number between
        // 0 and 1 and returns another number between 0 and 1.
        easing: (t) => t,
        
        // this animation is considered essential with respect to prefers-reduced-motion
        essential: true
      });
    });


  });

  let props = {
    lat, lng, zoom, bearing, pitch
  }



  // function openNav() {
  //   document.getElementById("mySidebar").style.width = "250px";
  //   document.getElementById("main").style.marginLeft = "250px";
  //   document.getElementById("openbtn").style.visibility = "hidden";
  // }

  // function closeNav() {
  //   document.getElementById("mySidebar").style.width = "0";
  //   document.getElementById("main").style.marginLeft= "0";
  //   document.getElementById("openbtn").style.visibility = "visible";
  // }

  /**
   *
   */
  // let sidebarmenuProps = {
  //   closeNav
  // }
  return (
    <div>
      <div ref={mapContainer} className="map-container" />
      {/* <SidebarMenu {...sidebarmenuProps} /> */}
      {/* <button id='openbtn' className="openbtn" onClick={openNav}>☰</button> */}

      <BaseMaps />
      <LayersTOC />
      <InfoBar {...props} />
      <div className="calculation-box">
        <p>วัดขนาดพื้นที่โดยคลิกบนแผนที่</p>
        <div id="calculated-area" />
      </div>

      <button id="titleblock">ระบบข้อมูลภูมิสารสนเทศของ รร.นนก. ณ ที่ตั้ง อ.มวกเหล็ก จว.สระบุรี</button>
      
    </div>
  );
}

export default App;