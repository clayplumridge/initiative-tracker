import { ObservableArray, ObservableValue } from "@/render/core/Observable";
import { serialize } from "@/render/database/Serialize";

test("Serializes strings correctly", () => {
    const test = "test";
    expect(serialize(test)).toStrictEqual(test);
});

test("Serializes numbers correctly", () => {
    const test = 12;
    expect(serialize(test)).toStrictEqual(test);
});

test("Serializes objects correctly", () => {
    const test = { test: 12, test2: "test" };
    expect(serialize(test)).toStrictEqual(test);
});

test("Serializes arrays correctly", () => {
    const array = [1, 2, 3];
    expect(serialize(array)).toStrictEqual(array);
});

test("Serializes observable values correctly", () => {
    const obsVal = new ObservableValue(12);
    expect(serialize(obsVal)).toStrictEqual(12);
});

test("Serializes arrays of observables correctly", () => {
    const array = [
        new ObservableValue(1),
        new ObservableValue(2),
        new ObservableValue(3)
    ];
    expect(serialize(array)).toStrictEqual([1, 2, 3]);
});

test("Serializes observables of arrays correctly", () => {
    const obs = new ObservableValue([1, 2, 3]);
    expect(serialize(obs)).toStrictEqual([1, 2, 3]);
});

test("Serializes observable arrays correctly", () => {
    const res = [1, 2, 3];
    const obs = new ObservableArray(res);
    expect(serialize(obs)).toStrictEqual(res);
});

test("Serializes observable arrays of observables correctly", () => {
    const obs = new ObservableArray([
        new ObservableValue(1),
        new ObservableValue(2),
        new ObservableValue(3)
    ]);
    expect(serialize(obs)).toStrictEqual([1, 2, 3]);
});

test("Serializes objects with observable keys correctly", () => {
    const obj = {
        testNotObsVal: 12,
        testObsVal: new ObservableValue(13),
        testNotObsArr: ["one", "two", "three"],
        testObsArr: new ObservableArray(["four", "five", "six"])
    };

    expect(serialize(obj)).toStrictEqual({
        testNotObsVal: 12,
        testObsVal: 13,
        testNotObsArr: ["one", "two", "three"],
        testObsArr: ["four", "five", "six"]
    });
});

test("Serializes complex objects correctly", () => {
    const testObj = {
        first: new ObservableArray<
            ObservableValue<{ test: ObservableValue<string> }>
        >([
            new ObservableValue({ test: new ObservableValue("big yeetus") }),
            new ObservableValue({ test: new ObservableValue("small bonkus") })
        ]),
        second: new ObservableValue(12),
        third: new ObservableArray(["yeet", "wheat", "delete"])
    };

    const res = serialize(testObj);

    expect(res).toStrictEqual({
        first: [{ test: "big yeetus" }, { test: "small bonkus" }],
        second: 12,
        third: ["yeet", "wheat", "delete"]
    });
});
