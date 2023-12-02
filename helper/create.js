"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
let day = process.argv.slice(2).at(0);
const folder = __dirname + '/day' + day;
//fs.mkdirSync(folder)
try {
    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }
}
catch (err) {
    // console.error(err);
}
const template = fs.readFileSync(__dirname + "/helper/tstemplate.txt", "utf8");
fs.writeFile(folder + '/ex.txt', "", { flag: 'wx' }, function (err) {
    if (err)
        console.log("file already exists...skipping");
});
fs.writeFile(folder + '/input.txt', "", { flag: 'wx' }, function (err) {
    if (err)
        console.log("file already exists...skipping");
});
fs.writeFile(folder + '/day' + day + '.ts', template, { flag: 'wx' }, function (err) {
    if (err)
        console.log("file already exists...skipping");
});
//# sourceMappingURL=create.js.map