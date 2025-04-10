export function startCountdown() {
    const weddingDate = new Date('2025-07-12T14:00:00');
    const countdownWrapper = document.querySelector('.countdown-wrapper');
    let animationFrameId;

    function updateCountdown() {
        const now = new Date();
        const difference = weddingDate - now;

        if (difference <= 0) {
            countdownWrapper.classList.add('hide');
            cancelAnimationFrame(animationFrameId);
            return;
        }

        updateCountdownDisplay(difference);
        animationFrameId = requestAnimationFrame(updateCountdown);
    }

    updateCountdown();
}

function updateCountdownDisplay(difference) {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);

    document.getElementById('countdown-days').textContent = String(days).padStart(2, '0');
    document.getElementById('countdown-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('countdown-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('countdown-seconds').textContent = String(seconds).padStart(2, '0');
}