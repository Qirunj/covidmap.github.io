mapboxgl.accessToken =
    'pk.eyJ1IjoicWlydW5qIiwiYSI6ImNsZHF5dWtrdDE4M3AzcHB3ODJsaW9zOGoifQ.G5rGgcnPZM2mu2c7-mlnEg';
let map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/qirunj/cldqzc0v5004d01r0e866ytuq', // style URL
    center: [-97, 40], // starting position [lng, lat]
    zoom: 4, // starting zoom
    projection: 'albers'
});

const grades = [1, 543, 1183, 2316, 5455], 
      colors = ['rgb(255,255,178)', 'rgb(254,204,92)', 'rgb(253,141,60)', 'rgb(240,59,32)', 'rgb(189,0,38)'], 
      radii = [3, 6, 9, 12, 15];

map.on('load', () => {
    map.addSource('covidcount', {
        type: 'geojson',
        data: 'assets/us-covid-2020-counts.json'
    });

    map.addLayer({
        'id': 'covidcount-point',
        'type': 'circle',
        'source': 'covidcount',
        'paint': {
            // increase the radii of the circle as the zoom level and dbh value increases
            'circle-radius': {
                'property': 'cases',
                'stops': [
                    [grades[0], radii[0]],
                    [grades[1], radii[1]],
                    [grades[2], radii[2]],
                    [grades[3], radii[3]],
                    [grades[4], radii[4]]
                ]
            },
            'circle-color': {
                'property': 'cases',
                'stops': [
                    [grades[0], colors[0]],
                    [grades[1], colors[1]],
                    [grades[2], colors[2]],
                    [grades[3], colors[3]],
                    [grades[4], colors[4]]
                ]
            },
            'circle-stroke-color': 'white',
            'circle-stroke-width': 1,
            'circle-opacity': 0.8
        }
    });

    map.on('click', 'covidcount-point', (event) => {
        new mapboxgl.Popup()
            .setLngLat(event.features[0].geometry.coordinates)
            .setHTML(`<strong>Cases:</strong> ${event.features[0].properties.cases}`)
            .addTo(map);
    });

// create legend object, it will anchor to the div element with the id legend.
const legend = document.getElementById('legend');

//set up legend grades and labels
var labels = ['<strong>Cases</strong>'], vbreak;

for (var i = 0; i < grades.length; i++) {
    vbreak = grades[i];
    // you need to manually adjust the radius of each dot on the legend 
    // in order to make sure the legend can be properly referred to the dot on the map.
    dot_radius = 2 * radii[i];
    labels.push(
        '<p class="break"><i class="dot" style="background:' + colors[i] + '; width: ' + dot_radius +
        'px; height: ' +
        dot_radius + 'px; "></i> <span class="dot-label" style="top: ' + dot_radius / 2 + 'px;">' + vbreak +
        '</span></p>');
}

const source =
    '<p style="text-align: right; font-size:10pt">Source: <a href="https://github.com/nytimes/covid-19-data/blob/43d32dde2f87bd4dafbb7d23f5d9e878124018b8/live/us-counties.csv">The New York Times</a></p>';

// combine all the html codes.
legend.innerHTML = labels.join('') + source;

});