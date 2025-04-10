export function initializeMaps() {
    const mapToggles = document.querySelectorAll('.map-toggle');
    mapToggles.forEach(toggle => {
        toggle.addEventListener('click', () => handleMapToggle(toggle));
    });
}

function handleMapToggle(toggle) {
    const mapContainer = toggle.parentElement.parentElement.nextElementSibling;
    const mapType = toggle.dataset.map;

    mapContainer.classList.toggle('collapsed');
    toggle.classList.toggle('active');
    updateToggleText(toggle, mapContainer, mapType);
}

function updateToggleText(toggle, mapContainer, mapType) {
    const isCollapsed = mapContainer.classList.contains('collapsed');
    const mapName = mapType === 'church' ? 'kościół' : 'salę';
    const text = isCollapsed ? `Pokaż ${mapName} na mapie` : 'Ukryj mapę';
    const rotation = isCollapsed ? '0deg' : '180deg';

    toggle.innerHTML = `${text} <span class="toggle-icon" style="transform: rotate(${rotation})">▼</span>`;
}