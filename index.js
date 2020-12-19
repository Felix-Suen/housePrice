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
        const firstRow = [
            'Address',
            'Price',
            'type',
            'Bedrooms',
            'Bathrooms',
            'Total Size',
        ];
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
                    var totalSpace = 0;
                    var row = house.Building.Room.map((room) => {
                        var space = room.Dimension.split('x');
                        if (room.Dimension === '') space = 0;
                        else if (space[0].includes("'")) {
                            // imperial convert to metrics
                            space[0] = space[0].match(/\d+/g).map(Number);
                            space[1] = space[1].match(/\d+/g).map(Number);
                            if (space[0].length === 1)
                                space[0] = space[0][0] * 0.3048;
                            else
                                space[0] =
                                    space[0][0] * 0.3048 + space[0][1] * 0.0254;
                            if (space[1].length === 1)
                                space[1] = space[1][0] * 0.3048;
                            else
                                space[1] =
                                    space[1][0] * 0.3048 + space[1][1] * 0.0254;
                            space = space[0] * space[1];
                            space = Math.round(space * 100) / 100;
                        } else {
                            // metrics
                            space[0] = parseFloat(
                                space[0].replace(/([' 'm])/g, '')
                            );
                            space[1] = parseFloat(
                                space[1].replace(/([' 'm])/g, '')
                            );
                            space = space[0] * space[1];
                            space = Math.round(space * 100) / 100; // round to 2 decimals
                        }
                        totalSpace += space;
                        return space;
                    });
                    row.unshift(Math.round(totalSpace * 100) / 100);

                    var bedrooms = house.Building.Bedrooms.split(' + ');
                    var numBed = 0;
                    if (bedrooms.length > 1) {
                        numBed = parseInt(bedrooms[0]) + parseInt(bedrooms[1]);
                    } else {
                        numBed = parseInt(bedrooms[0]);
                    }

                    var type = 0;
                    if (house.Building.Type === 'Apartment') type = 1;

                    row.unshift(parseInt(house.Building.BathroomTotal));
                    row.unshift(numBed);
                    row.unshift(type);
                    row.unshift(parseInt(house.Property.PriceUnformattedValue));
                    row.unshift(house.Property.Address.AddressText);
                    return row;
                } catch (err) {
                    console.error(err.message);
                }
            });
        });
        Promise.all(dimensions).then((dimensions) => {
            // filter out unnecessary rows
            const result = dimensions.filter(
                (row) => row !== undefined && row[5] > 0 && row[5] < 300
            );
            console.log(result);
            excel(result);
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
