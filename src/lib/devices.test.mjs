import tape from "tape";

import { parseSettingsString } from "./devices.mjs";

const STRING = `                     brightness 0x00980900 (int)    : min=-64 max=64 step=1 default=0 value=0
contrast 0x00980901 (int)    : min=0 max=64 step=1 default=32 value=24
saturation 0x00980902 (int)    : min=0 max=128 step=1 default=64 value=72
     hue 0x00980903 (int)    : min=-40 max=40 step=1 default=0 value=0
white_balance_temperature_auto 0x0098090c (bool)   : default=1 value=1
   gamma 0x00980910 (int)    : min=72 max=500 step=1 default=100 value=100
    gain 0x00980913 (int)    : min=0 max=100 step=1 default=0 value=0
power_line_frequency 0x00980918 (menu)   : min=0 max=2 default=1 value=2
         0: Disabled
         1: 50 Hz
         2: 60 Hz
white_balance_temperature 0x0098091a (int)    : min=2800 max=6500 step=1 default=4600 value=4600 flags=inactive
sharpness 0x0098091b (int)    : min=0 max=6 step=1 default=4 value=3
backlight_compensation 0x0098091c (int)    : min=0 max=255 step=1 default=1 value=1
exposure_auto 0x009a0901 (menu)   : min=0 max=3 default=3 value=1
exposure_absolute 0x009a0902 (int)    : min=1 max=5000 step=1 default=157 value=157
exposure_auto_priority 0x009a0903 (bool)   : default=0 value=1
focus_absolute 0x009a090a (int)    : min=1 max=1023 step=1 default=280 value=1023
focus_auto 0x009a090c (bool)   : default=1 value=0`;

tape("Collects correct number of settings", async (t) => {
  const settings = await parseSettingsString(STRING);
  t.equal(settings.length, 16);
  t.end();
});

tape("Parses ints correctly", async (t) => {
  const settings = await parseSettingsString(STRING);
  t.deepEqual(settings[1], {
    type: "int",
    name: "brightness",
    min: -64,
    max: 64,
    step: 1,
    default: 0,
    value: 0,
  });
  t.end();
});

tape("Parses bools correctly", async (t) => {
  const settings = await parseSettingsString(STRING);
  t.deepEqual(settings[15], {
    type: "bool",
    name: "white_balance_temperature_auto",
    default: 1,
    value: 1,
  });
  t.end();
});

tape("Parses menus correctly", async (t) => {
  const settings = await parseSettingsString(STRING);
  t.deepEqual(settings[11], {
    type: "menu",
    name: "power_line_frequency",
    min: 0,
    max: 2,
    default: 1,
    value: 2,
    options: [
      { number: 0, value: "Disabled" },
      { number: 1, value: "50 Hz" },
      { number: 2, value: "60 Hz" },
    ],
  });
  t.end();
});

tape("Parses inactive items correctly", async (t) => {
  const settings = await parseSettingsString(STRING);
  t.deepEqual(settings[14], {
    name: "white_balance_temperature",
    type: "int",
    min: 2800,
    max: 6500,
    step: 1,
    default: 4600,
    value: 4600,
    inactive: true,
  });
  t.end();
});
