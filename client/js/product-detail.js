
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

function getSlugFromUrl() {
  return new URLSearchParams(window.location.search).get('slug');
}

function changeQty(step) {
  const input = document.getElementById('qty-input');
  if (!input) return;
  const next = Math.max(1, Number(input.value || 1) + step);
  input.value = next;
}

function addToCartByData(product) {
  const quantity = Math.max(1, Number(document.getElementById('qty-input')?.value || 1));
  addToCart(product, quantity);
  alert('已加入購物車');
}

async function loadProductDetail() {
  const slug = getSlugFromUrl();
  const container = document.getElementById('product-detail');
  if (!container) return;

  if (!slug) {
    container.innerHTML = '<div class="empty-state">找不到商品參數</div>';
    return;
  }

  try {
    const res = await fetch(`/api/products/${slug}`);
    const result = await res.json();
    const product = result.data;
    if (!product) throw new Error('not found');

    container.innerHTML = `
      <section class="detail-card">
        <div class="detail-image">
          <img src="${getProductImage(product)}" alt="${getProductName(product)}">
        </div>
        <div class="detail-info">
          <span class="section-label">${getProductCategory(product)}</span>
          <h1>${getProductName(product)}</h1>
          <p class="price">${money(getProductPrice(product))}</p>
          <p class="muted">${product.description || ''}</p>

          <div class="detail-highlights">
            <div><span>庫存</span><strong>${Number(product.stock || 0)}</strong></div>
            <div><span>系列</span><strong>${getProductCategory(product)}</strong></div>
            <div><span>風格</span><strong>Warm Botanical</strong></div>
          </div>

          <div class="qty-row">
            <span>數量</span>
            <div class="qty-box">
              <button type="button" onclick="changeQty(-1)">−</button>
              <input id="qty-input" type="number" min="1" value="1">
              <button type="button" onclick="changeQty(1)">＋</button>
            </div>
          </div>

          <div class="product-actions">
            <button class="btn" onclick='addToCartByData(${JSON.stringify(product)})'>加入購物車</button>
            <a class="btn btn-light" href="/cart.html">前往購物車</a>
          </div>
          <div class="mini-note">這頁也已經統一成與首頁相同的品牌氛圍與配色語言。</div>
        </div>
      </section>
    `;
  } catch (error) {
    container.innerHTML = '<div class="empty-state">商品載入失敗</div>';
  }
}

updateCartCount();
loadProductDetail();
window.changeQty = changeQty;
window.addToCartByData = addToCartByData;
