// public/script.js

const generateForm    = document.querySelector('.generate-form');
const promptInput     = generateForm.querySelector('.prompt-input');
const quantitySelect  = generateForm.querySelector('.img-quantity');
const generateBtn     = generateForm.querySelector('.generate-btn');
const imageGallery    = document.querySelector('.image-gallery');

let isImageGenerating = false;

// Populate each card with the returned Base64 image and enable download
const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard     = imageGallery.querySelectorAll('.img-card')[index];
    const imgElement  = imgCard.querySelector('img');
    const downloadBtn = imgCard.querySelector('.download-btn');

    const dataUri = `data:image/png;base64,${imgObject.b64_json}`;
    imgElement.src = dataUri;

    imgElement.onload = () => {
      imgCard.classList.remove('loading');
      downloadBtn.setAttribute('href', dataUri);
      downloadBtn.setAttribute('download', `${Date.now()}.png`);
    };
  });
};

const generateAiImages = async (prompt, quantity) => {
  try {
    const response = await fetch('/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, n: quantity })
    });

    if (!response.ok) {
      throw new Error('Failed to generate AI images.');
    }

    const { data } = await response.json();
    updateImageCard(data);

  } catch (error) {
    console.error(error);
    alert(error.message);
  } finally {
    generateBtn.disabled   = false;
    generateBtn.innerText  = 'Generate';
    isImageGenerating      = false;
  }
};

const handleSubmit = (e) => {
  e.preventDefault();
  if (isImageGenerating) return;

  const prompt   = promptInput.value.trim();
  const quantity = parseInt(quantitySelect.value, 10);

  if (!prompt) {
    return alert('Please enter a prompt.');
  }

  // Disable button & show loading text
  isImageGenerating   = true;
  generateBtn.disabled = true;
  generateBtn.innerText = 'Generating…';

  // Build placeholder cards with loader icon
  const cardsHtml = Array.from({ length: quantity })
    .map(() => `
      <div class="img-card loading">
        <img src="/images/loader.svg" alt="Loading…">
        <a class="download-btn" href="#">
          <img src="/images/download.svg" alt="Download">
        </a>
      </div>`)
    .join('');

  imageGallery.innerHTML = cardsHtml;
  generateAiImages(prompt, quantity);
};

generateForm.addEventListener('submit', handleSubmit);
