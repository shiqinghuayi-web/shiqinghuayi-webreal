
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
        <div class="product-meta">庫存：${Number(product.stock || 0)}</div>
        <p class="muted">${product.description || ''}</p>
      </div>
    </article>
  `;
}

async function loadAdminProducts() {
  const list = document.getElementById('admin-product-list');
  if (!list) return;
  try {
    const res = await fetch('/api/admin/products');
    const result = await res.json();
    const products = Array.isArray(result.data) ? result.data : [];
    list.innerHTML = products.length ? products.map(createProductCard).join('') : '<div class="empty-state">目前沒有商品資料。</div>';
  } catch (error) {
    list.innerHTML = '<div class="empty-state">後台商品載入失敗。</div>';
  }
}

document.getElementById('admin-product-form')?.addEventListener('submit', async e => {
  e.preventDefault();
  const formData = new FormData(e.currentTarget);
  const payload = {
    name: String(formData.get('name') || '').trim(),
    slug: String(formData.get('slug') || '').trim(),
    price: Number(formData.get('price') || 0),
    stock: Number(formData.get('stock') || 0),
    imageUrl: String(formData.get('imageUrl') || '').trim(),
    description: String(formData.get('description') || '').trim()
  };

  try {
    const res = await fetch('/api/admin/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (!res.ok || !result.success) throw new Error(result.message || '新增商品失敗');
    alert('商品新增成功');
    e.currentTarget.reset();
    loadAdminProducts();
  } catch (error) {
    alert(error.message || '商品新增失敗');
  }
});

updateCartCount();
loadAdminProducts();
