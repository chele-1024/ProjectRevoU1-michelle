// ============================================
// FUNGSI UTAMA YANG DIPAKAI DI SEMUA HALAMAN
// ============================================

// Cek apakah user sudah login
function checkLogin() {
    const currentPage = window.location.pathname.split('/').pop();
    
    // Skip check untuk halaman index.html
    if (currentPage === 'index.html' || currentPage === '' || currentPage.includes('index.html')) {
        return true;
    }
    
    // Jika belum login (tidak ada nama di localStorage)
    if (!localStorage.getItem('userName')) {
        // Simpan halaman tujuan
        sessionStorage.setItem('redirectAfterLogin', currentPage);
        
        // Redirect ke halaman login
        window.location.href = 'index.html';
        return false;
    }
    
    return true;
}

// Fungsi untuk mendapatkan nama pengguna
function getUserName() {
    return localStorage.getItem('userName') || 'Pengguna';
}

// Tampilkan nama pengguna di semua halaman
function displayUserName() {
    const userName = getUserName();
    
    // Update di halaman welcome
    const userNameDisplay = document.getElementById('userNameDisplay');
    if (userNameDisplay) {
        animateText(userNameDisplay, userName);
    }
    
    // Update di navigation bar
    const userWelcomeNav = document.getElementById('userWelcomeNav');
    const userWelcome = document.getElementById('userWelcome');
    
    if (userWelcomeNav) {
        userWelcomeNav.innerHTML = `<i class="fas fa-user"></i> ${userName}`;
    }
    
    if (userWelcome) {
        userWelcome.innerHTML = `<i class="fas fa-user"></i> ${userName}`;
    }
}

// Fungsi untuk animasi teks
function animateText(element, text) {
    if (!element) return;
    
    element.textContent = '';
    let i = 0;
    
    function typeWriter() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    typeWriter();
}

// Fungsi logout
function logout() {
    // Hapus nama dari localStorage
    localStorage.removeItem('userName');
    localStorage.removeItem('savedUserName');
    
    // Redirect ke halaman login
    window.location.href = 'index.html';
    
    return false; // Mencegah default link behavior
}

// Set navigasi aktif
function setActiveNav() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('nav a');
    
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        
        // Hapus kelas aktif dari semua link
        link.classList.remove('active');
        
        // Tambahkan kelas aktif ke link yang sesuai
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else if ((currentPage === '' || currentPage === 'index.html') && linkPage === 'welcome.html') {
            link.classList.add('active');
        } else if (currentPage === 'welcome.html' && linkPage === 'welcome.html') {
            link.classList.add('active');
        } else if (currentPage === 'profile.html' && linkPage === 'profile.html') {
            link.classList.add('active');
        } else if (currentPage === 'contact.html' && linkPage === 'contact.html') {
            link.classList.add('active');
        }
    });
}

// Inisialisasi animasi scroll
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Amati semua elemen dengan kelas untuk animasi
    document.querySelectorAll('.card, .welcome-section, .about-card, .contact-info, .contact-form, .faq-section').forEach(element => {
        observer.observe(element);
    });
}

// Efek hover pada kartu
function initCardHoverEffects() {
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Animasi shapes di halaman login
function animateShapes() {
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        // Set posisi awal random
        const randomX = Math.random() * 100;
        const randomY = Math.random() * 100;
        shape.style.left = `${randomX}%`;
        shape.style.top = `${randomY}%`;
        
        // Animasi mengambang
        shape.animate([
            { transform: 'translate(0, 0)' },
            { transform: `translate(${Math.random() * 20 - 10}px, ${Math.random() * 20 - 10}px)` }
        ], {
            duration: 3000 + index * 1000,
            iterations: Infinity,
            direction: 'alternate'
        });
    });
}

// ============================================
// FUNGSI KHUSUS HALAMAN LOGIN (INDEX.HTML)
// ============================================

function initLoginPage() {
    const loginForm = document.getElementById('loginForm');
    const userNameInput = document.getElementById('userName');
    const nameError = document.getElementById('nameError');
    const rememberCheckbox = document.getElementById('rememberName');
    
    if (!loginForm) return;
    
    // Cek apakah ada nama yang disimpan
    const savedName = localStorage.getItem('savedUserName');
    if (savedName) {
        userNameInput.value = savedName;
        rememberCheckbox.checked = true;
    }
    
    // Fokus pada input nama
    userNameInput.focus();
    
    // Validasi real-time
    userNameInput.addEventListener('input', function() {
        validateName();
    });
    
    // Handle form submission
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateName()) {
            const userName = userNameInput.value.trim();
            
            // Simpan nama ke localStorage
            localStorage.setItem('userName', userName);
            
            // Simpan untuk remember me
            if (rememberCheckbox.checked) {
                localStorage.setItem('savedUserName', userName);
            } else {
                localStorage.removeItem('savedUserName');
            }
            
            // Animasi loading
            const submitBtn = document.querySelector('.btn-login');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Memproses...';
            submitBtn.disabled = true;
            
            // Check if there's a redirect URL
            const redirectPage = sessionStorage.getItem('redirectAfterLogin') || 'welcome.html';
            sessionStorage.removeItem('redirectAfterLogin');
            
            // Simulasi loading dan redirect
            setTimeout(function() {
                window.location.href = redirectPage;
            }, 1500);
        }
    });
    
    // Fungsi validasi nama
    function validateName() {
        const userName = userNameInput.value.trim();
        let isValid = true;
        
        // Reset error
        nameError.textContent = '';
        userNameInput.style.borderColor = '#e1e5eb';
        
        if (!userName) {
            nameError.textContent = 'Nama tidak boleh kosong';
            userNameInput.style.borderColor = '#e74c3c';
            isValid = false;
        } else if (userName.length < 2) {
            nameError.textContent = 'Nama minimal 2 karakter';
            userNameInput.style.borderColor = '#e74c3c';
            isValid = false;
        } else if (userName.length > 50) {
            nameError.textContent = 'Nama maksimal 50 karakter';
            userNameInput.style.borderColor = '#e74c3c';
            isValid = false;
        } else if (!/^[a-zA-Z\s\u00C0-\u024F\u1E00-\u1EFF]+$/.test(userName)) {
            nameError.textContent = 'Nama hanya boleh berisi huruf dan spasi';
            userNameInput.style.borderColor = '#e74c3c';
            isValid = false;
        } else {
            userNameInput.style.borderColor = '#2ecc71';
        }
        
        return isValid;
    }
    
    // Jalankan animasi shapes
    animateShapes();
}

// ============================================
// FUNGSI KHUSUS HALAMAN WELCOME (WELCOME.HTML)
// ============================================

function initWelcomePage() {
    // Tambahkan efek parallax untuk welcome section
    const welcomeSection = document.querySelector('.welcome-section');
    if (welcomeSection) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * 0.3;
            welcomeSection.style.transform = `translateY(${rate}px)`;
        });
    }
    
    // Animasi untuk kartu
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
}

// ============================================
// FUNGSI KHUSUS HALAMAN PROFIL (PROFILE.HTML)
// ============================================

function initProfilePage() {
    // Smooth scroll untuk anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Tambahkan efek parallax untuk hero section
    const hero = document.querySelector('.profile-hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            hero.style.backgroundPosition = `center ${rate}px`;
        });
    }
}

// ============================================
// FUNGSI KHUSUS HALAMAN KONTAK (CONTACT.HTML)
// ============================================

function initContactPage() {
    const contactForm = document.getElementById('contactForm');
    const formResult = document.getElementById('formResult');
    
    if (!contactForm) return;
    
    // Toggle FAQ
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', function() {
            const answer = this.nextElementSibling;
            const isOpen = answer.classList.contains('open');
            
            // Tutup semua FAQ lainnya
            document.querySelectorAll('.faq-answer').forEach(item => {
                item.classList.remove('open');
                item.previousElementSibling.classList.remove('active');
            });
            
            // Buka FAQ yang diklik jika sebelumnya tertutup
            if (!isOpen) {
                answer.classList.add('open');
                this.classList.add('active');
            }
        });
    });
    
    // Handle form submission
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset pesan error
        clearErrors();
        
        // Validasi form
        if (validateForm()) {
            // Ambil data form
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                newsletter: document.getElementById('newsletter').checked,
                timestamp: new Date().toLocaleString('id-ID')
            };
            
            // Tampilkan hasil
            displayFormResult(formData);
            
            // Reset form
            contactForm.reset();
            
            // Scroll ke hasil
            formResult.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Real-time validation
    document.getElementById('name')?.addEventListener('blur', validateName);
    document.getElementById('email')?.addEventListener('blur', validateEmail);
    document.getElementById('phone')?.addEventListener('blur', validatePhone);
    document.getElementById('subject')?.addEventListener('change', validateSubject);
    document.getElementById('message')?.addEventListener('blur', validateMessage);
    
    // Fungsi validasi form kontak
    function validateForm() {
        let isValid = true;
        
        if (!validateName()) isValid = false;
        if (!validateEmail()) isValid = false;
        if (!validateSubject()) isValid = false;
        if (!validateMessage()) isValid = false;
        
        return isValid;
    }
    
    function validateName() {
        const nameInput = document.getElementById('name');
        const errorElement = document.getElementById('nameError');
        
        if (!nameInput || !errorElement) return true;
        
        const name = nameInput.value.trim();
        
        if (!name) {
            errorElement.textContent = 'Nama harus diisi';
            nameInput.style.borderColor = '#e74c3c';
            return false;
        }
        
        if (name.length < 3) {
            errorElement.textContent = 'Nama minimal 3 karakter';
            nameInput.style.borderColor = '#e74c3c';
            return false;
        }
        
        errorElement.textContent = '';
        nameInput.style.borderColor = '#2ecc71';
        return true;
    }
    
    function validateEmail() {
        const emailInput = document.getElementById('email');
        const errorElement = document.getElementById('emailError');
        
        if (!emailInput || !errorElement) return true;
        
        const email = emailInput.value.trim();
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!email) {
            errorElement.textContent = 'Email harus diisi';
            emailInput.style.borderColor = '#e74c3c';
            return false;
        }
        
        if (!emailPattern.test(email)) {
            errorElement.textContent = 'Format email tidak valid';
            emailInput.style.borderColor = '#e74c3c';
            return false;
        }
        
        errorElement.textContent = '';
        emailInput.style.borderColor = '#2ecc71';
        return true;
    }
    
    function validatePhone() {
        const phoneInput = document.getElementById('phone');
        const errorElement = document.getElementById('phoneError');
        
        if (!phoneInput || !errorElement) return true;
        
        const phone = phoneInput.value.trim();
        
        if (phone && !/^[0-9+\-\s]+$/.test(phone)) {
            errorElement.textContent = 'Format telepon tidak valid';
            phoneInput.style.borderColor = '#e74c3c';
            return false;
        }
        
        errorElement.textContent = '';
        phoneInput.style.borderColor = '#2ecc71';
        return true;
    }
    
    function validateSubject() {
        const subjectSelect = document.getElementById('subject');
        const errorElement = document.getElementById('subjectError');
        
        if (!subjectSelect || !errorElement) return true;
        
        const subject = subjectSelect.value;
        
        if (!subject) {
            errorElement.textContent = 'Silakan pilih subjek';
            subjectSelect.style.borderColor = '#e74c3c';
            return false;
        }
        
        errorElement.textContent = '';
        subjectSelect.style.borderColor = '#2ecc71';
        return true;
    }
    
    function validateMessage() {
        const messageTextarea = document.getElementById('message');
        const errorElement = document.getElementById('messageError');
        
        if (!messageTextarea || !errorElement) return true;
        
        const message = messageTextarea.value.trim();
        
        if (!message) {
            errorElement.textContent = 'Pesan harus diisi';
            messageTextarea.style.borderColor = '#e74c3c';
            return false;
        }
        
        if (message.length < 10) {
            errorElement.textContent = 'Pesan minimal 10 karakter';
            messageTextarea.style.borderColor = '#e74c3c';
            return false;
        }
        
        errorElement.textContent = '';
        messageTextarea.style.borderColor = '#2ecc71';
        return true;
    }
    
    function clearErrors() {
        document.querySelectorAll('.error-message').forEach(el => {
            el.textContent = '';
        });
        
        document.querySelectorAll('.contact-form input, .contact-form select, .contact-form textarea').forEach(el => {
            el.style.borderColor = '#e1e5eb';
        });
    }
    
    function displayFormResult(formData) {
        if (!formResult) return;
        
        const subjectText = {
            'informasi': 'Informasi Produk',
            'dukungan': 'Dukungan Teknis',
            'kerja-sama': 'Kerja Sama',
            'karir': 'Karir',
            'lainnya': 'Lainnya'
        };
        
        formResult.innerHTML = `
            <div class="success">
                <h3><i class="fas fa-check-circle"></i> Pesan Berhasil Dikirim!</h3>
                <p>Terima kasih <strong>${formData.name}</strong>, pesan Anda telah kami terima.</p>
                <hr>
                <p><strong>Detail Pesan:</strong></p>
                <ul>
                    <li><strong>Email:</strong> ${formData.email}</li>
                    <li><strong>Telepon:</strong> ${formData.phone || 'Tidak diisi'}</li>
                    <li><strong>Subjek:</strong> ${subjectText[formData.subject]}</li>
                    <li><strong>Waktu:</strong> ${formData.timestamp}</li>
                </ul>
                <p>Tim kami akan menghubungi Anda dalam 1-2 hari kerja.</p>
            </div>
        `;
        
        formResult.className = 'form-result success';
    }
}

// ============================================
// INISIALISASI SEMUA HALAMAN
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Cek login untuk semua halaman kecuali index.html
    const currentPage = window.location.pathname.split('/').pop();
    
    if (currentPage !== 'index.html' && currentPage !== '' && !currentPage.includes('index.html')) {
        if (!checkLogin()) return;
    }
    
    // Fungsi umum untuk semua halaman
    displayUserName();
    setActiveNav();
    initScrollAnimations();
    initCardHoverEffects();
    
    // Event listener untuk tombol logout
    document.querySelectorAll('.logout-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    });
    
    // Inisialisasi halaman spesifik berdasarkan URL
    if (currentPage === 'index.html' || currentPage === '' || currentPage.includes('index.html')) {
        initLoginPage();
    } else if (currentPage === 'welcome.html' || currentPage.includes('welcome.html')) {
        initWelcomePage();
    } else if (currentPage === 'profile.html' || currentPage.includes('profile.html')) {
        initProfilePage();
    } else if (currentPage === 'contact.html' || currentPage.includes('contact.html')) {
        initContactPage();
    }
    
    // Tambahkan efek hover untuk feature items di login page
    document.querySelectorAll('.feature').forEach(feature => {
        feature.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
        });
        
        feature.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
    
    // Animasi untuk stat items di profile page
    document.querySelectorAll('.stat-item').forEach(stat => {
        stat.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        stat.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
});