// Master Category Database
const categoryProducts = {
    'long-wallet': [
        {
            id: 'lw-1',
            name: "Royal Long Executive Wallet",
            rawPrice: 2499,
            price: "Rs. 2,499",
            description: "Handcrafted from full-grain leather with dual bill compartments and 12 card slots.",
            colors: {
                'Classic Black': ['sphare tallboy.jfif'],
                'Mahogany Tan': ['long tan (2).jpg']
            }
        },
        {
            id: 'lw-2',
            name: "Heritage Long Wallet",
            rawPrice: 1799,
            price: "Rs. 1,799",
            description: "Zip-around security featuring genuine leather trim.",
            colors: {
                'Deep Brown': ['long wallet  (2).jfif', 'long wallet  (1).jfif'],
                'Classic Black': ['long wallet (b) (2).jfif', 'long wallet (b) (1).jfif']
            }
        }
    ],
    'cardholder': [
        {
            id: 'ch-1',
            name: "Zlvon Classic",
            rawPrice: 1999,
            price: "Rs. 1,999",
            description: "Ultra-slim RFID-protected card wallet holding up to 8 cards.",
            colors: {
                'Matte Black': ['zlvon clasic black (1).jpg']
            }
        },
        {
            id: 'ch-2',
            name: "Minimalist Leather Card Case",
            rawPrice: 999,
            price: "Rs. 999",
            description: "Ultra-slim RFID-protected card wallet holding up to 8 cards.",
            colors: {
                'Matte Black': ['Blackout Utility Pouch (2).jfif']
            }
        }
    ],
    'leather': [
        {
            id: 'lea-1',
            name: "Full Grain Leather Folio",
            rawPrice: 1899,
            price: "Rs. 1,899",
            description: "Vintage finish leather wallet built to age gracefully.",
            colors: {
                'Matte Black': ['The Stleth fold.jfif']
            }
        }
    ],
    'classic-wallet': [
        {
            id: 'cw-1',
            name: "The Ash Crest",
            rawPrice: 1499,
            price: "Rs. 1,499",
            description: "Soft velour leather with extended slots for cards.",
            colors: {
                'Velour Black': ['the ash crest black.jpg'],
                'Velour grey': ['the ash crest.jfif'],
                'Velour brown': ['the ash crest brown.jpg']
            }
        },
        {
            id: 'cw-2',
            name: "black out mini walt.jfif",
            rawPrice: 1499,
            price: "Rs. 1,499",
            description: "Soft velour leather with dual currency sleeves.",
            colors: {
                'Velour Black': ['black out mini walt.jfif']
            }
        }
    ]
};

// Global State
let cart = [];
let currentModalProduct = null;
let selectedColorName = '';
let currentQuantity = 1;

// Category Switcher
function showCategory(categoryKey) {
    const container = document.getElementById('products-container');
    const title = document.getElementById('display-title');
    const products = categoryProducts[categoryKey] || categoryProducts['long-wallet'];

    if (title) title.innerText = categoryKey.replace('-', ' ').toUpperCase();

    if (container) {
        container.innerHTML = products.map(product => `
            <div class="product-card" onclick="openProductDetail('${categoryKey}', '${product.id}')">
                <div class="product-img" style="background-image: url('${Object.values(product.colors)[0][0]}');"></div>
                <div class="product-info">
                    <h4>${product.name}</h4>
                    <p class="price">${product.price}</p>
                    <button class="btn-cart" onclick="event.stopPropagation(); openProductDetail('${categoryKey}', '${product.id}')">ADD TO CART</button>
                </div>
            </div>
        `).join('');
    }
}

// Product Modal logic
function openProductDetail(categoryKey, productId) {
    const productList = categoryProducts[categoryKey];
    currentModalProduct = productList.find(p => p.id === productId);
    
    if (!currentModalProduct) return;

    currentQuantity = 1;
    document.getElementById('modalQty').innerText = currentQuantity;
    document.getElementById('modalTitle').innerText = currentModalProduct.name;
    document.getElementById('modalPrice').innerText = currentModalProduct.price;
    document.getElementById('modalDesc').innerText = currentModalProduct.description;

    const colorKeys = Object.keys(currentModalProduct.colors);
    selectedColorName = colorKeys[0];
    document.getElementById('modalColorLabel').innerText = selectedColorName;

    const swatchContainer = document.getElementById('modalSwatches');
    swatchContainer.innerHTML = colorKeys.map((cName, idx) => `
        <button class="color-swatch ${idx === 0 ? 'active' : ''}" title="${cName}" onclick="selectModalColor(this, '${cName}')">
            <div class="color-swatch-inner" style="background-color: ${getColorHex(cName)};"></div>
        </button>
    `).join('');

    updateModalImages(currentModalProduct.colors[selectedColorName]);
    document.getElementById('productDetailModal').classList.add('open');
}

function getColorHex(colorName) {
    const map = {
        'Classic Black': '#111111',
        'Mahogany Tan': '#8B4513',
        'Deep Brown': '#3E2723',
        'Matte Black': '#1A1A1A',
        'Saddle Tan': '#C68B59',
        'Vintage Tan': '#B06D3B',
        'Velour Black': '#222222',
        'Velour grey': '#adadad',
        'Velour brown': '#d87625',
    };
    return map[colorName] || '#555555';
}

function selectModalColor(element, colorName) {
    document.querySelectorAll('#modalSwatches .color-swatch').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    selectedColorName = colorName;
    document.getElementById('modalColorLabel').innerText = colorName;
    updateModalImages(currentModalProduct.colors[colorName]);
}

function updateModalImages(images) {
    if (!images || images.length === 0) return;
    document.getElementById('modalMainImg').src = images[0];

    const thumbContainer = document.getElementById('modalThumbnails');
    thumbContainer.innerHTML = images.map((img, idx) => `
        <button class="thumb-btn ${idx === 0 ? 'active' : ''}" onclick="switchModalMainImg(this, '${img}')">
            <img src="${img}" alt="Thumbnail">
        </button>
    `).join('');
}

function switchModalMainImg(element, imgUrl) {
    document.querySelectorAll('#modalThumbnails .thumb-btn').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    document.getElementById('modalMainImg').src = imgUrl;
}

function adjustModalQty(delta) {
    currentQuantity = Math.max(1, currentQuantity + delta);
    document.getElementById('modalQty').innerText = currentQuantity;
}

function closeProductDetail() {
    document.getElementById('productDetailModal').classList.remove('open');
}

// Cart Drawer System
function addModalProductToCart() {
    const cartItem = {
        id: currentModalProduct.id,
        name: currentModalProduct.name,
        price: currentModalProduct.rawPrice,
        color: selectedColorName,
        qty: currentQuantity,
        img: currentModalProduct.colors[selectedColorName][0]
    };

    const existingIndex = cart.findIndex(item => item.id === cartItem.id && item.color === cartItem.color);
    if (existingIndex > -1) {
        cart[existingIndex].qty += currentQuantity;
    } else {
        cart.push(cartItem);
    }

    updateCartUI();
    closeProductDetail();
    openCartDrawer();
}

function updateCartUI() {
    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    document.getElementById('cartBadgeCount').innerText = totalCount;
    document.getElementById('drawerCartCount').innerText = totalCount;
    document.getElementById('cartSubtotal').innerText = `Rs. ${subtotal.toLocaleString()}`;

    const itemsContainer = document.getElementById('cartItemsList');
    if (cart.length === 0) {
        itemsContainer.innerHTML = `<p style="text-align:center; color: var(--text-secondary);">Your cart is empty.</p>`;
        return;
    }

    itemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <img src="${item.img}" alt="${item.name}">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-color">Color: ${item.color}</div>
                <div class="cart-item-price">Rs. ${item.price} x ${item.qty}</div>
            </div>
            <button class="cart-remove-btn" onclick="removeFromCart(${index})"><i class="fa-solid fa-trash"></i></button>
        </div>
    `).join('');
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function openCartDrawer() {
    document.getElementById('cartDrawer').classList.add('open');
}

function closeCartDrawer() {
    document.getElementById('cartDrawer').classList.remove('open');
}

// Checkout Modal logic
function openCheckoutModal() {
    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const totalCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    document.getElementById('summaryCount').innerText = totalCount;
    document.getElementById('summaryTotal').innerText = `Rs. ${subtotal.toLocaleString()}`;

    closeCartDrawer();
    document.getElementById('checkoutModal').classList.add('open');
}

function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('open');
}

function handleOrderSubmission(event) {
    event.preventDefault();

    const name = document.getElementById('custName').value;
    const phone = document.getElementById('custPhone').value;
    const address = document.getElementById('custAddress').value;
    const method = document.getElementById('payMethod').value;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);

    if (method === 'WhatsApp') {
        let msg = `Hello Zlvon Store! I would like to place an order:\n\n`;
        cart.forEach(item => {
            msg += `- ${item.name} (${item.color}) x ${item.qty}\n`;
        });
        msg += `\nTotal: Rs. ${subtotal.toLocaleString()}\n`;
        msg += `Name: ${name}\nPhone: ${phone}\nAddress: ${address}`;

        window.open(`https://wa.me/923404122968?text=${encodeURIComponent(msg)}`, '_blank');
    } else {
        alert(`Thank you ${name}! Your Order (COD) has been placed successfully.`);
    }

    cart = [];
    updateCartUI();
    closeCheckoutModal();
}

// App Init
document.addEventListener('DOMContentLoaded', () => {
    showCategory('long-wallet');
});
// Sale Closure Clock Logic (12-Hour Perpetual Countdown Loop)
function startSaleCountdown() {
    // Set target time 8 hours from initial page load
    let targetTime = new Date().getTime() + (8 * 60 * 60 * 1000) + (45 * 60 * 1000);

    const timerInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = targetTime - now;

        if (distance < 0) {
            // Reset timer automatically when it reaches zero
            targetTime = new Date().getTime() + (12 * 60 * 60 * 1000);
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        const hoursEl = document.getElementById('timer-hours');
        const minutesEl = document.getElementById('timer-minutes');
        const secondsEl = document.getElementById('timer-seconds');

        if (hoursEl) hoursEl.innerText = hours < 10 ? '0' + hours : hours;
        if (minutesEl) minutesEl.innerText = minutes < 10 ? '0' + minutes : minutes;
        if (secondsEl) secondsEl.innerText = seconds < 10 ? '0' + seconds : seconds;
    }, 1000);
}

// Add startSaleCountdown() inside your DOMContentLoaded listener in script.js
document.addEventListener('DOMContentLoaded', () => {
    startSaleCountdown();
});