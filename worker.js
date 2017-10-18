const fs = require('fs');

if (process.argv.length != 4) {
    console.log('Недопустимое число параметров');
    process.exit(0);
}
const path = process.argv[2];
const X = 1000 * parseInt(process.argv[3]);

console.log(path + ' ' + X);
fs.exists(path, (good) => {
    if (good)
        readJSON();
    else {
        console.log('Нет заданного файла');
        fs.writeFile(path, '[]', () => {
            readJSON();
        });
    }
});
function readJSON() {
    fs.readFile(path, 'utf8', (err, data) => {
        if (err) {
            console.error('Bad');
            return -1;
        }
        pushRandomNumber(data);
    });
}

function pushRandomNumber(data) {
    let arr = JSON.parse(data);
    let rand;
    const min = 0;
    const max = 1000000000;

    setTimeout(function pushData() {
        rand = Math.floor(Math.random() * (max - min)) + min;
        arr.push(rand);
        let dat = JSON.stringify(arr);
        console.log(dat);
        fs.writeFile(path, dat, (err) => {
            if (err) console.error(err);
        });
        setTimeout(pushData, X);
    }, X);

}