import { Link } from "react-router-dom";
import React, { useRef, useEffect, useState, useMemo } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxCompare from 'mapbox-gl-compare';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import './CompareMap.css'

import Button from '@mui/material/Button';


import ('./CompareMap.css')
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhbG9lbXBob2wiLCJhIjoiY2w0a3JidXJtMG0yYTNpbnhtdnd6cGh0dCJ9.CpVWidx8WhlkRkdK1zTIbw';

export function CompareMap() {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const comparemap = useRef()
  const beforeMap = useRef()
  const afterMap = useRef()

  const [beforeMapLayer, setBeforeMapLayer] = useState("");
  const [afterMapLayer, setAfterMapLayer] = useState("");

//Longitude: 101.1866 | Latitude: 14.6534 | Zoom: 15.12 | Bearing: 0.00 | Pitch: 0.00
  const start = [101.1866, 14.6534];
  const [_zoom, _bearing, _pitch] = [15, 0, 0]
  const [lng, setLng] = useState(start[0]);
  const [lat, setLat] = useState(start[1]);
  const [zoom, setZoom] = useState(_zoom); //15
  const [bearing, setBearing] = useState(_bearing); //-108
  const [pitch, setPitch] = useState(_pitch); //76
 
  //map data sources
  const ortho = require('../../MapData/nkrafaortho.json')
  const admins = require('../../MapData/vectorAdminSrc.json')
  const constructions = require('../../MapData/vectorConstructionSrc.json')

  function setBeforeLayerSelected(e) {
    setBeforeMapLayer(e.target.value)
  }

  useEffect(() => {

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


      const comparableMaps = Object.entries(ortho).slice(-2)

      afterMap.current.addControl(new mapboxgl.NavigationControl());


      beforeMap.current.on('data', () => {

        if (comparableMaps.length) {

          let [name, con] = comparableMaps.shift()
          loadBeforeMap(name, con)
        }

        // Object.entries(ortho).slice(0, 1).forEach(([name, con]) => {

        // });
        beforeMap.current.off('data', () => {});
      });


      afterMap.current.on('data', () => {

        if (comparableMaps.length) {

          let [name, con] = comparableMaps.shift()
          if (!afterMap.current.getSource(con.layer.source)) {
            console.log(name);
            afterMap.current.addSource(con.layer.source, con.src);
          }
          if (!afterMap.current.getLayer(name)) {
            afterMap.current.addLayer(con.layer);
          }
        }

        // Object.entries(ortho).slice(1, 2).forEach(([name, con]) => {

        // });

        afterMap.current.off('data', () => {});
      });



      // A selector or reference to HTML element
      const container = '#comparison-container';

      comparemap.current = new MapboxCompare(beforeMap.current, afterMap.current, container, {
        // Set this to enable comparing two maps by mouse movement:
        // mousemove: true
      });

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        // style: 'mapbox://styles/mapbox/streets-v11',
        style: 'mapbox://styles/chaloemphol/clasf7ipf00dp14mpio2dnq8h', //'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
        center: [lng, lat],
        pitch,
        bearing,
        zoom,
      });

      // map.current.addControl(new mapboxgl.FullscreenControl());
      map.current.addControl(new mapboxgl.NavigationControl());

      map.current.on('load', () => {

        const layerList = document.getElementById('basemaps_menu');
        const inputs = layerList.getElementsByTagName('input');

        for (const input of inputs) {
          input.onclick = (layer) => {
            const layerId = layer.target.id;
            map.current.setStyle('mapbox://styles/mapbox/' + layerId);
          };
        }



      });


      var loadSource = () => {
        if (map.current.isStyleLoaded()) {


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


          // MARK:- RASTER

          /**
           * BBOX ให้ใช้ {bbox-epsg-3857}
           *
          //  */




          map.current.off('data', loadSource);
        }
      }

      //filtration:

      map.current.on('data', loadSource);

      map.current.on('sourcedata', (e) => {
        console.log(e);
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



  });

  useEffect(() => {

    if (!map.current) return
    
    map.current.on('move', () => {
      setLng(map.current.getCenter().lng.toFixed(4));
      setLat(map.current.getCenter().lat.toFixed(4));
      setZoom(map.current.getZoom().toFixed(2));
      setBearing(map.current.getBearing().toFixed(2));
      setPitch(map.current.getPitch().toFixed(2));
    });
  });

  function loadBeforeMap(name, con) {
    console.log('loading', 'before'+ name);
    if (!beforeMap.current.getSource(con.layer.source)) {
      beforeMap.current.addSource(con.layer.source, con.src);
    }
    if (!beforeMap.current.getLayer('before'+ name)) {
      let beforeLayer = {
        ...con.layer,
        id: 'before' + con.layer.id 
      }
      beforeMap.current.addLayer(beforeLayer);
    }
    Object.keys(ortho).forEach((currentName) => {
      console.log('checking', 'before' + currentName);
      if (beforeMap.current.getLayer('before'+ currentName)) {
        
        map.current.setLayoutProperty('before' + currentName,
          'visibility',
          currentName === name ? 'visible' : 'none'
        );
        console.log('setting ', 'before' + currentName, 'to', currentName === name ? 'visible' : 'none');

      }

    });

  }

  const beforeMapRenderer = useMemo(() => {
    if (beforeMapLayer) {
      let selected = ortho[beforeMapLayer]
      loadBeforeMap(beforeMapLayer, selected)
    }
    console.log('done loaded', beforeMapLayer);
    return (<div id="before" className="map" />)
  }, [beforeMapLayer])

return (<div>

<div ref={mapContainer} className="map-container" />
    <div id="comparison-container">
      {beforeMapRenderer}
      <div id="after" className="map" />
  </div>
    {/* <div id='titleblock'><TitleBlock /></div> */}
  

    {ortho && Object.entries(ortho).length > 2 
    ? (<div className="beforemap-select">
        <div className="beforemap-select">
          <fieldset>
            <label>เลือก layer</label>
              <select id="beforemap-layer" 
              name="beforemap-layer" 
              value={beforeMapLayer} 
              onChange={setBeforeLayerSelected}>
              { /* Each value matches a layer ID. */ }
                {Object.entries(ortho).map(([name, con]) => {
                  return (<option key={name} value={name}>{con.info.desc}</option>)  
                })}
              </select>
          </fieldset>          
        </div>
    </div>)
    : <></>}
    <div className='button-group-right'>
      <Button id="comparebutton" component={Link} to="/" color="error" variant="contained"  size="small">ออกจากโหมดเปรียบเทียบ</Button>
    </div>

  </div>)

}

export async function webexists(url) {
  const result = await fetch(url, { method: 'HEAD' });
  return result.ok;
}

export function normalize(string) {
  return string.trim().toLowerCase();
}

export function getUniqueFeatures(features, comparatorProperty) {
    const uniqueIds = new Set();
    const uniqueFeatures = [];
    for (const feature of features) {
      const id = feature.properties[comparatorProperty];
      if (!uniqueIds.has(id)) {
        uniqueIds.add(id);
        uniqueFeatures.push(feature);
      }
    }
    return uniqueFeatures;
  }
