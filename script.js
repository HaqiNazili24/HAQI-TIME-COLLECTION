// Data Produk Palsu
const products = [
    { id: 'P001', name: 'Luxury Chrono Pria', category: 'pria', price: 1500000, image: 'image/download (1).jpeg', desc: 'Stainless steel, anti-air 50m' },
    { id: 'P002', name: 'Sporty Diver Pria', category: 'pria', price: 950000, image: 'image/download (2).jpeg', desc: 'Tahan banting, tali karet' },
    { id: 'W001', name: 'Elegant Rose Wanita', category: 'wanita', price: 800000, image: 'image/download (17).jpeg', desc: 'Warna rose gold, tipis dan ringan' },
    { id: 'W002', name: 'Minimalist Slim Wanita', category: 'wanita', price: 550000, image: 'image/download (19).jpeg', desc: 'Dial putih, tali kulit sintetis' },
    { id: 'U001', name: 'Retro Digital Unisex', category: 'unisex', price: 350000, image: 'image/download (18).jpeg', desc: 'Gaya 80-an, layar LCD' },
    { id: 'U002', name: 'Canvas Strap Fashion', category: 'unisex', price: 400000, image: 'image/download (27).jpeg', desc: 'Tali kanvas, cocok untuk hangout' },
    { id: 'P003', name: 'Classic Leather Pria', category: 'pria', price: 750000, image: 'image/download (4).jpeg', desc: 'Tali kulit coklat, tampilan klasik' },
    { id: 'W003', name: 'Jewel Strap Wanita', category: 'wanita', price: 1200000, image: 'image/download (28).jpeg', desc: 'Bertabur permata imitasi, mewah' },
    { id: 'U003', name: 'Modern Pilot Unisex', category: 'unisex', price: 1100000, image: 'image/download (29).jpeg', desc: 'Desain ala cockpit, maskulin' },
];

const CONTACT_NUMBER = "6285311696756"; // Ganti dengan nomor WhatsApp Anda (format: 62...)

// --- Fungsi Helper ---

/** Mengubah angka menjadi format mata uang Rupiah */
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(number);
};

// --- Fungsi Keranjang (Cart) ---

let cart = JSON.parse(localStorage.getItem('haqiTimeCart')) || [];

/** Simpan keranjang ke Local Storage */
const saveCart = () => {
    localStorage.setItem('haqiTimeCart', JSON.stringify(cart));
    updateCartDisplay();
};

/** Tambahkan produk ke keranjang */
window.addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        cartItem.qty += 1;
    } else {
        cart.push({
            id: productId,
            name: product.name,
            price: product.price,
            qty: 1
        });
    }

    saveCart();
    alert(`"${product.name}" telah ditambahkan ke keranjang!`);
};

/** Hapus item dari keranjang */
window.removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    renderCartItems();
};

/** Update kuantitas item di keranjang */
window.updateCartQuantity = (productId, change) => {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.qty += change;
        if (cartItem.qty <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            renderCartItems();
        }
    }
};

/** Render isi keranjang di Modal */
const renderCartItems = () => {
    const container = document.getElementById('cart-items-container');
    const totalElement = document.getElementById('cart-total-price');
    const emptyMessage = document.getElementById('cart-empty-message');
    container.innerHTML = '';
    let totalPrice = 0;

    if (cart.length === 0) {
        emptyMessage.style.display = 'block';
        totalElement.textContent = formatRupiah(0);
        return;
    }

    emptyMessage.style.display = 'none';

    cart.forEach(item => {
        const itemTotal = item.price * item.qty;
        totalPrice += itemTotal;
        
        const row = `
            <tr>
                <td>${item.name}</td>
                <td class="text-center">
                    <div class="input-group input-group-sm justify-content-center">
                        <button class="btn btn-outline-secondary" type="button" onclick="updateCartQuantity('${item.id}', -1)">-</button>
                        <span class="input-group-text">${item.qty}</span>
                        <button class="btn btn-outline-secondary" type="button" onclick="updateCartQuantity('${item.id}', 1)">+</button>
                    </div>
                </td>
                <td class="text-end">${formatRupiah(item.price)}</td>
                <td class="text-end">${formatRupiah(itemTotal)}</td>
                <td class="text-center">
                    <button class="btn btn-danger btn-sm" onclick="removeFromCart('${item.id}')"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
        container.innerHTML += row;
    });

    totalElement.textContent = formatRupiah(totalPrice);
};

/** Update jumlah item di ikon keranjang */
const updateCartDisplay = () => {
    const totalQty = cart.reduce((sum, item) => sum + item.qty, 0);
    document.getElementById('cart-count').textContent = totalQty;
};

// --- Fungsi Render Produk ---

/** Render produk di halaman kategori */
const renderProducts = () => {
    const categories = ['pria', 'wanita', 'unisex'];
    
    categories.forEach(category => {
        const container = document.getElementById(`${category}-products`);
        if (!container) return;

        container.innerHTML = '';
        const filteredProducts = products.filter(p => p.category === category);

        filteredProducts.forEach((product, index) => {
            const productHtml = `
                <div class="col">
                    <div class="card h-100 shadow-sm">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-title text-dark">${product.name}</h5>
                            <p class="card-text text-muted small mb-1">${product.desc}</p>
                            <p class="fs-5 fw-bold text-danger mt-auto">${formatRupiah(product.price)}</p>
                            <button class="btn btn-primary mt-2" onclick="addToCart('${product.id}')">
                                <i class="fas fa-cart-plus me-1"></i> Tambah ke Keranjang
                            </button>
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += productHtml;
        });
    });
};

// --- Fungsi WhatsApp Order ---

/** Membuat pesan WhatsApp dari isi keranjang */
const createWhatsAppMessage = () => {
    if (cart.length === 0) {
        return "Halo Haqi Time! Saya ingin bertanya tentang koleksi jam tangan Anda.";
    }

    let message = "Halo Haqi Time! Saya ingin memesan produk berikut:\n\n";
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.qty;
        total += itemTotal;
        message += `${index + 1}. ${item.name} (${item.id})\n   - Qty: ${item.qty}\n   - Total: ${formatRupiah(itemTotal)}\n`;
    });

    message += `\nTotal Keseluruhan: ${formatRupiah(total)}\n\n`;
    message += "Mohon infokan langkah selanjutnya untuk pembayaran dan pengiriman. Terima kasih!";
    
    // Encode pesan agar aman untuk URL
    return encodeURIComponent(message);
};

/** Redirect ke WhatsApp dengan pesan pre-filled */
const handleWhatsAppOrder = () => {
    const message = createWhatsAppMessage();
    const url = `https://wa.me/${CONTACT_NUMBER}?text=${message}`;
    window.open(url, '_blank');
};


// --- Event Listener dan Inisialisasi ---

document.addEventListener('DOMContentLoaded', () => {
    // 1. Render produk saat halaman dimuat
    renderProducts();

    // 2. Update tampilan keranjang saat halaman dimuat
    updateCartDisplay();
    
    // 3. Tambahkan event listener untuk tombol order WhatsApp
    document.getElementById('whatsapp-order-btn').addEventListener('click', handleWhatsAppOrder);

    // 4. Tambahkan event listener untuk tombol WhatsApp di Home (jika keranjang kosong)
    document.getElementById('whatsapp-link-home').addEventListener('click', (e) => {
        e.preventDefault();
        const message = "Halo Haqi Time, saya melihat website Anda. Saya tertarik dengan koleksi jam tangan di sana.";
        const url = `https://wa.me/${CONTACT_NUMBER}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    });

    // 5. Update isi modal keranjang setiap kali modal dibuka
    const cartModal = document.getElementById('cartModal');
    if (cartModal) {
        cartModal.addEventListener('show.bs.modal', renderCartItems);
    }

    // 6. Set nomor kontak (Opsional, untuk konsistensi)
    document.getElementById('contact-number').textContent = `0${CONTACT_NUMBER.substring(2)}`;
});