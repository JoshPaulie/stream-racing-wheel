const CONTROLLER_TYPES = ["wheel", "pedal", "shifter"];

const CONTROLLER_PROFILE_KEYS = {
  wheel: [
    "btnWheel",
    "btnWheel_DUp",
    "btnWheel_DDown",
    "btnWheel_DLeft",
    "btnWheel_DRight",
    "btnWheel_Back",
    "btnWheel_Start",
    "btnWheel_X",
    "btnWheel_Y",
    "btnWheel_A",
    "btnWheel_B",
    "btnWheel_RSB",
    "btnWheel_LSB",
    "btnWheel_LB",
    "btnWheel_RB",
    "btnWheel_L3",
    "btnWheel_R3",
    "btnWheel_L4",
    "btnWheel_R4",
    "imgWheel",
    "imgWheel_DUp",
    "imgWheel_DDown",
    "imgWheel_DLeft",
    "imgWheel_DRight",
    "imgWheel_Back",
    "imgWheel_Start",
    "imgWheel_X",
    "imgWheel_Y",
    "imgWheel_A",
    "imgWheel_B",
    "imgWheel_RSB",
    "imgWheel_LSB",
    "imgWheel_LB",
    "imgWheel_RB",
    "imgWheel_L3",
    "imgWheel_R3",
    "imgWheel_L4",
    "imgWheel_R4",
  ],
  pedal: ["btnGas", "btnBrake", "btnClutch", "imgPedalBase", "imgGas", "imgBrake", "imgClutch"],
  shifter: ["btnGearReverse", "btnGear1", "btnGear2", "btnGear3", "btnGear4", "btnGear5", "btnGear6", "btnGear7", "imgShifterBase", "imgShifter"],
};

export function normalizeControllerType(controllerType) {
  if (controllerType === "pedals") {
    return "pedal";
  }

  if (CONTROLLER_TYPES.includes(controllerType)) {
    return controllerType;
  }

  return "wheel";
}

export function getControllerFromPath(pathname) {
  const basePath = import.meta.env.BASE_URL || "/";
  let path = pathname || "/";

  if (path.startsWith(basePath)) {
    path = path.slice(basePath.length);
  } else if (basePath !== "/" && path.startsWith(basePath.slice(0, -1))) {
    path = path.slice(basePath.length - 1);
  }

  const segment = path.replace(/^\/+|\/+$/g, "").split("/")[0] || "wheel";
  return normalizeControllerType(segment);
}

export function getControllerProfileKeys(controllerType) {
  return CONTROLLER_PROFILE_KEYS[normalizeControllerType(controllerType)] || CONTROLLER_PROFILE_KEYS.wheel;
}

export function getControllerPath(controllerType) {
  const normalized = normalizeControllerType(controllerType);
  const basePath = import.meta.env.BASE_URL || "/";
  return `${basePath}${normalized}`;
}

export function getScopedStorageKey(controllerType, key) {
  return `srw:${normalizeControllerType(controllerType)}:${key}`;
}

export function readScopedStorage(controllerType, key) {
  const raw = localStorage.getItem(getScopedStorageKey(controllerType, key));
  if (raw === null) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (_e) {
    return raw;
  }
}

export function writeScopedStorage(controllerType, key, value) {
  localStorage.setItem(getScopedStorageKey(controllerType, key), JSON.stringify(value));
}
