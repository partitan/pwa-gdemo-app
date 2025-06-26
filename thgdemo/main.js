const routes = {
  home: 'home.html',
  product: 'product.html',
  search: 'search.html',
  contact: 'contact.html',
  login: 'login.html',
 test: 'test.html' 
};

async function loadPage(page) {
  let pageFile = routes[page] || routes['home'];
  try {
    const resp = await fetch(pageFile);
    if (resp.ok) {
      const html = await resp.text();
      document.getElementById('app').innerHTML = html;

      // If loading the login page, add login logic
      if (page === 'login') setupLogin();
      updateUserInfo();
    } else {
      document.getElementById('app').innerHTML = "<h2>Page not found.</h2>";
    }
  } catch (e) {
    document.getElementById('app').innerHTML = "<h2>Page load error.</h2>";
  }
}

function setupLogin() {
  const form = document.getElementById('loginForm');
  if (form) {
    form.onsubmit = function(e) {
      e.preventDefault();
      const email = document.getElementById('email').value;
      // No password check
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userId', email.split('@')[0]);
      localStorage.setItem('loggedIn', 'true');

      // Genesys Journey - send user attribute
      if (typeof Journey === "function") {
        Journey('attribute', { name: 'Name', value: email.split('@')[0] });
        Journey('attribute', { name: 'Email', value: email });
      }

      // Go to home page and trigger pageview
      location.hash = '#home';
      updateUserInfo();
    };
  }
}

function updateUserInfo() {
  const userInfo = document.getElementById('userInfo');
  const loginNav = document.getElementById('loginNav');
  if (localStorage.getItem('loggedIn') === 'true') {
    const email = localStorage.getItem('userEmail');
    userInfo.innerHTML = ` | Logged in as <b>${email}</b> <a href="#" id="logoutBtn">(Logout)</a>`;
    loginNav.style.display = 'none';
    setTimeout(() => {
      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn) {
        logoutBtn.onclick = function() {
          localStorage.removeItem('loggedIn');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userId');
          loginNav.style.display = '';
          userInfo.innerHTML = '';
          location.hash = '#login';
        };
      }
    }, 100);
  } else {
    userInfo.innerHTML = '';
    if (loginNav) loginNav.style.display = '';
  }
}

//function route() {
//  const page = location.hash.replace('#', '') || 'home';
//  loadPage(page);
//}

function route() {
  // Check login state
  const loggedIn = localStorage.getItem('loggedIn') === 'true';
  // If not logged in, always show login page
  const page = location.hash.replace('#', '') || (loggedIn ? 'home' : 'login');
  // If user tries to navigate to anything but login and not logged in, force login
  if (!loggedIn && page !== 'login') {
    location.hash = '#login';
    loadPage('login');
  } else {
    loadPage(page);
  }

  // Genesys Journey: send virtual pageview and user attributes if available
  if (typeof Journey === "function") {
    Journey('pageview', { page: `/${page}` });
    console.log('Journey virtual pageview:', page);

    // Use real user info if available
    const userId = localStorage.getItem('userId') || 'guest';
    const email = localStorage.getItem('userEmail') || '';
    Journey('attribute', { name: 'userId', value: userId });
    if (email) Journey('attribute', { name: 'email', value: email });
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
