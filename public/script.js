const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");

let isImageGenerating = false;

// Fill each card with the AI‑generated image and enable download
const updateImageCard = (imgDataArray) => {
  imgDataArray.forEach((imgObject, index) => {
    const imgCard = imageGallery.querySelectorAll(".img-card")[index];
    const imgElement = imgCard.querySelector("img");
    const downloadBtn = imgCard.querySelector(".download-btn");

    const aiGeneratedImage = `data:image/jpeg;base64,${imgObject.b64_json}`;
    imgElement.src = aiGeneratedImage;

    imgElement.onload = () => {
      imgCard.classList.remove("loading");
      downloadBtn.setAttribute("href", aiGeneratedImage);
      downloadBtn.setAttribute("download", `${Date.now()}.jpg`);
    };
  });
};

const generateAiImages = async (userPrompt, userImgQuantity) => {
  try {
    // ← Use a relative URL, matching your server.post("/generate", …)
    const response = await fetch("/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt: userPrompt, n: userImgQuantity }),
    });

    if (!response.ok) throw new Error("Failed to generate AI images.");

    const { data } = await response.json();
    updateImageCard(data);
  } catch (error) {
    alert(error.message);
  } finally {
    generateBtn.removeAttribute("disabled");
    generateBtn.innerText = "Generate";
    isImageGenerating = false;
  }
};

const handleImageGeneration = (e) => {
  e.preventDefault();
  if (isImageGenerating) return;

  const userPrompt = e.target.prompt.value.trim();
  const userImgQuantity = parseInt(e.target["img-quantity"].value, 10);

  // Disable button while we fetch
  generateBtn.setAttribute("disabled", true);
  generateBtn.innerText = "Generating…";
  isImageGenerating = true;

  // Build loading cards
  const imgCardMarkup = Array.from({ length: userImgQuantity }, () => `
    <div class="img-card loading">
      <!-- absolute path into /images -->
      <img src="/images/loader.svg" alt="loading…">
      <a class="download-btn" href="#">
        <img src="/images/download.svg" alt="download icon">
      </a>
    </div>
  `).join("");
  imageGallery.innerHTML = imgCardMarkup;

  generateAiImages(userPrompt, userImgQuantity);
};

generateForm.addEventListener("submit", handleImageGeneration);
