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
  console.log('createBasicControl', setting.name);
  const containerId = `${setting.name}-container`;
  let container = document.getElementById(containerId);
  let meta;
  let label;
  let values;
  let control;
  let reset;
  if (!container) {
    container = document.createElement('div');
    container.setAttribute('id', containerId);
    container.classList.add('setting');
    meta = document.createElement('div');
    label = document.createElement('label');
    values = document.createElement('div');
    reset = document.createElement('button');
    reset.innerHTML = `Reset: ${setting.default}`;
    reset.classList.add('reset');
    values.classList.add('values');
    meta.appendChild(label);
    meta.appendChild(values);
    container.appendChild(meta);
    label.setAttribute('for', setting.name);
    form.appendChild(container);

    control = document.createElement(type);
    control.classList.add('setting-control');
    control.setAttribute('name', setting.name);
    control.setAttribute('id', setting.name);
    control.addEventListener('change', () => {
      const value = getValue(control);
      updateSettingControl(setting.name, value);
    }, false);
    reset.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      updateSettingControl(setting.name, setting.default);
    }, false);
    container.appendChild(control);
  } else {
    label = container.querySelector('label');
    values = container.querySelector('.values');
    control = container.querySelector(type);
    reset = container.querySelector('.reset');
    reset.parentNode.removeChild(reset);
  }
  label.textContent = `${setting.name}`;
  values.innerHTML = `cur: ${setting.value}, default ${setting.default}, `;
  reset.innerHTML = `reset`;
  values.appendChild(reset);
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
