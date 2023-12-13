"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExampleInputRaw = exports.getPuzzleInputRaw = exports.getExampleInput = exports.getPuzzleInput = void 0;
const fs = require("fs");
function getPuzzleInput(path) {
    return fs
        .readFileSync(path + "/input.txt", "utf8")
        .split("\r\n");
}
exports.getPuzzleInput = getPuzzleInput;
function getExampleInput(path) {
    return fs
        .readFileSync(path + "/ex.txt", "utf8")
        .split("\r\n");
}
exports.getExampleInput = getExampleInput;
function getPuzzleInputRaw(path) {
    return fs.readFileSync(path + "/input.txt", "utf8");
}
exports.getPuzzleInputRaw = getPuzzleInputRaw;
function getExampleInputRaw(path) {
    return fs.readFileSync(path + "/ex.txt", "utf8");
}
exports.getExampleInputRaw = getExampleInputRaw;
//# sourceMappingURL=inputs.js.map