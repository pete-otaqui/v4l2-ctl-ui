async function main() {
  const response = await fetch('/settings');
  const settingsData = await response.json();
  console.log('settingsData', settingsData);
  createSettings(settingsData.settings);
}


function createSettings(settingsData) {
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
  const container = document.createElement('div');
  container.classList.add('setting');
  const label = document.createElement('label');
  label.textContent = setting.name;
  label.setAttribute('for', setting.name);
  container.appendChild(label);
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
    console.log('change', setting.name, parseInt(control.value, 10));
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
    console.log('change', setting.name, control.checked ? 1 : 0);
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
    console.log('change', setting.name, parseInt(control.value, 10));
  }, false);
  container.appendChild(control);
}

main();