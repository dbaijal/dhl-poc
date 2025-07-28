
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
    fetchData(addRandomNumber('/article-tags.json')),
    fetchData(addRandomNumber('/articles-index.json'))
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
  
  function addRandomNumber(url) {
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}${Math.floor(Math.random() * 1000000)}`;
}


  // Create custom dropdown function
  function createCustomDropdown() {
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'custom-dropdown';
    
    const selectedOption = document.createElement('div');
    selectedOption.className = 'selected-option';
    selectedOption.innerHTML = `<span>All Articles</span><i class="dropdown-arrow"></i>`;
    
    const optionsList = document.createElement('div');
    optionsList.className = 'dropdown-options';
    
    // Add "All Articles" option
    const allOption = document.createElement('div');
    allOption.className = 'dropdown-option selected';
    allOption.dataset.value = 'all';
    allOption.textContent = 'All Articles';
    optionsList.appendChild(allOption);
    
    // Then add options from the tags data
    if (allTags.length > 0) {
      allTags.forEach(tag => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.dataset.value = tag;
        option.textContent = tagMap.get(tag);
        optionsList.appendChild(option);
      });
    }
    
    dropdownContainer.appendChild(selectedOption);
    dropdownContainer.appendChild(optionsList);
    
    // Event handlers
    selectedOption.addEventListener('click', () => {
      dropdownContainer.classList.toggle('open');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
      if (!dropdownContainer.contains(e.target)) {
        dropdownContainer.classList.remove('open');
      }
    });
    
    // Handle option selection
    const options = optionsList.querySelectorAll('.dropdown-option');
    options.forEach(option => {
      option.addEventListener('click', () => {
        const value = option.dataset.value;
        const text = option.textContent;
        
        // Update selected option display
        selectedOption.querySelector('span').textContent = text;
        
        // Update selected class
        options.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        // Close dropdown
        dropdownContainer.classList.remove('open');
        
        // Filter articles based on selection
        if (value === 'all') {
          renderArticles(articles);
        } else {
          const filteredArticles = articles.filter(article => article.type === value);
          renderArticles(filteredArticles);
        }
      });
    });
    
    return dropdownContainer;
  }
  
  // Add the custom dropdown to the filter section
  const customDropdown = createCustomDropdown();
  filterDropdown.appendChild(customDropdown);
  
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
}