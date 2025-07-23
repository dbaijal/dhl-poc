// Sample articles data
const articlesData = [
    {
        "id": "1",
        "type": "news",
        "title": "New Product Launch",
        "description": "Our company just launched an innovative product that will revolutionize the industry.",
        "image": "https://dummyimage.com/300x200",
        "link": "/articles/new-product-launch"
    },
    {
        "id": "2",
        "type": "blog",
        "title": "Best Practices for UX Design",
        "description": "Learn the top 10 best practices for creating engaging user experiences.",
        "image": "https://dummyimage.com/300x200",
        "link": "/articles/ux-design-practices"
    },
    {
        "id": "3",
        "type": "case-study",
        "title": "How Company X Increased Revenue by 200%",
        "description": "A detailed analysis of how our solutions helped Company X achieve unprecedented growth.",
        "image": "https://dummyimage.com/300x200",
        "link": "/articles/company-x-case-study"
    },
    {
        "id": "4",
        "type": "white-paper",
        "title": "Future Trends in Digital Marketing",
        "description": "An in-depth look at emerging trends that will shape digital marketing in the next decade.",
        "image": "https://dummyimage.com/300x200",
        "link": "/articles/digital-marketing-trends"
    },
    {
        "id": "5",
        "type": "news",
        "title": "Annual Conference Announcement",
        "description": "Join us for our annual industry conference featuring keynote speakers and workshops.",
        "image": "https://dummyimage.com/300x200",
        "link": "/articles/annual-conference"
    },
    {
        "id": "6",
        "type": "blog",
        "title": "5 Ways to Improve Team Productivity",
        "description": "Simple strategies that can significantly boost your team's productivity and morale.",
        "image": "https://dummyimage.com/300x200",
        "link": "/articles/team-productivity"
    },
    {
        "id": "7",
        "type": "case-study",
        "title": "Digital Transformation Journey of Company Y",
        "description": "How Company Y successfully navigated their digital transformation with our help.",
        "image": "https://dummyimage.com/300x200",
        "link": "/articles/company-y-transformation"
    },
    {
        "id": "8",
        "type": "white-paper",
        "title": "Security Challenges in IoT",
        "description": "A comprehensive analysis of security challenges in the Internet of Things ecosystem.",
        "image": "https://dummyimage.com/300x200",
        "link": "/articles/iot-security-challenges"
    }
];

// Decorate function for EDS
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
  
  const options = [
    { value: 'all', text: 'All Articles' },
    { value: 'news', text: 'News' },
    { value: 'blog', text: 'Blog' },
    { value: 'case-study', text: 'Case Study' },
    { value: 'white-paper', text: 'White Paper' }
  ];
  
  options.forEach(option => {
    const optionElement = document.createElement('option');
    optionElement.value = option.value;
    optionElement.textContent = option.text;
    select.appendChild(optionElement);
  });
  
  filterDropdown.appendChild(select);
  filterSection.appendChild(filterTitle);
  filterSection.appendChild(filterDropdown);
  
  // Create the articles section
  const articlesSection = document.createElement('div');
  articlesSection.className = 'articles-section';
  
  const articlesContainer = document.createElement('div');
  articlesContainer.id = 'articles-container';
  articlesContainer.className = 'articles-grid';
  
  articlesSection.appendChild(articlesContainer);
  
  // Add sections to the filter container
  filterContainer.appendChild(filterSection);
  filterContainer.appendChild(articlesSection);
  
  // Replace the block's content with our new structure
  block.textContent = '';
  block.appendChild(filterContainer);
  
  // Initialize the articles display
  renderArticles(articlesData);
  
  // Set up event listener for the filter dropdown
  select.addEventListener('change', function() {
    const selectedType = this.value;
    
    if (selectedType === 'all') {
      renderArticles(articlesData);
    } else {
      const filteredArticles = articlesData.filter(article => article.type === selectedType);
      renderArticles(filteredArticles);
    }
  });
  
  // Function to render articles
  function renderArticles(articles) {
    articlesContainer.innerHTML = ''; // Clear existing articles
    
    if (articles.length === 0) {
      articlesContainer.innerHTML = '<div class="no-articles">No articles found matching this filter.</div>';
      return;
    }
    
    articles.forEach(article => {
      const articleElement = document.createElement('div');
      articleElement.className = 'article-card';
      
      articleElement.innerHTML = `
        <img src="${article.image}" alt="${article.title}" class="article-image">
        <div class="article-content">
          <div class="article-type ${article.type}">${article.type}</div>
          <h3 class="article-title">${article.title}</h3>
          <p class="article-description">${article.description}</p>
          <a href="${article.link}" class="article-link">Read More</a>
        </div>
      `;
      
      articlesContainer.appendChild(articleElement);
    });
  }
}