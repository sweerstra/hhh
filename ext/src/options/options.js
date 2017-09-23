const Keywords = document.getElementById('keywords');
const SaveButton = document.getElementById('save');
const AddButton = document.getElementById('add');

SaveButton.addEventListener('click', () => {
    const keywords = [...document.querySelectorAll('input')].map(input => input.value).filter(Boolean).join(',');
    localStorage.setItem('keywords', keywords);
});

AddButton.addEventListener('click', () => {
    addInput('');
});

const saved = localStorage.getItem('keywords');
saved.split(',').forEach((keyword) => {
    addInput(keyword);
});

document.addEventListener('keyup', (e) => {
    if (e.keyCode === 9) {
        addInput('');
    }
});

function addInput(value) {
    const input = document.createElement('input');
    input.value = value;
    Keywords.appendChild(input);
}