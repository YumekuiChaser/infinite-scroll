const imageContainer = document.getElementById('image-container');
const loader = document.getElementById('loader');
const seed = generateApiSeed();

let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let imagesArray = [];

function generateApiSeed() {
    const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const seed_size = 5;
    let random_string = '';

    for (let index = 0; index < seed_size; index++) {
        let rnd_num = Math.floor(Math.random() * chars.length);
        random_string += chars.substring(rnd_num, rnd_num + 1);
    }
    return random_string;
}

// Helper Function to Set Attributes on DOM Elements
function setAttributes(element, attributes) {
    for (const key in attributes) {
        element.setAttribute(key, attributes[key]);
    }
}

// Check if all images were loaded
function imageLoaded() {
    imagesLoaded++;
    if (imagesLoaded === totalImages) {
        ready = true;
        loader.hidden = true;
    }
}
// Create elements for links and Images, ADD  TO DOM
function displayImages() {
    // Run function for each object in imagesArray
    imagesLoaded = 0;
    totalImages = imagesArray.length;
    imagesArray.forEach((image) => {
        // images.forEach((image) => {
        // Create an <a></a> to link to Wallhaven.cc 
        const item = document.createElement('a');
        // item.setAttribute('href', image.url);
        // item.setAttribute('target', '_blank');
        setAttributes(item, {
            href: image.url,
            target: '_blank',
        });
        // Create <img> for image
        const img = document.createElement('img');
        // img.setAttribute('src', image.thumbs.original);
        // img.setAttribute('alt', image.id);
        // img.setAttribute('title', image.id);
        setAttributes(img, {
            src: image.thumbs.large,
            alt: img.id,
            title: image.id,
        });
        // Event listener, check when each is finished loading
        img.addEventListener('load', imageLoaded());
        // Put <img> inside <a>, then put both inside imageContainer Element
        item.appendChild(img);
        imageContainer.appendChild(item);
        // });
    });
}

// Get images from Wallhaven.cc API
async function getImages() {
    const proxyUrl = 'https://vast-shore-57584.herokuapp.com/';
    const apiUrl = `https://wallhaven.cc/api/v1/search?categories=110&purity=110&sorting=random&seed=${seed}`;
    try {
        const response = await fetch(proxyUrl + apiUrl);

        let data = await response.json();
        imagesArray = Object.values(data);
        imagesArray = imagesArray[0];
        displayImages();
    } catch (error) {
        // I have nothing here yet
    }
}

// Check to see if scrolling near bottom of page, Load More Protos
window.addEventListener('scroll', () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 && ready) {
        ready = false;
        getImages();
    }
});

getImages();