document.addEventListener('DOMContentLoaded', () => {
    const gears = document.querySelectorAll('.gear');

    // Add hover effect to gears
    gears.forEach(gear => {
        gear.addEventListener('mouseover', () => {
            gear.style.animation = 'spin 1s linear infinite';
        });

        gear.addEventListener('mouseout', () => {
            gear.style.animation = 'spin 4s linear infinite';
        });
    });
});