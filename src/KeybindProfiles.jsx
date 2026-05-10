import flatstore from "flatstore";
import { useEffect, useState } from "react";
import {
    getControllerProfileKeys,
    getScopedStorageKey,
    normalizeControllerType,
    readScopedStorage,
    writeScopedStorage,
} from "./controllerScope";

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

function getStorageNames(controllerType) {
    const normalized = normalizeControllerType(controllerType);
    return {
        defaultProfile: getScopedStorageKey(normalized, "defaultProfile"),
        profiles: getScopedStorageKey(normalized, "profiles"),
    };
}

function parseStoredValue(raw) {
    if (typeof raw !== "string") {
        return raw;
    }

    try {
        return JSON.parse(raw);
    } catch (_e) {
        return raw;
    }
}

function saveKeyValue(controllerType, key, value) {
    if (typeof value === "undefined") {
        return;
    }

    flatstore.set(key, value);
    writeScopedStorage(controllerType, key, value);
}

export function getCurrentProfile(controllerType = "wheel") {
    const normalized = normalizeControllerType(controllerType);
    const keys = getControllerProfileKeys(normalized);

    let json = {};
    for (let key of keys) {
        const current = flatstore.get(key);
        if (typeof current !== "undefined") {
            json[key] = current;
        }

        const inverted = flatstore.get("invert/" + key);
        if (typeof inverted !== "undefined" && inverted != null) {
            json["invert/" + key] = inverted;
        }
    }
    return json;
}

export function ProfileLoader({ controllerType = "wheel" }) {
    const normalized = normalizeControllerType(controllerType);
    const [defaultProfile] = flatstore.useChange("defaultProfile");
    const profiles = getProfiles(normalized);
    const profileNames = Object.keys(profiles);

    const [isCreate, setIsCreate] = useState(false);
    const [profileName, setProfileName] = useState("");
    const [profileJson, setProfileJson] = useState("");
    const [prevProfileName, setPrevProfileName] = useState("");

    const [updatedSettings] = flatstore.useChange("updatedSettings");

    useEffect(() => {
        const currentProfile = getCurrentProfile(normalized);
        setProfileJson(JSON.stringify(currentProfile, null, 2));
    }, [updatedSettings, normalized]);

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
                    const selectedProfileName = e.target.value;
                    if (selectedProfileName === "*") {
                        const curProfileName = getDefaultProfile(normalized);
                        if (curProfileName !== "*") {
                            setPrevProfileName(curProfileName);
                        }

                        const currentProfile = getCurrentProfile(normalized);
                        setProfileJson(JSON.stringify(currentProfile, null, 2));
                        setIsCreate(true);
                        return;
                    }
                    loadProfile(selectedProfileName, normalized);
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
                            const json = getCurrentProfile(normalized);
                            const curProfileName = getDefaultProfile(normalized);
                            addProfile(curProfileName, json, normalized);
                            loadProfile(curProfileName, normalized);
                            setIsCreate(false);
                        }}
                    >
                        Save
                    </button>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <button
                        onClick={() => {
                            const curProfileName = getDefaultProfile(normalized);
                            if (!window.confirm(`Do you want to DELETE "${curProfileName}" profile?`)) return;

                            removeProfile(curProfileName, normalized);
                            loadProfile("G920", normalized);
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
                                const json = JSON.parse(profileJson);
                                if (profileName.length < 3) {
                                    alert("Profile name must be more than 2 characters.");
                                    return;
                                }

                                addProfile(profileName, json, normalized);
                                loadProfile(profileName, normalized);
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
                            const currentDefaultProfile = getDefaultProfile(normalized);
                            loadProfile(currentDefaultProfile, normalized);
                            const currentProfile = getCurrentProfile(normalized);
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
                            loadProfile(prevProfileName || getDefaultProfile(normalized), normalized);
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

export function getDefaultProfile(controllerType = "wheel") {
    const normalized = normalizeControllerType(controllerType);
    const { defaultProfile } = getStorageNames(normalized);
    let currentDefaultProfile = localStorage.getItem(defaultProfile);

    if (currentDefaultProfile) {
        const profiles = getProfiles(normalized);
        if (profiles[currentDefaultProfile]) {
            return currentDefaultProfile;
        }
    }

    return "G920";
}

export function setDefaultProfile(profileName, controllerType = "wheel") {
    const normalized = normalizeControllerType(controllerType);
    const { defaultProfile } = getStorageNames(normalized);

    localStorage.setItem(defaultProfile, profileName);
    flatstore.set("defaultProfile", profileName);
}

export function getProfiles(controllerType = "wheel") {
    const normalized = normalizeControllerType(controllerType);
    const { profiles } = getStorageNames(normalized);

    try {
        const storedProfiles = localStorage.getItem(profiles);
        if (storedProfiles) {
            return JSON.parse(storedProfiles);
        }
    } catch (e) {
        console.error(e);
    }

    return defaultProfiles;
}

export function loadDefaultProfile(controllerType = "wheel") {
    const normalized = normalizeControllerType(controllerType);
    let defaultProfileName = getDefaultProfile(normalized);
    loadProfile(defaultProfileName, normalized);
}

export function loadProfile(profileName, controllerType = "wheel") {
    const normalized = normalizeControllerType(controllerType);
    const profiles = getProfiles(normalized);
    const profile = profiles[profileName] || profiles.G920 || defaultProfiles.G920;

    const keys = getControllerProfileKeys(normalized);
    for (const key of keys) {
        const profileValue = typeof profile[key] === "undefined" ? defaultProfiles.G920[key] : profile[key];
        const persistedValue = readScopedStorage(normalized, key);
        const resolvedValue = persistedValue === null ? profileValue : persistedValue;

        saveKeyValue(normalized, key, resolvedValue);

        const invertKey = "invert/" + key;
        const invertProfileValue = profile[invertKey];
        const persistedInvert = readScopedStorage(normalized, invertKey);

        if (persistedInvert !== null) {
            saveKeyValue(normalized, invertKey, persistedInvert);
        } else if (typeof invertProfileValue !== "undefined") {
            saveKeyValue(normalized, invertKey, invertProfileValue);
        }
    }

    flatstore.set("updatedSettings", Date.now());
    setDefaultProfile(profileName, normalized);
    flatstore.set("defaultProfile", profileName);
}

export function addProfile(profileName, profile, controllerType = "wheel") {
    if (typeof profileName !== "string") {
        console.error("Profile name must be string.");
        alert("Profile name must be string.");
        return;
    }

    const normalized = normalizeControllerType(controllerType);
    let profiles = getProfiles(normalized);

    if (profileName in profiles) {
        console.warn(`Profile "${profileName}" already exists.`);
        if (!window.confirm(`Do you want to overwrite "${profileName}" profile?`)) return;
    }

    profiles[profileName] = profile;

    const { profiles: profilesStorageKey } = getStorageNames(normalized);
    localStorage.setItem(profilesStorageKey, JSON.stringify(profiles));
}

export function removeProfile(profileName, controllerType = "wheel") {
    if (profileName === "G920") {
        return false;
    }

    const normalized = normalizeControllerType(controllerType);
    let profiles = getProfiles(normalized);
    if (profileName in profiles) {
        delete profiles[profileName];
    }

    const { profiles: profilesStorageKey } = getStorageNames(normalized);
    localStorage.setItem(profilesStorageKey, JSON.stringify(profiles));
}
