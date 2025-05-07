export default async function decorate(block) {
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
}