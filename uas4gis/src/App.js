import logo from './logo.svg';
import './App.css';
import React, { useRef, useEffect, useState } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxCompare from 'mapbox-gl-compare';
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import * as turf from '@turf/turf'
import { PulsingDot } from './mapComponents/pulseingDot';
import { InfoBar } from './mapLayouts/InfoBar/InfoBar';
import { LayersTOC } from './mapLayouts/LayersTOC/LayersTOC';
import { BaseMaps } from './mapLayouts/BaseMaps/BaseMaps';
import { SidebarMenu } from './mapLayouts/SidebarMenu/SidebarMenu';


import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';


import Stack from '@mui/material/Stack';
import { Typography } from '@mui/material';
import { Box } from '@mui/system';

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhbG9lbXBob2wiLCJhIjoiY2w0a3JidXJtMG0yYTNpbnhtdnd6cGh0dCJ9.CpVWidx8WhlkRkdK1zTIbw';

function App() {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const comparemap = useRef()
  const beforeMap = useRef()
  const afterMap = useRef()

  const draw = useRef(null);
//Longitude: 101.1866 | Latitude: 14.6534 | Zoom: 15.12 | Bearing: 0.00 | Pitch: 0.00
  const start = [101.1866, 14.6534];
  const [_zoom, _bearing, _pitch] = [15, 0, 0]
  const [lng, setLng] = useState(start[0]);
  const [lat, setLat] = useState(start[1]);
  const [zoom, setZoom] = useState(_zoom); //15
  const [bearing, setBearing] = useState(_bearing); //-108
  const [pitch, setPitch] = useState(_pitch); //76
  const [compareMode, setCompareMode] = useState(false);
  const [toggleSymbol, setToggleSymbol] = useState("▶︎");

  //map data sources
  const ortho = require('./MapData/nkrafaortho.json')
  const admins = require('./MapData/vectorAdminSrc.json')
  const constructions = require('./MapData/vectorConstructionSrc.json')
  const essentialLayers = {...ortho, ...admins, ...constructions}

  const mapIds = Object.entries(essentialLayers).reduce((p, [name, con]) => {
    return {...p, [name] : con.info.desc}
  }, {'nkrafa-dem-layer': 'ชั้นความสูง DEM'});
  // Enumerate ids of the layers.
  const toggleableLayerIds = Object.keys(essentialLayers).reduce((p, name) => {
    Array.isArray(p) ? p.push(name) : p = name
    return p
  }, [])

  //['nkrafa-ortho-6508-layer', 'nkrafa-ortho-6509-layer', 'nkrafa-dem-layer', 'provinces', 'roads', 'buildings']; //'contours', 'museums',
  //['provinces', 'amphoes', 'tambols', 'sky', 'nkrafa-ortho-6508-layer']; //'contours', 'museums',
  // If these two layers were not added to the map, abort

  const visibleLayers = Object.entries(essentialLayers).reduce((p, [name, con]) => {
    if (con.info.visible) Array.isArray(p) ? p.push(name) : p = name
    return p
  }, [])
  //['nkrafa-ortho-6508-layer', 'nkrafa-ortho-6509-layer', 'roads', 'buildings']//['provinces']

  const [spinners, setSpinners] = useState(toggleableLayerIds.reduce((p, id) => ({...p, [id]: <></>}), {}));

  useEffect(() => {

    if (compareMode) {

      if (comparemap.current) return;
      if (!beforeMap.current) beforeMap.current = new mapboxgl.Map({
        container: 'before',
        // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
          style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
          center: [lng, lat],
          pitch,
          bearing,
          zoom,
        });

        if (!afterMap.current) afterMap.current = new mapboxgl.Map({
        container: 'after',
        style: 'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
        center: [lng, lat],
        pitch,
        bearing,
        zoom,
        });


      afterMap.current.addControl(new mapboxgl.NavigationControl());


        beforeMap.current.on('data', () => {

          Object.entries(ortho).slice(0, 1).forEach(([name, con]) => {
            if (!beforeMap.current.getSource(con.layer.source)) {
              console.log(name);
              beforeMap.current.addSource(con.layer.source, con.src);
            }
            if (!beforeMap.current.getLayer(name)) {
              beforeMap.current.addLayer(con.layer);
            }
          });

          beforeMap.current.off('data', () => {});
        });


        afterMap.current.on('data', () => {

          Object.entries(ortho).slice(1, 2).forEach(([name, con]) => {
            if (!afterMap.current.getSource(con.layer.source)) {
              console.log(name);
              afterMap.current.addSource(con.layer.source, con.src);
            }
            if (!afterMap.current.getLayer(name)) {
              afterMap.current.addLayer(con.layer);
            }
          });

          afterMap.current.off('data', () => {});
        });



        // A selector or reference to HTML element
        const container = '#comparison-container';

        comparemap.current = new MapboxCompare(beforeMap.current, afterMap.current, container, {
        // Set this to enable comparing two maps by mouse movement:
        // mousemove: true
        });

    } else  {
      comparemap.current = null
    if (map.current) return; // initialize map only once
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // style: 'mapbox://styles/mapbox/streets-v11',
      style: 'mapbox://styles/chaloemphol/clasf7ipf00dp14mpio2dnq8h',//'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
      center: [lng, lat],
      pitch,
      bearing,
      zoom,
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
    }

  });

  useEffect(() => {


    document.getElementById('titleblock').addEventListener('click', () => {
      // depending on whether we're currently at point a or b, aim for
      // point a or b
      // const target = isAtStart ? end : start;

      // and now we're at the opposite point
      // isAtStart = !isAtStart;
      let flyParams = {
        // These options control the ending camera position: centered at
        // the target, at zoom level 9, and north up.
        center: start,
        zoom: _zoom,
        bearing: _bearing,
        pitch: _pitch,

        // These options control the flight curve, making it move
        // slowly and zoom out almost completely before starting
        // to pan.
        speed: 1.5, // make the flying slow
        curve: 1, // change the speed at which it zooms out

        // This can be any easing function: it takes a number between
        // 0 and 1 and returns another number between 0 and 1.
        easing: (t) => t,

        // this animation is considered essential with respect to prefers-reduced-motion
        essential: true
      }

      if (compareMode) {
        beforeMap.current.flyTo(flyParams);
      } else {
        map.current.flyTo(flyParams);
      }
    });

    if (!map.current || compareMode) return; // wait for map to initialize
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

      toggleSidebar('left');


      // toggleableLayerIds.forEach(id => {
      //   console.log('====================================');
      //   console.log('checking visibility', id);
      //   console.log('====================================');
      //   toggleVisibility(id)

      // });

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


  function toggleVisibility(id) {
    if (!visibleLayers.includes(id)) map.current.setLayoutProperty(
      id,
      'visibility',
      'none'
    );
  }


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

                    //SKY
        // add a sky layer that will show when the map is highly pitched

        if (!map.current.getLayer('sky')) map.current.addLayer({
          'id': 'sky',
          'type': 'sky',
          'paint': {
            'sky-type': 'atmosphere',
            'sky-atmosphere-sun': [0.0, 0.0],
            'sky-atmosphere-sun-intensity': 15
          }
        });

        //  MARK Mapbox Terrain

        if (!map.current.getSource('mapbox-dem')) map.current.addSource('mapbox-dem', {
          'type': 'raster-dem',
          'url': 'mapbox://mapbox.mapbox-terrain-dem-v1',
          'tileSize': 512,
          'maxzoom': 14
        });
        // add the DEM source as a terrain layer with exaggerated height
        // map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 });


        // MARK:- DEM

        if (!map.current.getSource('nkrafa-dem')) map.current.addSource('nkrafa-dem', {
          "type": "raster-dem",
          "url": "mapbox://chaloemphol.aqjbpzug",
          "tileSize": 256
      });

      if (!map.current.getLayer('nkrafa-dem-layer')) {
        map.current.addLayer({
            'id': 'nkrafa-dem-layer',
            'type': 'hillshade',
            'source': 'nkrafa-dem',
            'paint': {}
          },
          'nkrafa-ortho-6508-layer'
        );

        toggleVisibility('nkrafa-dem-layer')
      }


        // MARK:- RASTER

      /**
       * BBOX ให้ใช้ {bbox-epsg-3857}
       *
      //  */


      Object.entries(ortho).sort((a, b) => a[1].info.date - b[1].info.date).forEach(([name, con]) => {
        if (!map.current.getSource(con.layer.source)) {
        console.log(name);
          map.current.addSource(con.layer.source, con.src);
        }
        if (!map.current.getLayer(name)) {
          map.current.addLayer(con.layer);
          toggleVisibility(name)
        }
      });

        // Admin areas
        Object.entries(admins).sort((a, b) => a[1].id - b[1].id).forEach(([name, con]) => {
          if (!map.current.getSource(con.layer.source)) map.current.addSource(con.layer.source, con.src);
          if (!map.current.getLayer(name)) {
            map.current.addLayer(con.layer);
            toggleVisibility(name)
          }
        });

        // Buildings and roads
        Object.entries(constructions).forEach(([name, con]) => {
          if (!map.current.getSource(con.layer.source)) {
          console.log(name);
            map.current.addSource(con.layer.source, con.src);
          }
          if (!map.current.getLayer(name)) {
            map.current.addLayer(con.layer);
            toggleVisibility(name)

            if (con.label && !map.current.getLayer(name + "-label")) map.current.addLayer(con.label);

          }

          if (con.info.extrude && !map.current.getLayer(con.extrude.id)) map.current.addLayer(con.extrude)

        });



        const layers = document.getElementById('menu');

        if (!document.getElementById('toggleTerrain')) {
          const toggleTerrainCB = document.createElement('input');
          toggleTerrainCB.type = 'checkbox';
          toggleTerrainCB.id = 'toggleTerrain'; // need unique Ids!
          toggleTerrainCB.checked = (bearing === 0 && pitch === 0) ? '' : map.current.getTerrain() ? 'checked' : '';
          toggleTerrainCB.onclick = (e) => toggleTerrain(e.target);
          layers.appendChild(toggleTerrainCB);

          const toggleTerrainLabel = document.createElement("label");
          toggleTerrainLabel.innerText = "แสดง Terrain"
          toggleTerrainLabel.htmlFor =  "toggleTerrain" ;
          layers.appendChild(toggleTerrainLabel);
        }

        if (toggleableLayerIds.some(l => !map.current.getLayer(l))) {
          return;
        }

        let layerGroupsSet = new Set()

        Object.values(essentialLayers).forEach(con => {

          // console.log(con);
          layerGroupsSet.add(con.info.group)
        //
        });

        // Set up the corresponding toggle button for each layer.
        layerGroupsSet.forEach(group => {
              const name = document.createElement('p')
              name.textContent = group
              name.id = group
              name.style.textDecoration = 'underline'
              name.style.marginTop = '10px'
              name.style.textAlign = 'center'
              if (!document.getElementById(group)) layers.appendChild(name)

              for (const id of toggleableLayerIds) {
                // Skip layers that already have a button set up.
                if (document.getElementById(id)) {
                  continue;
                }

                if (Object.entries(essentialLayers)
                  .filter(([_, con]) => (con.info.group === group))
                  .map(([name, _]) => name).includes(id)) {


                  // Create a link.
                  const link = document.createElement('a');

                  link.id = id;
                  link.href = '#';
                  link.textContent = mapIds[id] || id;
                  link.className = visibleLayers.includes(id) ? 'active' : '';

                  // Show or hide layer when the toggle is clicked.
                  link.onclick = function (e) {
                    const clickedLayer = this.id;
                    const clickedLayerLabel = clickedLayer + "-label"
                    const clickedLayerExtrude = clickedLayer + "-extrude"

                    const allLayers = [clickedLayer, clickedLayerLabel, clickedLayerExtrude]

                    e.preventDefault();
                    e.stopPropagation();

                    const visibility = map.current.getLayoutProperty(
                      clickedLayer,
                      'visibility'
                    );
                    // Toggle layer visibility by changing the layout object's visibility property.
                    if (!visibility || visibility === 'visible') {
                      allLayers.forEach(layer => {
                        if (map.current.getLayer(layer)) map.current.setLayoutProperty(layer, 
                          'visibility', 
                          'none');
                      });
                      this.className = '';
                    } else {
                      allLayers.forEach(layer => {
                        if (map.current.getLayer(layer)) map.current.setLayoutProperty(layer, 
                          'visibility', 
                          'visible');
                      });
                      this.className = 'active';
                    }
                  };
                  layers.appendChild(link);

                } else {
                  continue
                }
      }

    });

        map.current.off('data', loadSource);
      }
    }

    map.current.on('data', loadSource);

    map.current.on('sourcedata', (e) => {
      // console.log(e);
      // if (e.isSourceLoaded) {
      //   setSpinners(o => ({...o, [e.sourceId] : <>spinning</>}))
      // } else {
      //   setSpinners(o => ({...o, [e.sourceId] : <></>}))
      // }
    })

      // After the last frame rendered before the map enters an "idle" state.
      map.current.on('idle', () => {



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
    map.current.on('draw.modechange', updateArea);

function updateArea(e) {

    console.log(draw.current.getMode());
    const data = draw.current.getAll();
    const answer = document.getElementById('calculated-area');

    const calculationBox = document.getElementById('calculation-box');
    calculationBox.style.display = data.features.length > 0 ? 'block' : 'none'

    if (data.features.length > 0) {
      const area = turf.area(data);
      // Restrict the area to 2 decimal points.
      const rounded_area = Math.round(area * 100) / 100;
      answer.innerHTML = `<p><strong>${rounded_area.toLocaleString()}</strong> ตร.ม.</p>`;
    } else {
      answer.innerHTML = '';
      // if (e.type !== 'draw.delete')
      //   alert('Click the map to draw a polygon.');
    }
}




  });

  // useEffect(() => {

  //   async function checkGeoserver() {

  //     let geoserverUrl = 'http://sppsim.rtaf.mi.th'
  //     console.log(await webexists(geoserverUrl));

  //   }

  //   checkGeoserver()


  // });

  function toggleTerrain(event) {
    event.checked ? map.current.setTerrain({ 'source': 'mapbox-dem', 'exaggeration': 1.5 }) : map.current.setTerrain();
 }


  function toggleSidebar(id) {
    const elem = document.getElementById(id);
    // Add or remove the 'collapsed' CSS class from the sidebar element.
    // Returns boolean "true" or "false" whether 'collapsed' is in the class list.
    const collapsed = elem.classList.toggle('collapsed');
    const duration = 1000
    const padding = {};
    // 'id' is 'right' or 'left'. When run at start, this object looks like: '{left: 300}';
    padding[id] = collapsed ? 0 : 200; // 0 if collapsed, 300 px if not. This matches the width of the sidebars in the .sidebar CSS class.
    // Use `map.easeTo()` with a padding option to adjust the map's center accounting for the position of sidebars.
    map.current.easeTo({
      padding: padding,
      duration // In ms. This matches the CSS transition duration property.
    });

    setTimeout(() => {
      setToggleSymbol(collapsed ? "▶︎" : "◀︎")
    }, duration);
  }

  // useEffect(() => {

  //   console.log(spinners);
  // }, [spinners]);

  let props = {
    lat, lng, zoom, bearing, pitch
  }

  const TitleBlock = () => {
    return (
    <Card sx={{ display: 'flex', bgcolor:"transparent", maxHeight : "15vh"}}>
      <CardMedia
          component="img"
          image="nkrafalogo.png"
          alt="nkrafa logo"
          sx={{ maxHeight: '15vh', width:80, objectFit:'contain'}}
        />
      <CardContent>
      <Box sx={{ textAlign: 'center', typography:'h5', color:'white' }}>ระบบข้อมูลภูมิสารสนเทศของ รร.นนก. ณ ที่ตั้ง อ.มวกเหล็ก จว.สระบุรี</Box>
        </CardContent>
  </Card>)
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

if (compareMode) {
  return (<React.Fragment>

  <div id="comparison-container">
    <div id="before" className="map" />
    <div id="after" className="map" />
 </div>
  <div id='titleblock'><TitleBlock /></div>

  <div className='button-group-right'>
        <Button onClick={() => {
          window.location.reload()
          }}  color="error" variant="contained"  size="small">ออกจากโหมดเปรียบเทียบ</Button>
      </div>
</React.Fragment>) }

return (
  <React.Fragment>
    <div ref={mapContainer} className="map-container" />
    {/* <SidebarMenu {...sidebarmenuProps} /> */}
    {/* <button id='openbtn' className="openbtn" onClick={openNav}>☰</button> */}

    <div id="left" className="sidebar flex-center left collapsed">
        <div className="sidebar-content rounded-rect flex-center">

          <Stack spacing={2} direction="column" >

            <LayersTOC />
            {/* <BaseMaps /> */}
          </Stack>
          <div className="sidebar-toggle left" onClick={event => { toggleSidebar('left'); }}>
          {toggleSymbol}
          </div>
        </div>
    </div>


    <InfoBar {...props} />
    <div id='calculation-box' className="calculation-box">
      <p>ขนาดพื้นที่รวม</p>
      <div id="calculated-area" />
    </div>

    <div id='titleblock'><TitleBlock /></div>
    <div className='button-group-right'>
      <Button onClick={() => setCompareMode(b => !b)}   color="info" variant="contained"  size="small">โหมดเปรียบเทียบ</Button>
    </div>

  </React.Fragment>
);

}

export async function webexists(url) {
  const result = await fetch(url, { method: 'HEAD' });
  return result.ok;
}

export default App;