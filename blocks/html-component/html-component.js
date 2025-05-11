function extractSingleScriptSrc(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
  
    const script = tempDiv.querySelector('script[src]');
    return script ? script.getAttribute('src') : null;
  }

const loadScript = (url, callback, type) => {
    const head = document.querySelector('head');
    const script = document.createElement('script');
    script.src = url;
    if (type) {
      script.setAttribute('type', type);
    }
    script.onload = callback;
    head.append(script);
    return script;
  };

function cleanHTML(input) {
    return input
      .replace(/<\s*p\s*>|<\s*\/\s*p\s*>/gi, '') // Remove <p> and </p> tags
      .replace(/<\s*br\s*\/?>/gi, '')            // Remove <br> tags
      .replace(/&lt;/g, '<')                     // Replace &lt; with <
      .replace(/&gt;/g, '>')                     // Replace &gt; with >
      .replace(/&nbsp;/gi, '');                  // Remove &nbsp;
  }

export default async function decorate(block) {
//console.log(block.innerHTML);
const rawhtml = block.innerHTML;
const cleanStr = cleanHTML(rawhtml);
const scriptSrc = extractSingleScriptSrc(cleanStr); 
console.log("script is "+ scriptSrc);
loadScript(scriptSrc);
block.textContent = '';
block.innerHTML = cleanStr;
}