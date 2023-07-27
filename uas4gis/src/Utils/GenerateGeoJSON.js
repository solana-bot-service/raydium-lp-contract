import { fakerTH as faker, fakerEN } from '@faker-js/faker'
import * as turf from '@turf/turf'
import { RANKS } from '../config';

const nkrafaunits = require('../data/nkrafaunits.json')

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

        // let coords = feature.geometry.coordinates
        // let polygon = turf.polygon(coords);
        // let centroid = turf.centroid(polygon);

        const buildingIds = [829, 217, 258, 789, 977, 1035, 2354, 616, 752, 754, 669, 477, 474, 520, 26, 84, 132, 896, 1572, 272, 367, 523, 85, 690, 116, 1741, 3269, 1530, 618, 5009, 921, 3730, 1273, 2625, 1436, 1092, 205, 913, 3040, 181, 274, 52, 2587, 1927, 90, 61, 995, 859, 255, 363, 20, 12, 27, 39, 134, 543, 125, 343, 1613, 231, 360, 1582, 1552, 53, 1271, 103, 1456, 1262, 1323, 1115, 1705, 1393, 2487, 3095, 1665, 633, 59, 976, 1812, 884, 2240, 1605, 66, 1184, 1960, 322, 537, 536, 799, 1484, 783, 1884, 48, 23, 459, 119, 882, 70, 19]        
        const buildingCoords = [[101.18230161922318, 14.658957148321893], [101.1819751560688, 14.658827773899635], [101.18190541863441, 14.658739871519764], [101.18180885910988, 14.65869478506038], [101.18245225399733, 14.658619857230939], [101.18208546191454, 14.658448269056453], [101.18359118700027, 14.657805379786936], [101.18286296725273, 14.658054275232693], [101.18273355066776, 14.658092766425842], [101.18234150111675, 14.658009513071521], [101.18199359625578, 14.65786798217328], [101.1825880408287, 14.657089182210655], [101.18266314268112, 14.656938676607119], [101.18298936635256, 14.65711286088112], [101.18188429623842, 14.655133250051396], [101.18341416120529, 14.656892616695426], [101.18334710597992, 14.656982141609497], [101.18278183043003, 14.657603625136915], [101.1821997910738, 14.657475176624782], [101.18175038695335, 14.657731165292793], [101.1818926781416, 14.657399923933976], [101.18184480071068, 14.65726511791956], [101.18284318596125, 14.657040851771125], [101.18239257484674, 14.656498511960502], [101.1841182410717, 14.656320434840914], [101.18358731269836, 14.655286279692493], [101.18233624845743, 14.654668105128625], [101.18256041407585, 14.653279282619021], [101.18394657969475, 14.653904052719287], [101.18317571282387, 14.653660742509047], [101.18355652460686, 14.653981040797946], [101.18386209011078, 14.653755607033068], [101.18321487307549, 14.653563301664331], [101.18462824395725, 14.652293338595692], [101.18429090827703, 14.653043983756692], [101.18423793464899, 14.65152381194255], [101.18355564773083, 14.652078976731541], [101.18361510336399, 14.651986206092262], [101.18367088692528, 14.651752842661821], [101.18381860000747, 14.651923370424452], [101.1838074401021, 14.650752828486779], [101.18403609842062, 14.650274807653254], [101.1854349821806, 14.650451483199769], [101.18431638926268, 14.65009023779415], [101.18857637047768, 14.648877970210322], [101.18578992784023, 14.648703527089534], [101.18785900825804, 14.64831592469992], [101.18785798549652, 14.648315859181013], [101.18677171213287, 14.647931135786067], [101.1869289278984, 14.648345673170075], [101.18694797158241, 14.648648707236053], [101.18699423968792, 14.64865259977088], [101.18694495409727, 14.64868114502406], [101.18419401347637, 14.656502242224935], [101.18425369262695, 14.656381740109808], [101.18625495582819, 14.65375078791672], [101.18623428046703, 14.652159421199054], [101.18632382154465, 14.652136196112048], [101.18620557444436, 14.651897420524715], [101.18631839752197, 14.651588019851431], [101.18647545576096, 14.651820992043872], [101.18643271923065, 14.651483038074693], [101.18603897094727, 14.652275546557135], [101.18443172425032, 14.651715354516664], [101.18464797735214, 14.65328218030371], [101.18477437645197, 14.652651169687388], [101.18454203009605, 14.65252888136295], [101.1849195510149, 14.652710205265919], [101.18519821337291, 14.652109838416052], [101.1848586526784, 14.651846194874345], [101.18635553866625, 14.648687956904144], [101.18626300245523, 14.648426508215167], [101.18614833801985, 14.648106670979299], [101.18562027812004, 14.648284754809648], [101.18520453572273, 14.648653572838352], [101.18598807603121, 14.650404557555344], [101.18602931499481, 14.650459701609712], [101.18534702807665, 14.650884308338622], [101.18584759533405, 14.650796078225792], [101.18562933057547, 14.650332546454116], [101.18621304631233, 14.650006483778947], [101.18606895208359, 14.649790838831311], [101.18613325059414, 14.649906641148032], [101.18459332734346, 14.650178792399231], [101.18521861732006, 14.649419751957925], [101.1849650144577, 14.649936937851791], [101.18485014885664, 14.649983518242134], [101.18514123558998, 14.650026984601826], [101.18505612015724, 14.649830412741965], [101.18452861905098, 14.649687038388748], [101.18464831262827, 14.649444404770687], [101.18478879332542, 14.649158952985562], [101.1901880800724, 14.647105914131213], [101.19001038372517, 14.647123477008492], [101.19004290550947, 14.647202301360245], [101.19020953774452, 14.646877921070544], [101.18995070457458, 14.646953501707454], [101.18963795900345, 14.646965374056162], [101.18960872292519, 14.646920090551184]]
        
        let features = [...[{
            name: "ผศ.วัชรินทร์ โกมุทผล",
            rank: 'พล.อ.ต.',
            position: "ผอ.สบฑ.รร.นนก.",
            email:'watcharin@rtaf.mi.th',
            imageUrl: "personnel/165928.jpg"
        }, {
            name: "รศ.ปัญญารักษ์ โกศัลวัฒน์",
            rank: 'น.อ.',
            position: "อจ.กกศ.รร.นนก.",
            email:'panyarak@rtaf.mi.th',
            imageUrl: "personnel/165940.jpg"
        }, {
            name: "รศ.สุทธิ์ ศรีบูรพา",
            rank: 'น.อ.',
            position: "ผอ.กฟธ.กกศ.รร.นนก.",
            email:'suth@rtaf.mi.th',
            imageUrl: "personnel/165945.jpg"
        }].map((u, index) => {

            let rand = faker.number.int({
                'min': 0,
                'max': buildingIds.length - 1
            })

            return ({
                "type": "Feature",
                "id": index,
                "geometry": {
                    "type": "Point",
                    "coordinates": buildingCoords[rand]
                },
                "geometry_name": "nkrafauser" + index,
                "properties": {
                    "NAME": u.name,
                    "RANK" : u.rank,
                    "POSITION" : u.position,
                    "UNIT": faker.helpers.arrayElements(nkrafaunits, 1)[0].name,
                    "BUILDING" : buildingIds[rand],
                    "BUILDING_NAME" : "อาคาร " + buildingIds[rand],
                    "ROOM" : "ห้อง " + buildingIds[rand] + "/" +  faker.string.numeric(3), 
                    "IMAGE_URL": u.imageUrl,
                    "AREA_SQM": faker.string.uuid(),
                    "TEL" : "4-" + faker.string.numeric(4),
                    "EMAIL": u.email
                }
            })
        }),
        ...Array(97).fill().map((f, index) => {

            // let coords = f.geometry.coordinates
            // let polygon = turf.polygon(coords);
            // let centroid = turf.centroid(polygon);
            let rand = faker.number.int({
                'min': 0,
                'max': buildingIds.length - 1
            })
            let fullname = fakerEN.person.fullName()
            return ({
                "type": "Feature",
                "id": index + 3,
                "geometry": {
                    "type": "Point",
                    "coordinates": buildingCoords[rand]
                },
                "geometry_name": "the_geom" + index,
                "properties": {
                    "NAME": faker.person.fullName(),
                    "RANK" : faker.helpers.arrayElements(RANKS, 1)[0].replace('หญิง', ''),
                    "UNIT": faker.helpers.arrayElements(nkrafaunits, 1)[0].name,
                    "POSITION" : faker.person.jobTitle(),
                    "BUILDING" : buildingIds[rand],
                    "BUILDING_NAME" : "อาคาร " + buildingIds[rand], 
                    "ROOM" : "ห้อง " + buildingIds[rand] + "/" +  faker.string.numeric(3), 
                    "IMAGE_URL": faker.image.avatar(),
                    "AREA_SQM": faker.string.uuid(),
                    "TEL": "4-" + faker.string.numeric(4),
                    "EMAIL": fullname.split(" ")[0].toLowerCase() + "@rtaf.mi.th"
                }
            })
        })]
        console.log('features', {
            "type": "FeatureCollection",
            "features": features
        });
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