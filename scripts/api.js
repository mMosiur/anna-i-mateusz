import { updateWeddingInfo } from './display.js';

export const apiBaseUrl = 'https://anna-i-mateusz.azurewebsites.net';

export async function fetchWeddingInfo() {
    const urlParams = new URLSearchParams(window.location.search);
    const apiKey = urlParams.get('key');

    try {
        const cacheKey = `weddingInfo_${apiKey}`;
        const cachedData = localStorage.getItem(cacheKey);
        if (cachedData) {
            console.log('Using cached data');
            var parsedData = JSON.parse(cachedData);
            updateWeddingInfo(parsedData); // Show cached data immediately
            // Fetch fresh data in the background to update if changed
        }

        const response = await fetch(`${apiBaseUrl}/info`, {
            method: 'GET',
            mode: 'cors',
            headers: { 'X-Api-Key': apiKey }
        });

        if (!response.ok) {
            console.error('Network response was not ok:', response.statusText);
            localStorage.removeItem(cacheKey);
            updateWeddingInfo(null);
            return;
        }

        const data = await response.json();
        localStorage.setItem(cacheKey, JSON.stringify(data));
        updateWeddingInfo(data);
    } catch (error) {
        console.error('Error fetching wedding info:', error);
        localStorage.removeItem(cacheKey);
        updateWeddingInfo(null);
    }
}
