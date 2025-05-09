document.addEventListener('DOMContentLoaded', () => {
  fetch('shows.json')
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      const pageIdMap = {
        'korean-list': 'Korean Drama',
        'anime-list': 'Anime',
        'american-list': 'American Shows',
        'top-rated-list': 'all'
      };

      for (const listId in pageIdMap) {
        const listElement = document.getElementById(listId);
        if (!listElement) continue;

        const category = pageIdMap[listId];
        let shows = [];

        if (category === 'all') {
          const all = Object.values(data).flat();
          shows = all.filter(show => {
            const match = show.rating.match(/^([\d,.]+)\/(\d+)/);
            if (!match) return false;
            const numerator = parseFloat(match[1].replace(/,/g, ''));
            const denominator = parseFloat(match[2]);
            return denominator && (numerator / denominator) >= 1;
          });
        } else {
          shows = data[category] || [];
        }

        shows.forEach(show => {
          const li = document.createElement('li');
          li.innerHTML = `
            <img src="${show.image_url}" alt="${show.title}" onerror="this.onerror=null; this.src='https://via.placeholder.com/250x140?text=No+Image';" />
            <h3><a href="${show.wikipedia_link}" target="_blank">${show.title}</a></h3>
            <p><strong>Rating:</strong> ${show.rating}</p>
            <p><strong>Main Cast:</strong> ${Array.isArray(show.main_cast) ? show.main_cast.join(', ') : 'N/A'}</p>
            <p>${show.summary}</p>
        `;
        listElement.appendChild(li);
        });
      }
    })
    .catch(error => {
      console.error('Error loading JSON:', error);
      document.body.innerHTML = `<p style="color:red;">Failed to load show data. Please try again later.</p>`;
    });
});
