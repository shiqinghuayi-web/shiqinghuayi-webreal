
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80";

function getCart() {
  return JSON.parse(localStorage.getItem('cart') || '[]');
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
  const count = getCart().reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  document.querySelectorAll('#cart-count').forEach(el => {
    el.textContent = count;
  });
}

function getProductId(product) {
  return product?.id || product?.productId || product?.slug || Date.now();
}

function getProductName(product) {
  return product?.name || product?.title || '未命名商品';
}

function getProductPrice(product) {
  return Number(product?.price || product?.unitPrice || 0);
}

function getProductImage(product) {
  return product?.imageUrl || product?.image || product?.coverImage || FALLBACK_IMAGE;
}

function getProductCategory(product) {
  if (typeof product?.category === 'object' && product.category !== null) {
    return product.category.name || '商品分類';
  }
  return product?.category || '商品分類';
}

function createCartItem(product, quantity = 1) {
  return {
    id: getProductId(product),
    productId: getProductId(product),
    slug: product?.slug || '',
    name: getProductName(product),
    title: getProductName(product),
    price: getProductPrice(product),
    unitPrice: getProductPrice(product),
    imageUrl: getProductImage(product),
    image: getProductImage(product),
    quantity
  };
}

function addToCart(product, quantity = 1) {
  const cart = getCart();
  const productId = String(getProductId(product));
  const existing = cart.find(item => String(item.id) === productId);

  if (existing) {
    existing.quantity += quantity;
  } else {
    cart.push(createCartItem(product, quantity));
  }

  saveCart(cart);
  updateCartCount();
}

function money(n) {
  return `NT$ ${Number(n || 0)}`;
}

function createProductCard(product) {
  const id = getProductId(product);
  return `
    <article class="product-card">
      <div class="product-media">
        <span class="product-tag">${getProductCategory(product)}</span>
        <img src="${getProductImage(product)}" alt="${getProductName(product)}">
      </div>
      <div class="product-body">
        <div class="product-title-row">
          <div class="product-title">${getProductName(product)}</div>
          <div class="price">${money(getProductPrice(product))}</div>
        </div>
        <div class="product-meta">品牌精選 · 限量推薦</div>
        <p class="muted">${product.description || ''}</p>
        <div class="product-actions">
          <a class="btn" href="/product-detail.html?slug=${product.slug || id}">查看商品</a>
          <button class="btn btn-outline" onclick="quickAddToCart('${id}')">加入購物車</button>
        </div>
      </div>
    </article>
  `;
}

let featuredProducts = [];

function quickAddToCart(productId) {
  const product = featuredProducts.find(item => String(getProductId(item)) === String(productId));
  if (!product) return alert('找不到商品資料');
  addToCart(product, 1);
  alert('已加入購物車');
}

async function loadFeaturedProducts() {
  const container = document.getElementById('featured-products');
  if (!container) return;

  try {
    const res = await fetch('/api/products');
    const result = await res.json();
    const products = Array.isArray(result.data) ? result.data : [];
    featuredProducts = products;
    container.innerHTML = products.slice(0, 3).map(createProductCard).join('') || '<div class="empty-state">目前沒有精選商品</div>';
  } catch (error) {
    container.innerHTML = '<div class="empty-state">精選商品載入失敗</div>';
  }
}

updateCartCount();
loadFeaturedProducts();
window.quickAddToCart = quickAddToCart;
