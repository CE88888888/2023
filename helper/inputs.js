"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExampleInput = exports.getPuzzleInput = void 0;
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
//# sourceMappingURL=inputs.js.map