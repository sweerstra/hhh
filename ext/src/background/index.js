chrome.extension.onMessage.addListener(({ type }, sender, sendResponse) => {
    chrome.browserAction.setBadgeText({ text: '' });

    fetchHipHopHeads()
        .then((json) => {
            if (type === 'save') {
                if (json.data.length) {
                    localStorage.setItem('id', json.id);
                }
            } else if (type === 'refresh') {
                localStorage.removeItem('id');
            }
            else if (type === 'reset') {
                sendResponse({ json });
            }
        });

    return true;
});

chrome.alarms.create('timer', {
    delayInMinutes: 10, periodInMinutes: 10
});

chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'timer') {
        fetchHipHopHeads()
            .then((json) => {
                chrome.browserAction.setBadgeText({ text: (json.data.length || '').toString() });
            });
    }
});

function fetchHipHopHeads() {
    const keywords = localStorage.getItem('keywords') || '';
    const id = localStorage.getItem('id') || '';
    const url = `https://i321720.iris.fhict.nl/hhh/server.php?keywords=${keywords}&id=${id}`;

    return fetch(url).then(resp => resp.json());
}