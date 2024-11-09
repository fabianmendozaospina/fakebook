'use strict';

const fullNameObj = select('.name');
const userNameObj = select('.username');
const emailObj = select('.email');
const pagesObj = select('.pages');
const groupsObj = select('.groups');
const inputObj = select('.input'); 
const postObj = select('.post-btn'); 
const postsContainerObj = select('.all-posts');
const uploadImageObj = select('.upload-img-btn');
const canMonetizeObj = select('.can-monetize');
const fileInputObj = getElement('fileInput');
const fileNameObj = select('.file-name');
let postId = 1;

class User {
    #id;
    #name;
    #userName;
    #email;

    constructor(id, name, userName, email) {
        this.#id = id;
        this.#name = name;
        this.#userName = userName;
        this.#email = email;
    }

    get id() { return this.#id; }
    get name() { return this.#name; }
    get userName() { return this.#userName; }
    get email() { return this.#email; }

    getInfo() {
        return {
            id: this.#id,
            name: this.#name,
            userName: this.#userName,
            email: this.#email
        };
    }
}

class Subscriber extends User {
    #pages;
    #groups;
    #canMonetize;

    constructor(id, name, userName, email, pages, groups, canMonetize) {
        super(id, name, userName, email);
        this.#pages = pages;
        this.#groups = groups;
        this.#canMonetize = canMonetize;
    }

    get pages() { return this.#pages; }
    get groups() { return this.#groups; }
    get canMonetize() { return this.#canMonetize; }

    getInfo() {
        return {
            ...super.getInfo(),
            pages: this.#pages,
            groups: this.#groups,
            canMonetize: this.#canMonetize
        };
    }
}

const user = new Subscriber(
    '1001',
    'John Smith',
    'john_smith',
    'john_smith@myemail.com',
    ['Travel and Life Style', 'Sports', 'Science fiction Movies', 'Artificial Intelligence'],
    ['AI trends', 'Rocky Mountains Lovers', 'NFL Experts', 'Movie Addicts'],
    true
);

function select(selector, scope = document) {
    return scope.querySelector(selector);
}

function listen(event, selector, callback) {
    return selector.addEventListener(event, callback);
}

function getElement(selector, scope = document) {
    return scope.getElementById(selector);
}

function openModal() {
    const modal = getElement('modal-popup');

    modal.style.display = 'flex';
    fullNameObj.innerHTML = getItemProfile('Name', user.getInfo().name); 
    userNameObj.innerHTML = getItemProfile('Username', user.getInfo().userName);
    emailObj.innerHTML = getItemProfile('Email', user.getInfo().email);
    pagesObj.innerHTML = getItemProfile('Pages', user.getInfo().pages.join(', '));
    groupsObj.innerHTML = getItemProfile('Groups', user.getInfo().groups.join(', '));
    canMonetizeObj.innerHTML = getItemProfile('Can Monetize?', user.getInfo().canMonetize, true);
}

function getItemProfile(label, value, isBool = false) {
    return `<p><strong>${label}:</strong> ${isBool ? (value ? 'Yes' : 'No') : value}</p>`;
}

function closeModal() {
    const modal = getElement('modal-popup');
    modal.style.display = 'none';
}

function createPost(input, file) {
    if (!input && !file) {
        return;
    }

    const currentDate = new Date();
    const element = document.createElement('div');
    const header = document.createElement('div');
    const profileContainer = document.createElement('div');
    const profile = document.createElement('div');
    const userName = document.createElement('div');
    const date = document.createElement('div');
    const text = document.createElement('div');
    const image = document.createElement('div');

    element.classList.add('post-container');
    header.classList.add('post-header');
    profileContainer.classList.add('profile-container');
    profile.classList.add('profile');
    userName.classList.add('user-name');
    userName.innerHTML = '<p>John Smith</p>';
    date.classList.add('date');
    date.innerHTML = `<p>${currentDate.toDateString()}</p>`;
    profileContainer.appendChild(profile);
    profileContainer.appendChild(userName);
    header.appendChild(profileContainer);
    header.appendChild(date);
    text.classList.add('post-text');
    text.innerHTML = `<p>${input}</p>`;
    image.classList.add('post-img');
    image.style.height = '0';

    if (file) {
        const reader = new FileReader();
        reader.onload = function () {
            image.style.backgroundImage = `url('${reader.result}')`;
            image.style.height = '615px'; 
        };
        reader.readAsDataURL(file);
    } 

    element.appendChild(header);
    element.appendChild(text);
    element.appendChild(image);
    element.dataset.postId = getPostIdentifier();
    element.style.display = 'inline-block';
    inputObj.value = '';
    fileInput.value = '';
    fileNameObj.innerText = '';
    
    postsContainerObj.prepend(element);
}

function getPostIdentifier() {
    return `post${postId++}`;
}

function uploadImage(file) {
    if (file) {
        fileNameObj.innerText = `File: ${file.name}`;
    }
}

listen('DOMContentLoaded', document, function () {
    const profileButton = select('.profile');
    listen('click', profileButton, openModal);
});

listen('click', window, function (event) {
    const modal = getElement('modal-popup');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

listen('change', fileInputObj, function (event) {
    const file = event.target.files[0];
    uploadImage(file);
});

listen('click', postObj, function () {
    const file = fileInputObj.files[0];
    createPost(inputObj.value, file);
});