const express = require('express');
const app = express();
const port = 3000;

const realtor = require('./realtorca.js');

let opts = {
    LongitudeMin: -79.6758985519409,
    LongitudeMax: -79.6079635620117,
    LatitudeMin: 43.57601549736786,
    LatitudeMax: 43.602250137362276,
    PriceMin: 100000,
    PriceMax: 410000,
    CurrentPage: 1
};

app.get('/', (req, res) => {
    res.send(
        realtor.optionsFromUrl(
            'https://www.realtor.ca/Residential/Map.aspx#LongitudeMin=-79.6758985519409&LongitudeMax=-79.6079635620117&LatitudeMin=43.57601549736786&LatitudeMax=43.602250137362276&PriceMin=100000&PriceMax=425000'
            )
    );
});

realtor
    .post(opts)
    .then((data) => {
        //console.log(data);
        data.Results.map(result => console.log(result.Property.Price))
    })
    .catch((err) => {console.error(err.message)});

app.listen(port, () => {
    console.log(`Testing app listening on port ${port}!`);
});
