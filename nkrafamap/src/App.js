import './App.css';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"
import { useEffect, useRef } from 'react';



function App() {



  
  const mainmap = useRef()


      
  function toggleSidebar(id) {
    const elem = document.getElementById(id);
    // Add or remove the 'collapsed' CSS class from the sidebar element.
    // Returns boolean "true" or "false" whether 'collapsed' is in the class list.
    const collapsed = elem.classList.toggle('collapsed');
    const padding = {};
    // 'id' is 'right' or 'left'. When run at start, this object looks like: '{left: 300}';
    padding[id] = collapsed ? 0 : 300; // 0 if collapsed, 300 px if not. This matches the width of the sidebars in the .sidebar CSS class.
    // Use `map.easeTo()` with a padding option to adjust the map's center accounting for the position of sidebars.
    mainmap.current.easeTo({
      padding: padding,
      duration: 1000 // In ms. This matches the CSS transition duration property.
    });
  }

  useEffect(() => {

    if (mainmap.current) return
    mapboxgl.accessToken = 'pk.eyJ1IjoiY2hhbG9lbXBob2wiLCJhIjoiY2w0a3JidXJtMG0yYTNpbnhtdnd6cGh0dCJ9.CpVWidx8WhlkRkdK1zTIbw';

    const center = [-77.01866, 38.888];
    mainmap.current = new mapboxgl.Map({
      container: 'map',
      zoom: 12.5,
      center: center,
      pitch: 60,
      // Choose from Mapbox's core styles, or make your own style with Mapbox Studio
      style: 'mapbox://styles/mapbox/streets-v11'
    });

    new mapboxgl.Marker().setLngLat(center).addTo(mainmap.current);

    mainmap.current.on('load', () => {
      toggleSidebar('left');
    });


  });

  return (
    <div className="App">
      <div id="map">
        <div id="left" className="sidebar flex-center left collapsed">
          <div className="sidebar-content rounded-rect flex-center">
          Left Sidebar
            <div className="sidebar-toggle rounded-rect left" onClick={event => { toggleSidebar('left'); }}>
            →
            </div>
          </div>
          </div>
      </div>
    </div>
  );
}

export default App;
