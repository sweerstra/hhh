const STORAGE_KEY = 'keywords';
const Loader = document.getElementById('js-loader');
const FetchButton = document.getElementById('js-fetch');
const AddInputIcon = document.getElementById('js-add-input');
const RemoveInputIcon = document.getElementById('js-remove-input');
const SaveButton = document.getElementById('js-save');
const Options = document.querySelector('.matches');
const Results = document.querySelector('.results');

const handleFetchedPosts = ({ json }) => {
    Results.innerHTML = json.data.length
        ? json.data.reduce((html, post) => (
            html + `<a href="${post.link}" class="results__post" target='_blank'>${post.title}</a>`
        ), '')
        : '<span class="results__not-found">No new posts found</span>';
};

const loadMatchingOptions = () => {
    const keywords = localStorage.getItem(STORAGE_KEY);

    if (keywords) {
        keywords.split(':').forEach(addInput);
    }

    // add additional input for new matchs
    addInput();
};

function addInput(value = '') {
    const input = document.createElement('input');
    input.value = value;
    input.placeholder = 'Artist';
    input.spellcheck = false;
    Options.appendChild(input);
    input.focus();
}

const clearElement = (el) => {
    while (el.hasChildNodes()) {
        el.removeChild(el.firstChild);
    }
};

FetchButton.addEventListener('click', () => {
    clearElement(Results);
    Loader.style.display = 'block';

    chrome.runtime.sendMessage({ type: 'fetch' }, data => {
        handleFetchedPosts(data);
        Loader.style.display = 'none';
    });
});

AddInputIcon.addEventListener('click', () => addInput());

RemoveInputIcon.addEventListener('click', () => Options.removeChild(Options.lastChild));

SaveButton.addEventListener('click', () => {
    const keywords = Array.from(Options.querySelectorAll('input'))
        .map(input => input.value)
        .filter(Boolean)
        .join(':');

    localStorage.setItem(STORAGE_KEY, keywords);
});

document.addEventListener('keydown', e => {
    if (e.ctrlKey && e.keyCode === 82) {
        FetchButton.classList.add('active');
    } else if (e.ctrlKey && e.keyCode === 83) {
        SaveButton.classList.add('active');
    }
});

document.addEventListener('keyup', e => {
    const clickEvent = new Event('click');

    if (e.ctrlKey && e.keyCode === 82) {
        FetchButton.classList.remove('active');
        FetchButton.dispatchEvent(clickEvent);
    } else if (e.ctrlKey && e.keyCode === 83) {
        SaveButton.classList.remove('active');
        SaveButton.dispatchEvent(clickEvent);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadMatchingOptions();

    chrome.runtime.sendMessage({ type: 'fetch' }, data => {
        handleFetchedPosts(data);
        Loader.style.display = 'none';
    });
});