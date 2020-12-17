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

async function excel() {
    try {
        let workbook = new ExcelJS.Workbook();
        let worksheet = workbook.addWorksheet('test');
        worksheet.columns = [
            { header: 'Address', key: 'Address' },
            { header: 'Bedrooms', key: 'Bedrooms' },
            { header: 'Den', key: 'Den' },
            { header: 'Bathrooms', key: 'Bathrooms' },
            { header: 'Type', key: 'Type' },
            { header: 'Parking', key: 'Parking' },
            { header: 'Price', key: 'Price' },
        ];
        worksheet.getRow(1).font = { bold: true };
        excelData.forEach((row) => worksheet.addRow(row));

        workbook.xlsx.writeFile('sample-den.xlsx');
    } catch (err) {
        console.log(err.message);
    }
}

realtor
    .post(opts)
    .then((data) => {
        excelData = data.Results.map((result) => {
            var bedrooms = result.Building.Bedrooms.split(" + ");
            var numBed = 0;
            var den = 0;
            if (bedrooms.length > 1) {
                numBed = parseInt(bedrooms[0])
                den = parseInt(bedrooms[1]);
            } else {
                numBed = parseInt(bedrooms[0]);
            }

            var type = 0;
            if (result.Building.Type === 'Apartment') type = 1;

            var parking = 0;
            if (result.Property.ParkingSpaceTotal) {
                parking = parseInt(result.Property.ParkingSpaceTotal);
            }

            var row = [
                result.Property.Address.AddressText,
                numBed,
                den,
                parseInt(result.Building.BathroomTotal),
                type,
                parking,
                parseInt(result.Property.PriceUnformattedValue),
            ];
            console.log(row);
            return row;
        });
        excel();
    })
    .catch((err) => {
        console.error(err.message);
    });
