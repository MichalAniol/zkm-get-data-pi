const fs = require('fs');
const axios = require('axios');

const path_in = '';
const path_out = __dirname + '/data';


const errorMessages = {
    503: () => console.log("Forbidden"),
    417: () => console.log("is a teepot"),
    'default': () => console.log("Not handle it")
}

axios.interceptors.response.use(function(res) {
        return res;
    },
    (err) => {
        return '------------ERROR------------';
        return Promise.reject(err);
    });

const test = () => {
    console.log(__dirname);

}

var LastUpdateData = '';
const start = () => {
    let delay = 0;
    let checked = 0;

    const getData = () => {
        axios({
                method: 'get',
                url: 'https://ckan2.multimediagdansk.pl/gpsPositions',
            })
            .then(function(response) {

                if (response.data.LastUpdateData != LastUpdateData) {
                    let latOk = response.data.LastUpdateData.replace(' ', '-').replace(':', '-').replace(':', '-');
                    let splited = latOk.split('-');

                    let folderName = splited[0] + '-' + splited[1] + '-' + splited[2] + '-' + splited[3];
                    createFolder(folderName);

                    save(folderName + '/' + latOk, response.data)

                    let difference = ((new Date(response.data.LastUpdateData) - new Date(LastUpdateData)) / 1000).toFixed(0);
                    delay = (checked > 0) ? (difference < 20 ? difference * 1000 : 20000) : 5000;
                    console.log(' ' + response.data.LastUpdateData, difference, delay / 1000, checked);
                    LastUpdateData = response.data.LastUpdateData;
                    checked++;
                } else {
                    console.log(' ---------');
                    delay = 5000;
                }

                setTimeout(() => { getData(); }, delay);
            })
            .catch(err => {
                console.log(err);
                setTimeout(() => { getData(); }, 1000);
            })
    }

    getData();

}

const createFolder = folderName => {
    let dir = path_out + '/' + folderName;
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }
}

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

const save = (name, data) => {
    filePath = path_out + '/' + name + '.json';
    fs.writeFileSync(filePath, JSON.stringify(data));
}

module.exports = { start, test }