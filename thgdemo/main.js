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

function route() {
  const page = location.hash.replace('#', '') || 'home';
  loadPage(page);
}

// Initial load
window.addEventListener('DOMContentLoaded', route);
// On hash change
window.addEventListener('hashchange', route);

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('service-worker.js');
}