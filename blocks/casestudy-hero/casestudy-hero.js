export default async function decorate(block) {
  const aempublishurl = 'https://author-p118103-e1621695.adobeaemcloud.com';
  const persistedquery = '/graphql/execute.json/aem-eds-poc/articleInformation';

   // Get the content fragment path from the block (2nd child div)
   const contentPath = block.querySelector(':scope div:nth-child(1) > div a')?.textContent?.trim();
   const itemId = `urn:aemconnection:${contentPath}/jcr:content/data/master`;
   block.textContent = '';
    block.innerHTML= `
    <div class="casehero-section" data-aue-resource="${itemId}" data-aue-type="reference" data-aue-filter="cf">
  <div class="casehero-container">
    <div class="casehero-row">
      
      <!-- Left: Text Content -->
      <div class="casehero-text">
        <p class="casehero-subheading" data-aue-prop="casestudyType" data-aue-label="CaseStudy Type" data-aue-type="text">Technology Case Study</p>
        <h1 class="casehero-title" data-aue-prop="casestudyTitle" data-aue-label="CaseStudy Title" data-aue-type="text">DHL SUPPLY CHAIN HELPS BIG TECH WORK FROM ANYWHERE</h1>
        <div class="casehero-separator"></div>
        <p class="casehero-intro" data-aue-prop="casestudyInfo" data-aue-label="CaseStudy Info" data-aue-type="richtext">
          Imagine the frustration of your company PC breaking down at home – you can’t get your work done or
          communicate effectively with colleagues, but you really want to do a great job
        </p>
        <p class="casehero-subtext" data-aue-prop="casestudyQuote" data-aue-label="CaseStudy quote" data-aue-type="text">
          <small>DHL Supply Chain – Excellence. Simply delivered.</small>
        </p>
      </div>

      <!-- Right: Image -->
      <div class="casehero-image" data-aue-prop="casestudyImage" data-aue-label="CaseStudy Image" data-aue-type="reference">
        <picture>
          <img src="../_images/placeholder.jpg" alt="ENTER ALT TAG TEXT HERE">
        </picture>
      </div>

    </div>
  </div>
</div>
    `;
}