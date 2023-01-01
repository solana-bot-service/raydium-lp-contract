import { faker } from '@faker-js/faker';
import * as turf from '@turf/turf'

class GenerateGeoJSON {

    createChartPolePolygonFrom({point, distance, bearing, otherOptions, params, setCenter}) {
            const options = {units: 'miles', ...otherOptions};

            const offset = turf.destination(point, distance, bearing, options);            
            const buffered = turf.buffer(offset, 0.03, {units: 'miles'});
            const enveloped = turf.envelope(buffered)
            if (setCenter) setCenter(offset.geometry.coordinates)
            if (params) {
                const bar = turf.polygon(enveloped.geometry.coordinates, params)
                return bar
            }
            return enveloped           
            
    }

    
    createPointsFromPolygons({ polygons }) {

        console.log('polygons', polygons);

        // let coords = feature.geometry.coordinates
        // let polygon = turf.polygon(coords);
        // let centroid = turf.centroid(polygon);

        let features = Array(10).fill().map((f, index) => {

            // let coords = f.geometry.coordinates
            // let polygon = turf.polygon(coords);
            // let centroid = turf.centroid(polygon);
            
            return ({
                "type": "Feature",
                "id": index,
                "geometry": {
                    "type": "Point",
                    "coordinates": [101.1849195510149, 14.652710205265919]
                },
                "geometry_name": "the_geom" + index,
                "properties": {
                    "NAME": "museam" + index,
                    "AREA_SQM": faker.datatype.uuid(),
                    "THUMBNAIL": "pics/22037827-Ti.jpg",
                    "MAINPAGE": "pics/22037827-L.jpg"
                }
            })
        })
        return ({
            "type": "FeatureCollection",
            "features": features
        })

        let g = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "id": "poi.1",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-74.0104611, 40.70758763]
                },
                "geometry_name": "the_geom",
                "properties": {
                    "NAME": "museam",
                    "THUMBNAIL": "pics/22037827-Ti.jpg",
                    "MAINPAGE": "pics/22037827-L.jpg"
                }
            }, {
                "type": "Feature",
                "id": "poi.2",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-74.01083751, 40.70754684]
                },
                "geometry_name": "the_geom",
                "properties": {
                    "NAME": "stock",
                    "THUMBNAIL": "pics/22037829-Ti.jpg",
                    "MAINPAGE": "pics/22037829-L.jpg"
                }
            }, {
                "type": "Feature",
                "id": "poi.3",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-74.01053024, 40.70938712]
                },
                "geometry_name": "the_geom",
                "properties": {
                    "NAME": "art",
                    "THUMBNAIL": "pics/22037856-Ti.jpg",
                    "MAINPAGE": "pics/22037856-L.jpg"
                }
            }, {
                "type": "Feature",
                "id": "poi.4",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-74.00857344, 40.71194565]
                },
                "geometry_name": "the_geom",
                "properties": {
                    "NAME": "lox",
                    "THUMBNAIL": "pics/22037884-Ti.jpg",
                    "MAINPAGE": "pics/22037884-L.jpg"
                }
            }, {
                "type": "Feature",
                "id": "poi.5",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-74.01183158, 40.70852996]
                },
                "geometry_name": "the_geom",
                "properties": {
                    "NAME": "church",
                    "THUMBNAIL": "pics/22037839-Ti.jpg",
                    "MAINPAGE": "pics/22037839-L.jpg"
                }
            }, {
                "type": "Feature",
                "id": "poi.6",
                "geometry": {
                    "type": "Point",
                    "coordinates": [-74.00153046, 40.71988512]
                },
                "geometry_name": "the_geom",
                "properties": {
                    "NAME": "fire",
                    "THUMBNAIL": "pics/28640984-Ti.jpg",
                    "MAINPAGE": "pics/28640984-L.jpg"
                }
            }],
            "totalFeatures": 6,
            "numberMatched": 6,
            "numberReturned": 6,
            "timeStamp": "2023-01-01T09:06:36.989Z",
            "crs": {
                "type": "name",
                "properties": {
                    "name": "urn:ogc:def:crs:EPSG::4326"
                }
            }
        }

    }

}

export default GenerateGeoJSON