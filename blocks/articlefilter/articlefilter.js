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
  
  // Create two filter dropdowns
  const assetTypeFilterContainer = document.createElement('div');
  assetTypeFilterContainer.className = 'filter-dropdown asset-type-filter';
  assetTypeFilterContainer.innerHTML = '<div class="filter-label">Filter by Asset Type</div>';
  
  const solutionFilterContainer = document.createElement('div');
  solutionFilterContainer.className = 'filter-dropdown solution-filter';
  solutionFilterContainer.innerHTML = '<div class="filter-label">Filter by Solution</div>';
  
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
  filterSection.appendChild(assetTypeFilterContainer);
  filterSection.appendChild(solutionFilterContainer);
  filterContainer.appendChild(filterSection);
  filterContainer.appendChild(articlesSection);
  
  // Replace the block's content with our new structure
  block.textContent = '';
  block.appendChild(filterContainer);
  
  // Track current filter selections
  let currentAssetTypeFilter = 'all';
  let currentSolutionFilter = 'all';
  
  // Fetch all required data in parallel
  const [assetTypesResponse, solutionsResponse, articlesResponse] = await Promise.all([
    fetchData(addRandomNumber('/asset-type.json')),
    fetchData(addRandomNumber('/solution.json')),
    fetchData(addRandomNumber('/articles-index.json'))
  ]);
  
  // Process asset types for dropdown
  const assetTypeOptions = [{ value: 'all', text: 'All Asset Types', tag: 'all' }];
  if (assetTypesResponse && assetTypesResponse.data) {
    assetTypesResponse.data.forEach(item => {
      // Skip parent tag
      if (item.tag !== 'dhl:assettype') {
        assetTypeOptions.push({
          value: item.tag,
          text: item.title,
          tag: item.tag
        });
      }
    });
  }
  
  // Process solutions for dropdown
  const solutionOptions = [{ value: 'all', text: 'All Solutions', tag: 'all' }];
  if (solutionsResponse && solutionsResponse.data) {
    solutionsResponse.data.forEach(item => {
      // Skip parent tag
      if (item.tag !== 'dhl:solution') {
        solutionOptions.push({
          value: item.tag,
          text: item.title,
          tag: item.tag
        });
      }
    });
  }
  
  // Create tag maps for quick lookup
  const assetTypeMap = new Map();
  assetTypeOptions.forEach(option => {
    if (option.tag !== 'all') {
      assetTypeMap.set(option.tag, option.text);
    }
  });
  
  const solutionMap = new Map();
  solutionOptions.forEach(option => {
    if (option.tag !== 'all') {
      solutionMap.set(option.tag, option.text);
    }
  });
  
  // Process articles data
  let articles = [];
  if (articlesResponse && articlesResponse.data) {
    articles = articlesResponse.data.map(item => {
      // Split the comma-separated types string into an array
      const typeString = item.type || '';
      const types = typeString.split(',').map(t => t.trim());
      
      // Find asset type and solution in the types array
      const assetType = types.find(t => t.includes('dhl:assettype/')) || '';
      const solution = types.find(t => t.includes('dhl:solution/')) || '';
      
      return {
        id: item.path,
        path: item.path,
        title: item.title,
        image: item.image || DEFAULT_IMAGE,
        types: types,
        assetType: assetType,
        solution: solution,
        // Use display titles from our maps, or fall back to generated display names
        assetTypeDisplay: assetTypeMap.get(assetType) || getDisplayNameFromTag(assetType),
        solutionDisplay: solutionMap.get(solution) || getDisplayNameFromTag(solution)
      };
    });
  }
  
  function addRandomNumber(url) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}${Math.floor(Math.random() * 1000000)}`;
  }
  
  // Helper function to extract display name from a tag
  function getDisplayNameFromTag(tag) {
    if (!tag) return '';
    
    // Extract the last part after the last slash
    const parts = tag.split('/');
    const lastPart = parts[parts.length - 1];
    
    // Convert to Title Case
    return lastPart
      .replace(/-/g, ' ')
      .replace(/\w\S*/g, txt => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase());
  }
  
  // Helper function to get CSS class from a tag
  function getCssClassFromTag(tag) {
    if (!tag) return '';
    
    // Extract the last part after the last slash
    const parts = tag.split('/');
    return parts[parts.length - 1].toLowerCase().replace(/\s+/g, '-');
  }
  
  // Create custom dropdown function
  function createCustomDropdown(options, containerElement, filterType) {
    const dropdownContainer = document.createElement('div');
    dropdownContainer.className = 'custom-dropdown';
    
    const selectedOption = document.createElement('div');
    selectedOption.className = 'selected-option';
    selectedOption.innerHTML = `<span>${options[0].text}</span><i class="dropdown-arrow"></i>`;
    
    const optionsList = document.createElement('div');
    optionsList.className = 'dropdown-options';
    
    // Add options
    options.forEach(opt => {
      const option = document.createElement('div');
      option.className = 'dropdown-option' + (opt.value === 'all' ? ' selected' : '');
      option.dataset.value = opt.value;
      option.textContent = opt.text;
      optionsList.appendChild(option);
    });
    
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
    const dropdownOptions = optionsList.querySelectorAll('.dropdown-option');
    dropdownOptions.forEach(option => {
      option.addEventListener('click', () => {
        const value = option.dataset.value;
        const text = option.textContent;
        
        // Update selected option display
        selectedOption.querySelector('span').textContent = text;
        
        // Update selected class
        dropdownOptions.forEach(opt => opt.classList.remove('selected'));
        option.classList.add('selected');
        
        // Close dropdown
        dropdownContainer.classList.remove('open');
        
        // Update current filter value based on which filter was changed
        if (filterType === 'assetType') {
          currentAssetTypeFilter = value;
        } else if (filterType === 'solution') {
          currentSolutionFilter = value;
        }
        
        // Apply both filters
        applyFilters();
      });
    });
    
    containerElement.appendChild(dropdownContainer);
    return dropdownContainer;
  }
  
  // Function to apply both filters
  function applyFilters() {
    let filteredArticles = articles;
    
    // Apply Asset Type filter if not "All"
    if (currentAssetTypeFilter !== 'all') {
      filteredArticles = filteredArticles.filter(article => article.assetType === currentAssetTypeFilter);
    }
    
    // Apply Solution filter if not "All"
    if (currentSolutionFilter !== 'all') {
      filteredArticles = filteredArticles.filter(article => article.solution === currentSolutionFilter);
    }
    
    renderArticles(filteredArticles);
  }
  
  // Add the custom dropdowns to their containers
  createCustomDropdown(assetTypeOptions, assetTypeFilterContainer, 'assetType');
  createCustomDropdown(solutionOptions, solutionFilterContainer, 'solution');
  
  // Function to render articles
  function renderArticles(articlesToRender) {
    articlesContainer.innerHTML = ''; // Clear existing articles
    
    if (articlesToRender.length === 0) {
      articlesContainer.innerHTML = '<div class="no-articles">No articles found matching these filters.</div>';
      return;
    }
    
    articlesToRender.forEach(article => {
      const articleElement = document.createElement('div');
      articleElement.className = 'article-card';
      
      // Get CSS class from solution
      const cssClass = getCssClassFromTag(article.solution);
      
      articleElement.innerHTML = `
        <img src="${article.image}" onerror="this.src='${DEFAULT_IMAGE}'" alt="${article.title}" class="article-image">
        <div class="article-content">
          <div class="article-type ${cssClass}">${article.solutionDisplay || 'Other'}</div>
          <h3 class="article-title">${article.title}</h3>
          <a href="${article.path}" class="article-link">Read More</a>
        </div>
      `;
      
      articlesContainer.appendChild(articleElement);
    });
  }
  
  // Initial rendering of all articles
  renderArticles(articles);
}