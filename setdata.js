const fs = require('fs');

const path_in = 'G:/______/________own/_zkm/__get_data/data2';
const path_out = 'G:/______/________own/_zkm/__get_data/data';

const trams = ['2', '3', '4', '5', '6', '7', '8', '9', '10', '12'];

const load = name => {
    let filePath = path_in + '/' + name + '.js';
    let data = null;

    try {
        if (fs.existsSync(filePath)) {
            data = fs.readFileSync(filePath);
        }
    } catch (err) {
        console.error(err)
    }

    console.log(' loaded: ' + name);

    return data;
}



fs.readdir(path_in, (err, files) => {
    files.forEach(file => {
        console.log(file);
    });
});