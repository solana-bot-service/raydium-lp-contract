
import { Link } from "react-router-dom";
import React, { useRef, useEffect, useState, useMemo } from 'react';
import ReactDOM from "react-dom"

import './MainMap.css'
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css'
import * as turf from '@turf/turf'
import { LayersTOC } from '../../mapLayouts/LayersTOC/LayersTOC';

import { unit } from 'mathjs'

import { useLiff } from 'react-liff';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';


import Stack from '@mui/material/Stack';
import { Box } from '@mui/system';
import SearchControl from "../../MapControls/SearchControl";
import { Paper } from "@mui/material";
import GenerateGeoJSON from "../../Utils/GenerateGeoJSON";
import PersonCard from "../../mapLayouts/Popups/Person";
import { isLocalhost } from "../../App";
import BuildingCard from "../../mapLayouts/Popups/Building";

mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhbG9lbXBob2wiLCJhIjoiY2w0a3JidXJtMG0yYTNpbnhtdnd6cGh0dCJ9.CpVWidx8WhlkRkdK1zTIbw';

export function MainMap(props) {

  const mapContainer = useRef(null);
  const map = useRef(null);
  const searchables = useRef()
  const popup = useRef()
  const searchableBBox = useRef()

  const { error, isReady, liff } = useLiff();
  let { isLoggedIn } =  useLiff();
  if (isLocalhost) isLoggedIn = true

  const draw = useRef(null);
//Longitude: 101.1866 | Latitude: 14.6534 | Zoom: 15.12 | Bearing: 0.00 | Pitch: 0.00
  const start = [101.1866, 14.6534];
  const [_zoom, _bearing, _pitch] = [15, 0, 0]
  const [lng, setLng] = useState(start[0]);
  const [lat, setLat] = useState(start[1]);
  const [zoom, setZoom] = useState(_zoom); //15
  const [bearing, setBearing] = useState(_bearing); //-108
  const [pitch, setPitch] = useState(_pitch); //76
//   const [compareMode, setCompareMode] = useState(false);
  const [toggleSymbol, setToggleSymbol] = useState("▶︎");
  const [mode, setMode] = useState("");
  const [mapReady, setMapReady] = useState(false);
  const searchFields = useRef();
  // const [searchingLayer, setSearchingLayer] = useState('');
  const searchingLayer = useRef()

  //map data sources
  const ortho = require('../../MapData/nkrafaortho.json')
  const admins = require('../../MapData/vectorAdminSrc.json')
  const constructions = require('../../MapData/vectorConstructionSrc.json')
  const essentialLayers = {...ortho, ...constructions} //...admins,


  const mapIds = Object.entries(essentialLayers).reduce((p, [name, con]) => {
    return {...p, [name] : con.info.desc}
  }, {'nkrafa-dem-layer': 'ชั้นความสูง DEM', personnel: 'บุคคล'});
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
  }, ['personnel'])
  //['nkrafa-ortho-6508-layer', 'nkrafa-ortho-6509-layer', 'roads', 'buildings']//['provinces']

  function toggleVisibility(id) {
    if (!visibleLayers.includes(id)) map.current.setLayoutProperty(
      id,
      'visibility',
      'none'
    );
  }

  const [spinners, setSpinners] = useState(toggleableLayerIds.reduce((p, id) => ({...p, [id]: <></>}), {}));


  function zoomToFeature(feature) {

    let centroid
    switch (feature.geometry.type) {
      case 'Point':
        centroid = feature
        break;

      default:
        let coords = feature.geometry.coordinates
        let polygon = turf.polygon(coords);
        centroid = turf.centroid(polygon);
        break
    }

    let flyParams = {
      // These options control the ending camera position: centered at
      // the target, at zoom level 9, and north up.
      center: centroid.geometry.coordinates,
      // These options control the flight curve, making it move
      // slowly and zoom out almost completely before starting
      // to pan.
      // zoom,
      // bearing: 45,
      // pitch: 20,
      speed: 1.5, // make the flying slow
      curve: 1, // change the speed at which it zooms out

      // This can be any easing function: it takes a number between
      // 0 and 1 and returns another number between 0 and 1.
      easing: (t) => t,

      // this animation is considered essential with respect to prefers-reduced-motion
      essential: true
    }
    // map.flyTo({center: centroid.geometry.coordinates, zoom: 12});

    map.current.flyTo(flyParams);

  }

  useEffect(() => {

    console.log('map.current', map.current);
    console.log('isLoggedIn', isLoggedIn);

    if (!map.current) return
    console.log('map.current.isStyleLoaded()', map.current.isStyleLoaded());
    console.log('mapReady', mapReady);
    if (mapReady) {

      Object.entries(constructions).forEach(([name, con]) => {

        if (con.roles && con.roles.rtafregistered && !isLoggedIn) {
          console.log('hiding ', name);
          map.current.setLayoutProperty(
          name,
          'visibility',
          'none'
        )}

        if (con.info.extrude && map.current.getLayer(con.extrude.id)) {


          if (con.extrude.roles && con.extrude.roles.rtafregistered && !isLoggedIn) {
            console.log('hiding ', con.extrude.id);
              map.current.setLayoutProperty(
                con.extrude.id,
                'visibility',
                'none'
              )
            }

        }


        if (con.populatePersonnel) {

          if (con.populatePersonnel.roles && con.populatePersonnel.roles.rtafregistered && !isLoggedIn) {
            console.log('hiding ', con.populatePersonnel.layer.id);
            [con.populatePersonnel.layer.id, con.populatePersonnel.label.id].forEach(l => map.current.setLayoutProperty(
              l,
              'visibility',
              'none'
            ))
          }
        }

      });
    }

  }, [mapReady, map.current, isLoggedIn]);

  useEffect(() => {

    if (map.current) return; // initialize map only once


    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      // style: 'mapbox://styles/mapbox/streets-v11',
      style: 'mapbox://styles/chaloemphol/cjkje3cwt17e72smseq2pmmxu',// 'mapbox://styles/chaloemphol/clasf7ipf00dp14mpio2dnq8h',//'mapbox://styles/mapbox-map-design/ckhqrf2tz0dt119ny6azh975y',
      center: [lng, lat],
      pitch,
      bearing,
      zoom,
    });

    popup.current = new mapboxgl.Popup({
      closeButton: false
    });

    // map.current.addControl(new mapboxgl.FullscreenControl());
    map.current.addControl(new mapboxgl.NavigationControl());

    if (!draw.current) draw.current = new MapboxDraw({
      displayControlsDefault: false,
      // Select which mapbox-gl-draw control buttons to add to the map.
      controls: {
        line_string: true,
        // combine_features: true,
        // uncombine_features: true,
        polygon: true,
        trash: true
      },
      styles: [
  // ACTIVE (being drawn)
  // line stroke
  {
      "id": "gl-draw-line",
      "type": "line",
      "filter": ["all", ["==", "$type", "LineString"], ["!=", "mode", "static"]],
      "layout": {
        "line-cap": "round",
        "line-join": "round"
      },
      "paint": {
        "line-color": "#ffc800",
        "line-dasharray": [0.2, 2],
        "line-width": 4
      }
  },
  // polygon fill
  {
    "id": "gl-draw-polygon-fill",
    "type": "fill",
    "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
    "paint": {
      "fill-color": "#ffc800",
      "fill-outline-color": "#ffc800",
      "fill-opacity": 0.1
    }
  },
  // polygon mid points
  {
    'id': 'gl-draw-polygon-midpoint',
    'type': 'circle',
    'filter': ['all',
      ['==', '$type', 'Point'],
      ['==', 'meta', 'midpoint']],
    'paint': {
      'circle-radius': 3,
      'circle-color': '#fbb03b'
    }
  },
  // polygon outline stroke
  // This doesn't style the first edge of the polygon, which uses the line stroke styling instead
  {
    "id": "gl-draw-polygon-stroke-active",
    "type": "line",
    "filter": ["all", ["==", "$type", "Polygon"], ["!=", "mode", "static"]],
    "layout": {
      "line-cap": "round",
      "line-join": "round"
    },
    "paint": {
      "line-color": "#ffc800",
      "line-dasharray": [0.2, 2],
      "line-width": 4
    }
  },
  // vertex point halos
  {
    "id": "gl-draw-polygon-and-line-vertex-halo-active",
    "type": "circle",
    "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    "paint": {
      "circle-radius": 5,
      "circle-color": "#FFF"
    }
  },
  // vertex points
  {
    "id": "gl-draw-polygon-and-line-vertex-active",
    "type": "circle",
    "filter": ["all", ["==", "meta", "vertex"], ["==", "$type", "Point"], ["!=", "mode", "static"]],
    "paint": {
      "circle-radius": 3,
      "circle-color": "#a17e00",
    }
  },

  // INACTIVE (static, already drawn)
  // line stroke
]
      // Set mapbox-gl-draw to draw by default.
      // The user does not have to click the polygon control button first.
      // defaultMode: 'draw_polygon'
    });
    map.current.addControl(draw.current);


    // Search Control


    // const searchControl = new SearchControl();

    // map.current.addControl(searchControl);


    const filterEl = document.getElementById('feature-filter');
    const listingEl = document.getElementById('feature-listing');


    function renderListings(features) {

      const empty = document.createElement('p');
      // Clear any existing listings
      listingEl.innerHTML = '';
      if (features.length) {
        for (const feature of features) {

          const mainLayerId = feature.layer.id.split('-')[0]

          let fields = searchFields.current[mainLayerId]
          // const labels = Object.entries()
          const itemLink = document.createElement('a');
          let [field, value] = Object.entries(fields).shift()
          const label = [value.prefix, feature.properties[field]].join(" ")

          //`${mapIds[mainLayerId]} ${feature.properties['AREA_SQM']}`;

          // itemLink.href = '#' //feature.properties.wikipedia;
          itemLink.target = '_self';
          itemLink.textContent = label;
          itemLink.addEventListener('mousedown', () => zoomToFeature(feature))

          // itemLink.onmousedown = () => zoomToFeature(feature)
          itemLink.addEventListener('mouseover', () => {

            let centroid
            switch (feature.geometry.type) {
              case 'Point':
                centroid = feature
                break;

              default:
                let coords = feature.geometry.coordinates
                let polygon = turf.polygon(coords);
                centroid = turf.centroid(polygon);
                break
            }

            console.log('feature.layer.id', feature.layer.id);
            let domContent
            switch (feature.layer.id) {
              case 'personnel':
                domContent = <PersonCard profile={feature.properties} />
                break;
              case 'buildings':
                domContent = <BuildingCard building={feature.properties} />
                break;
              default:
                domContent = <></>
                break;
            }

            // Highlight corresponding feature on the map
            const popupNode = document.createElement("div")
            ReactDOM.render(
              domContent,
              popupNode
            )
            popup.current
            .setLngLat(centroid.geometry.coordinates)
            // .setText(label)
            .setDOMContent(popupNode)
            .addTo(map.current);
          });

          listingEl.appendChild(itemLink);
        }

        // Show the filter input
        filterEl.parentNode.style.display = 'block';
      } else if (features.length === 0 && filterEl.value !== '') {
          empty.textContent = 'ไม่พบผลลัพธ์ค้นหา';
          listingEl.appendChild(empty);
      } else {
          empty.textContent = 'เลื่อนแผนที่เพื่อค้นหาและดูผลลัพธ์';
          listingEl.appendChild(empty);

          // Hide the filter input
          // filterEl.parentNode.style.display = 'none';

          // remove features filter

          Array.from(searchingLayer.current).forEach(l => {
            let fields = searchFields.current[l]
            // console.log(fields);

            let [field, _] = Object.entries(fields).shift()
            // const label = [value.prefix, feature.properties[field]].join(" ")
            // const name = normalize(`${feature.properties[field]}`);//'AREA_SQM']}`);
            map.current.setFilter(l, ['has', field]);
          })

      }
    }


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




    var loadSource = () => {
      if (map.current.isStyleLoaded()) {
        setMapReady(true)


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
          }
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
          map.current.addSource(con.layer.source, con.src);
        }
        if (!map.current.getLayer(name)) {
          map.current.addLayer(con.layer);
          toggleVisibility(name)
        }
      });

        // Admin areas
        // Object.entries(admins).sort((a, b) => a[1].id - b[1].id).forEach(([name, con]) => {
        //   if (!map.current.getSource(con.layer.source)) map.current.addSource(con.layer.source, con.src);
        //   if (!map.current.getLayer(name)) {
        //     map.current.addLayer(con.layer);
        //     toggleVisibility(name)
        //   }
        // });

        // Buildings and roads
        if (!searchingLayer.current) searchingLayer.current = new Set()
        if (!searchFields.current) searchFields.current = {}

        Object.entries(constructions).forEach(([name, con]) => {

          if (con.searchable) {
            searchingLayer.current.add(name)
            searchFields.current[name] = con.searchable.fields
          }


          if (!map.current.getSource(con.layer.source)) {
            map.current.addSource(con.layer.source, con.src);

          }
          if (!map.current.getLayer(name)) {
            map.current.addLayer(con.layer);
            toggleVisibility(name)

            if (con.label && !map.current.getLayer(name + "-label")) map.current.addLayer(con.label);
          }

          if (con.info.extrude && !map.current.getLayer(con.extrude.id)) {

            map.current.addLayer(con.extrude)
            searchingLayer.current.add(con.extrude.id)
            searchFields.current[con.extrude.id] = con.searchable.fields

          }


          if (con.populatePersonnel) {

            // console.log('e.sourceId', e.sourceId);

            let generateGeoJSON = new GenerateGeoJSON()
            let personnelMap = con.populatePersonnel


            if (!map.current.getSource(personnelMap.layer.source)) {

              let src = {
                'type': 'geojson',
                'data': generateGeoJSON.createPointsFromPolygons({
                  polygons: []
                })
              }
              map.current.addSource(personnelMap.layer.source, src);
            }

            if (!map.current.getLayer(personnelMap.layer.id)) {
              map.current.addLayer(personnelMap.layer);
              toggleVisibility(personnelMap.layer.id)

              if (personnelMap.label && !map.current.getLayer(personnelMap.label.id)) map.current.addLayer(personnelMap.label);
              searchingLayer.current.add(personnelMap.layer.id)
              if (personnelMap.searchable) searchFields.current[personnelMap.layer.id] = personnelMap.searchable.fields
            }



          }




        });


        // console.log('searchingLayer in loadSource', searchingLayer.current);

        // let features = []
        // Array.from(searchingLayer.current).forEach(sourceId => {
        //   let f = map.current.querySourceFeatures({  sourceId : 'buildings-source' })
        //   console.log('====================================');
        //   console.log(f);
        //   console.log('====================================');
        //   features = [...features, ...map.current.querySourceFeatures({  sourceId : sourceId })];
        // })

        // if (features) {
        //   const uniqueFeatures = getUniqueFeatures(features, 'AREA_SQM');
        //   // Populate features for the listing overlay.
        //     renderListings(uniqueFeatures);

        //   // Clear the input container
        //   //TODO:- uncomment here
        //   filterEl.value = '';

        //   // Store the current features in sn `airports` variable to
        //   // later use for filtering on `keyup`.
        //   searchables.current = uniqueFeatures;

        // console.log('searchables in loadSource', searchables.current);

        // }



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


        // Call this function on initialization
        // passing an empty array to render an empty state
        renderListings([]);
      }
    }

    //filtration:

      map.current.on('movestart', () => {
        if (!searchables.current) {

        // reset features filter as the map starts moving
          Array.from(searchingLayer.current).forEach(l => {
            let fields = searchFields.current[l]
            // console.log(fields);

            let [field, _] = Object.entries(fields).shift()
            map.current.setFilter(l, ['has', field]);
            if (map.current.getLayer(l + "-label")) map.current.setFilter(l + "-label", ['has', field])
          })
        }
      });

      map.current.on('moveend', () => {

        if (!searchables.current) {

          const features = map.current.queryRenderedFeatures({ layers: Array.from(searchingLayer.current) });
          if (features) {
            const uniqueFeatures = getUniqueFeatures(features, 'AREA_SQM');
            // Populate features for the listing overlay.
              renderListings([]);

            // Clear the input container
            //TODO:- uncomment here
            filterEl.value = '';

            // Store the current features in sn `airports` variable to
            // later use for filtering on `keyup`.
            searchables.current = uniqueFeatures//features//uniqueFeatures;

            //log
            // console.log(uniqueFeatures.filter(f => f.layer.id !== 'personnel').map(feature => feature.properties['AREA_SQM']).join(", "));

            // console.log(uniqueFeatures.filter(f => f.layer.id !== 'personnel').map(feature => {

            //   let centroid
            //   switch (feature.geometry.type) {
            //     case 'Point':
            //       centroid = feature
            //       break;

            //     default:
            //       let coords = feature.geometry.coordinates
            //       let polygon = turf.polygon(coords);
            //       centroid = turf.centroid(polygon);
            //       break
            //   }
            //   return `[${centroid.geometry.coordinates[0]}, ${centroid.geometry.coordinates[1]}]`
            // }).join(", "));

          }
        }

      });


    //draw tools
    map.current.on('draw.create', updateCalculation);
    map.current.on('draw.delete', updateCalculation);
    map.current.on('draw.update', updateCalculation);
    map.current.on('draw.modechange', updateCalculation);
    map.current.on('draw.render', updateCalculation);

    map.current.on('data', loadSource);

    map.current.on('sourcedata', (e) => {

      // const mainLayerId = e.sourceId.split('-')[0]


          // if (e.isSourceLoaded && constructions[mainLayerId] && constructions[mainLayerId].populatePersonnel) {

          //   console.log('e.sourceId', e.sourceId);

          //   let generateGeoJSON = new GenerateGeoJSON()
          //   let personnelMap = constructions[mainLayerId].populatePersonnel


          //   if (!map.current.getSource(personnelMap.layer.source)) {

          //     console.log('e', e);

          //     var polygons = map.current.querySourceFeatures(e.source)
          //     console.log('polygons', polygons);

          //     let src = {
          //       'type': 'geojson',
          //       'data': generateGeoJSON.createPointsFromPolygons({
          //         polygons: polygons
          //       })
          //     }
          //     console.log('src', src);
          //     map.current.addSource(personnelMap.layer.source, src);
          //   }

          //   if (!map.current.getLayer(personnelMap.layer.id)) {
          //     map.current.addLayer(personnelMap.layer);
          //     toggleVisibility(personnelMap.layer.id)

          //     if (personnelMap.label && !map.current.getLayer(personnelMap.label.id)) map.current.addLayer(personnelMap.label);
          //     // searchingLayer.current.add(personnelMap.layer.id)
          //   }



          // }



          if (searchingLayer.current) {

             var fs = Array.from(searchingLayer.current).reduce((p, c) => {

              if (`${e.sourceId}` !== (c + '-source') || !e.isSourceLoaded || !map.current.getSource(c + '-source')) return p

              var f = map.current.querySourceFeatures(c + '-source')

              console.log(f.length);
              if (f.length === 0) return p
              // console.log('====================================');
              // console.log(constructions[c].src);
              // console.log('====================================');
              // let newbbox = turf.bbox(constructions[c].src);
              // console.log('====================================');
              // console.log(newbbox);
              // console.log('====================================');
              return Array.isArray(p) ? [...p, ...f] : [...f]
            }, [])
          }

          if (fs && fs.length) {
            let newBbox = turf.bbox({
              type: 'FeatureCollection',
              features: fs
            });
            searchableBBox.current = newBbox
          }


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


    function updateCalculation(e) {

        let mode = draw.current.getMode()

        let data = draw.current.getAll();
        // if (e.type !== 'draw.render') console.log(data);
        const answer = document.getElementById('calculated-area');
        let headerText = document.createElement('p')
        headerText.id = 'headerText'

        const calculationBox = document.getElementById('calculation-box');
        if (!document.getElementById('headerText') && calculationBox) calculationBox.prepend(headerText)

        calculationBox.style.display = data.features.length > 0 ? 'block' : 'none'

        const searchContainer = document.getElementById('search_container');
        if (searchContainer) searchContainer.style.maxHeight =  data.features.length > 0 ?'50%' : '80%'

        const ButtonGroupRight = document.getElementById('button-group-right');
        if (ButtonGroupRight) ButtonGroupRight.style.maxHeight =  data.features.length > 0 ?'50%' : '80%'

        if (e.type === 'draw.update') {
          // switch (data.features.) {
          //   case value:

          //     break;

          //   default:
          //     break;
          // }
        }
        switch (mode) {
          case 'draw_polygon':

            document.getElementById('headerText').textContent = 'ขนาดพื้นที่รวม'
            data.features = data.features.filter(f => f.geometry.type === 'Polygon')
            console.log(data);

            if (data.features.length > 0) {
              const displayingUnit = 'm2'
              const area = turf.area(data);
              // Restrict the area to 2 decimal points.
              // const rounded_area = Math.round(area * 100) / 100;
              answer.innerHTML = `<div>${unit(area, displayingUnit).format({notation: 'fixed', precision: 2}).toString()}</div>` //; //<p><strong>${rounded_area} sqm.</strong></p>
            } else {
              answer.innerHTML = '';
              // if (e.type !== 'draw.delete')
              //   alert('Click the map to draw a polygon.');
            }
            break;

          case 'draw_line_string':

            document.getElementById('headerText').textContent = 'ระยะทางรวม'
            data.features = data.features.filter(f => f.geometry.type === 'LineString')
            console.log(data);

            if (data.features.length > 0) {
              const displayingUnit = 'meters'
              const length = turf.length(data, { units : 'meters'});
              // Restrict the area to 2 decimal points.
              // console.log(length);
              // const rounded_length = length.toFixed(3);
              answer.innerHTML = `<div>${unit(length, displayingUnit).format({notation: 'fixed', precision: 2}).toString()}</div>`
            } else {
              answer.innerHTML = '';
              // if (e.type !== 'draw.delete')
              //   alert('Click the map to draw a polygon.');
            }
            break;


          default:
            break;
        }



    }

    // setHandleResetView(() => {
    //       // depending on whether we're currently at point a or b, aim for
    //       // point a or b
    //       // const target = isAtStart ? end : start;

    //       // and now we're at the opposite point
    //       // isAtStart = !isAtStart;
    //       let flyParams = {
    //         // These options control the ending camera position: centered at
    //         // the target, at zoom level 9, and north up.
    //         center: start,
    //         zoom: _zoom,
    //         bearing: _bearing,
    //         pitch: _pitch,

    //         // These options control the flight curve, making it move
    //         // slowly and zoom out almost completely before starting
    //         // to pan.
    //         speed: 1.5, // make the flying slow
    //         curve: 1, // change the speed at which it zooms out

    //         // This can be any easing function: it takes a number between
    //         // 0 and 1 and returns another number between 0 and 1.
    //         easing: (t) => t,

    //         // this animation is considered essential with respect to prefers-reduced-motion
    //         essential: true
    //       }

    //       map.current.flyTo(flyParams);
    //     })

  // const element = document.getElementById('titleblock')
  //   if (element.getAttribute('listener') !== 'true') element.addEventListener('click', () => {
  //     // depending on whether we're currently at point a or b, aim for
  //     // point a or b
  //     // const target = isAtStart ? end : start;

  //     // and now we're at the opposite point
  //     // isAtStart = !isAtStart;
  //     let flyParams = {
  //       // These options control the ending camera position: centered at
  //       // the target, at zoom level 9, and north up.
  //       center: start,
  //       zoom: _zoom,
  //       bearing: _bearing,
  //       pitch: _pitch,

  //       // These options control the flight curve, making it move
  //       // slowly and zoom out almost completely before starting
  //       // to pan.
  //       speed: 1.5, // make the flying slow
  //       curve: 1, // change the speed at which it zooms out

  //       // This can be any easing function: it takes a number between
  //       // 0 and 1 and returns another number between 0 and 1.
  //       easing: (t) => t,

  //       // this animation is considered essential with respect to prefers-reduced-motion
  //       essential: true
  //     }

  //     map.current.flyTo(flyParams);
  //   });

    if (filterEl.getAttribute('listener') !== 'true') {
      filterEl.addEventListener('keyup', (e) => {

        const value = normalize(`${e.target.value}`);
        if (value === '') {
          renderListings([])
          popup.current.remove()
          return map.current.fitBounds(searchableBBox.current)
        }

        // Filter visible features that match the input value.
        const filtered = [];


        for (const feature of searchables.current) {

          // console.log(feature.layer.id);
          let mainLayerId = feature.layer.id.split('-')[0]

          let fields = searchFields.current[mainLayerId]
          // console.log(fields);

          let [field, _] = Object.entries(fields).shift()
          // const label = [value.prefix, feature.properties[field]].join(" ")

          const name = normalize(`${feature.properties[field]}`);//'AREA_SQM']}`);
          if (name.includes(value)) { //|| code.includes(value)) {
            filtered.push(feature);
          }
        }

        // Populate the sidebar with filtered results
        renderListings(filtered);

        // Set the filter to populate features into the layer.
        // if (false) { //(filtered.length) { //

        //   Array.from(searchingLayer.current).forEach(layerComponents => {
        //     let visibleLayers = []
        //     let targets = [layerComponents, layerComponents + "-label"]
        //     targets.forEach(layer => {
        //       if (map.current.getLayer(layer)) visibleLayers.push(layer)
        //     })
        //     visibleLayers.forEach(l => {
        //       map.current.setFilter(l, [
        //         'match',
        //         ['get', 'AREA_SQM'],
        //         filtered.map((feature) => {
        //           return feature.properties['AREA_SQM'];
        //         }),
        //         true,
        //         false
        //       ]);
        //     })
        //   });
        // }
      });

      filterEl.addEventListener('focus' , (e) => {
        const value = normalize(`${e.target.value}`);
        if (value === '') map.current.fitBounds(searchableBBox.current)
      })
    }
  })

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

  // useEffect(() => {

  //   async function checkGeoserver() {

  //     let geoserverUrl = 'https://sppsim.rtaf.mi.th'
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

    // console.log('collapsed', collapsed);
    // console.log('newMode', newMode);
    // console.log('padding', padding);
    // console.log('newMode === mode', newMode === mode);

    setTimeout(() => {
      console.log('setting arrow');
      console.log(collapsed);
      setToggleSymbol(collapsed ? "▶︎" : "◀︎")
    }, duration);
  }

  // useEffect(() => {

  //   console.log(spinners);
  // }, [spinners]);


  const SidebarContent = useMemo(() => {
    return (<LayersTOC mode={mode} />)
  }, [mode])

  const TitleBlock = () => {
    console.log('in TitleBlock');
    return (
    <Card sx={{ display: 'flex', bgcolor:"transparent", maxHeight : "15vh"}}>
      <CardMedia
          component="img"
          image="nkrafalogo.png"
          alt="nkrafa logo"
          sx={{  width:80, objectFit:'contain'}}
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


// return (
//     <React.Fragment>
//       <div ref={mapContainer} className="map-container" />
//       {/* <SidebarMenu {...sidebarmenuProps} /> */}
//       {/* <button id='openbtn' className="openbtn" onClick={openNav}>☰</button> */}

//       <div id="left" className="sidebar flex-center left collapsed">
//           <div className="sidebar-content rounded-rect flex-center">

//             <Stack spacing={2} direction="column" >

//               <LayersTOC />
//               {/* <BaseMaps /> */}
//             </Stack>
//             <div className="sidebar-toggle left" onClick={event => { toggleSidebar('left'); }}>
//             {toggleSymbol}
//             </div>
//           </div>
//       </div>


//      {/* <InfoBar {...info}/> */}
//       <div id='calculation-box' className="calculation-box">
//         <div id="calculated-area" />
//       </div>

//       <div id='titleblock'><TitleBlock /></div>
//       <div className='button-group-right'>
//       <Button component={Link} to="/comparemap" color="info" variant="contained"  size="small">โหมดเปรียบเทียบ</Button>
//         {/* <Button onClick={() => setCompareMode(b => !b)}   color="info" variant="contained"  size="small">โหมดเปรียบเทียบ</Button> */}
//         {/* <SearchBox /> */}
//       </div>

//       <div className="search_container">
//         <fieldset>
//         <input id="feature-filter" type="text" placeholder="ค้นหา" />
//         </fieldset>
//         <div id="feature-listing" className="listing" />
//       </div>
//     </React.Fragment>
//   )

return useMemo(() => {
  return (
    <React.Fragment>
      <div ref={mapContainer} className="map-container searchmode" />
      {/* <SidebarMenu {...sidebarmenuProps} /> */}
      {/* <button id='openbtn' className="openbtn" onClick={openNav}>☰</button> */}

      <div id="left" className="sidebar flex-center left collapsed">
          <div className="sidebar-content rounded-rect flex-center">
            <Stack spacing={2} direction="column" >
              <LayersTOC />
              {/* <BaseMaps /> */}
            </Stack>
            <div className="sidebar-toggle left" onClick={() => { toggleSidebar('left', ""); }}>
              {toggleSymbol}
            </div>
            {/* <div className="sidebar-search-toggle" onClick={() => { toggleSidebar('left', "search"); }}>
              {toggleSymbol}
            </div> */}
          </div>
      </div>


     {/* <InfoBar {...info}/> */}
      <div id='calculation-box' className="calculation-box">
            <Stack direction={"column"} sx={{ p:1, m:1}} className="calculated-area" >
              <div id="calculated-area" />
            </Stack>

      </div>

      {/* <div id='titleblock'><TitleBlock /></div> */}
      <div className='button-group-right'>
        {/* <Button onClick={() => setCompareMode(b => !b)}   color="info" variant="contained"  size="small">โหมดเปรียบเทียบ</Button> */}
        {/* <SearchBox /> */}
        <div id="search_container" className="search_container">
          <fieldset>
          <input id="feature-filter" type="text" placeholder="ค้นหา" />
          </fieldset>
          <div id="feature-listing" className="listing" />
        </div>
        <Button id="comparebutton" component={Link} to="/comparemap" color="info" variant="contained"  size="small">โหมดเปรียบเทียบ</Button>
      </div>


    </React.Fragment>
  )
}, [toggleSymbol])

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
