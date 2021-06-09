let settingsData = [];

async function main() {
  await fetchSettingsData();
  createSettingsControls();
}

async function fetchSettingsData() {
  const response = await fetch('/settings');
  const rawSettingsData = await response.json();
  settingsData = rawSettingsData.settings;
}

async function sendSetting(name, value) {
  await fetch(`/settings/${name}`, { method: 'PUT', body: value });
  await fetchSettingsData();
  createSettingsControls();
}

async function updateSettingControl(name, value) {
  const setting = settingsData.find(s => s.name === name);
  setting.value = value;
  await sendSetting(name, value);
}

function createSettingsControls() {
  const form = getForm();
  settingsData.forEach((setting) => {
    createSettingControl(setting, form);
  });
}

function getForm() {
  return document.getElementById('form');
}

function createSettingControl(setting, form) {
  switch(setting.type) {
    case 'int':
      createSettingControlInt(setting, form);
      break;
    case 'bool':
      createSettingControlBool(setting, form);
      break;
    case 'menu':
      createSettingControlMenu(setting, form);
      break;
  }
}

function createBasicControl(setting, form, type, getValue) {
  let label;
  let control;
  let controlValue;
  let reset;
  const controlFound = !!document.getElementById(setting.name);

  if (!controlFound) {
    label = document.createElement('label');
    label.setAttribute('for', setting.name);
    label.setAttribute('data-setting', setting.name);
    form.appendChild(label);

    control = document.createElement(type);
    control.classList.add('setting-control');
    control.setAttribute('data-setting', setting.name);
    control.setAttribute('name', setting.name);
    control.setAttribute('id', setting.name);
    control.addEventListener('change', () => {
      const value = getValue(control);
      updateSettingControl(setting.name, value);
    }, false);
    form.appendChild(control);

    controlValue = document.createElement('div');
    controlValue.classList.add('control-value');
    controlValue.setAttribute('data-setting', setting.name);
    form.appendChild(controlValue);

    reset = document.createElement('button');
    reset.classList.add('reset');
    reset.setAttribute('data-setting', setting.name);
    reset.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      updateSettingControl(setting.name, setting.default);
    }, false);
    form.appendChild(reset);
  } else {
    label = form.querySelector(`label[data-setting="${setting.name}"]`);
    reset = form.querySelector(`.reset[data-setting="${setting.name}"]`);
    control = form.querySelector(`${type}[data-setting="${setting.name}"]`);
    controlValue = form.querySelector(`.control-value[data-setting="${setting.name}"]`);
  }

  label.textContent = `${setting.name}`;
  controlValue.innerHTML = setting.value;
  reset.innerHTML = `reset to ${setting.default}`;

  if (setting.inactive) {
    control.setAttribute('readonly', true);
    control.setAttribute('disabled', true);
  } else {
    control.removeAttribute('readonly');
    control.removeAttribute('disabled');
  }
  
  return control;
}

function createSettingControlInt(setting, form) {
  const control = createBasicControl(setting, form, 'input', (control) => parseInt(control.value, 10));
  control.setAttribute('type', 'range');
  control.setAttribute('min', setting.min);
  control.setAttribute('max', setting.max);
  control.setAttribute('value', setting.value);
  control.value = setting.value;
}
function createSettingControlBool(setting, form) {
  const control = createBasicControl(setting, form, 'input', (control) => control.checked ? 1 : 0);
  control.setAttribute('type', 'checkbox');
  if (setting.value === 1) {
    control.setAttribute('checked', true);
  } else {
    control.removeAttribute('checked');
  }
}
function createSettingControlMenu(setting, form) {
  const control = createBasicControl(setting, form, 'select', (control) => parseInt(control.value, 10));
  control.innerHTML = '';
  setting.options.forEach((settingOption) => {
    const option = document.createElement('option');
    option.setAttribute('value', settingOption.number);
    if (settingOption.number === setting.value) {
      option.setAttribute('selected', true);
    }
    option.textContent = settingOption.value
    control.appendChild(option);
  });
}

main();
