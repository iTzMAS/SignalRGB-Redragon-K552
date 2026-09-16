export function Name() { return "Redragon K552"; }
export function VendorId() { return 0x320F; }
export function ProductId() { return [0x5000, 0x5055]; }
export function Publisher() { return "WhirlwindFx"; }
export function Size() { return [18, 6]; }
export function DeviceType() { return "keyboard"; }
export function Validate(endpoint) { return endpoint.interface === 1; }

export function ControllableParameters() {
    return [
        {
            property: "LightingMode",
            group: "lighting",
            label: "Lighting Mode",
            type: "combobox",
            values: ["Canvas", "Forced"],
            default: "Canvas"
        },
        {
            property: "forcedColor",
            group: "lighting",
            label: "Forced Color",
            type: "color",
            default: "#009bde"
        },
        {
            property: "fpsLimit",
            group: "lighting",
            label: "FPS Limit",
            type: "number",
            min: "15",
            max: "60",
            step: "1",
            default: "28"
        }
    ];
}

const Keymap = {
    // Row 0
    0: ["Esc", [0, 0]],
    1: ["'", [0, 1]],
    8: ["F1", [2, 0]],
    16: ["F2", [3, 0]],
    24: ["F3", [4, 0]],
    32: ["F4", [5, 0]],
    40: ["F5", [6, 0]],
    48: ["F6", [7, 0]],
    56: ["F7", [8, 0]],
    64: ["F8", [9, 0]],
    72: ["F9", [10, 0]],
    80: ["F10", [11, 0]],
    88: ["F11", [12, 0]],
    96: ["F12", [13, 0]],
    104: ["PrtSc", [15, 0]],
    112: ["ScrLk", [16, 0]],
    120: ["Pause", [17, 0]],

    // Row 1
    9: ["1", [1, 1]],
    17: ["2", [2, 1]],
    25: ["3", [3, 1]],
    33: ["4", [4, 1]],
    41: ["5", [5, 1]],
    49: ["6", [6, 1]],
    57: ["7", [7, 1]],
    65: ["8", [8, 1]],
    73: ["9", [9, 1]],
    81: ["0", [9, 1]],
    89: ["-", [10, 1]],
    97: ["=", [11, 1]],
    105: ["Backspace", [13, 1]],
    113: ["Insert", [15, 1]],
    121: ["Home", [16, 1]],
    115: ["Page Up", [17, 1]],

    // Row 2
    2: ["Tab", [0, 2]],
    10: ["Q", [1, 2]],
    18: ["W", [2, 2]],
    26: ["E", [3, 2]],
    34: ["R", [4, 2]],
    42: ["T", [5, 2]],
    50: ["Y", [6, 2]],
    58: ["U", [7, 2]],
    66: ["I", [8, 2]],
    74: ["O", [9, 2]],
    82: ["P", [10, 2]],
    90: ["[", [11, 2]],
    98: ["]", [12, 2]],
    106: ["\\", [13, 2]],
    114: ["Delete", [15, 2]],
    122: ["End", [16, 2]],
    123: ["Page Down", [17, 2]],

    // Row 3
    3: ["Caps Lock", [0, 3]],
    11: ["A", [1, 3]],
    19: ["S", [2, 3]],
    27: ["D", [3, 3]],
    35: ["F", [4, 3]],
    43: ["G", [5, 3]],
    51: ["H", [6, 3]],
    59: ["J", [7, 3]],
    67: ["K", [8, 3]],
    75: ["L", [9, 3]],
    83: [";", [10, 3]],
    91: ["'", [11, 3]],
    107: ["Enter", [13, 3]],

    // Row 4
	4: ["Left Shift", [0, 4]],
    20: ["Z", [1, 4]],
    28: ["X", [2, 4]],
    36: ["C", [3, 4]],
    44: ["V", [4, 4]],
    52: ["B", [5, 4]],
    60: ["N", [6, 4]],
    68: ["M", [7, 4]],
    76: [",", [8, 4]],
    84: [".", [9, 4]],
    92: ["/", [10, 4]],
    108: ["Right Shift", [13, 4]],
    116: ["Up Arrow", [16, 4]],

    // Row 5
    5: ["Left Ctrl", [0, 5]],
    13: ["Windows", [1, 5]],
    21: ["Left Alt", [2, 5]],
    45: ["Space Bar", [6, 5]],
    77: ["Right Alt", [10, 5]],
    85: ["Fn", [11, 5]],
    93: ["Menu", [12, 5]],
    101: ["Right Ctrl", [13, 5]],
    109: ["Left Arrow", [15, 5]],
    117: ["Down Arrow", [16, 5]],
    125: ["Right Arrow", [17, 5]]
};

export function Initialize() {
    device.set_endpoint(1, 0x0092, 0xff1c, 0x0004);
    EVISION.Initialize();
    EVISION.setSoftwareMode();
}

export function Render() {
    EVISION.sendColors();
}

export function Shutdown() {
    EVISION.restoreHardwareMode();
}

class EVISION_Device_Protocol {
    constructor() {
        this.RGBData = new Array(392).fill(0);
        this.packetBuffer = new Array(64).fill(0);
        this.lastRenderTime = 0;

        this.ledCount = 0;
        this.RenderIdx = null;
        this.RenderX = null;
        this.RenderY = null;

        this._lastForcedColor = "";
        this._cachedForcedRgb = [0, 0, 0];

        this.packetBuffer[3] = 0x12;
        this.packetBuffer[4] = 56;
        this.packetBuffer[7] = 0x00;
    }

    Initialize() {
        const LedNames = [];
        const LedPositions = [];
        const ids = Object.keys(Keymap);
        const count = ids.length;

        this.RenderIdx = new Array(count);
        this.RenderX = new Array(count);
        this.RenderY = new Array(count);
        this.ledCount = count;

        for (let i = 0; i < count; i++) {
            const id = parseInt(ids[i]);
            const entry = Keymap[id];
            const x = entry[1][0];
            const y = entry[1][1];

            LedNames.push(entry[0]);
            LedPositions.push([x, y]);

            this.RenderIdx[i] = id * 3;
            this.RenderX[i] = x;
            this.RenderY[i] = y;
        }

        device.setName("Redragon K552");
        device.setSize([18, 6]);
        device.setControllableLeds(LedNames, LedPositions);
    }

    setSoftwareMode() {
        try {
            device.write(
                [0x04, 0x8c, 0x00, 0x0b, 0x30, 0x50, 0x01],
                64
            );
            device.pause(30);
        } catch (e) {
            device.log("Error entering software mode: " + e);
        }
    }

    restoreHardwareMode() {
        try {
            device.write(
                [0x04, 0x8c, 0x00, 0x0b, 0x30, 0x50, 0x00],
                64
            );
            device.pause(30);
        } catch (e) {
            device.log("Error restoring hardware mode: " + e);
        }
    }

    sendColors() {
        const targetDelay = 1000 / (fpsLimit || 28);
        const now = Date.now();

        if (now - this.lastRenderTime < targetDelay) {
            return;
        }

        this.lastRenderTime = now;

        const RGBData = this.RGBData;
        const RenderIdx = this.RenderIdx;
        const RenderX = this.RenderX;
        const RenderY = this.RenderY;
        const len = this.ledCount;

        if (LightingMode === "Forced") {
            if (forcedColor !== this._lastForcedColor) {
                this._cachedForcedRgb = hexToRgb(forcedColor);
                this._lastForcedColor = forcedColor;
            }

            const fr = this._cachedForcedRgb[0];
            const fg = this._cachedForcedRgb[1];
            const fb = this._cachedForcedRgb[2];

            for (let i = 0; i < len; i++) {
                const idx = RenderIdx[i];

                RGBData[idx] = fr;
                RGBData[idx + 1] = fg;
                RGBData[idx + 2] = fb;
            }
        } else {
            for (let i = 0; i < len; i++) {
                const idx = RenderIdx[i];
                const color = device.color(RenderX[i], RenderY[i]);

                RGBData[idx] = color[0];
                RGBData[idx + 1] = color[1];
                RGBData[idx + 2] = color[2];
            }
        }

        this.writeRGBPackages();
    }

    writeRGBPackages() {
        const packetBuffer = this.packetBuffer;
        const RGBData = this.RGBData;

        for (let i = 0; i < 7; i++) {
            const start = i * 56;
            let sum = 0;

            for (let j = 0; j < 56; j++) {
                const val = RGBData[start + j];

                packetBuffer[8 + j] = val;
                sum += val;
            }

            const checksum = sum + start + 74;

            packetBuffer[0] = 0x04;
            packetBuffer[1] = checksum & 0xFF;
            packetBuffer[2] = (checksum >>> 8) & 0xFF;
            packetBuffer[5] = start & 0xFF;
            packetBuffer[6] = (start >>> 8) & 0xFF;

            device.write(packetBuffer, 64);
            device.pause(2);
        }

        device.pause(4);
    }
}

const EVISION = new EVISION_Device_Protocol();

function hexToRgb(hex) {
    const result =
        /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    return result
        ? [
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16)
        ]
        : [0, 0, 0];
}
