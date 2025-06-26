const routes = {
  home: 'home.html',
  product: 'product.html',
  search: 'search.html',
  contact: 'contact.html'
};

async function loadPage(page) {
  const resp = await fetch(routes[page] || routes['home']);
  const html = await resp.text();
  document.getElementById('app').innerHTML = html;
}

//function route() {
//  const page = location.hash.replace('#', '') || 'home';
//  loadPage(page);
//}

function route() {
  const page = location.hash.replace('#', '') || 'home';
  loadPage(page);

  // Genesys Journey: send virtual pageview and attributes
  if (typeof Journey === "function") {
    Journey('pageview', { page: `/${page}` });
    console.log('Journey virtual pageview:', page);

    // Optional: send user info if you have it
    Journey('attribute', { name: 'userId', value: 'user123' });
    Journey('attribute', { name: 'email', value: 'john.doe@example.com' });
  }
}

// Initial load
window.addEventListener('DOMContentLoaded', route);
// On hash change
window.addEventListener('hashchange', route);

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}
