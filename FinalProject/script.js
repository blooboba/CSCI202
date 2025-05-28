// Global variables
let restaurants = [];
let filteredRestaurants = [];
let categories = ['All Categories'];
let selectedCategory = 'All Categories';
let searchQuery = '';

// DOM elements
const searchInput = document.getElementById('searchInput');
const categoryButton = document.getElementById('categoryButton');
const categoryDropdown = document.getElementById('categoryDropdown');
const selectedCategorySpan = document.getElementById('selectedCategory');
const restaurantsContainer = document.getElementById('restaurantsContainer');
const noResults = document.getElementById('noResults');

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadRestaurants();
    setupEventListeners();
    renderCategories();
    filterAndRenderRestaurants();
});

// Load restaurant data from JSON file
async function loadRestaurants() {
    try {
        showLoading();
        const response = await fetch('restaurants.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        restaurants = data.restaurants;
        
        // Extract unique categories
        const uniqueCategories = [...new Set(restaurants.map(r => r.category))];
        categories = ['All Categories', ...uniqueCategories.sort()];
        
        console.log('Loaded restaurants:', restaurants.length);
    } catch (error) {
        console.error('Error loading restaurants:', error);
        showError('Failed to load restaurant data. Please try again later.');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase();
        filterAndRenderRestaurants();
    });

    // Category dropdown toggle
    categoryButton.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleCategoryDropdown();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!categoryButton.contains(e.target) && !categoryDropdown.contains(e.target)) {
            closeCategoryDropdown();
        }
    });

    // Close dropdown on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCategoryDropdown();
        }
    });
}

// Render category options
function renderCategories() {
    categoryDropdown.innerHTML = '';
    categories.forEach(category => {
        const option = document.createElement('button');
        option.className = 'category-option';
        option.textContent = category;
        option.addEventListener('click', () => selectCategory(category));
        categoryDropdown.appendChild(option);
    });
}

// Toggle category dropdown
function toggleCategoryDropdown() {
    const isOpen = !categoryDropdown.classList.contains('hidden');
    if (isOpen) {
        closeCategoryDropdown();
    } else {
        openCategoryDropdown();
    }
}

// Open category dropdown
function openCategoryDropdown() {
    categoryDropdown.classList.remove('hidden');
    categoryButton.classList.add('open');
}

// Close category dropdown
function closeCategoryDropdown() {
    categoryDropdown.classList.add('hidden');
    categoryButton.classList.remove('open');
}

// Select a category
function selectCategory(category) {
    selectedCategory = category;
    selectedCategorySpan.textContent = category;
    closeCategoryDropdown();
    filterAndRenderRestaurants();
}

// Filter and render restaurants
function filterAndRenderRestaurants() {
    filteredRestaurants = restaurants.filter(restaurant => {
        const matchesSearch = searchQuery === '' || 
            restaurant.name.toLowerCase().includes(searchQuery) ||
            restaurant.category.toLowerCase().includes(searchQuery) ||
            restaurant.description.toLowerCase().includes(searchQuery) ||
            (restaurant.subcategory && restaurant.subcategory.toLowerCase().includes(searchQuery));
        
        const matchesCategory = selectedCategory === 'All Categories' || 
            restaurant.category === selectedCategory;

        return matchesSearch && matchesCategory;
    });

    renderRestaurants();
}

// Render restaurants
function renderRestaurants() {
    if (filteredRestaurants.length === 0) {
        restaurantsContainer.classList.add('hidden');
        noResults.classList.remove('hidden');
        return;
    }

    restaurantsContainer.classList.remove('hidden');
    noResults.classList.add('hidden');

    restaurantsContainer.innerHTML = filteredRestaurants.map(restaurant => `
        <div class="restaurant-card">
            <div class="restaurant-card-content">
                <img 
                    src="${restaurant.image}" 
                    alt="${restaurant.name}"
                    class="restaurant-image"
                    onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop'"
                >
                <div class="restaurant-info">
                    <div>
                        <h3 class="restaurant-name">${restaurant.name}</h3>
                        <p class="restaurant-category">
                            ${restaurant.category}
                            ${restaurant.subcategory ? `<span class="separator">•</span>${restaurant.subcategory}` : ''}
                        </p>
                        <p class="restaurant-description">
                            ${restaurant.description} ${restaurant.emoji || ''}
                        </p>
                    </div>
                    <div class="restaurant-actions">
                        <button class="maps-button" onclick="openGoogleMaps('${restaurant.name}', '${restaurant.address || 'Bellingham, WA'}')">
                            View on Google Maps
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Open Google Maps
function openGoogleMaps(restaurantName, address) {
    const query = encodeURIComponent(`${restaurantName} ${address}`);
    const url = `https://www.google.com/maps/search/?api=1&query=${query}`;
    window.open(url, '_blank');
}

// Show loading state
function showLoading() {
    restaurantsContainer.innerHTML = '<div class="loading">Loading restaurants...</div>';
}

// Show error message
function showError(message) {
    restaurantsContainer.innerHTML = `<div class="loading">${message}</div>`;
}

// Utility function to debounce search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Apply debouncing to search (optional optimization)
const debouncedSearch = debounce((query) => {
    searchQuery = query.toLowerCase();
    filterAndRenderRestaurants();
}, 300);

// You can replace the direct search event listener with this for better performance:
// searchInput.addEventListener('input', (e) => debouncedSearch(e.target.value));