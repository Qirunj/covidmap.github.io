mapboxgl.accessToken = 'pk.eyJ1IjoicWlydW5qIiwiYSI6ImNsZHF5dWtrdDE4M3AzcHB3ODJsaW9zOGoifQ.G5rGgcnPZM2mu2c7-mlnEg';

const map = new mapboxgl.Map({
    container: 'map', // container ID
    style: 'mapbox://styles/qirunj/clds4ek08000u01o5o4bfy4ic', // style URL
    zoom: 4, // starting zoom
    center: [-97, 40], // starting center
    projection: 'albers'
});

async function geojsonFetch() {
    // other operations
    let response = await fetch('assets/us-covid-2020-rates.json');
    let stateData = await response.json();

    const layers = [
        '<45',
        '45-58',
        '59-70',
        '71-85',
        '86-291',
        '≥291'
    ];

    const colors = [
        '#ffffb280',
        '#fed97680',
        '#feb24c80',
        '#FD8D3C80',
        '#f03b2080',
        '#bd002680'
    ];

    map.on('load', function loadingData() {
        // add layer
        // add legend
        map.addSource('stateData', {
            type: 'geojson',
            data: stateData
        });

        map.addLayer({
            'id': 'stateData-layer',
            'type': 'fill',
            'source': 'stateData',
            'paint': {
                'fill-color': [
                    'step',
                    ['get', 'rates'],
                    '#ffffb2', // stop_output_0
                    45, // stop_input_0
                    '#fed976', // stop_output_1
                    59, // stop_input_1
                    '#feb24c', // stop_output_2
                    71, // stop_input_2
                    '#fd8d3c', // stop_output_3
                    86, // stop_input_3
                    '#f03b20', // stop_output_4
                    291, // stop_input_4
                    '#bd0026'
                ],
                'fill-outline-color': '#444343',
                'fill-opacity': 0.8,
            }
        });
    });

    const legend = document.getElementById('legend');
    legend.innerHTML = "<b>COVID-19 Case</b>(cases/1000 residents)<br><br>";

    layers.forEach((layer, i) => {
        const color = colors[i];
        const item = document.createElement('div');
        const key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        const value = document.createElement('span');
        value.innerHTML = `${layer}`;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    });

    map.on('mousemove', ({ point }) => {
        const state = map.queryRenderedFeatures(point, {
            layers: ['stateData-layer']
        });
        document.getElementById('text-description').innerHTML = state.length ?
            `<h3>${state[0].properties.county}</h3><p><strong><em>${state[0].properties.rates}</strong> cases per thousand residents</em></p>` :
            `<p>Hover over a county!</p>`;
    });

}

geojsonFetch();