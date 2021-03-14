import low, { AdapterAsync, AdapterSync, LowdbSync } from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import fs from "fs";

const dataFile: string = "db.json";
const adapter: AdapterSync = new FileSync(dataFile);
const db: LowdbSync<any> = low(adapter);

export class Database {
    constructor() {
        //Check if we have read/write permissions to the database
        //Then, check if the database is initalized, and if it isn't, initalize it
        fs.accessSync(dataFile, fs.constants.R_OK | fs.constants.W_OK);
        fs.open(dataFile, "r", (err, fd) => {
            if (err) throw err;
            const readData: Uint8Array = new Uint8Array();
            fs.read(fd, readData, 0, 1, 0, () => {
                fs.close(fd, err => {
                    if (err) throw err;
                });
                if (!readData[0]) {
                    db.defaults({ actorTemplates: [], encounters: [] }).write();
                }
            });
        });
    }
}
