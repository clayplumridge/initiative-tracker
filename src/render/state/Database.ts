import { ActorTemplate } from "@/models";
import low, { AdapterSync, LowdbSync } from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { Encounter, EncounterData } from "@/render/state/Encounter";

const dataFile: string = "db.json";
const adapter: AdapterSync<Schema> = new FileSync<Schema>(dataFile);
const db = low(adapter);

interface Schema {
    actorTemplates: Array<ActorTemplate>;
    encounters: Array<EncounterData>;
}

export class Database {
    constructor() {
        db.defaults({ actorTemplates: [], encounters: [] }).write();

        // //Check if we have read/write permissions to the database
        // //Then, check if the database is initalized, and if it isn't, initalize it
        // fs.accessSync(dataFile, fs.constants.R_OK | fs.constants.W_OK);
        // fs.open(dataFile, "r", (err, fd) => {
        //     if (err) throw err;
        //     const readData: Uint8Array = new Uint8Array();
        //     fs.read(fd, readData, 0, 1, 0, () => {
        //         fs.close(fd, err => {
        //             if (err) throw err;
        //         });
        //         if (!readData[0]) {
        //             db.defaults({ actorTemplates: [], encounters: [] }).write();
        //         }
        //     });
        // });
    }

    public createEncounter(encounter: Encounter): void {
        db.get("encounters")
            .push({ ...encounter.encounterData })
            .write();
    }

    public updateEncounter(encounter: Encounter): void {
        db.get("encounters")
            .find({ id: encounter.encounterData.id })
            .assign({ ...encounter.encounterData })
            .write();
    }

    public getEncounter(encounterId: string): EncounterData {
        return db.get("encounters").find({ id: encounterId }).value();
    }

    public removeEncounter(encounterId: string): void {
        db.get("encounters").remove({ id: encounterId }).write();
    }
}
