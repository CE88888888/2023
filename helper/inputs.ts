import * as fs from "fs";

export function getPuzzleInput(path: string): string[] {
    return fs
        .readFileSync(path+ "/input.txt", "utf8")
        .split("\r\n");
}
export function getExampleInput(path: string): string[] {
    return fs
        .readFileSync(path + "/ex.txt", "utf8")
        .split("\r\n");
}

export function getPuzzleInputRaw(path: string): string {
    return fs.readFileSync(path+ "/input.txt", "utf8")
}
export function getExampleInputRaw(path: string): string {
    return fs.readFileSync(path + "/ex.txt", "utf8")
}

