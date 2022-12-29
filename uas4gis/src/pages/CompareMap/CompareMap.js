import { Link } from "react-router-dom";
import React, { useRef, useEffect, useState, useMemo } from 'react';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxCompare from 'mapbox-gl-compare';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import './CompareMap.css'

import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import { Box } from "@mui/system";


import ('./CompareMap.css')
mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhbG9lbXBob2wiLCJhIjoiY2w0a3JidXJtMG0yYTNpbnhtdnd6cGh0dCJ9.CpVWidx8WhlkRkdK1zTIbw';

export function CompareMap(props) {

  const mapContainer = useRef(null);
  const map = useRef(null);

  //compare map

  const comparemap = useRef()
  const beforeMap = useRef()
  const afterMap = useRef()
  const { orientation } = props
  const [compareMapOptions, setCompareMapOptions] = useState(orientation === 'portrait' ? {
    orientation: 'horizontal'
  } : {});

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

  function setBeforeLayerSelected(e) {
    if (e.target.value === afterMapLayer) setAfterMapLayer(beforeMapLayer)
    setBeforeMapLayer(e.target.value)
  }

  function setAfterLayerSelected(e) {
    setAfterMapLayer(e.target.value)
  }

  useEffect(() => {
    console.log('chaning compare orientation');
    
    setCompareMapOptions(o => ({
      ...o,
      ...orientation === 'portrait' ? {
        orientation: 'horizontal'
      } : {}
    }))    
  }, [orientation]);

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

          let [name, _] = comparableMaps.shift()
          setBeforeMapLayer(name)
        }

        // Object.entries(ortho).slice(0, 1).forEach(([name, con]) => {

        // });
        beforeMap.current.off('data', () => {});
      });


      afterMap.current.on('data', () => {

        if (comparableMaps.length) {

          let [name, _] = comparableMaps.shift()
          setAfterMapLayer(name)

          // if (!afterMap.current.getSource(con.layer.source)) {
          //   console.log(name);
          //   afterMap.current.addSource(con.layer.source, con.src);
          // }
          // if (!afterMap.current.getLayer(name)) {
          //   afterMap.current.addLayer(con.layer);
          // }
        }

        // Object.entries(ortho).slice(1, 2).forEach(([name, con]) => {

        // });

        afterMap.current.off('data', () => {});
      });



      // A selector or reference to HTML element
      const container = '#comparison-container';

      comparemap.current = new MapboxCompare(beforeMap.current, afterMap.current, container, {});
      // CONSIDER using memo

      // {
      //   // Set this to enable comparing two maps by mouse movement:
      //   // mousemove: true
      //   ...orientation === 'portrait' ? {orientation: 'horizontal'} : {}
      // }

    comparemap.current.on('slideend', (e) => {
      console.log(comparemap.current.currentPosition);
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

    if (!beforeMap.current.getSource(con.layer.source)) {
      beforeMap.current.addSource(con.layer.source, con.src);
    }
    if (!beforeMap.current.getLayer( name)) {
      beforeMap.current.addLayer(con.layer);
    }
  }

  function loadAfterMap(name, con) {

    if (!afterMap.current.getSource(con.layer.source)) {
      afterMap.current.addSource(con.layer.source, con.src);
    }
    if (!afterMap.current.getLayer( name)) {
      afterMap.current.addLayer(con.layer);
    }

  }

  const beforeMapRenderer = useMemo(() => {
    if (beforeMapLayer && beforeMapLayer !== 'basemap') {
      let selected = ortho[beforeMapLayer]
      loadBeforeMap(beforeMapLayer, selected)
    }
    Object.keys(ortho).forEach((currentName) => {
        if (beforeMap.current && beforeMap.current.getLayer(currentName)) {

          beforeMap.current.setLayoutProperty(currentName,
            'visibility',
            currentName !== beforeMapLayer ? 'none' : 'visible'
          );

        }

      });
      return (<div id="before" className="map" />)
  }, [beforeMapLayer])


  const afterMapRenderer = useMemo(() => {
    if (afterMapLayer && afterMapLayer !== 'basemap') {
      let selected = ortho[afterMapLayer]
      loadAfterMap(afterMapLayer, selected)
    }
    Object.keys(ortho).forEach((currentName) => {
        if (afterMap.current && afterMap.current.getLayer( currentName)) {
          
          afterMap.current.setLayoutProperty( currentName,
            'visibility',
            currentName !== afterMapLayer  ? 'none' : 'visible'
          );
        }
      });
      return (<div id="after" className="map" />)
  }, [afterMapLayer])

return (<div>

<div ref={mapContainer} className="map-container" />
    <div id="comparison-container">
      {beforeMapRenderer}
      {afterMapRenderer}
  </div>
  
    {/* <div id='titleblock'>{orientation}</div> */}
  

    <div className='button-group-right back'>
      <Button id="comparebutton" component={Link} to="/" color="error" variant="contained"  size="small">ออกจากโหมดเปรียบเทียบ</Button>
    </div>


    {ortho && Object.entries(ortho).length > 2 
    ? (<Box className="beforemap-select" sx={{ p:1, m:2, minWidth: 60 }}>
    <FormControl fullWidth>
      <InputLabel variant="standard" htmlFor="uncontrolled-native">
        เลือก layer ซ้าย
      </InputLabel>
      <NativeSelect
        id="beforemap-layer"
        name="beforemap-layer" 
        value={beforeMapLayer} 
        size="small"
        
        onChange={setBeforeLayerSelected}>
        { /* Each value matches a layer ID. */ }
        <option key={'basemap'} value={'basemap'}>-</option>
        {Object.entries(ortho).map(([name, con]) => {
            return (<option key={name} value={name}>{con.info.desc}</option>)  
          })}              
      </NativeSelect>
    </FormControl>
  </Box>)
    : <></>}


{ortho && Object.entries(ortho).length > 2 
    ? (<Box className="aftermap-select" sx={{ p:1, m:2, minWidth: 60 }}>
    <FormControl fullWidth>
      <InputLabel variant="standard" htmlFor="uncontrolled-native">
        เลือก layer ขวา
      </InputLabel>
      <NativeSelect
        id="aftermap-layer"
        name="aftermap-layer" 
        value={afterMapLayer} 
        onChange={setAfterLayerSelected}>
        { /* Each value matches a layer ID. */ }
        <option key={'basemap'} value={'basemap'}>-</option>
        {Object.entries(ortho)
        .filter(([name, _]) => (name !== beforeMapLayer))
        .map(([name, con]) => {
            return (<option key={name} value={name}>{con.info.desc}</option>)  
          })}              
      </NativeSelect>
    </FormControl>
  </Box>)
    : <></>}

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
