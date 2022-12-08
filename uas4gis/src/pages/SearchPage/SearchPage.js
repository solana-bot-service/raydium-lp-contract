export function SearchMap() {
    return (<><div id="map" />
 
    <div className="map-overlay">
    <fieldset>
    <input id="feature-filter" type="text" placeholder="Filter results by name" />
    </fieldset>
    <div id="feature-listing" className="listing" />
    </div></>)
}