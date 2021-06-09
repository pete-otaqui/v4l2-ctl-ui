import { v4l2CtlListCtrlsMenus, v4l2CtlSetCtrlValue, v4l2CtlListDevices } from './v4l2-ctl.mjs';

export async function getDevice(/* deviceId */) {
  return '/dev/video0';
}

export async function listDevices() {
  const rawString = await v4l2CtlListDevices();
  const rawList = rawString.split('\n');
  const devices = rawList.reduce((acc, rawLine) => {
    const line = rawLine.trim();
    if (line.match(/^\/dev\/video[0-9]+$/)) {
      acc.push(line);
    }
    return acc;
  }, []);
  return devices;
}

export async function getSettings(device) {
  const rawString = await v4l2CtlListCtrlsMenus(device);
  const settings = await parseSettingsString(rawString);
  return settings;
}

export async function updateSetting(name, value) {
  const device = await getDevice();
  v4l2CtlSetCtrlValue(device, name, value);
}

export async function parseSettingsString(rawString) {
  const rawList = rawString.split('\n');
  let capturingMenu = false;
  const settings = rawList.reduce((acc, rawLine) => {
    const line = rawLine.trim();
    if (!line) {
      return acc;
    }
    if (capturingMenu) {
      const parts = line.match(/^(\d+):\s+(.*)$/);
      if (parts) {
        // eslint-disable-next-line no-unused-vars
        const [_, number, value] = parts;
        let item = acc[acc.length - 1];
        item.options.push({ number: parseInt(number, 10), value });
      } else {
        capturingMenu = false;
      }
    }
    if (!capturingMenu) {
      const parts = line.match(/^([a-z_]+)\s+0x[0-9a-f]+\s+\(([a-z]+)\)\s+:\s+(.*)$/);
      // eslint-disable-next-line no-unused-vars
      const [_, name, type, valuesString] = parts;
      let item = {
        name,
        type,
      };
      if (type === 'int' || type === 'bool' || type === 'menu') {
        const range = valuesString.split(' ').reduce((obj, kv) => {
          const [k, vS] = kv.split('=');
          if (k === 'flags') {
            const v = (vS === 'inactive');
            obj.inactive = v;
          } else {
            const v = parseInt(vS, 10);
            obj[k] = v;
          }
          return obj;
        }, {});
        item = {...item, ...range};
      }
      if (type === 'menu') {
        item.options = [];
        capturingMenu = true;
      }
      acc.push(item);
    }
    return acc;
  }, []);
  settings.sort((a, b) => {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  })
  return settings;
}
