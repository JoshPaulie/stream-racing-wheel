import flatstore from "flatstore";
import { useEffect, useState } from "react";

const basePath = import.meta.env.BASE_URL;
const assetPath = (fileName) => `${basePath}g920/${fileName}`;

export const defaultProfiles = {
    G920: {
        btnWheel: 0,
        btnGas: 1,
        btnBrake: 2,
        btnClutch: 5,
        btnGearReverse: 15,
        btnGear1: 16,
        btnGear2: 17,
        btnGear3: 18,
        btnGear4: 19,
        btnGear5: 20,
        btnGear6: 21,
        btnGear7: 22,
        btnWheel_DUp: 16,
        btnWheel_DDown: 17,
        btnWheel_DLeft: 18,
        btnWheel_DRight: 19,
        btnWheel_Back: 12,
        btnWheel_Start: 13,
        btnWheel_X: 6,
        btnWheel_Y: 7,
        btnWheel_A: 4,
        btnWheel_B: 5,
        btnWheel_RSB: 15,
        btnWheel_LSB: 14,
        btnWheel_LB: 8,
        btnWheel_RB: 9,
        btnWheel_L3: 8,
        btnWheel_R3: 9,
        btnWheel_L4: 8,
        btnWheel_R4: 9,
        imgWheel: assetPath("wheel.png"),
        imgWheel_DUp: assetPath("DUp.png"),
        imgWheel_DDown: assetPath("DDown.png"),
        imgWheel_DLeft: assetPath("DLeft.png"),
        imgWheel_DRight: assetPath("DRight.png"),
        imgWheel_Back: assetPath("Back.png"),
        imgWheel_Start: assetPath("Start.png"),
        imgWheel_X: assetPath("X.png"),
        imgWheel_Y: assetPath("Y.png"),
        imgWheel_A: assetPath("A.png"),
        imgWheel_B: assetPath("B.png"),
        imgWheel_RSB: assetPath("RSB.png"),
        imgWheel_LSB: assetPath("LSB.png"),
        imgWheel_LB: assetPath("LB.png"),
        imgWheel_RB: assetPath("RB.png"),
        imgWheel_L3: assetPath("LB.png"),
        imgWheel_R3: assetPath("RB.png"),
        imgWheel_L4: assetPath("LB.png"),
        imgWheel_R4: assetPath("RB.png"),
        imgPedalBase: assetPath("pedals.png"),
        imgGas: assetPath("gas.png"),
        imgBrake: assetPath("brake.png"),
        imgClutch: assetPath("clutch.png"),
        imgShifterBase: assetPath("shifter-base.png"),
        imgShifter: assetPath("shifter.png"),
    },
};

export function getCurrentProfile() {
    let keys = Object.keys(defaultProfiles.G920); //use keys from this profile

    let json = {};
    for (let key of keys) {
        try {
            json[key] = JSON.parse(getSaved(key));
        } catch (e) {
            json[key] = getSaved(key);
        }

        let inverted = getSaved("invert/" + key);
        if (typeof inverted !== "undefined" && inverted != null) {
            try {
                json["invert/" + key] = JSON.parse(getSaved("invert/" + key));
            } catch (e) {
                json["invert/" + key] = getSaved("invert/" + key);
            }
        }
    }
    return json;
}

export function ProfileLoader({}) {
    let [defaultProfile] = flatstore.useChange("defaultProfile");
    // let defaultProfile = getDefaultProfile();
    let profiles = getProfiles();
    let profileNames = Object.keys(profiles);

    let [isCreate, setIsCreate] = useState(false);
    let [profileName, setProfileName] = useState("");
    let [profileJson, setProfileJson] = useState("");
    let [prevProfileName, setPrevProfileName] = useState("");

    let [updatedSettings] = flatstore.useChange("updatedSettings");

    useEffect(() => {
        let currentProfile = getCurrentProfile();
        setProfileJson(JSON.stringify(currentProfile, null, 2));
    }, [updatedSettings]);

    useEffect(() => {
        let currentProfile = getCurrentProfile();
        setProfileJson(JSON.stringify(currentProfile, null, 2));
    }, []);

    return (
        <div>
            <label
                htmlFor="profileLoader"
                style={{ color: "white", fontSize: "16px", fontWeight: "bold", display: "block" }}
            >
                Load Keybind Profile
            </label>
            <select
                name="profileLoader"
                id="profileLoader"
                value={isCreate ? "*" : defaultProfile}
                onChange={(e) => {
                    let profileName = e.target.value;
                    if (profileName == "*") {
                        let curProfileName = getDefaultProfile();
                        if (curProfileName != "*") {
                            setPrevProfileName(curProfileName);
                        }

                        let currentProfile = getCurrentProfile();
                        setProfileJson(JSON.stringify(currentProfile, null, 2));
                        setIsCreate(true);
                        return;
                    }
                    loadProfile(profileName);
                    setIsCreate(false);
                }}
            >
                {profileNames.map((name) => (
                    <option key={"profilename-" + name} value={name}>
                        {name}
                    </option>
                ))}
                <option name="new" value="*">
                    Create new profile
                </option>
            </select>
            {!isCreate && (
                <span style={{ display: "inline-block", paddingLeft: "1rem" }}>
                    <button
                        onClick={() => {
                            let json = getCurrentProfile();
                            let curProfileName = getDefaultProfile();
                            addProfile(curProfileName, json);
                            loadProfile(curProfileName);
                            setIsCreate(false);
                        }}
                    >
                        Save
                    </button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button
                        onClick={() => {
                            if (!window.confirm(`Do you want to DELETE "${profileName}" profile?`))
                                return;

                            let curProfileName = getDefaultProfile();
                            removeProfile(curProfileName);
                            loadProfile("G920");
                            setIsCreate(false);
                        }}
                    >
                        Delete
                    </button>
                </span>
            )}
            <br />
            {isCreate && (
                <>
                    <h4
                        style={{
                            marginTop: "20px",
                            color: "white",
                            fontSize: "18px",
                            fontWeight: "600",
                            display: "block",
                        }}
                    >
                        Create Profile from Settings
                    </h4>
                    <label
                        htmlFor="profilename"
                        style={{
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "300",
                            display: "block",
                        }}
                    >
                        Profile Name
                    </label>
                    <input
                        type="text"
                        id="profilename"
                        name="profilename"
                        value={profileName}
                        onChange={(e) => {
                            setProfileName(e.target.value);
                        }}
                    />
                    <label
                        htmlFor="profilename"
                        style={{
                            color: "white",
                            fontSize: "14px",
                            fontWeight: "300",
                            display: "block",
                        }}
                    >
                        Profile JSON
                    </label>
                    <textarea
                        style={{ width: "500px", height: "200px" }}
                        id="profilename"
                        name="profilejson"
                        value={profileJson}
                        onChange={(e) => {
                            setProfileJson(e.target.value);
                        }}
                    ></textarea>
                    <br />
                    <button
                        name="create"
                        value="create"
                        onClick={() => {
                            try {
                                let json = JSON.parse(profileJson);
                                if (profileName.length < 3) {
                                    alert("Profile name must be more than 2 characters.");
                                    return;
                                }

                                addProfile(profileName, json);
                                loadProfile(profileName);
                                setIsCreate(false);
                            } catch (e) {
                                alert("Profile JSON is invalid, must be valid JSON syntax.");
                                console.error(e);
                            }
                        }}
                    >
                        Create Profile
                    </button>
                    &nbsp;&nbsp;&nbsp;
                    <button
                        name="reset"
                        value="reset"
                        onClick={() => {
                            let defaultProfile = getDefaultProfile();
                            loadProfile(defaultProfile);
                            let currentProfile = getCurrentProfile();
                            setProfileJson(JSON.stringify(currentProfile, null, 2));
                        }}
                    >
                        Reset to G920
                    </button>
                    &nbsp;&nbsp;&nbsp;
                    <button
                        name="cancel"
                        value="cancel"
                        onClick={() => {
                            loadProfile(prevProfileName);
                            setIsCreate(false);
                        }}
                    >
                        Cancel
                    </button>
                </>
            )}
        </div>
    );
}

export function getDefaultProfile() {
    let defaultProfile = localStorage.getItem("defaultProfile");
    if (defaultProfile) return defaultProfile;
    return "G920";
}
export function setDefaultProfile(profileName) {
    localStorage.setItem("defaultProfile", profileName);
    flatstore.set("defaultProfile", profileName);
}

export function getProfiles() {
    try {
        let profiles = localStorage.getItem("profiles");
        if (profiles) return JSON.parse(profiles);
    } catch (e) {
        console.error(e);
    }

    return defaultProfiles;
}

export function loadDefaultProfile() {
    let defaultProfile = getDefaultProfile();
    loadProfile(defaultProfile);
}

export function loadProfile(profileName) {
    let profiles = getProfiles();
    let profile = profiles[profileName];

    let keys = Object.keys(profile);
    for (let key of keys) {
        loadSaved(key, profile[key]);

        loadSaved("invert/" + key, profile["invert/" + key]);
    }

    // let inverted = getSaved('invert/' + key);
    // if (typeof inverted !== 'undefined' && inverted != null) {
    //   try { json['invert/' + key] = JSON.parse(getSaved('invert/' + key)); }
    //   catch (e) { json['invert/' + key] = getSaved('invert/' + key); }
    // }
    flatstore.set("updatedSettings", Date.now());
    setDefaultProfile(profileName);
    flatstore.set("defaultProfile", profileName);
}

export function addProfile(profileName, profile) {
    if (typeof profileName !== "string") {
        console.error("Profile name must be string.");
        alert("Profile name must be string.");
        return;
    }

    let profiles = getProfiles();

    if (profileName in profiles) {
        console.warn(`Profile "${profileName}" already exists.`);
        if (!window.confirm(`Do you want to overwrite "${profileName}" profile?`)) return;
        // return;
    }

    profiles[profileName] = profile;

    localStorage.setItem("profiles", JSON.stringify(profiles));
}

export function removeProfile(profileName) {
    //cannot delete G920
    if (profileName == "G920") {
        return false;
    }

    let profiles = getProfiles();
    if (profileName in profiles) {
        delete profiles[profileName];
    }

    localStorage.setItem("profiles", JSON.stringify(profiles));
}

function getSaved(key) {
    let value = flatstore.get(key);
    // if (value !== null && typeof value !== 'undefined' && (key.indexOf("btn") === 0 || key.indexOf("invert") === 0)) {
    //   value = Number.parseInt(value);
    // }
    return value;
}

function loadSaved(key, defaultValue) {
    // let saved = getSaved(key);

    // if (saved == null || typeof saved === 'undefined') {
    flatstore.set(key, defaultValue);
    // localStorage.setItem(key, defaultValue);
    // }
    // else {
    //   flatstore.set(key, saved);
    // }
}
