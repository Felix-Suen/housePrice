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
            { header: 'Bathrooms', key: 'Bathrooms' },
            { header: 'Type', key: 'Type' },
            { header: 'Parking', key: 'Parking' },
            { header: 'Price', key: 'Price' },
        ];
        worksheet.getRow(1).font = { bold: true };
        excelData.forEach((row) => worksheet.addRow(row));

        workbook.xlsx.writeFile('sample.xlsx');
    } catch (err) {
        console.log(err.message);
    }
}

realtor
    .post(opts)
    .then((data) => {
        excelData = data.Results.map((result) => {
            var row = [
                result.Property.Address.AddressText,
                result.Building.Bedrooms,
                parseInt(result.Building.BathroomTotal),
                result.Building.Type,
                parseInt(result.Property.ParkingSpaceTotal),
                parseInt(result.Property.PriceUnformattedValue),
            ];
            return row;
        });
        excel();
    })
    .catch((err) => {
        console.error(err.message);
    });
