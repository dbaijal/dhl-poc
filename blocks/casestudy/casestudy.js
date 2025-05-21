import { fetchPlaceholders } from '../../scripts/aem.js';

export default async function decorate(block) {
 const placeholders = await fetchPlaceholders();
 const aempublishurl = 'https://author-p118103-e1621695.adobeaemcloud.com';
  const persistedquery = '/graphql/execute.json/DHL/getCaseStudyDetails';
  const contentPath = block.querySelector(':scope div:nth-child(1) > div a')?.textContent?.trim();
  const url = `${aempublishurl}${persistedquery};path=${contentPath};ts=${
        Math.random() * 1000
      }`;
  const options = { credentials: 'include' };
  const cfReq = await fetch(url, options)
  .then((response) => response.json())
  .then((contentfragment) => {
    return contentfragment?.data?.casestudytemplateByPath?.item || null;
  }); 

    block.textContent = '';
    block.innerHTML= `
    <div class="casehero-section">
  <div class="casehero-container">
    <div class="casehero-row">
      
      <!-- Left: Text Content -->
      <div class="casehero-text">
        <p class="casehero-subheading">${cfReq?.casestudyType || ''}</p>
        <h1 class="casehero-title">${cfReq?.casestudyTitle || ''}</h1>
        <div class="casehero-separator"></div>
        <p class="casehero-intro">
         ${cfReq?.casestudyinfo?.plaintext}
        </p>
        <p class="casehero-subtext">
          <small>${cfReq?.casestudyquote?.plaintext || ''}</small>
        </p>
      </div>

      <!-- Right: Image -->
      <div class="casehero-image">
        <picture>
          <img src="${aempublishurl + cfReq.casestudyImage?._path}" alt="ENTER ALT TAG TEXT HERE">
        </picture>
      </div>
    </div>
  </div>
</div>
    <div class="casestudydesc columns-container">
      <div class="columns-wrapper"><div class="columns columns-2-cols">
          <div>
            <div>
            ${cfReq?.caseStudyDesc?.html}
            </div>
            <div>
            ${cfReq?.casestudySummary?.html}
            </div>
          </div>
        </div></div></div>
    `;
/*
    const relatedHTML = `
    <div class="casestudy-container">
    <h1 class="related-section-title">Lorem Ipsum Dolar Sit</h1>
    <div class="card-grid">
      <div class="related-card">
        <img src="image1.jpg" alt="Card Image 1">
        <div class="related-card-body">
          <h2 class="related-card-title">Lorem ipsum dolor sit amet <span class="arrow">➔</span></h2>
          <p class="related-card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
      <div class="related-card">
        <img src="image2.jpg" alt="Card Image 2">
        <div class="related-card-body">
          <h2 class="related-card-title">Lorem ipsum dolor sit amet <span class="arrow">➔</span></h2>
          <p class="related-card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
      <div class="related-card">
        <img src="image3.jpg" alt="Card Image 3">
        <div class="related-card-body">
          <h2 class="related-card-title">Lorem ipsum dolor sit amet <span class="arrow">➔</span></h2>
          <p class="related-card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
      <div class="related-card">
        <img src="image4.jpg" alt="Card Image 4">
        <div class="related-card-body">
          <h2 class="related-card-title">Lorem ipsum dolor sit amet <span class="arrow">➔</span></h2>
          <p class="related-card-text">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </div>
      </div>
    </div>
  </div>
`;

block.insertAdjacentHTML('beforeend', relatedHTML ); */
// Dynamically build related case studies cards
let relatedHTML = `
  <div class="casestudy-container">
    <h1 class="related-section-title">${placeholders.RelatedCaseStudy}</h1>
    <div class="card-grid">
`;

if (cfReq?.relatedCaseStudies?.length) {
  cfReq.relatedCaseStudies.forEach((item) => {
    const imagePath = item?.casestudyImage?._path || '';
    const title = item?.casestudyTitle || '';
    const path = item?._path || '#';
    
    relatedHTML += `
      <div class="related-card">
        <a class="related-card-link">
          <img src="${aempublishurl}${imagePath}" alt="${title}">
          <div class="related-card-body">
            <h2 class="related-card-title">${title} <span class="arrow">➔</span></h2>
          </div>
        </a>
      </div>
    `;
  });
}

relatedHTML += `
    </div>
  </div>
`;

// Insert related case studies section into the block
block.insertAdjacentHTML('beforeend', relatedHTML);

}