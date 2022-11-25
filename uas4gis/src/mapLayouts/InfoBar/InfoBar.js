import './InfoBar.css'

export const InfoBar = ({
  lat,
  lng,
  zoom,
  bearing,
  pitch
}) => {
    return (<div className="infobar">
    Longitude: {lng} | Latitude: {lat} | Zoom: {zoom} | Bearing: {bearing} | Pitch: {pitch} 
  </div>)
}