const Loader = document.getElementById('loader');
const Section = document.getElementsByTagName('section')[0];

document.getElementById('refresh').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'refresh' }, init);
});

document.getElementById('close').addEventListener('click', () => {
    chrome.runtime.sendMessage({ type: 'save' });
    window.close();
});

window.onload = init;

function init() {
    cleanSection();
    Loader.style.display = 'block';

    chrome.runtime.sendMessage({ type: 'reset' }, ({ json }) => {
        const reddit = 'https://www.reddit.com';

        Section.innerHTML = json.data.length ? json.data.reduce((html, item) => {
            html += `<article>
            <a href="${reddit}${item.link}" target='_blank'>${item.title}</a>
         </article>`;

            return html;
        }, '') : '<span class="not-found">No new posts found</span>';

        Loader.style.display = 'none';
    });
}

function cleanSection() {
    while (Section.hasChildNodes()) {
        Section.removeChild(Section.firstChild);
    }
}
