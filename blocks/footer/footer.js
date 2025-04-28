/* eslint-disable no-console */
import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

/**
 * loads and decorates the footer
 * @param {Element} block The footer block element
 */
export default async function decorate(block) {
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // Clear block first
  block.textContent = '';

  // Create base structure
  const footerContent = document.createElement('div');
  footerContent.className = 'footer-content';

  const footerTop = document.createElement('div');
  footerTop.className = 'footer-top';

  const footerBottom = document.createElement('div');
  footerBottom.className = 'section footer-bottom';
  footerBottom.setAttribute('data-section-status', 'loaded');

  // Get all sections from fragment
  const sections = fragment.querySelectorAll('.section');

  // --- Handle footer left (logo + links) ---
  const footerLeft = sections[0];
  footerLeft.classList.add('footer-left');

  const logoWrapper = footerLeft.querySelector('.default-content-wrapper');
  logoWrapper.classList.add('footer-logo');

  const ul = logoWrapper.querySelector('ul');
  const footerLinksWrapper = document.createElement('div');
  footerLinksWrapper.className = 'footer-links';
  if (ul) {
    footerLinksWrapper.appendChild(ul);
  }
  logoWrapper.appendChild(footerLinksWrapper);

  // --- Handle footer right (follow us icons) ---
  const footerRight = sections[1];
  footerRight.classList.add('footer-right');

  const socialWrapper = footerRight.querySelector('.default-content-wrapper');
  const socialIconsDiv = document.createElement('div');
  socialIconsDiv.className = 'social-icons';

  const pictures = socialWrapper.querySelectorAll('picture');
  pictures.forEach((pic) => {
    const parentP = pic.closest('p');
    if (parentP) socialIconsDiv.appendChild(parentP);
  });

  socialWrapper.appendChild(socialIconsDiv);

  // --- Handle footer bottom (copyright) ---
  const bottomWrapper = sections[2].querySelector('.default-content-wrapper');
  if (bottomWrapper) {
    footerBottom.appendChild(bottomWrapper);
  }

  // --- Assemble everything ---
  footerTop.appendChild(footerLeft);
  footerTop.appendChild(footerRight);

  footerContent.appendChild(footerTop);
  footerContent.appendChild(footerBottom);

  block.appendChild(footerContent);
}

