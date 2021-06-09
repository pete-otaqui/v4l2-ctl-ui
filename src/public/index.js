async function main() {
  const response = await fetch('/settings');
  const settingsData = await response.json();
  console.log('settings', settings);
}


function createSettings(settings) {
  const form = getForm();
  settings.forEach((setting) => {
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
  return container;
}

main();