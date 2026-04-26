import React from 'react';
import flatstore from 'flatstore';

flatstore.set('maxrotation', 900);

function Wheel(props) {

    let [imgWheel] = flatstore.useWatch('imgWheel');
    let [valueWheel] = flatstore.useWatch('valueWheel');
    let [invert] = flatstore.useWatch("invert/btnWheel");

    let { id, index, type, pressed, value } = valueWheel;

    let currentRotation = value;

    let maxrotation = flatstore.get('maxrotation');
    let degrees = currentRotation * (maxrotation / 2) * (invert ? -1 : 1);
    let wheelStyle = {
        transform: 'rotate(' + degrees + 'deg)'
    };

    return (
        <div style={{ position: 'relative' }}>

            <WheelButtons wheelStyle={wheelStyle} />

            <img width="500px" height="500px" alt="" style={wheelStyle} src={imgWheel} />
        </div>
    )

}

function WheelButtons(props) {

    let [wheelButtonsEnabled] = flatstore.useWatch('wheelButtonsEnabled');

    if (!wheelButtonsEnabled) {
        return <></>
    }
    let wheelStyle = props.wheelStyle;
    return (
        <>
            <WheelButtonMask id="Wheel_DUp" wheelStyle={wheelStyle} />
            <WheelButtonMask id="Wheel_DDown" wheelStyle={wheelStyle} />
            <WheelButtonMask id="Wheel_DLeft" wheelStyle={wheelStyle} />
            <WheelButtonMask id="Wheel_DRight" wheelStyle={wheelStyle} />
            <WheelButtonMask id="Wheel_Back" wheelStyle={wheelStyle} />
            <WheelButtonMask id="Wheel_Start" wheelStyle={wheelStyle} />
            <WheelButtonMask id="Wheel_X" wheelStyle={wheelStyle} />
            <WheelButtonMask id="Wheel_Y" wheelStyle={wheelStyle} />
            <WheelButtonMask id="Wheel_A" wheelStyle={wheelStyle} />
            <WheelButtonMask id="Wheel_B" wheelStyle={wheelStyle} />
            <WheelButtonMask id="Wheel_RSB" wheelStyle={wheelStyle} />
            <WheelButtonMask id="Wheel_LSB" wheelStyle={wheelStyle} />
            <WheelButtonMask id="Wheel_LB" wheelStyle={wheelStyle} />
            <WheelButtonMask id="Wheel_RB" wheelStyle={wheelStyle} />
            <WheelButtonMask id="Wheel_L3" wheelStyle={wheelStyle} />
            <WheelButtonMask id="Wheel_R3" wheelStyle={wheelStyle} />
            <WheelButtonMask id="Wheel_L4" wheelStyle={wheelStyle} />
            <WheelButtonMask id="Wheel_R4" wheelStyle={wheelStyle} />
        </>
    )
}

function WheelButtonMask(props) {

    let [imgSrc] = flatstore.useWatch("img" + props.id);
    let [valueButton] = flatstore.useWatch("value" + props.id);

    let { type, pressed, value } = valueButton || {};
    let intensity = 0;
    if (type === 'Button' && pressed) {
        intensity = Math.min(Math.max(Math.abs(value || 0), 0.35), 1);
    }


    return (
        <div
            className="wheel-button-mask"
            style={{
                ...props.wheelStyle,
                '--wheel-mask-image': `url(${imgSrc})`,
                opacity: intensity,
                filter: `brightness(${1 + (intensity * 0.85)})`
            }}
        />
    )
}

export default Wheel;
