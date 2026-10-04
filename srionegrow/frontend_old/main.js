    const sections = [...document.querySelectorAll('.route-section')];
    const authViews = [...document.querySelectorAll('.auth-view')];
    const navLinks = [...document.querySelectorAll('[data-route]')];
    const menuToggle = document.querySelector('.menu-toggle');
    const navList = document.querySelector('.nav-links');
    const navActions = document.querySelector('.nav-actions');
    const themeToggle = document.querySelector('.theme-toggle');

    // Cart state
    let cart = JSON.parse(localStorage.getItem('srione-cart') || '[]');
    let activeDetailProduct = null;

    function applyTheme(theme) {
      const isLightMode = theme === 'light';
      document.body.classList.toggle('light-theme', isLightMode);
      document.body.classList.toggle('dark-theme', !isLightMode);

      if (themeToggle) {
        const label = isLightMode ? 'Switch to dark theme' : 'Switch to light theme';
        themeToggle.setAttribute('aria-label', label);
        themeToggle.setAttribute('aria-pressed', String(isLightMode));
        themeToggle.textContent = isLightMode ? '🌙 Dark' : '☀️ Light';
      }

      localStorage.setItem('srione-theme', theme);
    }

    const savedTheme = localStorage.getItem('srione-theme') || 'dark';
    applyTheme(savedTheme);

    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
        applyTheme(nextTheme);
      });
    }

    // Auth Tab Switching Logic
    function switchAuthTab(tab) {
      const isSignUp = tab === 'signup';
      const formSignin = document.getElementById('form-signin');
      const formSignup = document.getElementById('form-signup');
      const tabSigninBtn = document.getElementById('tab-signin-btn');
      const tabSignupBtn = document.getElementById('tab-signup-btn');

      if (formSignin) formSignin.style.display = isSignUp ? 'none' : 'block';
      if (formSignup) formSignup.style.display = isSignUp ? 'block' : 'none';
      if (tabSigninBtn) tabSigninBtn.classList.toggle('active', !isSignUp);
      if (tabSignupBtn) tabSignupBtn.classList.toggle('active', isSignUp);
    }

    const tabSigninBtn = document.getElementById('tab-signin-btn');
    const tabSignupBtn = document.getElementById('tab-signup-btn');
    const linkToSignup = document.getElementById('link-to-signup');
    const linkToSignin = document.getElementById('link-to-signin');

    if (tabSigninBtn) tabSigninBtn.addEventListener('click', () => { window.location.hash = 'signin'; switchAuthTab('signin'); });
    if (tabSignupBtn) tabSignupBtn.addEventListener('click', () => { window.location.hash = 'signup'; switchAuthTab('signup'); });
    if (linkToSignup) linkToSignup.addEventListener('click', (e) => { e.preventDefault(); window.location.hash = 'signup'; switchAuthTab('signup'); });
    if (linkToSignin) linkToSignin.addEventListener('click', (e) => { e.preventDefault(); window.location.hash = 'signin'; switchAuthTab('signin'); });

    function showRoute() {
      const route = window.location.hash.slice(1) || 'home';
      const isAuth = route === 'auth' || route === 'signin' || route === 'signup';
      const isProductDetail = route.startsWith('product-detail') || route.startsWith('product-');

      document.getElementById('main-content').style.display = isAuth ? 'none' : 'block';
      authViews.forEach(view => view.classList.toggle('visible', isAuth));

      const productDetailSec = document.getElementById('product-detail');

      if (isAuth) {
        sections.forEach(section => section.style.display = 'none');
        switchAuthTab(route === 'signup' ? 'signup' : 'signin');
      } else if (isProductDetail) {
        sections.forEach(section => {
          section.style.display = (section.id === 'product-detail' || section.id === 'contact') ? 'block' : 'none';
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        sections.forEach(section => {
          section.style.display = (section.id === 'product-detail') ? 'none' : 'block';
        });
      }

      navLinks.forEach(link => {
        link.classList.toggle('active', link.dataset.route === route || (isAuth && link.dataset.route === 'auth'));
      });

      if (navList) navList.classList.remove('open');
      if (navActions) navActions.classList.remove('open');
      if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');

      if (!isProductDetail && !isAuth) {
        if (route === 'shop') {
          const target = document.getElementById('shop');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        } else if (route === 'services') {
          const target = document.getElementById('services');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        } else if (route === 'contact') {
          const target = document.getElementById('contact');
          if (target) target.scrollIntoView({ behavior: 'smooth' });
        } else if (route === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    }

    if (menuToggle) {
      menuToggle.addEventListener('click', () => {
        const open = !navList.classList.contains('open');
        navList.classList.toggle('open', open);
        navActions.classList.toggle('open', open);
        menuToggle.setAttribute('aria-expanded', String(open));
      });
    }

    window.addEventListener('hashchange', showRoute);

    // Form Submissions and Auth Routing
    const formSignin = document.getElementById('form-signin');
    const formSignup = document.getElementById('form-signup');

    if (formSignin) {
      formSignin.addEventListener('submit', event => {
        event.preventDefault();
        const email = document.getElementById('signin-email').value;
        const user = { email, signedIn: true };
        localStorage.setItem('srione-user', JSON.stringify(user));
        updateUserNav();
        showToast('Welcome back to SRIONE.');
        window.location.hash = 'home';
      });
    }

    if (formSignup) {
      formSignup.addEventListener('submit', event => {
        event.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const phone = document.getElementById('signup-phone').value;
        const dob = document.getElementById('signup-dob').value;
        const tob = document.getElementById('signup-tob').value;

        const user = { name, email, phone, dob, tob, signedIn: true };
        localStorage.setItem('srione-user', JSON.stringify(user));
        updateUserNav();
        showToast(`Welcome to SRIONE, ${name}!`);
        window.location.hash = 'home';
      });
    }

    function updateUserNav() {
      const user = JSON.parse(localStorage.getItem('srione-user') || 'null');
      const authBtn = document.getElementById('nav-auth-btn');
      if (authBtn) {
        if (user && user.signedIn) {
          authBtn.textContent = user.name ? `Account (${user.name})` : 'Account';
        } else {
          authBtn.textContent = 'Sign In / Sign Up';
        }
      }
    }
    updateUserNav();

    // Toast Notifications
    function showToast(msg) {
      const existing = document.querySelector('.toast-msg');
      if (existing) existing.remove();

      const toast = document.createElement('div');
      toast.className = 'toast-msg';
      toast.innerHTML = `<span>✦</span> <span>${msg}</span>`;
      document.body.appendChild(toast);

      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transition = 'opacity 0.3s ease';
        setTimeout(() => toast.remove(), 300);
      }, 3000);
    }

    // Existing products preserved exactly


    const catalog = document.querySelector('#catalog');
    const topSearch = document.querySelector('.nav-search-input');
    const searchCategory = document.querySelector('.search-category');
    const filterButtons = [...document.querySelectorAll('.filter')];
    let activeFilter = 'all';


    function openProductDetail(product) {
      activeDetailProduct = product;
      document.getElementById('detail-product-icon').textContent = product.icon;
      const detailImage = document.getElementById('detail-product-image');
      detailImage.hidden = !product.image;
      detailImage.src = product.image || '';
      detailImage.alt = product.image ? product.name : '';
      document.getElementById('detail-product-icon').hidden = Boolean(product.image);
      document.getElementById('detail-product-group').textContent = `SRIONE / ${product.group.toUpperCase()}`;
      document.getElementById('detail-product-name').textContent = product.name;
      document.getElementById('detail-product-price').textContent = product.price;
      document.getElementById('detail-original-price').textContent = getListPrice(product);
      document.getElementById('detail-spec-category').textContent = product.group;
      document.getElementById('detail-free-gift').hidden = !isFreeGiftEligible(product);

      const rashiSelection = document.getElementById('rashi-selection');
      const rashiGrid = document.getElementById('rashi-grid');
      const productActions = document.querySelector('.product-action-group');
      const rashiProducts = products.filter(item => item.rashi);
      const isRashiSet = product.name.toLowerCase() === 'rashi set';
      rashiSelection.hidden = !isRashiSet;
      productActions.hidden = isRashiSet;
      if (isRashiSet) {
        rashiGrid.innerHTML = rashiProducts.map(item => `
          <article class="rashi-option">
            <div class="rashi-option-name">
              <span class="rashi-symbol">${item.icon}</span>
              <span>${item.name}</span>
            </div>
            <div class="rashi-action-group">
              <button class="rashi-buy" type="button" data-rashi-action="buy" data-rashi-name="${item.name}">Buy Now</button>
              <button class="rashi-cart" type="button" data-rashi-action="cart" data-rashi-name="${item.name}">Add to Cart</button>
            </div>
          </article>
        `).join('');
        rashiGrid.querySelectorAll('[data-rashi-action]').forEach(button => {
          button.addEventListener('click', () => {
            const rashi = rashiProducts.find(item => item.name === button.dataset.rashiName);
            if (!rashi) return;
            if (button.dataset.rashiAction === 'buy') {
              sendOrderEnquiry(rashi);
            } else {
              addToCart(rashi);
            }
          });
        });
      }

      const desc = productDescriptions[product.name] || `Curated SRIONE ${product.group.toLowerCase()} item crafted with intention to support clarity, energy balance, and aligned focus.`;
      document.getElementById('detail-product-desc').textContent = desc;

      window.location.hash = 'product-detail';
    }

    function sendOrderEnquiry(product) {
      const subject = encodeURIComponent(`Order Enquiry: ${product.name} (${product.price})`);
      const giftNote = isFreeGiftEligible(product) ? '\nFree gift: Selenite Plate' : '';
      const body = encodeURIComponent(`Hello SRIONE,\n\nI would like to purchase ${product.name} for ${product.price}.${giftNote}\n\nPlease provide payment and delivery details.`);
      window.location.href = `mailto:shop@srione.com?subject=${subject}&body=${body}`;
    }

    // Detail Action Handlers
    document.getElementById('detail-buy-now').addEventListener('click', () => {
      if (!activeDetailProduct) return;
      sendOrderEnquiry(activeDetailProduct);
    });

    document.getElementById('detail-add-cart').addEventListener('click', () => {
      if (!activeDetailProduct) return;
      addToCart(activeDetailProduct);
    });

    // Cart Management
    function addToCart(product) {
      cart.push(product);
      localStorage.setItem('srione-cart', JSON.stringify(cart));
      updateCartUI();
      showToast(`Added ${product.name} to your cart.`);
    }

    function removeFromCart(index) {
      cart.splice(index, 1);
      localStorage.setItem('srione-cart', JSON.stringify(cart));
      updateCartUI();
    }

    function parsePrice(priceStr) {
      const match = priceStr.match(/₹?\s*([\d,]+)/);
      if (!match) return 0;
      return parseInt(match[1].replace(/,/g, ''), 10) || 0;
    }

    function getListPrice(product) {
      return `₹${(parsePrice(product.price) * 2).toLocaleString('en-IN')}`;
    }

    function isFreeGiftEligible(product) {
      return parsePrice(product.price) > 1000;
    }

    function updateCartUI() {
      const cartCount = document.getElementById('cart-count');
      const cartItemsContainer = document.getElementById('cart-items-container');
      const cartTotalPrice = document.getElementById('cart-total-price');

      if (cartCount) cartCount.textContent = cart.length;

      if (!cartItemsContainer) return;

      if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty">Your cart is empty.</div>';
        if (cartTotalPrice) cartTotalPrice.textContent = '₹0';
        return;
      }

      let total = 0;
      cartItemsContainer.innerHTML = cart.map((item, idx) => {
        const itemVal = parsePrice(item.price);
        total += itemVal;
        return `
          <div class="cart-item">
            <div class="cart-item-info">
              <h4>${item.name}${item.rashiSelection ? ` - ${item.rashiSelection}` : ''}</h4>
              <p class="cart-item-pricing"><span class="price-original">${getListPrice(item)}</span><span>${item.price}</span><span class="discount-badge">50% OFF</span>${isFreeGiftEligible(item) ? '<span class="free-gift-badge">Free Selenite Plate</span>' : ''}</p>
            </div>
            <button class="cart-item-remove" type="button" onclick="removeFromCart(${idx})" aria-label="Remove item">✕</button>
          </div>
        `;
      }).join('');

      if (cartTotalPrice) cartTotalPrice.textContent = `₹${total.toLocaleString('en-IN')}`;
    }

    // Cart Drawer Toggle
    const cartBtn = document.getElementById('nav-cart-btn');
    const cartModal = document.getElementById('cart-modal');
    const cartCloseBtn = document.getElementById('cart-close-btn');
    const cartCheckoutBtn = document.getElementById('cart-checkout-btn');

    if (cartBtn) cartBtn.addEventListener('click', () => { cartModal.classList.add('visible'); updateCartUI(); });
    if (cartCloseBtn) cartCloseBtn.addEventListener('click', () => cartModal.classList.remove('visible'));
    if (cartModal) cartModal.addEventListener('click', (e) => { if (e.target === cartModal) cartModal.classList.remove('visible'); });

    if (cartCheckoutBtn) {
      cartCheckoutBtn.addEventListener('click', () => {
        if (cart.length === 0) {
          alert('Your cart is empty.');
          return;
        }
        const itemNames = cart.map(item => `${item.name} (${item.price})${isFreeGiftEligible(item) ? ' + Free Selenite Plate' : ''}`).join(', ');
        const total = document.getElementById('cart-total-price').textContent;
        const subject = encodeURIComponent(`Cart Order (${cart.length} items) - Total ${total}`);
        const body = encodeURIComponent(`Hello SRIONE,\n\nI would like to place an order for the following items:\n${itemNames}\n\nTotal: ${total}\n\nPlease confirm availability and payment details.`);
        window.location.href = `mailto:shop@srione.com?subject=${subject}&body=${body}`;
      });
    }

    updateCartUI();

    function productMatchesCategory(product, filterValue) {
      if (filterValue === 'all') return true;
      if (filterValue === 'bracelets') {
        return product.category === 'bracelets' || product.group.toLowerCase().includes('bracelet') || product.name.toLowerCase().includes('bracelet');
      }
      return product.category === filterValue;
    }

    const suggestionBox = document.querySelector('.search-suggestions');

    function getSuggestions(query) {
      if (!query) return [];
      const lower = query.toLowerCase();
      const matches = products.filter(product => `${product.name} ${product.group}`.toLowerCase().includes(lower));
      return matches.slice(0, 6).map(product => ({
        name: product.name,
        group: product.group,
        product: product
      }));
    }

    function renderSuggestions() {
      const query = (topSearch.value || '').trim();
      const suggestions = getSuggestions(query);

      if (!query || suggestions.length === 0) {
        suggestionBox.innerHTML = '';
        suggestionBox.classList.remove('visible');
        return;
      }

      suggestionBox.innerHTML = suggestions.map(item => `
        <button type="button" class="suggestion-item" data-name="${item.name}">
          <span>${item.name}</span>
          <small>${item.group}</small>
        </button>
      `).join('');

      suggestionBox.classList.add('visible');
      suggestionBox.querySelectorAll('.suggestion-item').forEach((button, idx) => {
        button.addEventListener('click', () => {
          topSearch.value = button.dataset.name;
          suggestionBox.classList.remove('visible');
          const matchedProd = products.find(p => p.name.toLowerCase() === button.dataset.name.toLowerCase());
          if (matchedProd) {
            openProductDetail(matchedProd);
          }
        });
      });
    }

    function renderProducts(shouldScroll = Boolean(topSearch.value.trim())) {
      const query = (topSearch.value || '').trim().toLowerCase();
      const visible = products.filter(product => {
        const matchesFilter = productMatchesCategory(product, activeFilter);
        const matchesSearch = !query || `${product.name} ${product.group}`.toLowerCase().includes(query);
        return matchesFilter && matchesSearch;
      });

      catalog.innerHTML = visible.length ? visible.map(product => `
        <article class="product" data-product-name="${product.name}" tabindex="0" role="button" aria-label="View details for ${product.name}">
          <div class="product-art" aria-hidden="true">${product.image ? `<img src="${product.image}" alt="${product.name}" loading="lazy">` : product.icon}</div>
          <div class="category">${product.group}</div>
          <h2>${product.name}</h2>
          <div class="product-bottom">
            <div class="product-pricing">
              <div class="product-price-line"><span class="price-original">${getListPrice(product)}</span><span class="price">${product.price}</span></div>
              <span class="discount-badge">50% OFF</span>
              ${isFreeGiftEligible(product) ? '<span class="free-gift-badge">Free Selenite Plate</span>' : ''}
            </div>
            <button class="enquire" type="button">View Details ↗</button>
          </div>
        </article>
      `).join('') : '<div class="empty">No products match that search.</div>';

      catalog.querySelectorAll('.product').forEach((card, idx) => {
        const prod = visible[idx];
        card.addEventListener('click', () => openProductDetail(prod));
        card.addEventListener('keydown', (e) => { if (e.key === 'Enter') openProductDetail(prod); });
      });
    }

    function syncFilterFromSearchCategory() {
      activeFilter = searchCategory.value;
      filterButtons.forEach(item => item.classList.toggle('active', item.dataset.filter === activeFilter));
      if (window.location.hash === '#auth' || window.location.hash === '#signin' || window.location.hash === '#signup') {
        window.location.hash = 'shop';
      }
      renderProducts(true);
    }

    filterButtons.forEach(button => button.addEventListener('click', () => {
      activeFilter = button.dataset.filter;
      searchCategory.value = activeFilter;
      filterButtons.forEach(item => item.classList.toggle('active', item === button));
      renderProducts();
    }));

    topSearch.addEventListener('input', () => {
      if (window.location.hash === '#auth' || window.location.hash === '#signin' || window.location.hash === '#signup') {
        window.location.hash = 'shop';
      }
      renderSuggestions();
      renderProducts();
    });

    searchCategory.addEventListener('change', syncFilterFromSearchCategory);
    document.querySelector('.nav-search-btn').addEventListener('click', () => {
      if (window.location.hash === '#auth' || window.location.hash === '#signin' || window.location.hash === '#signup') {
        window.location.hash = 'shop';
      }
      renderProducts();
    });

    topSearch.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        suggestionBox.classList.remove('visible');
        if (window.location.hash === '#auth' || window.location.hash === '#signin' || window.location.hash === '#signup') {
          window.location.hash = 'shop';
        }
        renderProducts(true);
      }
    });

    document.addEventListener('click', (event) => {
      if (!event.target.closest('.nav-search')) {
        suggestionBox.classList.remove('visible');
      }
    });


    renderProducts();

    if ('IntersectionObserver' in window) {
      const sectionObserver = new IntersectionObserver((entries) => {
        if (window.location.hash === '#auth' || window.location.hash === '#signin' || window.location.hash === '#signup' || window.location.hash.startsWith('#product')) return;
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
              link.classList.toggle('active', link.dataset.route === id);
            });
          }
        });
      }, { rootMargin: '-25% 0px -55% 0px' });

      sections.forEach(section => sectionObserver.observe(section));
    }

    showRoute();
