import { useEffect } from 'react'
import './BaseMaps.css'

export const BaseMaps = (props) => {

  const  { setMapstyle } = props

  useEffect(() => {
    

    const layerList = document.getElementById('basemaps_menu');
    const inputs = layerList.getElementsByTagName('input');
      
      for (const input of inputs) {
        // console.log('input', input);
            input.onclick = (layer) => {
              // console.log('layer', layer);
            const layerId = layer.target.id;
            setMapstyle(layerId)
            };
      }
    }, [setMapstyle])
  

    return (<div id="basemaps_menu">
    <input id="satellite-v9" type="radio" name="rtoggle" defaultValue="satellite" defaultChecked="checked" />
    {/* See a list of Mapbox-hosted public styles at */}
    {/* https://docs.mapbox.com/api/maps/styles/#mapbox-styles */}
    <label htmlFor="satellite-v9">satellite</label>
    <input id="light-v10" type="radio" name="rtoggle" defaultValue="light" />
    <label htmlFor="light-v10">light</label>
    <input id="dark-v10" type="radio" name="rtoggle" defaultValue="dark" />
    <label htmlFor="dark-v10">dark</label>
    <input id="streets-v11" type="radio" name="rtoggle" defaultValue="streets" />
    <label htmlFor="streets-v11">streets</label>
    <input id="outdoors-v11" type="radio" name="rtoggle" defaultValue="outdoors" />
    <label htmlFor="outdoors-v11">outdoors</label>
  </div>
  )
}