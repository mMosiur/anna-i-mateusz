import { fetchWeddingInfo } from './api.js';

const apiBaseUrl = 'https://anna-i-mateusz.azurewebsites.net';
let currentPhotos = [];
let currentPhotoIndex = 0;
let apiKey = null;

document.addEventListener('DOMContentLoaded', () => {
    initializeGallery()
        .then(_ => {});
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

function showPrevPhoto() {
    if (currentPhotoIndex <= 0) return;
    currentPhotoIndex--;
    updateModalContent();
}

function showNextPhoto() {
    if (currentPhotoIndex >= currentPhotos.length - 1) return;
    currentPhotoIndex++;
    updateModalContent();
}

function updateModalContent() {
    const photo = currentPhotos[currentPhotoIndex];
    document.getElementById('modal-image').src = photo.fullUrl;
    document.getElementById('modal-date').textContent = formatDate(photo.uploadDate);
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