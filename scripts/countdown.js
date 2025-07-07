export function startCountdown() {
    const weddingDate = new Date('2025-07-12T14:00:00');
    const partyEndDate = new Date('2025-07-13T04:00:00');
    const countdownWrapper = document.querySelector('.countdown-wrapper');
    let animationFrameId;

    function updateCountdown() {
        const now = new Date();
        const difference = weddingDate - now;
        const partyDifference = partyEndDate - now;

        if (difference <= 0 && partyDifference > 0) {
            // Wedding has started, party is ongoing
            showPartyMessage();
            cancelAnimationFrame(animationFrameId);
            return;
        } else if (partyDifference <= 0) {
            // Party has ended
            showThankYouMessage();
            // Start counting up from wedding date
            updateElapsedTime(weddingDate, now);
        } else if (difference > 0) {
            // Wedding hasn't started yet, show countdown
            updateCountdownDisplay(difference);
        }

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

function showPartyMessage() {
    const countdownWrapper = document.querySelector('.countdown-wrapper');
    const countdownHeader = countdownWrapper.querySelector('.countdown-header');
    const countdownBox = countdownWrapper.querySelector('.countdown-box');
    
    // Hide the countdown display
    countdownBox.style.display = 'none';
    
    // Show party message
    countdownHeader.textContent = '🎉 Zabawa trwa! 🎉';
    countdownHeader.style.fontSize = '2rem';
    countdownHeader.style.color = '#2c3e50';
    countdownHeader.style.fontWeight = '600';
    countdownHeader.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.1)';
}

function showThankYouMessage() {
    const countdownWrapper = document.querySelector('.countdown-wrapper');
    const countdownHeader = countdownWrapper.querySelector('.countdown-header');
    const countdownBox = countdownWrapper.querySelector('.countdown-box');
    
    // Add elapsed time styling
    countdownWrapper.classList.add('elapsed-time');
    
    // Show both the message and the counter
    countdownBox.style.display = 'flex';
    
    // Show thank you message
    countdownHeader.innerHTML = '💕 Dziękujemy za wspaniały wieczór!<br><small style="font-size: 0.6em; font-weight: normal; opacity: 0.8; margin-top: 0.5rem; display: block;">Od ślubu minęło:</small>';
    countdownHeader.style.fontSize = '1.6rem';
    countdownHeader.style.color = '#2c3e50';
    countdownHeader.style.fontWeight = '600';
    countdownHeader.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.1)';
    countdownHeader.style.lineHeight = '1.4';
    countdownHeader.style.marginBottom = '1rem';
}

function updateElapsedTime(weddingDate, currentTime) {
    const elapsed = currentTime - weddingDate;
    
    const days = Math.floor(elapsed / (1000 * 60 * 60 * 24));
    const hours = Math.floor((elapsed % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

    document.getElementById('countdown-days').textContent = String(days).padStart(2, '0');
    document.getElementById('countdown-hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('countdown-minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('countdown-seconds').textContent = String(seconds).padStart(2, '0');
}