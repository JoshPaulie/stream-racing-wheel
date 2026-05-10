import React from "react";
import flatstore from "flatstore";
import { ProfileLoader } from "./KeybindProfiles";
import { normalizeControllerType, writeScopedStorage } from "./controllerScope";

function PreviewButtons() {
    const [actionStates] = flatstore.useWatch("actionStates");

    if (!actionStates || actionStates.length === 0) {
        return null;
    }

    const displayAxes = [];
    const displayButtons = [];

    for (const action of actionStates) {
        const { type, id, pressed, value: rawValue } = action;

        if (type === "Button") {
            displayButtons.push(
                <span
                    key={`btn-${id}`}
                    style={{
                        display: "inline-block",
                        position: "relative",
                        textAlign: "center",
                        borderRadius: "50%",
                        width: "2.5rem",
                        height: "2.5rem",
                        padding: "0.5rem",
                        margin: "0.2rem",
                        backgroundColor: "#222",
                    }}
                >
                    <span
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            borderRadius: "50%",
                            padding: "0.5rem",
                            width: "100%",
                            height: "100%",
                            color: !pressed ? "white" : "black",
                            backgroundColor: !pressed ? "#222" : `rgba(255,255,255,${Math.abs(rawValue)})`,
                        }}
                    >
                        {id}
                    </span>
                </span>
            );
        } else if (type === "Axis") {
            const axisValue = Number.parseFloat(rawValue);
            const pct = Math.min(((axisValue + 1.0) / 2.0) * 100, 100);
            displayAxes.push(
                <span
                    key={`axis-${id}`}
                    style={{
                        padding: "0.5rem",
                        width: "50px",
                        height: "2rem",
                        margin: "0.5rem",
                        backgroundColor: "black",
                        color: "white",
                        position: "relative",
                        display: "inline-block",
                        textAlign: "center",
                    }}
                >
                    <span
                        style={{
                            width: `${pct}%`,
                            height: "0.4rem",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            transition: "width 0.05s linear",
                            backgroundColor: "rgba(255,255,255,255)",
                        }}
                    />
                    {id}
                </span>
            );
        }
    }

    return (
        <>
            <div id="displayAxes" style={{ width: "100%" }}>
                <h3 style={{ color: "white", padding: "1rem 0" }}>Axes IDs</h3>
                {displayAxes}
            </div>
            <div id="displayButtons" style={{ width: "100%", paddingBottom: "1rem" }}>
                <h3 style={{ color: "white", padding: "1rem 0" }}>Button IDs</h3>
                {displayButtons}
            </div>
        </>
    );
}

function RebindInputs({ controllerType = "wheel" }) {
    const normalized = normalizeControllerType(controllerType);
    const [gamepad] = flatstore.useWatch("gamePad");

    if (!gamepad) return <></>;

    return (
        <div style={{ paddingBottom: "3rem" }}>
            <ProfileLoader controllerType={normalized} />
            <br />
            <p style={{ color: "white" }}>
                Press and move your controller inputs to identify the ID needed to map the input to
                the correct binding.
            </p>

            <PreviewButtons />

            {normalized === "wheel" && (
                <>
                    <div style={{ paddingBottom: "1rem" }}>
                        <h3 style={{ color: "white", padding: "1rem 0" }}>Wheel Binding</h3>
                        <InputBind
                            controllerType={normalized}
                            title="Wheel"
                            id="btnWheel"
                            allowInvert={true}
                        />
                    </div>

                    <div style={{ paddingBottom: "1rem" }}>
                        <h3 style={{ color: "white", padding: "1rem 0" }}>Wheel Button Binding</h3>
                        <InputBind controllerType={normalized} title="D-Up" id="btnWheel_DUp" />
                        <InputBind controllerType={normalized} title="D-Down" id="btnWheel_DDown" />
                        <InputBind controllerType={normalized} title="D-Left" id="btnWheel_DLeft" />
                        <InputBind controllerType={normalized} title="D-Right" id="btnWheel_DRight" />
                        <InputBind controllerType={normalized} title="Back" id="btnWheel_Back" />
                        <InputBind controllerType={normalized} title="Start" id="btnWheel_Start" />
                        <br />
                        <InputBind controllerType={normalized} title="X" id="btnWheel_X" />
                        <InputBind controllerType={normalized} title="Y" id="btnWheel_Y" />
                        <InputBind controllerType={normalized} title="A" id="btnWheel_A" />
                        <InputBind controllerType={normalized} title="B" id="btnWheel_B" />
                        <InputBind controllerType={normalized} title="RSB" id="btnWheel_RSB" />
                        <InputBind controllerType={normalized} title="LSB" id="btnWheel_LSB" />
                        <InputBind controllerType={normalized} title="LB" id="btnWheel_LB" />
                        <InputBind controllerType={normalized} title="RB" id="btnWheel_RB" />
                        <InputBind controllerType={normalized} title="L3" id="btnWheel_L3" />
                        <InputBind controllerType={normalized} title="R3" id="btnWheel_R3" />
                        <InputBind controllerType={normalized} title="L4" id="btnWheel_L4" />
                        <InputBind controllerType={normalized} title="R4" id="btnWheel_R4" />
                    </div>

                    <div>
                        <h3 style={{ color: "white", padding: "1rem 0" }}>Change Wheel Images</h3>
                        <h5
                            style={{
                                fontWeight: "light",
                                color: "white",
                                padding: "0",
                                paddingBottom: "1rem",
                            }}
                        >
                            Enter an image URL to replace the existing image. Images will be forced to the
                            pixel ratios below.
                        </h5>
                        <ImageBind controllerType={normalized} title="Wheel" id="imgWheel" width="500" height="500" />

                        <h3 style={{ color: "white", padding: "1rem 0" }}>Change Wheel Button Masks</h3>
                        <ImageBind controllerType={normalized} title="D-Up" id="imgWheel_DUp" width="500" height="500" />
                        <ImageBind controllerType={normalized} title="D-Down" id="imgWheel_DDown" width="500" height="500" />
                        <ImageBind controllerType={normalized} title="D-Left" id="imgWheel_DLeft" width="500" height="500" />
                        <ImageBind controllerType={normalized} title="D-Right" id="imgWheel_DRight" width="500" height="500" />
                        <ImageBind controllerType={normalized} title="Back" id="imgWheel_Back" width="500" height="500" />
                        <ImageBind controllerType={normalized} title="Start" id="imgWheel_Start" width="500" height="500" />

                        <ImageBind controllerType={normalized} title="X" id="imgWheel_X" width="500" height="500" />
                        <ImageBind controllerType={normalized} title="Y" id="imgWheel_Y" width="500" height="500" />
                        <ImageBind controllerType={normalized} title="A" id="imgWheel_A" width="500" height="500" />
                        <ImageBind controllerType={normalized} title="B" id="imgWheel_B" width="500" height="500" />
                        <ImageBind controllerType={normalized} title="RSB" id="imgWheel_RSB" width="500" height="500" />
                        <ImageBind controllerType={normalized} title="LSB" id="imgWheel_LSB" width="500" height="500" />
                        <ImageBind controllerType={normalized} title="LB" id="imgWheel_LB" width="500" height="500" />
                        <ImageBind controllerType={normalized} title="RB" id="imgWheel_RB" width="500" height="500" />
                        <ImageBind controllerType={normalized} title="L3" id="imgWheel_L3" width="500" height="500" />
                        <ImageBind controllerType={normalized} title="R3" id="imgWheel_R3" width="500" height="500" />
                        <ImageBind controllerType={normalized} title="L4" id="imgWheel_L4" width="500" height="500" />
                        <ImageBind controllerType={normalized} title="R4" id="imgWheel_R4" width="500" height="500" />
                    </div>
                </>
            )}

            {normalized === "pedal" && (
                <>
                    <div style={{ paddingBottom: "1rem" }}>
                        <h3 style={{ color: "white", padding: "1rem 0" }}>Pedal Binding</h3>
                        <InputBind controllerType={normalized} title="Gas" id="btnGas" allowInvert={true} />
                        <InputBind controllerType={normalized} title="Break" id="btnBrake" allowInvert={true} />
                        <InputBind controllerType={normalized} title="Clutch" id="btnClutch" allowInvert={true} />
                    </div>

                    <div>
                        <h3 style={{ color: "white", padding: "1rem 0" }}>Change Pedal Images</h3>
                        <h5
                            style={{
                                fontWeight: "light",
                                color: "white",
                                padding: "0",
                                paddingBottom: "1rem",
                            }}
                        >
                            Enter an image URL to replace the existing image. Images will be forced to the
                            pixel ratios below.
                        </h5>
                        <ImageBind controllerType={normalized} title="Pedal Base" id="imgPedalBase" width="400" height="238" />
                        <ImageBind controllerType={normalized} title="Gas Pedal" id="imgGas" width="70" height="121" />
                        <ImageBind controllerType={normalized} title="Brake Pedal" id="imgBrake" width="70" height="96" />
                        <ImageBind controllerType={normalized} title="Clutch Petal" id="imgClutch" width="70" height="96" />
                    </div>
                </>
            )}

            {normalized === "shifter" && (
                <>
                    <div style={{ paddingBottom: "1rem" }}>
                        <h3 style={{ color: "white", padding: "1rem 0" }}>Gear Binding</h3>
                        <InputBind controllerType={normalized} title="Gear Reverse" id="btnGearReverse" allowInvert={true} />
                        <InputBind controllerType={normalized} title="Gear 1" id="btnGear1" allowInvert={true} />
                        <InputBind controllerType={normalized} title="Gear 2" id="btnGear2" allowInvert={true} />
                        <InputBind controllerType={normalized} title="Gear 3" id="btnGear3" allowInvert={true} />
                        <InputBind controllerType={normalized} title="Gear 4" id="btnGear4" allowInvert={true} />
                        <InputBind controllerType={normalized} title="Gear 5" id="btnGear5" allowInvert={true} />
                        <InputBind controllerType={normalized} title="Gear 6" id="btnGear6" allowInvert={true} />
                        <InputBind controllerType={normalized} title="Gear 7" id="btnGear7" allowInvert={true} />
                    </div>

                    <div>
                        <h3 style={{ color: "white", padding: "1rem 0" }}>Change Shifter Images</h3>
                        <h5
                            style={{
                                fontWeight: "light",
                                color: "white",
                                padding: "0",
                                paddingBottom: "1rem",
                            }}
                        >
                            Enter an image URL to replace the existing image. Images will be forced to the
                            pixel ratios below.
                        </h5>
                        <ImageBind controllerType={normalized} title="Shifter Base" id="imgShifterBase" width="250" height="293" />
                        <ImageBind controllerType={normalized} title="Shifter Head" id="imgShifter" width="150" height="150" />
                    </div>
                </>
            )}
        </div>
    );
}

function ImageBind({ controllerType, id, title, width, height }) {
    const [value] = flatstore.useChange(id);
    return (
        <div style={{ display: "block", paddingLeft: "1rem", paddingBottom: "0.5rem" }}>
            <label
                style={{
                    fontWeight: "light",
                    color: "white",
                    paddingRight: "0.5rem",
                    width: "150px",
                    height: "2rem",
                    display: "inline-block",
                }}
            >
                {title}
            </label>
            <input
                name={id}
                type="text"
                value={value}
                onChange={(e) => {
                    flatstore.set(id, e.target.value);
                    writeScopedStorage(controllerType, id, e.target.value);
                    flatstore.set("updatedSettings", Date.now());
                }}
                style={{ height: "2rem", width: "400px" }}
            />
            <span style={{ paddingLeft: "10px", color: "white", fontSize: "12px" }}>
                {width || 0}x{height || 0} pixels
            </span>
        </div>
    );
}

function InputBind({ controllerType, id, title, allowInvert }) {
    const actionStates = flatstore.get("actionStates");
    const [defaultValue] = flatstore.useChange(id);
    const [defaultChecked] = flatstore.useWatch("invert/" + id);

    return (
        <div style={{ display: "inline-block", paddingLeft: "1rem" }}>
            <label
                style={{
                    fontWeight: "bold",
                    color: "#eee",
                    paddingRight: "0.5rem",
                    height: "2rem",
                    display: "inline-block",
                }}
            >
                {title}
            </label>
            <select
                style={{
                    height: "2rem",
                    width: "100px",
                    color: "white",
                    backgroundColor: "rgb(34, 34, 34)",
                    borderColor: "rgb(34, 34, 34)",
                }}
                name={id}
                value={defaultValue}
                onChange={(e) => {
                    const value = Number.parseInt(e.target.value, 10);
                    flatstore.set(id, value);
                    writeScopedStorage(controllerType, id, value);
                    flatstore.set("updatedSettings", Date.now());
                }}
            >
                {actionStates.map((action) => (
                    <option key={"option-" + action.index} value={action.index}>
                        {action.type} {action.id}
                    </option>
                ))}
            </select>
            <br />
            {allowInvert && (
                <div style={{ display: "flex", flexDirection: "row", gap: "0.4rem" }}>
                    <span style={{ color: "white", fontSize: "0.65rem" }}>Invert?</span>
                    <label className="switch">
                        <input
                            id={`checkbox-${id}`}
                            key={`checkbox-${id}`}
                            name={`checkbox-${id}`}
                            type="checkbox"
                            checked={defaultChecked === "false" || !defaultChecked ? false : true}
                            onChange={(e) => {
                                flatstore.set("invert/" + id, e.target.checked);
                                writeScopedStorage(controllerType, "invert/" + id, e.target.checked);
                                flatstore.set("updatedSettings", Date.now());
                            }}
                        />
                        <span className="slider round"></span>
                    </label>
                </div>
            )}
        </div>
    );
}

export default RebindInputs;
