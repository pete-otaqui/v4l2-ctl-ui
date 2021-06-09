let settingsData = [];

async function main() {
  await fetchSettingsData();
  createSettingsControls();
}

async function fetchSettingsData() {
  const response = await fetch('/settings');
  const rawSettingsData = await response.json();
  settingsData = rawSettingsData.settings;
  console.log('settingsData', settingsData);
}
async function sendSetting(name, value) {
  const response = await fetch(`/settings/${name}`, { method: 'PUT', body: value });
  const responseData = await response.json();
  console.log('responseData', responseData);
}



async function updateSettingControl(name, value) {
  const setting = settingsData.find(s => s.name === name);
  setting.value = value;
  await sendSetting(name, value);
}

function createSettingsControls() {
  const form = getForm();
  settingsData.forEach((setting) => {
    const el = createSettingControl(setting);
    form.appendChild(el);
  });
  
}

function getForm() {
  return document.getElementById('form');
}

function createSettingControl(setting) {
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
  return container;
}

function createSettingControlInt(setting, container) {
  const control = document.createElement('input');
  control.classList.add('setting-control');
  control.setAttribute('type', 'range');
  control.setAttribute('name', setting.name);
  control.setAttribute('id', setting.name);
  control.setAttribute('min', setting.min);
  control.setAttribute('max', setting.max);
  control.setAttribute('value', setting.value);
  control.addEventListener('change', () => {
    const value = parseInt(control.value, 10);
    updateSettingControl(setting.name, value);
  }, false);
  container.appendChild(control);
}
function createSettingControlBool(setting, container) {
  const control = document.createElement('input');
  control.classList.add('setting-control');
  control.setAttribute('type', 'checkbox');
  control.setAttribute('name', setting.name);
  control.setAttribute('id', setting.name);
  control.setAttribute('checked', setting.value === 1);
  control.addEventListener('change', () => {
    const value = control.checked ? 1 : 0;
    updateSettingControl(setting.name, value);
  }, false);
  container.appendChild(control);
}
function createSettingControlMenu(setting, container) {
  const control = document.createElement('select');
  control.classList.add('setting-control');
  control.setAttribute('name', setting.name);
  control.setAttribute('id', setting.name);
  setting.options.forEach((settingOption) => {
    const option = document.createElement('option');
    option.setAttribute('value', settingOption.number);
    option.setAttribute('selected', settingOption.number === setting.value);
    option.textContent = settingOption.value
    control.appendChild(option);
  })
  control.addEventListener('change', () => {
    const value = parseInt(control.value, 10);
    updateSettingControl(setting.name, value);
  }, false);
  container.appendChild(control);
}

main();
