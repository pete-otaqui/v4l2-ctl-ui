import child_process from 'child_process';


export async function v4l2CtlListDevices() {
  const result = await exec('v4l2-ctl --list-devices');
  return result;
}

export function validateDevice(device) {
  if (!device.match(/^\/dev\/video[0-9]+$/)) {
    throw new RangeError(`not a valid device specifier '${device}'`);
  }
}
export function validateCtrl(ctrl) {
  if (!ctrl.match(/^[a-z_]+$/)) {
    throw new RangeError(`not a valid ctrl specifier ${ctrl}`);
  }
}
export function validateValue(value) {
  if (!value.match(/^-?[0-9]+$/)) {
    throw new RangeError(`not a valid value ${value}`);
  }
}

export async function v4l2CtlListCtrls(device) {
  validateDevice(device);
  const result = await v4l2CtlExec(`v4l2-ctl --list-ctrls --device ${device}`);
  return result;
}
export async function v4l2CtlListCtrlsMenus(device) {
  validateDevice(device);
  const result = await v4l2CtlExec(`v4l2-ctl --list-ctrls-menus --device ${device}`);
  return result;
}
export async function v4l2CtlSetCtrlValue(device, ctrl, value) {
  await Promise.all([
    validateDevice(device),
    validateCtrl(ctrl),
    validateValue(value),
  ]);
  const cmd = `v4l2-ctl --device ${device} -c ${ctrl}=${value}`;
  const result = await v4l2CtlExec(cmd);
  return result;
};

export function v4l2CtlExec(cmd) {
  return new Promise((resolve, reject) => {
    child_process.exec(cmd, (err, stdout, stderr) => {
      if (err) {
        return reject(stderr);
      }
      resolve(stdout);
    })
  });
}
