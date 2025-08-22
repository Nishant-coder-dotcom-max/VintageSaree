// Logo Animation and Language Switcher for Vintage Saree House

document.addEventListener('DOMContentLoaded', function () {
    // Logo Animation
    const overlay = document.getElementById('logo-animation-overlay');
    const logo = document.getElementById('vintage-logo');
    const logoTitle = document.getElementById('logo-title');
    const langSwitcher = document.querySelector('.language-switcher');

    // Hide language switcher initially
    langSwitcher.style.opacity = 0;
    langSwitcher.style.pointerEvents = 'none';

    // Animate logo (draw circle, fade in text)
    const circle = logo.querySelector('circle');
    const text = logo.querySelector('text');
    circle.style.strokeDasharray = circle.getTotalLength();
    circle.style.strokeDashoffset = circle.getTotalLength();
    text.style.opacity = 0;
    logoTitle.style.opacity = 0;

    // Animate circle drawing
    setTimeout(() => {
        circle.style.transition = 'stroke-dashoffset 1.2s ease';
        circle.style.strokeDashoffset = 0;
    }, 200);

    // Fade in text and title
    setTimeout(() => {
        text.style.transition = 'opacity 0.8s';
        text.style.opacity = 1;
        logoTitle.style.transition = 'opacity 0.8s';
        logoTitle.style.opacity = 1;
    }, 1500);

    // Fade out overlay, reveal language switcher
    setTimeout(() => {
        overlay.style.transition = 'opacity 1s';
        overlay.style.opacity = 0;
        setTimeout(() => {
            overlay.style.display = 'none';
            // Unique reveal for language switcher
            langSwitcher.style.transition = 'opacity 1s cubic-bezier(.68,-0.55,.27,1.55)';
            langSwitcher.style.opacity = 1;
            langSwitcher.style.pointerEvents = 'auto';
            langSwitcher.classList.add('vintage-reveal');
        }, 1000);
    }, 2500);

    // Language Switcher Logic
    const langEn = document.getElementById('lang-en');
    const langBn = document.getElementById('lang-bn');
    let currentLang = 'en';

    function switchLanguage(lang) {
        currentLang = lang;
        // Update active button
        langEn.classList.toggle('active', lang === 'en');
        langBn.classList.toggle('active', lang === 'bn');
        // Update all elements with data-en/data-bn
        document.querySelectorAll('[data-en]').forEach(el => {
            el.textContent = el.getAttribute(lang === 'en' ? 'data-en' : 'data-bn');
        });
        // Hide language switcher after selection
        langSwitcher.style.transition = 'opacity 0.7s';
        langSwitcher.style.opacity = 0;
        setTimeout(() => {
            langSwitcher.style.display = 'none';
        }, 700);
    }

    langEn.addEventListener('click', () => switchLanguage('en'));
    langBn.addEventListener('click', () => switchLanguage('bn'));

    // Optionally, auto-detect browser language
    // let browserLang = navigator.language.startsWith('bn') ? 'bn' : 'en';
    // switchLanguage(browserLang);

    // Default to English
    switchLanguage('en');

    // --- Cart, Reviews, and Delivery Time Logic ---
    const cartDrawer = document.getElementById('cart-drawer');
    const cartItemsContainer = cartDrawer.querySelector('.cart-items');
    const cartTotal = cartDrawer.querySelector('.cart-total');
    const cartBtn = document.querySelector('.nav-links li a[data-en="Cart"]');
    const authNavLink = document.querySelector('.nav-links li a[href="#login"]');
    const ordersNavLink = document.querySelector('.nav-links li a[href="#orders"]');
    const closeCartBtn = cartDrawer.querySelector('.close-cart');
    let cart = JSON.parse(localStorage.getItem('vintageCart') || '[]');

    function openCart() {
        cartDrawer.classList.add('open');
    }
    function closeCart() {
        cartDrawer.classList.remove('open');
    }
    cartBtn.addEventListener('click', (e) => { e.preventDefault(); openCart(); });
    closeCartBtn.addEventListener('click', closeCart);

    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;
        cart.forEach((item, idx) => {
            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
                <img src="${item.img}" class="cart-item-img" alt="${item.name}" />
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">${item.price}</div>
                </div>
                <button class="remove-cart-item" data-idx="${idx}">&times;</button>
            `;
            cartItemsContainer.appendChild(div);
            total += parseInt(item.price.replace(/[^\d]/g, ''));
        });
        cartTotal.textContent = `₹${total}`;
        // Remove item
        cartItemsContainer.querySelectorAll('.remove-cart-item').forEach(btn => {
            btn.onclick = function() {
                cart.splice(parseInt(btn.dataset.idx), 1);
                localStorage.setItem('vintageCart', JSON.stringify(cart));
                updateCart();
            };
        });
    }
    updateCart();

    // Add to Cart buttons
    document.querySelectorAll('.add-cart-btn').forEach((btn, idx) => {
        btn.addEventListener('click', function() {
            const card = btn.closest('.saree-card');
            const name = card.querySelector('.saree-name').textContent;
            const price = card.querySelector('.saree-price').textContent;
            const img = card.querySelector('img').src;
            cart.push({ name, price, img });
            localStorage.setItem('vintageCart', JSON.stringify(cart));
            updateCart();
            openCart();
        });
    });

    // Quick actions: Wishlist and Save for Later on each card
    document.querySelectorAll('.saree-card').forEach(card => {
        const actionsBar = document.createElement('div');
        actionsBar.style.display = 'flex'; actionsBar.style.gap = '6px'; actionsBar.style.marginTop = '6px';
        const makeBtn = (label) => { const b=document.createElement('button'); b.className='btn-small'; b.textContent=label; return b; };
        const wishBtn = makeBtn('Wishlist');
        const saveBtn = makeBtn('Save for Later');
        actionsBar.appendChild(wishBtn); actionsBar.appendChild(saveBtn);
        card.querySelector('.saree-info').appendChild(actionsBar);
        wishBtn.addEventListener('click', ()=>{
            const name = card.querySelector('.saree-name').textContent;
            const price = card.querySelector('.saree-price').textContent;
            const img = card.querySelector('img').src;
            const list = getWishlist(); list.push({name, price, img}); setWishlist(list);
        });
        saveBtn.addEventListener('click', ()=>{
            const name = card.querySelector('.saree-name').textContent;
            const price = card.querySelector('.saree-price').textContent;
            const img = card.querySelector('img').src;
            const list = getSaved(); list.push({name, price, img}); setSaved(list);
        });
    });

    // --- Checkout Functionality ---
    const checkoutModal = document.getElementById('checkout-modal');
    const closeCheckoutBtn = checkoutModal.querySelector('.close-checkout');
    const checkoutSteps = checkoutModal.querySelectorAll('.checkout-step');
    const nextStepBtns = checkoutModal.querySelectorAll('.next-step-btn');
    const prevStepBtns = checkoutModal.querySelectorAll('.prev-step-btn');
    const placeOrderBtn = checkoutModal.querySelector('.place-order-btn');
    const paymentMethodRadios = checkoutModal.querySelectorAll('input[name="paymentMethod"]');
    const paymentDetails = document.getElementById('payment-details');
    const orderItems = checkoutModal.querySelector('.order-items');
    const subtotalAmount = checkoutModal.querySelector('.subtotal-amount');
    const finalAmount = checkoutModal.querySelector('.final-amount');
    let currentStep = 1;

    function openCheckout() {
        if (cart.length === 0) {
            alert(currentLang === 'en' ? 'Your cart is empty!' : 'আপনার কার্ট খালি!');
            return;
        }
        checkoutModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        updateOrderSummary();
        showPaymentDetails();
        
        // Load saved shipping info if available
        loadSavedShippingInfo();
    }

    function closeCheckout() {
        checkoutModal.classList.remove('open');
        document.body.style.overflow = '';
        resetCheckout();
    }

    function resetCheckout() {
        currentStep = 1;
        checkoutSteps.forEach((step, idx) => {
            step.classList.toggle('active', idx === 0);
        });
        checkoutModal.querySelector('form').reset();
        paymentDetails.innerHTML = '';
        updateProgressIndicator();
    }

    function updateProgressIndicator() {
        const progressSteps = checkoutModal.querySelectorAll('.progress-step');
        progressSteps.forEach((step, idx) => {
            const stepNum = idx + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNum < currentStep) {
                step.classList.add('completed');
            } else if (stepNum === currentStep) {
                step.classList.add('active');
            }
        });
    }

    function nextStep() {
        if (currentStep < 3) {
            if (validateCurrentStep()) {
                checkoutSteps[currentStep - 1].classList.remove('active');
                currentStep++;
                checkoutSteps[currentStep - 1].classList.add('active');
                updateProgressIndicator();
                if (currentStep === 3) {
                    updateOrderSummary();
                }
            }
        }
    }

    function prevStep() {
        if (currentStep > 1) {
            checkoutSteps[currentStep - 1].classList.remove('active');
            currentStep--;
            checkoutSteps[currentStep - 1].classList.add('active');
            updateProgressIndicator();
        }
    }

    function validateCurrentStep() {
        if (currentStep === 1) {
            const form = checkoutModal.querySelector('.shipping-form');
            if (!form.checkValidity()) {
                // Show validation errors
                form.reportValidity();
                return false;
            }
            
            // Additional custom validation
            const phone = form.querySelector('input[name="phone"]').value;
            const pincode = form.querySelector('input[name="pincode"]').value;
            
            if (phone.length < 10) {
                alert(currentLang === 'en' ? 'Please enter a valid phone number' : 'একটি বৈধ ফোন নম্বর লিখুন');
                return false;
            }
            
            if (pincode.length !== 6 || !/^\d{6}$/.test(pincode)) {
                alert(currentLang === 'en' ? 'Please enter a valid 6-digit pincode' : 'একটি বৈধ ৬-অঙ্কের পিনকোড লিখুন');
                return false;
            }
            
            return true;
        }
        return true;
    }

    function showPaymentDetails() {
        const selectedMethod = checkoutModal.querySelector('input[name="paymentMethod"]:checked').value;
        let detailsHTML = '';

        switch (selectedMethod) {
            case 'cod':
                detailsHTML = `
                    <div class="payment-info">
                        <p data-en="Pay when you receive your order" data-bn="আপনার অর্ডার পাওয়ার সময় পেমেন্ট করুন">Pay when you receive your order</p>
                        <p data-en="No additional charges" data-bn="কোন অতিরিক্ত চার্জ নেই">No additional charges</p>
                    </div>
                `;
                break;
            case 'upi':
                detailsHTML = `
                    <div class="payment-info">
                        <p data-en="UPI ID: vintage@saree" data-bn="ইউপিআই আইডি: vintage@saree">UPI ID: vintage@saree</p>
                        <p data-en="Scan QR code or use UPI ID" data-bn="কিউআর কোড স্ক্যান করুন বা ইউপিআই আইডি ব্যবহার করুন">Scan QR code or use UPI ID</p>
                    </div>
                `;
                break;
            case 'card':
                detailsHTML = `
                    <div class="payment-info">
                        <p data-en="Secure card payment" data-bn="নিরাপদ কার্ড পেমেন্ট">Secure card payment</p>
                        <p data-en="Visa, MasterCard, RuPay accepted" data-bn="ভিসা, মাস্টারকার্ড, রুপে স্বীকৃত">Visa, MasterCard, RuPay accepted</p>
                    </div>
                `;
                break;
        }
        paymentDetails.innerHTML = detailsHTML;
    }

    function updateOrderSummary() {
        let subtotal = 0;
        orderItems.innerHTML = '';

        cart.forEach(item => {
            const price = parseInt(item.price.replace(/[^\d]/g, ''));
            subtotal += price;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'order-item';
            itemDiv.innerHTML = `
                <img src="${item.img}" alt="${item.name}" class="order-item-img" />
                <div class="order-item-info">
                    <div class="order-item-name">${item.name}</div>
                    <div class="order-item-price">${item.price}</div>
                </div>
            `;
            orderItems.appendChild(itemDiv);
        });

        subtotalAmount.textContent = `₹${subtotal}`;
        finalAmount.textContent = `₹${subtotal + 50}`;
    }

    // API Configuration - Uses config.js
    const API_BASE_URL = window.VintageSareeConfig ? window.VintageSareeConfig.API_BASE_URL : 'http://localhost:5000';

    async function placeOrder() {
        try {
            const shippingForm = checkoutModal.querySelector('.shipping-form');
            if (!shippingForm) throw new Error('Shipping form not found');
            
            const formData = new FormData(shippingForm);
            const selectedPaymentEl = checkoutModal.querySelector('input[name="paymentMethod"]:checked');
            
            // Validate required fields
            const fullName = formData.get('fullName');
            const phone = formData.get('phone');
            const address = formData.get('address');
            const city = formData.get('city');
            const state = formData.get('state');
            const pincode = formData.get('pincode');
            
            if (!fullName || !phone || !address || !city || !state || !pincode) {
                alert(currentLang === 'en' ? 'Please fill in all required fields' : 'সব প্রয়োজনীয় ক্ষেত্র পূরণ করুন');
                return;
            }
            
            if (!selectedPaymentEl) {
                alert(currentLang === 'en' ? 'Please select a payment method' : 'একটি পেমেন্ট পদ্ধতি নির্বাচন করুন');
                return;
            }

            // Calculate total
            const total = (function() {
                const displayed = parseInt((finalAmount?.textContent || '').replace(/[^\d]/g, ''));
                if (!isNaN(displayed) && displayed > 0) return displayed;
                const computedSubtotal = (cart || []).reduce((sum, it) => {
                    const p = parseInt((it.price || '').replace(/[^\d]/g, ''));
                    return sum + (isNaN(p) ? 0 : p);
                }, 0);
                return computedSubtotal + 50;
            })();

            // Prepare order data for backend API
            const orderData = {
                name: fullName,
                phone: phone,
                items: cart.map(item => ({
                    name: item.name,
                    price: parseInt(item.price.replace(/[^\d]/g, '')),
                    quantity: item.quantity || 1,
                    image: item.img || item.image
                })),
                totalAmount: total,
                shippingAddress: {
                    street: address,
                    city: city,
                    state: state,
                    pincode: pincode
                }
            };

            // Send order to backend API
            const response = await fetch(`${API_BASE_URL}/api/orders`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData)
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Failed to create order');
            }

            // Create frontend order object for localStorage
            const frontendOrderData = {
                items: cart,
                shipping: {
                    fullName: fullName,
                    phone: phone,
                    email: formData.get('email'),
                    address: address,
                    city: city,
                    state: state,
                    pincode: pincode
                },
                payment: selectedPaymentEl.value,
                total: total,
                orderId: result.order.orderId, // Use backend-generated orderId
                date: new Date().toLocaleDateString(),
                status: 'pending'
            };

            // Save order to localStorage
            try {
                let ordersRaw = localStorage.getItem('vintageOrders');
                let orders = [];
                try { orders = ordersRaw ? JSON.parse(ordersRaw) : []; } catch (_) { orders = []; }
                if (!Array.isArray(orders)) orders = [];
                orders.push(frontendOrderData);
                localStorage.setItem('vintageOrders', JSON.stringify(orders));
            } catch (e) { console.warn('Saving orders failed, continuing', e); }

            // Clear cart and update UI
            cart = [];
            try { localStorage.setItem('vintageCart', JSON.stringify(cart)); } catch (_) {}
            updateCart();

            // Show success modal
            try { showOrderSuccess(frontendOrderData); } catch (e) { console.error('Show success modal failed', e); }
            const modalEl = document.getElementById('order-success-modal');
            if (modalEl) { modalEl.classList.add('open'); document.body.style.overflow = 'hidden'; }

            // Close checkout after showing success
            closeCheckout();
        } catch (error) {
            console.error('Error placing order:', error);
            const msg = (error && error.message) ? error.message : (currentLang === 'en' ? 'Unknown error' : 'অজানা ত্রুটি');
            alert((currentLang === 'en' ? 'Error placing order: ' : 'অর্ডার ত্রুটি: ') + msg);
        }
    }

    // Save shipping info for future use
    function saveShippingInfo() {
        const form = checkoutModal.querySelector('.shipping-form');
        const formData = new FormData(form);
        const shippingInfo = {
            fullName: formData.get('fullName'),
            phone: formData.get('phone'),
            email: formData.get('email'),
            address: formData.get('address'),
            city: formData.get('city'),
            state: formData.get('state'),
            pincode: formData.get('pincode')
        };
        localStorage.setItem('vintageShippingInfo', JSON.stringify(shippingInfo));
    }

    function loadSavedShippingInfo() {
        const savedInfo = localStorage.getItem('vintageShippingInfo');
        if (savedInfo) {
            try {
                const info = JSON.parse(savedInfo);
                const form = checkoutModal.querySelector('.shipping-form');
                Object.keys(info).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input && info[key]) {
                        input.value = info[key];
                    }
                });
            } catch (e) {
                // Ignore parsing errors
            }
        }
    }

    // Auto-save shipping info when form changes
    function setupFormAutoSave() {
        const form = checkoutModal.querySelector('.shipping-form');
        if (form) {
            form.addEventListener('input', () => {
                // Debounce the save operation
                clearTimeout(window.shippingSaveTimeout);
                window.shippingSaveTimeout = setTimeout(saveShippingInfo, 1000);
            });
        }
    }

    // Show estimated delivery time based on pincode
    function showDeliveryEstimate(pincode) {
        const deliveryInfo = checkoutModal.querySelector('.delivery-estimate');
        if (!deliveryInfo) return;

        if (pincode.length === 6) {
            // Simple logic: first digit determines region
            const firstDigit = parseInt(pincode.charAt(0));
            let estimate = '';
            
            if ([1, 2, 3, 4, 5, 6, 7].includes(firstDigit)) {
                estimate = currentLang === 'en' ? '1-2 days' : '১-২ দিন';
            } else if ([8, 9].includes(firstDigit)) {
                estimate = currentLang === 'en' ? '2-3 days' : '২-৩ দিন';
            } else {
                estimate = currentLang === 'en' ? '3-5 days' : '৩-৫ দিন';
            }
            
            deliveryInfo.textContent = currentLang === 'en' 
                ? `Estimated Delivery: ${estimate}` 
                : `আনুমানিক ডেলিভারি: ${estimate}`;
            deliveryInfo.style.display = 'block';
        } else {
            deliveryInfo.style.display = 'none';
        }
    }

    // Event listeners
    if (closeCheckoutBtn) closeCheckoutBtn.addEventListener('click', closeCheckout);
    if (placeOrderBtn) placeOrderBtn.addEventListener('click', placeOrder);
    
    nextStepBtns.forEach(btn => btn.addEventListener('click', nextStep));
    prevStepBtns.forEach(btn => btn.addEventListener('click', prevStep));
    
    paymentMethodRadios.forEach(radio => {
        radio.addEventListener('change', showPaymentDetails);
    });

    // Setup form auto-save
    setupFormAutoSave();

    // Setup pincode delivery estimate
    const pincodeInput = checkoutModal.querySelector('input[name="pincode"]');
    if (pincodeInput) {
        pincodeInput.addEventListener('input', (e) => {
            showDeliveryEstimate(e.target.value);
        });
    }

    // Connect checkout button in cart to checkout modal
    const cartCheckoutBtn = cartDrawer.querySelector('.checkout-btn');
    if (cartCheckoutBtn) {
        cartCheckoutBtn.addEventListener('click', openCheckout);
    }

    function generateOrderId() {
        const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
        let rand = '';
        for (let i = 0; i < 6; i++) {
            rand += alphabet[Math.floor(Math.random() * alphabet.length)];
        }
        const ts = new Date();
        const y = String(ts.getFullYear()).slice(-2);
        const m = String(ts.getMonth()+1).padStart(2,'0');
        const d = String(ts.getDate()).padStart(2,'0');
        return `VS-${y}${m}${d}-${rand}`;
    }

    // --- Order Success Modal ---
    const orderSuccessModal = document.getElementById('order-success-modal');
    const successCloseBtn = orderSuccessModal.querySelector('.success-close-btn');
    const successOrderId = orderSuccessModal.querySelector('#success-order-id');
    const successOrderDate = orderSuccessModal.querySelector('#success-order-date');
    const successOrderTotal = orderSuccessModal.querySelector('#success-order-total');

    function showOrderSuccess(orderData) {
        successOrderId.textContent = orderData.orderId;
        successOrderDate.textContent = orderData.date;
        successOrderTotal.textContent = `₹${orderData.total}`;
        orderSuccessModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        try {
            const audio = document.getElementById('order-success-sound');
            if (audio && typeof audio.play === 'function') { audio.currentTime = 0; audio.play().catch(() => {}); }
        } catch (_) {}
    }

    function closeOrderSuccess() {
        orderSuccessModal.classList.remove('open');
        document.body.style.overflow = '';
    }

    if (successCloseBtn) {
        successCloseBtn.addEventListener('click', closeOrderSuccess);
    }
    const successOrdersBtn = document.querySelector('.success-orders-btn');
    if (successOrdersBtn) successOrdersBtn.addEventListener('click', () => { try { closeOrderSuccess(); } catch(_){} openOrders(); });

    // --- Review Logic ---
    const reviewModal = document.getElementById('review-modal');
    const closeReviewBtn = reviewModal.querySelector('.close-review');
    const reviewsList = reviewModal.querySelector('.reviews-list');
    const reviewForm = reviewModal.querySelector('.review-form');
    let currentReviewSareeIdx = null;

    // Open review modal for a saree
    document.querySelectorAll('.review-btn').forEach((btn, idx) => {
        btn.addEventListener('click', function() {
            currentReviewSareeIdx = idx;
            showReviews(idx);
            reviewModal.classList.add('open');
        });
    });
    closeReviewBtn.addEventListener('click', () => {
        reviewModal.classList.remove('open');
    });

    function getReviews() {
        return JSON.parse(localStorage.getItem('vintageReviews') || '[]');
    }
    function setReviews(reviews) {
        localStorage.setItem('vintageReviews', JSON.stringify(reviews));
    }
    function showReviews(idx) {
        const reviews = getReviews();
        const sareeReviews = reviews[idx] || [];
        reviewsList.innerHTML = sareeReviews.length ? '' : `<div data-en="No reviews yet." data-bn="এখনও কোনো রিভিউ নেই।">No reviews yet.</div>`;
        sareeReviews.forEach(r => {
            const div = document.createElement('div');
            div.className = 'review-item';
            div.innerHTML = `
                <div class="review-item-name">${r.name}</div>
                <div class="review-item-rating">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</div>
                <div class="review-item-comment">${r.comment}</div>
            `;
            reviewsList.appendChild(div);
        });
    }
    reviewForm.onsubmit = function(e) {
        e.preventDefault();
        const name = reviewForm.querySelector('.reviewer-name').value;
        const rating = parseInt(reviewForm.querySelector('.review-rating').value);
        const comment = reviewForm.querySelector('.review-comment').value;
        let reviews = getReviews();
        if (!reviews[currentReviewSareeIdx]) reviews[currentReviewSareeIdx] = [];
        reviews[currentReviewSareeIdx].push({ name, rating, comment });
        setReviews(reviews);
        showReviews(currentReviewSareeIdx);
        reviewForm.reset();
    };

    // --- Delivery Time Logic ---
    function setDeliveryTimes(city) {
        document.querySelectorAll('.delivery-time').forEach(el => {
            if (["samudragarh", "nabadwip", "kalna"].includes(city)) {
                el.setAttribute('data-en', 'Delivery: 1-2 days');
                el.setAttribute('data-bn', 'ডেলিভারি: ১-২ দিন');
                el.textContent = (currentLang === 'en') ? 'Delivery: 1-2 days' : 'ডেলিভারি: ১-২ দিন';
            } else {
                el.setAttribute('data-en', 'Delivery: 3-5 days');
                el.setAttribute('data-bn', 'ডেলিভারি: ৩-৫ দিন');
                el.textContent = (currentLang === 'en') ? 'Delivery: 3-5 days' : 'ডেলিভারি: ৩-৫ দিন';
            }
        });
    }
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(pos) {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            // Use a free reverse geocoding API to get city (for demo, use Nominatim)
            fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`).then(r => r.json()).then(data => {
                let city = (data.address.city || data.address.town || data.address.village || '').toLowerCase();
                setDeliveryTimes(city);
            }).catch(() => setDeliveryTimes(''));
        }, () => setDeliveryTimes(''));
    } else {
        setDeliveryTimes('');
    }

    // --- Language Switcher Update for Dynamic Content ---
    function updateDynamicLang() {
        // Update cart drawer
        cartDrawer.querySelectorAll('[data-en]').forEach(el => {
            el.textContent = el.getAttribute(currentLang === 'en' ? 'data-en' : 'data-bn');
        });
        // Update review modal
        reviewModal.querySelectorAll('[data-en]').forEach(el => {
            el.textContent = el.getAttribute(currentLang === 'en' ? 'data-en' : 'data-bn');
        });
        // Update checkout modal
        if (checkoutModal) {
            checkoutModal.querySelectorAll('[data-en]').forEach(el => {
                el.textContent = el.getAttribute(currentLang === 'en' ? 'data-en' : 'data-bn');
            });
        }
        // Update order success modal
        if (orderSuccessModal) {
            orderSuccessModal.querySelectorAll('[data-en]').forEach(el => {
                el.textContent = el.getAttribute(currentLang === 'en' ? 'data-en' : 'data-bn');
            });
        }
        // Update delivery time
        document.querySelectorAll('.delivery-time').forEach(el => {
            el.textContent = el.getAttribute(currentLang === 'en' ? 'data-en' : 'data-bn');
        });
        // Update category filter buttons (if present)
        const cf = document.getElementById('category-filter');
        if (cf) {
            cf.querySelectorAll('.category-btn').forEach(el => {
                el.textContent = el.getAttribute(currentLang === 'en' ? 'data-en' : 'data-bn');
            });
        }
    }
    // Patch language switcher to update dynamic content
    [langEn, langBn].forEach(btn => btn.addEventListener('click', updateDynamicLang));

    // Language Chooser Modal Logic
    const langModal = document.getElementById('lang-modal');
    const modalLangEn = document.getElementById('modal-lang-en');
    const modalLangBn = document.getElementById('modal-lang-bn');

    function showLangModal() {
        langModal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
    }
    function hideLangModal() {
        langModal.style.opacity = 0;
        setTimeout(() => {
            langModal.style.display = 'none';
            document.body.style.overflow = '';
        }, 500);
    }

    // Only show modal if not already chosen
    if (!localStorage.getItem('vintageLangChosen')) {
        showLangModal();
    }
    modalLangEn.addEventListener('click', () => {
        switchLanguage('en');
        hideLangModal();
        localStorage.setItem('vintageLangChosen', 'en');
    });
    modalLangBn.addEventListener('click', () => {
        switchLanguage('bn');
        hideLangModal();
        localStorage.setItem('vintageLangChosen', 'bn');
    });
    // If already chosen, set language on load
    if (localStorage.getItem('vintageLangChosen')) {
        switchLanguage(localStorage.getItem('vintageLangChosen'));
    }

    // --- Auth (Phone-based OTP via Firebase) ---
    const authModal = document.getElementById('auth-modal');
    const closeAuthBtn = document.querySelector('.close-auth');
    const authTabs = document.querySelectorAll('.auth-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const authMsg = document.querySelector('.auth-msg');
    const sendOtpLoginBtn = document.querySelector('.send-otp-login');
    const resendOtpLoginBtn = document.querySelector('.resend-otp-login');
    const sendOtpRegisterBtn = document.querySelector('.send-otp-register');
    const resendOtpRegisterBtn = document.querySelector('.resend-otp-register');
    const phoneLoginInput = document.querySelector('.auth-phone-login');
    const phoneRegisterInput = document.querySelector('.auth-phone-register');
    const countryLoginSelect = document.querySelector('.country-code-login');
    const countryRegisterSelect = document.querySelector('.country-code-register');
    const otpLoginInput = document.querySelector('.auth-otp-login');
    const otpRegisterInput = document.querySelector('.auth-otp-register');
    const otpHintLogin = document.querySelector('.otp-hint-login');
    const otpHintRegister = document.querySelector('.otp-hint-register');
    const otpTimerLogin = document.querySelector('.otp-timer-login');
    const otpTimerRegister = document.querySelector('.otp-timer-register');
    let recaptchaLoginVerifier = null;
    let recaptchaRegisterVerifier = null;
    let recaptchaLoginWidgetId = null;
    let recaptchaRegisterWidgetId = null;
    let confirmationResultLogin = null;
    let confirmationResultRegister = null;
    let loginCountdown = null;
    let registerCountdown = null;

    // Default country code to +91 on load
    try {
        if (countryLoginSelect && !countryLoginSelect.value) countryLoginSelect.value = '+91';
        if (countryRegisterSelect && !countryRegisterSelect.value) countryRegisterSelect.value = '+91';
    } catch (_) {}

    function openAuth() {
        authModal.classList.add('open');
        document.body.style.overflow = 'hidden';
        // Ensure visible reCAPTCHA on modal open for reliability on some devices
        try { ensureRecaptcha(true); } catch (_) {}
    }
    function closeAuth() {
        authModal.classList.remove('open');
        document.body.style.overflow = '';
        authMsg.textContent = '';
    }
    if (authNavLink) {
        authNavLink.addEventListener('click', (e) => { e.preventDefault(); if (!getCurrentUser()) openAuth(); else handleLogout(); });
    }
    if (closeAuthBtn) closeAuthBtn.addEventListener('click', closeAuth);

    // Tabs toggle
    authTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            authTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const target = tab.getAttribute('data-target');
            if (target === 'login') {
                loginForm.classList.remove('hidden');
                registerForm.classList.add('hidden');
            } else {
                registerForm.classList.remove('hidden');
                loginForm.classList.add('hidden');
            }
            authMsg.textContent = '';
        });
    });

    // Helpers
    function normalizePhoneE164(phone, preferredCode) {
        let p = (phone || '').replace(/\s+/g, '');
        if (!p.startsWith('+')) {
            // Assume India country code if not provided
            const cc = (preferredCode && preferredCode.startsWith('+')) ? preferredCode : '+91';
            p = cc + p.replace(/[^\d]/g, '').slice(-10);
        }
        return p;
    }
    function startTimer(which) {
        let secs = 30;
        const disableBtn = which === 'login' ? resendOtpLoginBtn : resendOtpRegisterBtn;
        const timerEl = which === 'login' ? otpTimerLogin : otpTimerRegister;
        if (disableBtn) disableBtn.disabled = true;
        if (timerEl) timerEl.textContent = `(${secs}s)`;
        const handler = setInterval(() => {
            secs -= 1;
            if (timerEl) timerEl.textContent = `(${secs}s)`;
            if (secs <= 0) {
                clearInterval(handler);
                if (timerEl) timerEl.textContent = '';
                if (disableBtn) disableBtn.disabled = false;
            }
        }, 1000);
        if (which === 'login') loginCountdown = handler; else registerCountdown = handler;
    }

    function setCurrentUser(phone) { localStorage.setItem('vintageCurrentUser', phone); }
    function getCurrentUser() { return localStorage.getItem('vintageCurrentUser'); }
    function clearCurrentUser() { localStorage.removeItem('vintageCurrentUser'); }
    function updateAuthNav() {
        if (!authNavLink) return;
        const user = getCurrentUser();
        if (user) {
            authNavLink.setAttribute('data-en', 'Logout');
            authNavLink.setAttribute('data-bn', 'লগআউট');
            authNavLink.textContent = (currentLang === 'en') ? 'Logout' : 'লগআউট';
        } else {
            authNavLink.setAttribute('data-en', 'Login/Register');
            authNavLink.setAttribute('data-bn', 'লগইন/রেজিস্টার');
            authNavLink.textContent = (currentLang === 'en') ? 'Login/Register' : 'লগইন/রেজিস্টার';
        }
    }
    function handleLogout() {
        try { if (window.firebase && window.firebase.auth) { window.firebase.auth().signOut(); } } catch (_) {}
        clearCurrentUser();
        updateAuthNav();
        authMsg.textContent = '';
    }

    // Initialize Firebase (guard against empty config)
    try {
        if (window.firebase && window.firebase.initializeApp) {
            const cfg = window.firebaseConfig;
            if (cfg && typeof cfg.apiKey === 'string' && cfg.apiKey.length > 0) {
                if (!window.firebase.apps || !window.firebase.apps.length) {
                    window.firebase.initializeApp(cfg);
                }
            }
        }
    } catch (e) { /* ignore */ }

    function ensureRecaptcha(visible = false) {
        if (window.firebase && window.firebase.auth) {
            if (!recaptchaLoginVerifier) {
                recaptchaLoginVerifier = new window.firebase.auth.RecaptchaVerifier('recaptcha-login', { size: visible ? 'normal' : 'invisible' });
                recaptchaLoginVerifier.render().then(id => { recaptchaLoginWidgetId = id; });
            }
            if (!recaptchaRegisterVerifier) {
                recaptchaRegisterVerifier = new window.firebase.auth.RecaptchaVerifier('recaptcha-register', { size: visible ? 'normal' : 'invisible' });
                recaptchaRegisterVerifier.render().then(id => { recaptchaRegisterWidgetId = id; });
            }
        }
    }
    function resetRecaptcha(which) {
        try {
            if (window.grecaptcha) {
                if (which === 'login' && recaptchaLoginWidgetId !== null) window.grecaptcha.reset(recaptchaLoginWidgetId);
                if (which === 'register' && recaptchaRegisterWidgetId !== null) window.grecaptcha.reset(recaptchaRegisterWidgetId);
            }
        } catch (_) {}
    }

    // Send OTP actions via Firebase
    async function sendOtpLogin() {
        try {
            ensureRecaptcha();
            const phone = normalizePhoneE164(phoneLoginInput.value, countryLoginSelect?.value);
            if (!window.firebase || !window.firebase.auth) throw new Error('Firebase not loaded');
            const auth = window.firebase.auth();
            if (sendOtpLoginBtn) { sendOtpLoginBtn.disabled = true; }
            if (resendOtpLoginBtn) { resendOtpLoginBtn.disabled = true; }
            confirmationResultLogin = await auth.signInWithPhoneNumber(phone, recaptchaLoginVerifier);
            authMsg.textContent = currentLang === 'en' ? 'OTP sent via SMS' : 'এসএমএস এর মাধ্যমে ওটিপি পাঠানো হয়েছে';
            startTimer('login');
        } catch (err) {
            const code = err?.code || '';
            let msg = err?.message || 'Failed to send OTP';
            if (code === 'auth/invalid-phone-number') msg = 'Invalid phone number. Include correct country code.';
            if (code === 'auth/too-many-requests') msg = 'Too many attempts. Please try again later.';
            if (code === 'auth/quota-exceeded') msg = 'SMS quota exceeded. Try later.';
            if (code === 'auth/missing-recaptcha-token') msg = 'reCAPTCHA failed. Please try again.';
            if (code === 'app-compat/no-app') msg = 'App not initialized. Reload the page.';
            authMsg.textContent = msg;
            resetRecaptcha('login');
        }
        finally {
            if (sendOtpLoginBtn) { sendOtpLoginBtn.disabled = false; }
        }
    }
    if (sendOtpLoginBtn) sendOtpLoginBtn.addEventListener('click', sendOtpLogin);
    if (resendOtpLoginBtn) resendOtpLoginBtn.addEventListener('click', sendOtpLogin);

    async function sendOtpRegister() {
        try {
            ensureRecaptcha();
            const phone = normalizePhoneE164(phoneRegisterInput.value, countryRegisterSelect?.value);
            if (!window.firebase || !window.firebase.auth) throw new Error('Firebase not loaded');
            const auth = window.firebase.auth();
            if (sendOtpRegisterBtn) { sendOtpRegisterBtn.disabled = true; }
            if (resendOtpRegisterBtn) { resendOtpRegisterBtn.disabled = true; }
            confirmationResultRegister = await auth.signInWithPhoneNumber(phone, recaptchaRegisterVerifier);
            authMsg.textContent = currentLang === 'en' ? 'OTP sent via SMS' : 'এসএমএস এর মাধ্যমে ওটিপি পাঠানো হয়েছে';
            startTimer('register');
        } catch (err) {
            const code = err?.code || '';
            let msg = err?.message || 'Failed to send OTP';
            if (code === 'auth/invalid-phone-number') msg = 'Invalid phone number. Include correct country code.';
            if (code === 'auth/too-many-requests') msg = 'Too many attempts. Please try again later.';
            if (code === 'auth/quota-exceeded') msg = 'SMS quota exceeded. Try later.';
            if (code === 'auth/missing-recaptcha-token') msg = 'reCAPTCHA failed. Please try again.';
            if (code === 'app-compat/no-app') msg = 'App not initialized. Reload the page.';
            authMsg.textContent = msg;
            resetRecaptcha('register');
        }
        finally {
            if (sendOtpRegisterBtn) { sendOtpRegisterBtn.disabled = false; }
        }
    }
    if (sendOtpRegisterBtn) sendOtpRegisterBtn.addEventListener('click', sendOtpRegister);
    if (resendOtpRegisterBtn) resendOtpRegisterBtn.addEventListener('click', sendOtpRegister);

    // Login submit
    if (loginForm) loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const otp = otpLoginInput.value.trim();
            if (!confirmationResultLogin) throw new Error('Please request OTP first');
            const result = await confirmationResultLogin.confirm(otp);
            const phone = result.user.phoneNumber || normalizePhoneE164(phoneLoginInput.value);
            setCurrentUser(phone);
            updateAuthNav();
            authMsg.textContent = currentLang === 'en' ? 'Logged in!' : 'লগইন সম্পন্ন!';
            setTimeout(closeAuth, 600);
        } catch (err) {
            authMsg.textContent = err.message || (currentLang === 'en' ? 'Invalid OTP' : 'ভুল ওটিপি');
        }
    });

    // Register submit
    if (registerForm) registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const otp = otpRegisterInput.value.trim();
            if (!confirmationResultRegister) throw new Error('Please request OTP first');
            const result = await confirmationResultRegister.confirm(otp);
            const phone = result.user.phoneNumber || normalizePhoneE164(phoneRegisterInput.value);
            setCurrentUser(phone);
            updateAuthNav();
            authMsg.textContent = currentLang === 'en' ? 'Registered & logged in!' : 'রেজিস্টার ও লগইন সম্পন্ন!';
            setTimeout(closeAuth, 600);
        } catch (err) {
            authMsg.textContent = err.message || (currentLang === 'en' ? 'Invalid OTP' : 'ভুল ওটিপি');
        }
    });

    // Keep nav text in sync on language change
    [langEn, langBn].forEach(btn => btn.addEventListener('click', updateAuthNav));
    updateAuthNav();

    // --- Orders Modal / Tracking ---
    const ordersModal = document.getElementById('orders-modal');
    const closeOrdersBtn = ordersModal?.querySelector('.close-orders');
    const ordersListEl = ordersModal?.querySelector('.orders-list');
    // Wishlist / Saved
    const wishlistLink = document.querySelector('.nav-links li a[href="#wishlist"]');
    const wishlistModal = document.getElementById('wishlist-modal');
    const closeWishlistBtn = wishlistModal?.querySelector('.close-wishlist');
    const wishlistListEl = wishlistModal?.querySelector('.wishlist-list');
    const savedModal = document.getElementById('saved-modal');
    const closeSavedBtn = savedModal?.querySelector('.close-saved');
    const savedListEl = savedModal?.querySelector('.saved-list');

    function getWishlist() { try { return JSON.parse(localStorage.getItem('vintageWishlist')||'[]'); } catch(_) { return []; } }
    function setWishlist(v) { localStorage.setItem('vintageWishlist', JSON.stringify(v)); }
    function getSaved() { try { return JSON.parse(localStorage.getItem('vintageSaved')||'[]'); } catch(_) { return []; } }
    function setSaved(v) { localStorage.setItem('vintageSaved', JSON.stringify(v)); }

    function openWishlist() {
        if (!wishlistModal) return;
        renderWishlist();
        wishlistModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeWishlist() { if (!wishlistModal) return; wishlistModal.classList.remove('open'); document.body.style.overflow = ''; }
    function renderWishlist() {
        if (!wishlistListEl) return;
        const list = getWishlist();
        wishlistListEl.innerHTML = list.length ? '' : (currentLang==='en'?'No items in wishlist.':'উইশলিস্টে কিছু নেই।');
        list.forEach((it, idx)=>{
            const row = document.createElement('div'); row.className='order-card';
            row.innerHTML = `<div class="order-row"><strong>${it.name}</strong><span>₹${it.price.replace(/[^\d]/g,'')}</span></div>
                             <div class="order-actions"><button class="btn-small move-to-cart">Add to Cart</button> <button class="btn-small remove">Remove</button></div>`;
            row.querySelector('.remove').addEventListener('click', ()=>{ const cur=getWishlist(); cur.splice(idx,1); setWishlist(cur); renderWishlist(); });
            row.querySelector('.move-to-cart').addEventListener('click', ()=>{ cart.push(it); localStorage.setItem('vintageCart', JSON.stringify(cart)); updateCart(); const cur=getWishlist(); cur.splice(idx,1); setWishlist(cur); renderWishlist(); });
            wishlistListEl.appendChild(row);
        });
    }
    function openSaved() { if (!savedModal) return; renderSaved(); savedModal.classList.add('open'); document.body.style.overflow='hidden'; }
    function closeSaved() { if (!savedModal) return; savedModal.classList.remove('open'); document.body.style.overflow=''; }
    function renderSaved() {
        if (!savedListEl) return;
        const list = getSaved();
        savedListEl.innerHTML = list.length ? '' : (currentLang==='en'?'Nothing saved for later.':'পরের জন্য কিছু সংরক্ষিত নেই।');
        list.forEach((it, idx)=>{
            const row = document.createElement('div'); row.className='order-card';
            row.innerHTML = `<div class="order-row"><strong>${it.name}</strong><span>₹${it.price.replace(/[^\d]/g,'')}</span></div>
                             <div class="order-actions"><button class="btn-small move-to-cart">Move to Cart</button> <button class="btn-small remove">Remove</button></div>`;
            row.querySelector('.remove').addEventListener('click', ()=>{ const cur=getSaved(); cur.splice(idx,1); setSaved(cur); renderSaved(); });
            row.querySelector('.move-to-cart').addEventListener('click', ()=>{ cart.push(it); localStorage.setItem('vintageCart', JSON.stringify(cart)); updateCart(); const cur=getSaved(); cur.splice(idx,1); setSaved(cur); renderSaved(); });
            savedListEl.appendChild(row);
        });
    }
    const trackModal = document.getElementById('track-modal');
    const closeTrackBtn = trackModal?.querySelector('.close-track');
    // Info modal
    const infoModal = document.getElementById('info-modal');
    const closeInfoBtn = infoModal?.querySelector('.close-info');
    const infoTitleEl = infoModal?.querySelector('.info-title');
    const infoBodyEl = infoModal?.querySelector('.info-body');

    function openInfo(title, html) {
        if (!infoModal) return;
        if (infoTitleEl) infoTitleEl.textContent = title;
        if (infoBodyEl) infoBodyEl.innerHTML = html;
        infoModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeInfo() { if (!infoModal) return; infoModal.classList.remove('open'); document.body.style.overflow = ''; }

    const trackOrderIdEl = trackModal?.querySelector('.track-order-id');
    const trackStepsEls = trackModal?.querySelectorAll('.track-step');
    const trackEstimateEl = trackModal?.querySelector('.track-estimate');

    function getOrders() {
        try { const raw = localStorage.getItem('vintageOrders'); return raw ? JSON.parse(raw) : []; } catch(_) { return []; }
    }
    function openOrders() {
        if (!ordersModal) return;
        renderOrders();
        ordersModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeOrders() {
        if (!ordersModal) return;
        ordersModal.classList.remove('open');
        document.body.style.overflow = '';
    }
    function openTrack(order) {
        if (!trackModal) return;
        trackOrderIdEl.textContent = `Order ID: ${order.orderId}`;
        // simple fake progression based on date/time
        const now = Date.now();
        const placedTs = now - 1000; // pretend placed just now
        const stage = Math.min(5, 1 + Math.floor(((now - placedTs) / 1000) % 5));
        trackStepsEls.forEach((el, idx) => { el.classList.toggle('active', idx < stage); });
        trackEstimateEl.textContent = currentLang === 'en' ? 'Estimated delivery: 3-5 days' : 'আনুমানিক ডেলিভারি: ৩-৫ দিন';
        trackModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    function closeTrack() {
        if (!trackModal) return;
        trackModal.classList.remove('open');
        document.body.style.overflow = '';
    }
    function renderOrders() {
        if (!ordersListEl) return;
        const orders = getOrders().slice().reverse();
        ordersListEl.innerHTML = orders.length ? '' : (currentLang === 'en' ? 'No orders yet.' : 'এখনও কোনো অর্ডার নেই।');
        orders.forEach(o => {
            const card = document.createElement('div');
            card.className = 'order-card';
            card.innerHTML = `
                <div class="order-row"><strong>${o.orderId}</strong><span class="status-pill">${o.status || 'pending'}</span></div>
                <div class="order-row"><span>${o.date}</span><span>₹${o.total}</span></div>
                <div class="order-actions">
                    <button class="btn-small view-order">Details</button>
                    <button class="btn-small track-order">Track</button>
                    <button class="btn-small cancel-order">Cancel</button>
                </div>
            `;
            card.querySelector('.view-order').addEventListener('click', () => {
                alert(`Order: ${o.orderId}\nTotal: ₹${o.total}`);
            });
            card.querySelector('.track-order').addEventListener('click', () => openTrack(o));
            card.querySelector('.cancel-order').addEventListener('click', () => {
                const ordersAll = getOrders();
                const idx = ordersAll.findIndex(x => x.orderId === o.orderId);
                if (idx !== -1) {
                    if (ordersAll[idx].status && ['shipped','delivered'].includes(ordersAll[idx].status)) { alert('Cannot cancel shipped order'); return; }
                    // remove the order entirely
                    ordersAll.splice(idx,1);
                    localStorage.setItem('vintageOrders', JSON.stringify(ordersAll));
                    renderOrders();
                }
            });
            ordersListEl.appendChild(card);
        });
    }
    if (ordersNavLink) ordersNavLink.addEventListener('click', (e) => { e.preventDefault(); openOrders(); });
    if (closeOrdersBtn) closeOrdersBtn.addEventListener('click', closeOrders);
    if (closeTrackBtn) closeTrackBtn.addEventListener('click', closeTrack);
    if (wishlistLink) wishlistLink.addEventListener('click', (e)=>{ e.preventDefault(); openWishlist(); });
    if (closeWishlistBtn) closeWishlistBtn.addEventListener('click', closeWishlist);
    if (closeSavedBtn) closeSavedBtn.addEventListener('click', closeSaved);
    if (closeInfoBtn) closeInfoBtn.addEventListener('click', closeInfo);

    // Footer link handlers
    document.querySelectorAll('a[href="#faq"]').forEach(a=>a.addEventListener('click',(e)=>{e.preventDefault();openInfo('FAQs',`
        <h4>Ordering</h4><p>Place orders from the cart; you can cancel before shipping.</p>
        <h4>Shipping</h4><p>Estimated delivery 3-5 days within serviceable areas.</p>
        <h4>Returns</h4><p>7-day return if unused and with tags. Contact support.</p>`);}));
    document.querySelectorAll('a[href="#care"]').forEach(a=>a.addEventListener('click',(e)=>{e.preventDefault();openInfo('Saree Care Tips',`
        <ul><li>Dry-clean silk and rich zari sarees.</li><li>Store in muslin bags away from sunlight.</li><li>Air cotton sarees regularly; avoid harsh detergents.</li></ul>`);}));
    document.querySelectorAll('a[href="#terms"]').forEach(a=>a.addEventListener('click',(e)=>{e.preventDefault();openInfo('Terms & Conditions',`
        <p>By using this site, you agree to our policies on orders, payments, shipping, cancellations, and returns.</p>`);}));
    document.querySelectorAll('a[href="#privacy"]').forEach(a=>a.addEventListener('click',(e)=>{e.preventDefault();openInfo('Privacy Policy',`
        <p>We store minimal data (orders and preferences) locally for a better experience. No third-party sale of data.</p>`);}));
    document.querySelectorAll('a[href="#contact"]').forEach(a=>a.addEventListener('click',(e)=>{e.preventDefault();openInfo('Contact Us',`
        <p><strong>Phone:</strong> +91-98765-43210</p>
        <p><strong>Email:</strong> support@vintagesaree.example</p>
        <p><strong>Location:</strong> Samudragarh, West Bengal, India</p>`);}));
    document.querySelectorAll('a[href="#blog"]').forEach(a=>a.addEventListener('click',(e)=>{e.preventDefault();openInfo('Blog / Styling Tips',`
        <ul>
            <li>Pair Jamdani with oxidized silver and a sleek bun.</li>
            <li>Contrast blouses elevate solid Tussar drapes.</li>
            <li>Use soft pleats for linen; belt the pallu for fusion looks.</li>
        </ul>`);}));

    // --- Category Filter + Sort/Color Filter ---
    const productsGrid = document.querySelector('.products-grid');
    const categoryFilterContainer = document.getElementById('category-filter');
    const sortPriceSelect = document.getElementById('sort-price');
    const filterColorSelect = document.getElementById('filter-color');
    if (productsGrid && categoryFilterContainer) {
        const sareeCards = Array.from(productsGrid.querySelectorAll('.saree-card'));
        const categoryKeyToLabel = new Map();
        const colorSet = new Set();

        // Collect category labels from badges and tag cards
        sareeCards.forEach(card => {
            const badge = card.querySelector('.saree-category');
            if (!badge) return;
            const en = (badge.getAttribute('data-en') || badge.textContent || '').trim();
            const bn = (badge.getAttribute('data-bn') || '').trim();
            const key = en.toLowerCase();
            card.setAttribute('data-category', key);
            // derive a pseudo color from product name keywords
            const nameText = (card.querySelector('.saree-name')?.textContent || '').toLowerCase();
            const possibleColors = ['red','blue','green','white','yellow','pink','golden','grey','magenta'];
            const found = possibleColors.find(c => nameText.includes(c));
            const colorKey = found || 'multi';
            card.setAttribute('data-color', colorKey);
            colorSet.add(colorKey);
            if (en && !categoryKeyToLabel.has(key)) categoryKeyToLabel.set(key, { en, bn: bn || en });
        });

        // Render buttons: All + each unique category
        const fragment = document.createDocumentFragment();
        const makeBtn = (key, enLabel, bnLabel) => {
            const btn = document.createElement('button');
            btn.className = 'category-btn';
            btn.setAttribute('data-key', key);
            btn.setAttribute('data-en', enLabel);
            btn.setAttribute('data-bn', bnLabel);
            btn.textContent = currentLang === 'en' ? enLabel : bnLabel;
            return btn;
        };

        fragment.appendChild(makeBtn('all', 'All', 'সব'));
        Array.from(categoryKeyToLabel.keys()).sort().forEach(key => {
            const { en, bn } = categoryKeyToLabel.get(key);
            fragment.appendChild(makeBtn(key, en, bn));
        });
        categoryFilterContainer.appendChild(fragment);

        function setActiveButton(targetKey) {
            categoryFilterContainer.querySelectorAll('.category-btn').forEach(b => {
                b.classList.toggle('active', b.getAttribute('data-key') === targetKey);
            });
        }
        function applyFilter(key) {
            const colorValue = (filterColorSelect?.value) || 'all';
            sareeCards.forEach(card => {
                const cardKey = card.getAttribute('data-category');
                const cardColor = card.getAttribute('data-color');
                const categoryOk = key === 'all' || cardKey === key;
                const colorOk = colorValue === 'all' || cardColor === colorValue;
                const shouldShow = categoryOk && colorOk;
                card.classList.toggle('hidden', !shouldShow);
            });
            setActiveButton(key);
        }

        function applySort() {
            const mode = (sortPriceSelect?.value) || 'default';
            const visibleCards = sareeCards.slice();
            if (mode === 'default') {
                // keep DOM order
                visibleCards.forEach(c => productsGrid.appendChild(c));
                return;
            }
            const parsePrice = (card) => {
                const priceText = card.querySelector('.saree-price')?.textContent || '0';
                return parseInt(priceText.replace(/[^\d]/g,'') || '0', 10);
            };
            visibleCards.sort((a,b) => {
                const pa = parsePrice(a);
                const pb = parsePrice(b);
                return mode === 'low-high' ? (pa - pb) : (pb - pa);
            }).forEach(c => productsGrid.appendChild(c));
        }

        // Filter button clicks
        categoryFilterContainer.querySelectorAll('.category-btn').forEach(btn => {
            btn.addEventListener('click', () => applyFilter(btn.getAttribute('data-key')));
        });

        // Clicking on small category badge inside a card also filters
        productsGrid.querySelectorAll('.saree-category').forEach(badge => {
            badge.style.cursor = 'pointer';
            badge.addEventListener('click', () => {
                const key = (badge.getAttribute('data-en') || badge.textContent).trim().toLowerCase();
                applyFilter(key);
                // Ensure the filter bar shows the right active state
                setActiveButton(key);
                // Scroll to top of section for better UX
                const section = document.getElementById('categories');
                if (section) section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            });
        });

        // Populate color filter options
        if (filterColorSelect) {
            Array.from(colorSet.values()).sort().forEach(color => {
                const opt = document.createElement('option');
                opt.value = color;
                opt.textContent = color.charAt(0).toUpperCase() + color.slice(1);
                filterColorSelect.appendChild(opt);
            });
        }

        // Default view
        applyFilter('all');
        applySort();

        // Keep labels in sync with language switching
        [langEn, langBn].forEach(btn => btn.addEventListener('click', () => {
            categoryFilterContainer.querySelectorAll('.category-btn').forEach(el => {
                el.textContent = el.getAttribute(currentLang === 'en' ? 'data-en' : 'data-bn');
            });
        }));

        // Wire sort and color filter
        if (sortPriceSelect) sortPriceSelect.addEventListener('change', applySort);
        if (filterColorSelect) filterColorSelect.addEventListener('change', () => applyFilter(categoryFilterContainer.querySelector('.category-btn.active')?.getAttribute('data-key') || 'all'));
    }
});
