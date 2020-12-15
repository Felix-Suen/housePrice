const realtor = require('./realtorca.js');

let opts = {
    LongitudeMin: -79.6758985519409,
    LongitudeMax: -79.6079635620117,
    LatitudeMin: 43.57601549736786,
    LatitudeMax: 43.602250137362276,
    PriceMin: 100000,
    PriceMax: 1000000,
    RecordsPerPage: 100,
};

// console display
realtor
    .post(opts)
    .then((data) => {
        // console.log(data);
        data.Results.map(result => {
            console.log(result.Property.Address.AddressText);
            console.log('Bedrooms: ' + result.Building.Bedrooms);
            console.log('Bathrooms: ' + result.Building.BathroomTotal);
            console.log('Bathrooms: ' + result.Building.Type);
            console.log('Ammenities: ' + result.Property.AmmenitiesNearBy);
            console.log('Parking: '+ result.Property.ParkingSpaceTotal);
            console.log('Price: ' + result.Property.PriceUnformattedValue);
            console.log();
        })
    })
    .catch((err) => {console.error(err.message)});