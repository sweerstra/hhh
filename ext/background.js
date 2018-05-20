chrome.runtime.onMessage.addListener(({ type }, sender, sendResponse) => {
    setBadge();

    if (type === 'fetch') {
        fetchHipHopHeads()
            .then(json => {
                sendResponse({ json });
                setBadge(json.data.length);

                if (json.latest) {
                    localStorage.setItem('id', json.latest.id);
                }
            });
    }

    return true;
});

chrome.alarms.create('timer', { delayInMinutes: 0.5, periodInMinutes: 0.5 });

chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === 'timer') {
        fetchHipHopHeads()
            .then(({ latest, data }) => {
                setBadge(data.length);

                if (latest === null) {
                    return;
                }

                const { id, title, link } = latest;
                const storedId = localStorage.getItem('id');

                if (storedId !== id) {
                    showNotification(title, link);
                    localStorage.setItem('id', id);
                }
            });
    }
});

chrome.notifications.onClicked.addListener(link => {
    window.open(link, '_blank');
});

const showNotification = (message, link) => {
    const options = {
        type: 'basic',
        title: 'HHH',
        message,
        iconUrl: 'icons/128.png'
    };

    chrome.notifications.create(link, options);
};

const fetchHipHopHeads = () => {
    const keywords = localStorage.getItem('keywords') || '';
    const url = `https://i321720.iris.fhict.nl/hhh/server.php?keywords=${keywords}`;

    return fetch(url).then(resp => resp.json());
};

const setBadge = (text = '') => {
    if (!isNaN(text)) {
        text = text.toString();
    }

    chrome.browserAction.setBadgeText({ text });
};
