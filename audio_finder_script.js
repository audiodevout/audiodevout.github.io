async function loadAudioList() {
  const response = await fetch('/list-audio');
  const files = await response.json();

  const select = document.getElementById('audioSelect');
  const player = document.getElementById('audioPlayer');

  files.forEach(file => {
    const option = document.createElement('option');
    option.value = `/audio/${file}`;
    option.textContent = file;
    select.appendChild(option);
  });

  select.addEventListener('change', () => {
    player.src = select.value;
    player.play();
  });

  if (files.length > 0) {
    select.value = `/audio/${files[0]}`;
    player.src = select.value;
  }
}

window.addEventListener('DOMContentLoaded', loadAudioList);
