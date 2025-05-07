export default async function decorate(block) {
  const aempublishurl = 'https://author-p118103-e1621695.adobeaemcloud.com';
  const persistedquery = '/graphql/execute.json/DHL/getCaseStudyDetails';
  const contentPath = block.querySelector(':scope div:nth-child(1) > div a')?.textContent?.trim();
  const url = `${aempublishurl}${persistedquery};path=${contentPath}`;
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
        <h1 class="casehero-title"${cfReq?.casestudyTitle || ''}</h1>
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
              <h6 id="customer-challenge">CUSTOMER CHALLENGE</h6>
              <p>The company wanted to minimize frustration and&nbsp;unproductive IT downtime, especially for mission-&nbsp;critical and customer-facing employees, in order to&nbsp;retain staff, maintain business continuity, and&nbsp;efficiently serve its customers.&nbsp;In 2020, the start of the Covid-19 pandemic&nbsp;accelerated the trend of working from home and the&nbsp;company pivoted swiftly to allow employees to do&nbsp;this. However, post-pandemic analysis indicated 40%&nbsp;of the global workforce of around 56,000 employees&nbsp;would continue to work remotely, so a detailed plan&nbsp;was needed.<br>Not only must the company cost-effectively deliver&nbsp;laptops, mobiles, tablets, and associated hardware to&nbsp;tens of thousands of addresses around the globe&nbsp;instead of a few hundred corporate locations, it must&nbsp;also deliver an excellent digital experience to every&nbsp;member of its dispersed workforce.&nbsp;DHL had clearly demonstrated its end-to-end IT&nbsp;equipment delivery capabilities, serving the company’s internal teams in France, Germany, and&nbsp;the Nordics for several years. In addition, DHL offered&nbsp;the necessary global supply chain infrastructure. The&nbsp;companies therefore collaborated to customize a&nbsp;‘work from anywhere’ solution.</p>
              <h6 id="dhl-supply-chain-solution">DHL SUPPLY CHAIN SOLUTION</h6>
              <p>This fully integrated global end-to-end solution&nbsp;encompasses all stages of deploying, refreshing and&nbsp;returning IT equipment and is designed around the&nbsp;user experience. When an employee’s PC breaks&nbsp;down or when a manager wants to deploy new&nbsp;equipment, they access a user-friendly online portal.&nbsp;Placing an order before midday means the&nbsp;replacement or new PC and other items arrive the&nbsp;very next morning* – pre-installed and pre-configured as before.&nbsp;For any equipment that’s switched out, DHL provides&nbsp;a turnkey circular supply chain solution. DHL&nbsp;performs technical checks and, if necessary, passes&nbsp;the old device to a repair provider. Refreshed&nbsp;equipment is then made available to other employees&nbsp;or sold on, with all data safely wiped. If the device&nbsp;can’t be reused, end-of-life hardware management&nbsp;ensures its components are recycled.&nbsp;Inventory visibility and control are provided by DHL&nbsp;SeLECT, a single-source global IT platform that is<br>modular, scalable, and resilient. The IT department is&nbsp;able to track the location and status of all assets&nbsp;while maintaining highest levels of data security. This&nbsp;reduces business risk and ensures the department&nbsp;remains agile and responsive to the employees it&nbsp;serves.</p>
              <h6 id="customer-benefits">CUSTOMER BENEFITS</h6>
              <p>The company enjoys the confidence and peace of mind that&nbsp;come with knowing employees are happy and productive&nbsp;wherever they’re working, even when travelling. The single&nbsp;online portal ensures an excellent digital experience. It is easy&nbsp;to order and return equipment, and speedy turnaround times&nbsp;mean that a broken PC is never a disaster, even during&nbsp;business-critical projects. Business continuity is assured&nbsp;when employees can work from anywhere in the world.<br>In addition, the company benefits from the control and flexibility of full inventory visibility. Support professionals in the IT department always know the status and location of equipment and can therefore provide accurate, detailed&nbsp;information to employees and management. IT departments&nbsp;spend less time on routine tasks and more time on value-&nbsp;adding activities.<br>With this outsourced solution, the company is able to optimize&nbsp;working capital. DHL’s highly flexible workforce and global IT&nbsp;platform allow easy response to demand fluctuations and<br>changing needs.&nbsp;The company is able to achieve new sustainability goals,&nbsp;reducing the consumption and waste of IT equipment, by&nbsp;maximizing repair, reuse, and recycling opportunities. Wiping&nbsp;data before reuse maintains high corporate data security<br>standards.&nbsp;By minimizing frustration and unproductive IT downtime,&nbsp;especially for mission-critical and customer-facing&nbsp;employees, the company is succeeding in retaining staff,&nbsp;maintaining business continuity, and efficiently serving its&nbsp;customers</p>
            </div>
            <div>
              <h5 id="customer-challenge-1">CUSTOMER CHALLENGE:</h5>
              <ul>
                <li>Increasingly dispersed global workforce</li>
                <li>Minimize frustration &amp; unproductive IT downtime</li>
                <li>Keep employees happy &amp; productive</li>
                <li>Ensure business continuity</li>
                <li>Serve customers effectively</li>
                <li>Simplify with a single outsourced solution</li>
              </ul>
              <h5 id="dhl-supply-chain-solution-1">DHL SUPPLY CHAIN SOLUTION:</h5>
              <ul>
                <li>Integrated, global end-to-end solution</li>
                <li>Designed to optimize the digital experience</li>
                <li>Single user-friendly online portal</li>
                <li>State-of-the-art warehouse management system</li>
                <li>Pre-installation of OS &amp; device configuration</li>
                <li>Next-day express delivery service</li>
                <li>Turnkey circular supply chain solution includes<br>screening, technical analysis, grading, repair,<br>refurbishment &amp; end-of-life hardware management with<br>data wiping &amp; assessment for reuse, resale or recycling</li>
                <li>Customized use of the DHL SeLECT single-source<br>global IT platform</li>
              </ul>
              <h5 id="customer-benefits-1">CUSTOMER BENEFITS:</h5>
              <ul>
                <li>Confidence and peace of mind – whatever happens,<br>employees can keep working</li>
                <li>Easy, efficient ordering process using single user-<br>friendly portal</li>
                <li>Improved business resilience with workflow<br>continuity</li>
                <li>Control and flexibility with end-to-end visibility of<br>every device</li>
                <li>Ability to optimize working capital</li>
                <li>Responsive to demand fluctuations &amp; changing needs</li>
                <li>Sustainability through reducing consumption and<br>waste of IT equipment</li>
                <li>Data security ensured by wiping data before re-use or<br>resale</li>
              </ul>
            </div>
          </div>
        </div></div></div>
    `;
}