import { apiBaseUrl } from './api.js';

export async function downloadCalendar(apiKey) {
    try {
        const response = await fetch(`${apiBaseUrl}/calendar`, {
            method: 'GET',
            mode: 'cors',
            headers: { 'X-Api-Key': apiKey }
        });

        if (!response.ok) {
            throw new Error(`Failed to download file. Status: ${response.status}`);
        }

        const filename = extractFilename(response.headers.get('Content-Disposition'));
        triggerDownload(await response.blob(), filename);
    } catch (error) {
        console.error('Error:', error);
        alert('Wystąpił błąd podczas pobierania kalendarza.');
    }
}

function extractFilename(contentDisposition) {
    if (contentDisposition?.includes('filename=')) {
        const matches = /filename=([^;]*)/.exec(contentDisposition);
        if (matches?.[1]) {
            return matches[1].trim().replace(/["']/g, '');
        }
    }
    return 'event.ics';
}

function triggerDownload(blob, filename) {
    const blobWithType = new Blob([blob], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blobWithType);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.type = 'text/calendar';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
}