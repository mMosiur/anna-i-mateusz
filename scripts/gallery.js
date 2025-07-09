import { fetchWeddingInfo } from './api.js';

const apiBaseUrl = 'https://anna-i-mateusz.azurewebsites.net';
let currentPhotos = [];
let currentPhotoIndex = 0;
let apiKey = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeGallery();
});

async function initializeGallery() {
    const urlParams = new URLSearchParams(window.location.search);
    apiKey = urlParams.get('key');

    if (!apiKey) {
        hideAllContent();
        return;
    }

    showAllContent();
    await loadPhotos();
    setupEventListeners();
}

function hideAllContent() {
    const elementsToHide = [
        '#greeting-text',
        '.page-navigation',
        '.upload-section',
        '.gallery-section'
    ];

    elementsToHide.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) element.classList.add('hide');
    });
}

function showAllContent() {
    const elementsToShow = [
        '#greeting-text',
        '.page-navigation',
        '.upload-section',
        '.gallery-section'
    ];

    elementsToShow.forEach(selector => {
        const element = document.querySelector(selector);
        if (element) element.classList.remove('hide');
    });

    // Update navigation link with current key
    const navLink = document.querySelector('.nav-link');
    if (navLink) {
        navLink.href = `index.html?key=${apiKey}`;
    }
}

function setupEventListeners() {
    // File input change
    const photoInput = document.getElementById('photo-input');
    photoInput.addEventListener('change', handleFileSelect);

    // Gallery filters
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => handleFilterChange(btn));
    });

    // Modal controls
    const modal = document.getElementById('photo-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalBackdrop = document.querySelector('.modal-backdrop');
    const modalPrev = document.getElementById('modal-prev');
    const modalNext = document.getElementById('modal-next');

    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    modalPrev.addEventListener('click', showPrevPhoto);
    modalNext.addEventListener('click', showNextPhoto);

    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

async function handleFileSelect(event) {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    const validFiles = files.filter(file => {
        const validTypes = [
            'image/jpeg',
            'image/png',
            'image/webp',
            'image/heic',
            'image/heif'
        ];
        return validTypes.includes(file.type) && file.size <= 10 * 1024 * 1024; // 10MB limit
    });

    if (validFiles.length === 0) {
        alert('Proszę wybrać prawidłowe pliki zdjęć (JPG, PNG, WEBP, HEIC/HEIF, maksymalnie 10MB każdy).');
        return;
    }

    await uploadPhotos(validFiles);
    event.target.value = ''; // Reset input
}

async function uploadPhotos(files) {
    const progressContainer = document.querySelector('.upload-progress');
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');

    progressContainer.classList.remove('hide');

    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const progress = ((i + 1) / files.length) * 100;

            progressFill.style.width = `${progress}%`;
            progressText.textContent = `Przesyłanie ${i + 1} z ${files.length}...`;

            const formData = new FormData();
            formData.append('photo', file);

            const response = await fetch(`${apiBaseUrl}/gallery/upload`, {
                method: 'POST',
                headers: {
                    'X-Api-Key': apiKey
                },
                body: formData
            });

            if (!response.ok) {
                throw new Error(`Failed to upload ${file.name}`);
            }
        }

        progressText.textContent = 'Przesyłanie zakończone!';
        setTimeout(() => {
            progressContainer.classList.add('hide');
            loadPhotos(); // Refresh gallery
        }, 1500);

    } catch (error) {
        console.error('Upload error:', error);
        progressText.textContent = 'Błąd podczas przesyłania. Spróbuj ponownie.';
        setTimeout(() => {
            progressContainer.classList.add('hide');
        }, 3000);
    }
}

async function loadPhotos() {
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryEmpty = document.querySelector('.gallery-empty');

    try {
        const response = await fetch(`${apiBaseUrl}/gallery/photos`, {
            headers: {
                'X-Api-Key': apiKey
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load photos');
        }

        const photos = await response.json();
        currentPhotos = photos;

        if (photos.length === 0) {
            galleryGrid.innerHTML = '';
            galleryEmpty.classList.remove('hide');
        } else {
            galleryEmpty.classList.add('hide');
            displayPhotos(photos);
        }

    } catch (error) {
        console.error('Load photos error:', error);
        galleryGrid.innerHTML = '<p>Błąd podczas ładowania zdjęć.</p>';
    }
}

function displayPhotos(photos) {
    const galleryGrid = document.getElementById('gallery-grid');

    const photosHTML = photos.map((photo, index) => `
        <div class="gallery-item" data-index="${index}" onclick="openModal(${index})">
            <img src="${photo.thumbnailUrl}" alt="Zdjęcie ${index + 1}" loading="lazy">
            <div class="gallery-item-overlay">
                <div>${formatDate(photo.uploadDate)}</div>
                <div>Dodane przez: ${photo.uploaderName || 'Gość'}</div>
            </div>
        </div>
    `).join('');

    galleryGrid.innerHTML = photosHTML;
}

function handleFilterChange(clickedBtn) {
    // Remove active class from all buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Add active class to clicked button
    clickedBtn.classList.add('active');

    const filter = clickedBtn.dataset.filter;
    let filteredPhotos = currentPhotos;

    if (filter === 'recent') {
        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
        filteredPhotos = currentPhotos.filter(photo =>
            new Date(photo.uploadDate) > thirtyMinutesAgo
        );
    }

    displayPhotos(filteredPhotos);
}

function openModal(index) {
    currentPhotoIndex = index;
    const modal = document.getElementById('photo-modal');
    const modalImage = document.getElementById('modal-image');
    const modalDate = document.getElementById('modal-date');

    const photo = currentPhotos[index];
    modalImage.src = photo.fullUrl;
    modalDate.textContent = formatDate(photo.uploadDate);

    modal.classList.remove('hide');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    const modal = document.getElementById('photo-modal');
    modal.classList.add('hide');
    document.body.style.overflow = '';
}

function handleKeyboardNavigation(event) {
    const modal = document.getElementById('photo-modal');
    if (modal.classList.contains('hide')) return;

    switch (event.key) {
        case 'Escape':
            closeModal();
            break;
        case 'ArrowLeft':
            showPrevPhoto();
            break;
        case 'ArrowRight':
            showNextPhoto();
            break;
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Make openModal globally accessible
window.openModal = openModal;