const realtor = require('./realtorca.js');
const ExcelJS = require('exceljs');

let opts = {
    LongitudeMin: -79.6758985519409,
    LongitudeMax: -79.6079635620117,
    LatitudeMin: 43.57601549736786,
    LatitudeMax: 43.602250137362276,
    PriceMin: 500000,
    PriceMax: 10000000,
    RecordsPerPage: 500,
};

var excelData = [];
var dimensions = [];

async function excel(rows) {
    try {
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet('test');
        // const firstRow = ['Address', 'Bedrooms', 'Den', 'Bathrooms', 'Type', 'Parking', 'Price'];
        const firstRow = ['Address', 'Price', 'Total Size'];
        worksheet.addRow(firstRow);
        worksheet.getRow(1).font = { bold: true };
        rows.forEach((row) => worksheet.addRow(row));

        workbook.xlsx.writeFile('sample.xlsx');
    } catch (err) {
        console.log(err.message);
    }
}

var options = {
    PropertyId: '',
    ReferenceNumber: '',
};

realtor.post(opts).then((data) => {
    try {
        dimensions = data.Results.map((result) => {
            options.PropertyId = result.Id;
            options.ReferenceNumber = result.MlsNumber;
            return realtor.getPropertyDetails(options).then((house) => {
                try {
                    var row = house.Building.Room.map((room) => {
                        return room.Dimension;
                    });
                    row.unshift(house.Land.SizeTotal);
                    row.unshift(parseInt(house.Property.PriceUnformattedValue));
                    row.unshift(house.Property.Address.AddressText);
                    return row;
                } catch (err) {
                    console.error(err.message);
                }
            });
        });
        Promise.all(dimensions).then((dimensions) => {
            console.log(dimensions);
            excel(dimensions);
        });
    } catch (err) {
        console.error(err.message);
    }
});

// realtor
//     .post(opts)
//     .then((data) => {
//         excelData = data.Results.map((result) => {
//             var bedrooms = result.Building.Bedrooms.split(" + ");
//             var numBed = 0;
//             var den = 0;
//             if (bedrooms.length > 1) {
//                 numBed = parseInt(bedrooms[0])
//                 den = parseInt(bedrooms[1]);
//             } else {
//                 numBed = parseInt(bedrooms[0]);
//             }

//             var type = 0;
//             if (result.Building.Type === 'Apartment') type = 1;

//             var parking = 0;
//             if (result.Property.ParkingSpaceTotal) {
//                 parking = parseInt(result.Property.ParkingSpaceTotal);
//             }

//             var row = [
//                 result.Property.Address.AddressText,
//                 numBed,
//                 den,
//                 parseInt(result.Building.BathroomTotal),
//                 type,
//                 parking,
//                 parseInt(result.Property.PriceUnformattedValue),
//             ];
//             console.log(row);
//             return row;
//         });
//         excel(excelData);
//     })
//     .catch((err) => {
//         console.error(err.message);
//     });
