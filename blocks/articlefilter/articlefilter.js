
// Default image to use when none is available
const DEFAULT_IMAGE = 'https://dummyimage.com/300x200';

// Function to fetch data from a URL
async function fetchData(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Error fetching data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch from ${url}:`, error);
    return null;
  }
}

export default async function decorate(block) {
  // Create the filter container
  const filterContainer = document.createElement('div');
  filterContainer.className = 'article-filter-container';
  
  // Create the filter section
  const filterSection = document.createElement('div');
  filterSection.className = 'filter-section';
  
  const filterTitle = document.createElement('div');
  filterTitle.className = 'filter-title';
  filterTitle.textContent = 'Filter Articles';
  
  const filterDropdown = document.createElement('div');
  filterDropdown.className = 'filter-dropdown';
  
  const select = document.createElement('select');
  select.id = 'articleTypeFilter';
  
  // Add a loading indicator while data is being fetched
  const loadingDiv = document.createElement('div');
  loadingDiv.className = 'loading-indicator';
  loadingDiv.textContent = 'Loading articles...';
  
  // Create the articles section
  const articlesSection = document.createElement('div');
  articlesSection.className = 'articles-section';
  
  const articlesContainer = document.createElement('div');
  articlesContainer.id = 'articles-container';
  articlesContainer.className = 'articles-grid';
  articlesContainer.appendChild(loadingDiv);
  
  articlesSection.appendChild(articlesContainer);
  
  // Add sections to the filter container
  filterSection.appendChild(filterTitle);
  filterSection.appendChild(filterDropdown);
  filterContainer.appendChild(filterSection);
  filterContainer.appendChild(articlesSection);
  
  // Replace the block's content with our new structure
  block.textContent = '';
  block.appendChild(filterContainer);
  
  // Fetch filter options and article data in parallel
  const [tagsResponse, articlesResponse] = await Promise.all([
    fetchData('/article-tags.json'),
    fetchData('/articles-index.json')
  ]);
  
  // Process tags data
  const tagMap = new Map(); // Map to store tag to title mapping
  let allTags = [];
  
  if (tagsResponse && tagsResponse.data) {
    tagsResponse.data.forEach(item => {
      // Skip the parent tag (which doesn't have a slash)
      if (item.tag.includes('/')) {
        tagMap.set(item.tag, item.title);
        allTags.push(item.tag);
      }
    });
  }
  
  // Process articles data
  let articles = [];
  if (articlesResponse && articlesResponse.data) {
    articles = articlesResponse.data.map(item => ({
      id: item.path,
      type: item.type, // Keep the full type for exact matching
      title: item.title,
      image: DEFAULT_IMAGE,
      link: item.path,
      // Get the display name from the tag map or extract from the type
      displayType: tagMap.get(item.type)
    }));
  }
  
  // Populate filter dropdown
  // First add "All Articles" option
  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'All';
  select.appendChild(allOption);
  
  // Then add options from the tags data
  if (allTags.length > 0) {
    allTags.forEach(tag => {
      const option = document.createElement('option');
      option.value = tag;
      option.textContent = tagMap.get(tag);
      select.appendChild(option);
    });
  }
  
  filterDropdown.appendChild(select);
  
  // Function to get CSS class from type
  function getCssClassFromType(type) {
    // Extract just the last part after the last slash for CSS class
    const parts = type.split('/');
    return parts[parts.length - 1];
  }
  
  // Function to render articles
  function renderArticles(articlesToRender) {
    articlesContainer.innerHTML = ''; // Clear existing articles
    
    if (articlesToRender.length === 0) {
      articlesContainer.innerHTML = '<div class="no-articles">No articles found matching this filter.</div>';
      return;
    }
    
    articlesToRender.forEach(article => {
      const articleElement = document.createElement('div');
      articleElement.className = 'article-card';
      
      const cssClass = getCssClassFromType(article.type);
      
      articleElement.innerHTML = `
        <img src="${article.image}" alt="${article.title}" class="article-image">
        <div class="article-content">
          <div class="article-type ${cssClass}">${article.displayType}</div>
          <h3 class="article-title">${article.title}</h3>
          <a href="${article.link}" class="article-link">Read More</a>
        </div>
      `;
      
      articlesContainer.appendChild(articleElement);
    });
  }
  
  // Initial rendering of all articles
  renderArticles(articles);
  
  // Set up event listener for the filter dropdown
  select.addEventListener('change', function() {
    const selectedType = this.value;
    
    if (selectedType === 'all') {
      renderArticles(articles);
    } else {
      const filteredArticles = articles.filter(article => article.type === selectedType);
      renderArticles(filteredArticles);
    }
  });
}