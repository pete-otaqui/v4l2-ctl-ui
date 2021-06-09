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

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
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
  const containerId = `${setting.name}-container`;
  let container = document.getElementById(containerId);
  let label;
  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', containerId);
    container.classList.add('setting');
    label = document.createElement('label');
    container.appendChild(label);
    label.setAttribute('for', setting.name);
    label.textContent = setting.name;
    form.appendChild(container);
  } else {
    label = container.querySelector('label');
  }
  switch(setting.type) {
    case 'int':
      createSettingControlInt(setting, container);
      break;
    case 'bool':
      createSettingControlBool(setting, container);
      break;
    case 'menu':
      createSettingControlMenu(setting, container);
      break;
  }
}

function createBasicControl(setting, container, type, getValue) {
  let control = container.querySelector(type);
  if (!control) {
    control = document.createElement(type);
    control.classList.add('setting-control');
    control.setAttribute('name', setting.name);
    control.setAttribute('id', setting.name);
    control.addEventListener('change', () => {
      const value = getValue(control);
      updateSettingControl(setting.name, value);
    }, false);
    container.appendChild(control);
  }
  if (setting.inactive) {
    control.setAttribute('readonly', true);
    control.setAttribute('disabled', true);
  } else {
    control.removeAttribute('readonly');
    control.removeAttribute('disabled');
  }
  // control.setAttribute('readonly', setting.inactive ? true : false);
  // control.setAttribute('disabled', setting.inactive ? true : false);
  return control;
}

function createSettingControlInt(setting, container) {
  const control = createBasicControl(setting, container, 'input', (control) => parseInt(control.value, 10));
  control.setAttribute('type', 'range');
  control.setAttribute('min', setting.min);
  control.setAttribute('max', setting.max);
  control.setAttribute('value', setting.value);
}
function createSettingControlBool(setting, container) {
  const control = createBasicControl(setting, container, 'input', (control) => control.checked ? 1 : 0);
  control.setAttribute('type', 'checkbox');
  if (setting.value === 1) {
    control.setAttribute('checked', true);
  } else {
    control.removeAttribute('checked');
  }
}
function createSettingControlMenu(setting, container) {
  const control = createBasicControl(setting, container, 'select', (control) => parseInt(control.value, 10));
  control.innerHTML = '';
  setting.options.forEach((settingOption, index) => {
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
