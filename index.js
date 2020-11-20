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
    PriceMax: 1000000,
    RecordsPerPage: 10,
    // TotalPage: 45,
    // Pins: 438,
    // CurrentPage: 1,
};

// console display
realtor
    .post(opts)
    .then((data) => {
        console.log(data);
        // data.Results.map(result => console.log(result.Property))
    })
    .catch((err) => {console.error(err.message)});


// localhost:3000
var test = {};

realtor.post(opts).then((data) => {
    test = data.Results.map(result => result.Property.Price)
});

app.get('/', (req, res)=> { 
    res.send(test);
})

app.listen(port, () => {
    console.log(`Testing app listening on port ${port}!`);
});
