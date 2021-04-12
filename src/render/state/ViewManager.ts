import { createSingletonGetter } from "@/util";
import { getDatabaseConnection } from "@/render/database/DatabaseConnection";
import {
    IObservableValue,
    IReadonlyObservableValue,
    ObservableValue
} from "@/render/core/Observable";

class ViewManager {
    private readonly currentView: IObservableValue<View>;
    private readonly database = getDatabaseConnection();

    constructor() {
        const currentView = this.database.getLastViewId() || View.Encounter;
        this.currentView = new ObservableValue<View>(currentView);
    }

    public getCurrentView(): IReadonlyObservableValue<View> {
        return this.currentView;
    }

    public onViewChanged(newView: View) {
        this.currentView.value = newView;
    }
}

export const enum View {
    Encounter = 0,
    EncounterManagement = 1,
    CreateEncounter = 2
}

export const getViewManager = createSingletonGetter(ViewManager);
