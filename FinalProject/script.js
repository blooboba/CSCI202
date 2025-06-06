// Global variables
let restaurants = [];
let filteredRestaurants = [];
let categories = ['All Categories'];
let selectedCategory = 'All Categories';
let searchQuery = '';
let showFavorites = false;
let favorites = [];
let reviews = {}; // Store reviews by restaurant ID
let currentRestaurantId = null;
let selectedRating = 0;
let isDarkMode = false;

// DOM elements
const searchInput = document.getElementById('searchInput');
const categoryButton = document.getElementById('categoryButton');
const categoryDropdown = document.getElementById('categoryDropdown');
const selectedCategorySpan = document.getElementById('selectedCategory');
const restaurantsContainer = document.getElementById('restaurantsContainer');
const noResults = document.getElementById('noResults');
const reviewModal = document.getElementById('reviewModal');
const reviewForm = document.getElementById('reviewForm');
const modalRestaurantName = document.getElementById('modalRestaurantName');
const darkModeToggle = document.getElementById('darkModeToggle');
const favoritesToggle = document.getElementById('favoritesToggle');
const reviewsCol = window.collection(window.firestore, "reviews");
const snapshot = await window.getDocs(reviewsCol);

// Initialize the application
document.addEventListener('DOMContentLoaded', async () => {
    await loadRestaurants();
    loadReviews();
    loadFavorites();
    loadDarkModePreference();
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

// Load reviews from Firebase Firestore
async function loadReviews() {
    reviews = {};
    const reviewsCol = collection(window.firestore, "reviews");
    const snapshot = await getDocs(reviewsCol);

    snapshot.forEach(doc => {
        const review = doc.data();
        const id = review.restaurantId;
        if (!reviews[id]) {
            reviews[id] = [];
        }
        reviews[id].push(review);
    });

    filterAndRenderRestaurants();
}

// Load favorites from localStorage
function loadFavorites() {
    const savedFavorites = localStorage.getItem('restaurantFavorites');
    if (savedFavorites) {
        favorites = JSON.parse(savedFavorites);
    }
}

// Load dark mode preference
function loadDarkModePreference() {
    const savedDarkMode = localStorage.getItem('darkMode');
    if (savedDarkMode !== null) {
        isDarkMode = JSON.parse(savedDarkMode);
    } else {
        // Default to system preference
        isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    applyDarkMode();
}

// Apply dark mode
function applyDarkMode() {
    if (isDarkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
    updateDarkModeToggle();
}

// Update dark mode toggle icon
function updateDarkModeToggle() {
    const sunIcon = darkModeToggle.querySelector('.sun-icon');
    const moonIcon = darkModeToggle.querySelector('.moon-icon');
    
    if (isDarkMode) {
        sunIcon.style.display = 'block';
        moonIcon.style.display = 'none';
    } else {
        sunIcon.style.display = 'none';
        moonIcon.style.display = 'block';
    }
}

// Toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
    applyDarkMode();
}

// Toggle favorite
function toggleFavorite(restaurantId) {
    const index = favorites.indexOf(restaurantId);
    if (index > -1) {
        favorites.splice(index, 1);
    } else {
        favorites.push(restaurantId);
    }
    localStorage.setItem('restaurantFavorites', JSON.stringify(favorites));
    filterAndRenderRestaurants();
}

// Toggle show favorites
function toggleShowFavorites() {
    showFavorites = !showFavorites;
    favoritesToggle.classList.toggle('active', showFavorites);
    filterAndRenderRestaurants();
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

    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Favorites toggle
    favoritesToggle.addEventListener('click', toggleShowFavorites);

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
            closeReviewModal();
            closeAllReviewsModal();
            closePhotoModal();
        }
    });

    // Star rating functionality
    document.querySelectorAll('.star').forEach(star => {
        star.addEventListener('click', (e) => {
            selectedRating = parseInt(e.target.dataset.rating);
            updateStarRating();
        });
    });

    // Photo preview
    document.getElementById('reviewPhoto').addEventListener('change', handlePhotoPreview);

    // Review form submission
    reviewForm.addEventListener('submit', handleReviewSubmission);
}

// Update star rating display
function updateStarRating() {
    document.querySelectorAll('.star').forEach((star, index) => {
        if (index < selectedRating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });
}

// Handle photo preview
function handlePhotoPreview(e) {
    const file = e.target.files[0];
    const previewContainer = document.getElementById('photoPreview');
    
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            previewContainer.innerHTML = `<img src="${e.target.result}" alt="Review photo preview">`;
            previewContainer.classList.remove('hidden');
        };
        reader.readAsDataURL(file);
    } else {
        previewContainer.classList.add('hidden');
        previewContainer.innerHTML = '';
    }
}

// Handle review form submission
function handleReviewSubmission(e) {
    e.preventDefault();
    
    const reviewerName = document.getElementById('reviewerName').value;
    const reviewText = document.getElementById('reviewText').value;
    const photoFile = document.getElementById('reviewPhoto').files[0];
    
    if (!selectedRating) {
        alert('Please select a rating');
        return;
    }
    
    const review = {
        id: Date.now(),
        reviewerName,
        rating: selectedRating,
        text: reviewText,
        date: new Date().toLocaleDateString(),
        photo: null
    };
    
    // Handle photo if provided
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = (e) => {
            review.photo = e.target.result;
            addReview(review);
        };
        reader.readAsDataURL(photoFile);
    } else {
        addReview(review);
    }
}

// Save review to Firebase Firestore
async function addReview(review) {
    review.restaurantId = currentRestaurantId;

    try {
        await addDoc(collection(window.firestore, "reviews"), review);
        if (!reviews[currentRestaurantId]) {
            reviews[currentRestaurantId] = [];
        }
        reviews[currentRestaurantId].push(review);
        closeReviewModal();
        filterAndRenderRestaurants();
    } catch (error) {
        alert("Error saving review. Please try again.");
        console.error(error);
    }
}

// Open review modal
function openReviewModal(restaurantId, restaurantName) {
    currentRestaurantId = restaurantId;
    modalRestaurantName.textContent = `Add Review for ${restaurantName}`;
    reviewModal.classList.remove('hidden');
    
    // Reset form
    reviewForm.reset();
    selectedRating = 0;
    updateStarRating();
    document.getElementById('photoPreview').classList.add('hidden');
    document.getElementById('photoPreview').innerHTML = '';
}

// Close review modal
function closeReviewModal() {
    reviewModal.classList.add('hidden');
    currentRestaurantId = null;
}

// Open photo modal for larger view
function openPhotoModal(photoSrc, reviewerName) {
    const modal = document.createElement('div');
    modal.id = 'photoModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 90vw; max-height: 90vh; padding: 1rem;">
            <div class="modal-header">
                <h2>Photo by ${reviewerName}</h2>
                <button class="modal-close" onclick="closePhotoModal()">×</button>
            </div>
            <div style="text-align: center; padding: 1rem;">
                <img src="${photoSrc}" alt="Review photo" style="max-width: 100%; max-height: 70vh; object-fit: contain; border-radius: 0.5rem;">
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Close photo modal
function closePhotoModal() {
    const modal = document.getElementById('photoModal');
    if (modal) {
        modal.remove();
    }
}

// Open all reviews modal
function openAllReviewsModal(restaurantId, restaurantName) {
    const restaurant = restaurants.find(r => r.id === restaurantId);
    const restaurantReviews = reviews[restaurantId] || [];
    
    const modal = document.createElement('div');
    modal.id = 'allReviewsModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>All Reviews for ${restaurantName}</h2>
                <button class="modal-close" onclick="closeAllReviewsModal()">×</button>
            </div>
            <div class="all-reviews-content">
                ${restaurantReviews.length > 0 ? `
                    ${restaurantReviews.map(review => `
                        <div class="review-item">
                            <div class="review-header">
                                <span class="reviewer-name">${review.reviewerName}</span>
                                <span class="review-rating">${generateStarDisplay(review.rating)}</span>
                            </div>
                            <p class="review-text">${review.text}</p>
                            <div class="review-date">${review.date}</div>
                            ${review.photo ? `<img src="${review.photo}" alt="Review photo" class="review-photo" onclick="openPhotoModal('${review.photo}', '${review.reviewerName}')" style="cursor: pointer;">` : ''}
                        </div>
                    `).join('')}
                ` : '<p class="no-reviews-message">No reviews yet for this restaurant.</p>'}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
}

// Close all reviews modal
function closeAllReviewsModal() {
    const modal = document.getElementById('allReviewsModal');
    if (modal) {
        modal.remove();
    }
}

// Calculate average rating for a restaurant
function calculateAverageRating(restaurantId) {
    const restaurantReviews = reviews[restaurantId] || [];
    if (restaurantReviews.length === 0) return 0;
    
    const sum = restaurantReviews.reduce((acc, review) => acc + review.rating, 0);
    return sum / restaurantReviews.length;
}

// Generate star display
function generateStarDisplay(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    let stars = '';
    
    for (let i = 0; i < 5; i++) {
        if (i < fullStars) {
            stars += '★';
        } else if (i === fullStars && hasHalfStar) {
            stars += '☆';
        } else {
            stars += '☆';
        }
    }
    
    return stars;
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

        const matchesFavorites = !showFavorites || favorites.includes(restaurant.id);

        return matchesSearch && matchesCategory && matchesFavorites;
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

    restaurantsContainer.innerHTML = filteredRestaurants.map(restaurant => {
        const avgRating = calculateAverageRating(restaurant.id);
        const restaurantReviews = reviews[restaurant.id] || [];
        const displayedReviews = restaurantReviews.slice(-2); // Show only last 2 reviews
        const isFavorite = favorites.includes(restaurant.id);
        
        return `
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
                            <div class="restaurant-header">
                                <h3 class="restaurant-name">${restaurant.name}</h3>
                                <button class="favorite-button ${isFavorite ? 'active' : ''}" onclick="toggleFavorite('${restaurant.id}')" aria-label="${isFavorite ? 'Remove from favorites' : 'Add to favorites'}">
                                    <svg class="bookmark-icon" viewBox="0 0 24 24" fill="${isFavorite ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                                        <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"></path>
                                    </svg>
                                </button>
                            </div>
                            <p class="restaurant-category">
                                ${restaurant.category}
                                ${restaurant.subcategory ? `<span class="separator">•</span>${restaurant.subcategory}` : ''}
                            </p>
                            ${avgRating > 0 ? `
                                <div class="restaurant-rating">
                                    <span class="stars">${generateStarDisplay(avgRating)}</span>
                                    <span class="rating-text">${avgRating.toFixed(1)} (${restaurantReviews.length} review${restaurantReviews.length !== 1 ? 's' : ''})</span>
                                </div>
                            ` : ''}
                            <p class="restaurant-description">
                                ${restaurant.description} ${restaurant.emoji || ''}
                            </p>
                        </div>
                        
                        ${restaurantReviews.length > 0 ? `
                            <div class="reviews-section">
                                <div class="reviews-header">
                                    Recent Reviews:
                                    ${restaurantReviews.length > 2 ? `
                                        <button class="view-all-reviews-btn" onclick="openAllReviewsModal('${restaurant.id}', '${restaurant.name}')">
                                            View All ${restaurantReviews.length} Reviews
                                        </button>
                                    ` : ''}
                                </div>
                                ${displayedReviews.map(review => `
                                    <div class="review-item">
                                        <div class="review-header">
                                            <span class="reviewer-name">${review.reviewerName}</span>
                                            <span class="review-rating">${generateStarDisplay(review.rating)}</span>
                                        </div>
                                        <p class="review-text">${review.text}</p>
                                        ${review.photo ? `<img src="${review.photo}" alt="Review photo" class="review-photo" onclick="openPhotoModal('${review.photo}', '${review.reviewerName}')" style="cursor: pointer;">` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        ` : ''}
                        
                        <div class="restaurant-actions">
                            <button class="review-button" onclick="openReviewModal('${restaurant.id}', '${restaurant.name}')">
                                Add Review
                            </button>
                            <button class="maps-button" onclick="openGoogleMaps('${restaurant.name}', '${restaurant.address || 'Bellingham, WA'}')">
                                View on Google Maps
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
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
