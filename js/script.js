// script.js

// Wait for the DOM to be fully loaded before running scripts
document.addEventListener('DOMContentLoaded', (event) => {

    // --- Initialize Lucide Icons ---
    if (typeof lucide !== 'undefined') {
        try {
            lucide.createIcons();
        } catch (e) {
            console.error("Lucide icon creation failed:", e);
        }
    } else {
        console.warn("Lucide library not loaded. Icons may not appear.");
    }

    // --- Footer Current Year ---
    const yearSpan = document.getElementById("current-year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- Partner Logo Population ---
    const partnerLogos = [
        'FROGPAY.png',
        'BNINER.jpg',
        'reelai.png',
        // Add more logo filenames here
    ];
    const logoSet1Container = document.getElementById('partner-logos-set1');
    const logoSet2Container = document.getElementById('partner-logos-set2');
    const logoBasePath = 'img/partners/'; // IMPORTANT: Ensure this path is correct

    if (logoSet1Container && logoSet2Container) {
         if (partnerLogos.length === 0) {
              // Optionally hide the section
              const partnersSection = document.getElementById('partners');
              if(partnersSection) partnersSection.style.display = 'none';
              console.warn("Partner logo array is empty. Hiding section.");
         } else {
             partnerLogos.forEach(filename => {
                 const brandLogoDiv = document.createElement('div');
                 brandLogoDiv.className = 'brandLogo';
                 brandLogoDiv.setAttribute('role', 'listitem');

                 const img = document.createElement('img');
                 img.src = logoBasePath + filename;
                 img.loading = 'lazy';

                 let altText = filename.substring(0, filename.lastIndexOf('.')) || filename;
                 altText = altText.replace(/[-_]/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
                 img.alt = `Nashop Partner: ${altText}`;

                 brandLogoDiv.appendChild(img);
                 logoSet1Container.appendChild(brandLogoDiv.cloneNode(true));
                 logoSet2Container.appendChild(brandLogoDiv.cloneNode(true));
             });

            // Dynamically calculate track width after logos are added
            const firstSetWidth = logoSet1Container.offsetWidth;
            const trackElement = document.getElementById('partner-marquee');
            if (trackElement && firstSetWidth > 0) {
                 // Set total track width (set1 width + set2 width)
                 const totalWidth = firstSetWidth * 2;
                 trackElement.style.width = `${totalWidth}px`;

                 // Adjust animation duration based on width for consistent speed
                 const baseDuration = 45; // Duration for a baseline width (e.g., 1920px)
                 const baselineWidth = 1920;
                 const newDuration = (totalWidth / baselineWidth) * baseDuration;
                 // Apply new duration - target the track itself
                 trackElement.style.animationDuration = `${Math.max(20, newDuration)}s`; // Ensure minimum duration
                 // Reassign animation to apply duration - find the parent? No, need to target the animated element itself
                 trackElement.classList.remove('animate-marquee');
                 void trackElement.offsetWidth; // Trigger reflow
                 trackElement.classList.add('animate-marquee');
            } else if (firstSetWidth === 0) {
                console.warn("Could not calculate partner logo width for marquee animation timing.");
            }
         }
    } else {
        console.error("Partner logo container elements ('partner-logos-set1' or 'partner-logos-set2') not found.");
    }

    // --- Intersection Observer for Scroll Animations ---
    const animatedElements = document.querySelectorAll('.animate-fade-in-up');
    if ('IntersectionObserver' in window) {
         const observer = new IntersectionObserver((entries, observerInstance) => {
             entries.forEach(entry => {
                 if (entry.isIntersecting) {
                     entry.target.classList.add('is-visible'); // Trigger animation
                     observerInstance.unobserve(entry.target); // Stop observing once animated
                 }
             });
         }, {
             threshold: 0.1 // Trigger when 10% of the element enters the viewport
         });

         animatedElements.forEach(el => {
            // Immediately animate header elements if they have the class
            if (el.closest('header#top')) {
                // Skip immediate animation for header if we want scroll nav to work correctly from start
                // el.classList.add('is-visible');
                observer.observe(el); // Observe header too
            } else {
                // Observe elements outside the header
                observer.observe(el);
            }
         });
     } else {
         // Fallback for browsers that don't support IntersectionObserver
         console.warn("IntersectionObserver not supported. Animations will show immediately.");
         animatedElements.forEach(el => el.classList.add('is-visible'));
     }

     // --- 3D Card Tilt Effect ---
     const tiltContainers = document.querySelectorAll('.perspective-container');
     tiltContainers.forEach(container => {
         const card = container.querySelector('.card-3d-effect');
         if (card) {
             container.addEventListener('mousemove', (e) => {
                  const rect = container.getBoundingClientRect();
                  const x = e.clientX - rect.left - rect.width / 2;
                  const y = e.clientY - rect.top - rect.height / 2;
                  const rotateY = (x / (rect.width / 2)) * 7;
                  const rotateX = -(y / (rect.height / 2)) * 5;

                  requestAnimationFrame(() => {
                     card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px) scale(1.02)`;
                  });
             });

             container.addEventListener('mouseleave', () => {
                 requestAnimationFrame(() => {
                     card.style.transform = '';
                 });
             });
         } else {
            console.warn("No element with class 'card-3d-effect' found inside a 'perspective-container'.");
         }
    });

    // --- Enhanced Home Section 3D Effects ---
    // Logo 3D effect
    const logo3dContainer = document.querySelector('.logo-3d-container');
    if (logo3dContainer) {
        const logoParent = logo3dContainer.parentElement;

        logoParent.addEventListener('mousemove', (e) => {
            const rect = logoParent.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            // Calculate rotation based on mouse position relative to center
            const rotateY = ((mouseX - centerX) / (rect.width / 2)) * 12;
            const rotateX = -((mouseY - centerY) / (rect.height / 2)) * 8;

            // Apply transform with smooth transition
            requestAnimationFrame(() => {
                logo3dContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
        });

        logoParent.addEventListener('mouseleave', () => {
            // Reset transform with smooth transition back to default
            requestAnimationFrame(() => {
                logo3dContainer.style.transform = '';
            });
        });

        // --- Fingerprint Click Effect ---
        const fingerprintClickable = document.querySelector('.fingerprint-clickable');
        const fingerprintParticles = document.querySelector('.fingerprint-particles');
        const fingerprintRippleContainer = document.querySelector('.fingerprint-ripple-container');
        const fingerprintEnergyBurst = document.querySelector('.fingerprint-energy-burst');

        if (fingerprintClickable && fingerprintParticles && fingerprintRippleContainer && fingerprintEnergyBurst) {
            // Track click count for different effects
            let clickCount = 0;

            // Function to create ripple effect
            function createRippleEffect() {
                // Create multiple ripples with different sizes and delays
                for (let i = 0; i < 3; i++) {
                    const ripple = document.createElement('div');
                    ripple.classList.add('fingerprint-ripple', 'animate-ripple');

                    // Set size based on index
                    const size = 100 + (i * 40); // 100px, 140px, 180px
                    ripple.style.width = `${size}px`;
                    ripple.style.height = `${size}px`;

                    // Set delay based on index
                    ripple.style.animationDelay = `${i * 0.2}s`;

                    // Add to container
                    fingerprintRippleContainer.appendChild(ripple);

                    // Remove after animation completes
                    setTimeout(() => {
                        ripple.remove();
                    }, 1500 + (i * 200)); // Match animation duration plus delay
                }
            }

            // Function to create particle explosion
            function createParticleExplosion() {
                // Number of particles based on click count (more particles for more clicks)
                const particleCount = 20 + (clickCount * 5);
                const colors = ['#a855f7', '#d946ef', '#38bdf8', '#8b5cf6', '#22d3ee'];

                for (let i = 0; i < particleCount; i++) {
                    const particle = document.createElement('div');
                    particle.classList.add('fingerprint-particle');

                    // Random size between 3px and 8px
                    const size = 3 + Math.random() * 5;
                    particle.style.width = `${size}px`;
                    particle.style.height = `${size}px`;

                    // Random color from array
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    particle.style.backgroundColor = color;
                    particle.style.boxShadow = `0 0 ${size}px ${color}`;

                    // Random direction
                    const angle = Math.random() * Math.PI * 2; // Random angle in radians
                    const distance = 50 + Math.random() * 100; // Random distance between 50px and 150px
                    const tx = Math.cos(angle) * distance;
                    const ty = Math.sin(angle) * distance;

                    // Set CSS variables for the animation
                    particle.style.setProperty('--tx', `${tx}px`);
                    particle.style.setProperty('--ty', `${ty}px`);

                    // Add animation
                    particle.style.animation = `particle-float ${0.5 + Math.random() * 1}s cubic-bezier(0.22, 0.61, 0.36, 1) forwards`;

                    // Add to container
                    fingerprintParticles.appendChild(particle);

                    // Remove after animation completes
                    setTimeout(() => {
                        particle.remove();
                    }, 2000); // Ensure this is longer than the longest animation
                }
            }

            // Function to create energy burst effect
            function createEnergyBurst() {
                // Make energy burst visible
                fingerprintEnergyBurst.style.opacity = '0.8';
                fingerprintEnergyBurst.style.transform = 'scale(0.8)';
                fingerprintEnergyBurst.classList.add('animate-energy-burst');

                // Remove animation class after it completes
                setTimeout(() => {
                    fingerprintEnergyBurst.classList.remove('animate-energy-burst');
                    fingerprintEnergyBurst.style.opacity = '0';
                    fingerprintEnergyBurst.style.transform = 'scale(0)';
                }, 1500);
            }

            // Function to create 3D floating symbols
            function createFloatingSymbols() {
                const symbols = ['$', 'D', 'A', 'N', '💎', '🔐', '⚡'];
                const container = document.querySelector('.logo-container');

                if (container) {
                    for (let i = 0; i < 10; i++) {
                        const symbol = document.createElement('div');
                        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];

                        symbol.textContent = randomSymbol;
                        symbol.classList.add('absolute', 'text-xl', 'font-bold', 'text-white', 'animate-rotate-3d', 'pointer-events-none');
                        symbol.style.textShadow = '0 0 10px rgba(217, 70, 239, 0.8)';

                        // Random position around the fingerprint
                        const angle = Math.random() * Math.PI * 2;
                        const distance = 60 + Math.random() * 80;
                        const top = 50 + Math.sin(angle) * distance;
                        const left = 50 + Math.cos(angle) * distance;

                        symbol.style.top = `${top}%`;
                        symbol.style.left = `${left}%`;

                        // Random animation duration and delay
                        symbol.style.animationDuration = `${2 + Math.random() * 3}s`;
                        symbol.style.animationDelay = `${Math.random() * 0.5}s`;

                        // Add to container
                        container.appendChild(symbol);

                        // Remove after animation
                        setTimeout(() => {
                            symbol.style.opacity = '0';
                            setTimeout(() => symbol.remove(), 500);
                        }, 3000 + Math.random() * 1000);
                    }
                }
            }

            // Click event handler for fingerprint
            fingerprintClickable.addEventListener('click', () => {
                // Increment click count
                clickCount = (clickCount + 1) % 5; // Reset after 5 clicks

                // Create ripple effect
                createRippleEffect();

                // Create particle explosion
                createParticleExplosion();

                // Create energy burst
                createEnergyBurst();

                // On every third click, create floating symbols
                if (clickCount % 3 === 0) {
                    createFloatingSymbols();
                }

                // Add accessibility announcement for screen readers
                const announcement = document.createElement('div');
                announcement.setAttribute('role', 'status');
                announcement.setAttribute('aria-live', 'polite');
                announcement.classList.add('sr-only'); // Screen reader only
                announcement.textContent = 'Activated fingerprint effect!';
                document.body.appendChild(announcement);

                // Remove announcement after it's read
                setTimeout(() => {
                    announcement.remove();
                }, 1000);
            });

            // Keyboard event for accessibility
            fingerprintClickable.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    fingerprintClickable.click();
                }
            });
        }
    }

    // Title 3D effect
    const title3dContainer = document.querySelector('.title-3d-container');
    if (title3dContainer) {
        document.addEventListener('mousemove', (e) => {
            // Only apply effect on larger screens
            if (window.innerWidth >= 768) {
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                // Calculate subtle rotation based on mouse position
                const rotateY = ((mouseX - (windowWidth / 2)) / (windowWidth / 2)) * 2;
                const rotateX = -((mouseY - (windowHeight / 2)) / (windowHeight / 2)) * 1;

                // Apply transform with smooth transition
                requestAnimationFrame(() => {
                    title3dContainer.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(0)`;
                });
            }
        });
    }

    // Parallax effect for cosmic dust
    const cosmicDustElements = document.querySelectorAll('.cosmic-dust');
    if (cosmicDustElements.length > 0) {
        document.addEventListener('mousemove', (e) => {
            // Only apply effect on larger screens
            if (window.innerWidth >= 768) {
                const mouseX = e.clientX;
                const mouseY = e.clientY;
                const windowWidth = window.innerWidth;
                const windowHeight = window.innerHeight;

                cosmicDustElements.forEach((element, index) => {
                    // Calculate movement based on mouse position with different factors for each element
                    const moveX = ((mouseX - (windowWidth / 2)) / (windowWidth / 2)) * (10 + index * 5);
                    const moveY = ((mouseY - (windowHeight / 2)) / (windowHeight / 2)) * (10 + index * 5);

                    // Apply transform with smooth transition
                    requestAnimationFrame(() => {
                        element.style.transform = `translate(${moveX}px, ${moveY}px)`;
                    });
                });
            }
        });
    }

    // --- Newsletter Form Submission ---
    const newsletterForm = document.getElementById("newsletter-form");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", subscribeNewsletter);
    } else {
        console.warn("Newsletter form with ID 'newsletter-form' not found.");
    }

    // --- Scroll Navigation Logic ---
    setupScrollNavigation();


    // Testimonials section has been removed

    // --- Mobile App Store Buttons Coming Soon Notification ---
    const storeButtons = document.querySelectorAll('.store-button-trigger');
    const comingSoonNotification = document.getElementById('coming-soon-notification');
    const closeNotificationBtn = document.getElementById('close-notification');
    const storeNameElement = document.getElementById('store-name');
    const joinWaitlistBtn = document.getElementById('join-waitlist-btn');

    if (storeButtons.length && comingSoonNotification && closeNotificationBtn && storeNameElement) {
        // Function to show notification
        function showComingSoonNotification(storeName) {
            // Update store name in the message
            storeNameElement.textContent = storeName;

            // Show notification with animation
            comingSoonNotification.classList.remove('opacity-0', 'pointer-events-none');
            comingSoonNotification.classList.add('opacity-100', 'pointer-events-auto');

            // Animate the content
            const notificationContent = comingSoonNotification.querySelector('.notification-content');
            if (notificationContent) {
                setTimeout(() => {
                    notificationContent.classList.remove('scale-95');
                    notificationContent.classList.add('scale-100');
                }, 10);
            }

            // Add body class to prevent scrolling
            document.body.classList.add('overflow-hidden');
        }

        // Function to hide notification
        function hideComingSoonNotification() {
            // Hide notification with animation
            const notificationContent = comingSoonNotification.querySelector('.notification-content');
            if (notificationContent) {
                notificationContent.classList.remove('scale-100');
                notificationContent.classList.add('scale-95');
            }

            // Delay the opacity transition slightly for better animation
            setTimeout(() => {
                comingSoonNotification.classList.remove('opacity-100', 'pointer-events-auto');
                comingSoonNotification.classList.add('opacity-0', 'pointer-events-none');
            }, 200);

            // Remove body class to allow scrolling again
            document.body.classList.remove('overflow-hidden');
        }

        // Add click event listeners to store buttons
        storeButtons.forEach(button => {
            button.addEventListener('click', () => {
                const storeName = button.getAttribute('data-store') || 'app stores';
                showComingSoonNotification(storeName);
            });
        });

        // Add click event listener to close button
        closeNotificationBtn.addEventListener('click', hideComingSoonNotification);

        // Close notification when clicking outside the content
        comingSoonNotification.addEventListener('click', (e) => {
            if (e.target === comingSoonNotification) {
                hideComingSoonNotification();
            }
        });

        // Add click event listener to join waitlist button
        if (joinWaitlistBtn) {
            joinWaitlistBtn.addEventListener('click', () => {
                // Scroll to the QR code section when clicked
                const qrCodeSection = document.querySelector('.qr-code-container');
                if (qrCodeSection) {
                    hideComingSoonNotification();
                    setTimeout(() => {
                        qrCodeSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        // Add a highlight effect to the QR code
                        qrCodeSection.classList.add('ring-4', 'ring-blue-500', 'ring-opacity-70');
                        setTimeout(() => {
                            qrCodeSection.classList.remove('ring-4', 'ring-blue-500', 'ring-opacity-70');
                        }, 2000);
                    }, 300);
                }
            });
        }

        // Add keyboard event listener to close with Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !comingSoonNotification.classList.contains('opacity-0')) {
                hideComingSoonNotification();
            }
        });
    }
}); // --- End DOMContentLoaded ---


// --- Newsletter Subscription Function ---
async function subscribeNewsletter(event) {
     event.preventDefault(); // Prevent default form submission behavior

     const emailInput = document.getElementById("email");
     const message = document.getElementById("subscription-message");
     const subscribeButton = document.getElementById("subscribe-button");

     if (!emailInput || !message || !subscribeButton) {
        console.error("Newsletter form elements (email, message, button) not found.");
        return;
     }

     const email = emailInput.value.trim();

     // Basic client-side validation
     if (!email || !emailInput.checkValidity()) {
         message.textContent = "Please enter a valid email address.";
         message.classList.remove("hidden", "text-green-400");
         message.classList.add("text-red-500"); // Use red for error messages
         emailInput.focus();
         return;
     }

     // Update UI during submission
     subscribeButton.textContent = "Subscribing...";
     subscribeButton.disabled = true;
     message.classList.add("hidden"); // Hide previous messages
     message.classList.remove("text-red-500", "text-green-400"); // Reset message color

     // Your Google Apps Script URL
     const scriptURL = "https://script.google.com/macros/s/AKfycbzBVe_hIaecNcXRLm-NQB33pUzSYNhoF2D7fFg6JTgy2vYWiW56QbIJXy_AZ61GKOJ8/exec";
     const formData = new FormData();
     formData.append("email", email);

     try {
         const response = await fetch(scriptURL, { method: "POST", body: formData });

         // Check for successful submission (Google Apps Script often returns redirects/opaque responses)
         if (response.ok || response.type === 'opaque' || response.status === 200 || response.status === 302) {
             message.textContent = "✅ Success! Thanks for subscribing.";
             message.classList.remove("hidden");
             message.classList.add("text-green-400"); // Green for success
             emailInput.value = ""; // Clear the input field
             // Hide the success message after a few seconds
             setTimeout(() => message.classList.add('hidden'), 5000);
         } else {
              // Handle non-successful responses
              throw new Error(`Subscription failed with status: ${response.status}`);
         }
     } catch (error) {
         console.error("Error submitting newsletter form:", error);
         message.textContent = "❌ Error! Subscription failed. Please try again later.";
         message.classList.remove("hidden");
         message.classList.add("text-red-500"); // Red for error
     } finally {
          // Always re-enable the button and reset its text
          subscribeButton.textContent = "Subscribe";
          subscribeButton.disabled = false;
      }
 }

// --- Scroll Navigation Setup Function ---
function setupScrollNavigation() {
    const scrollNav = document.getElementById('scroll-nav');
    if (!scrollNav) {
        console.warn("Scroll navigation element (#scroll-nav) not found.");
        return;
    }

    const nodes = scrollNav.querySelectorAll('.scroll-nav-node');
    const revealBar = scrollNav.querySelector('.scroll-nav-red-container');
    const logoLink = scrollNav.querySelector('.scroll-nav-logo-link');
    const blueLine = scrollNav.querySelector('.scroll-nav-blue-line');
    const currentSectionDisplay = document.getElementById('scroll-nav-section-name');

    if (!nodes.length || !revealBar || !logoLink || !blueLine) {
        console.error("Required elements for scroll navigation missing (nodes, revealBar, logoLink, blueLine).");
        return;
    }

    // --- Get Target Sections and Positions ---
    const targetSections = [];
    const targetPositions = [];
    const sectionLabels = [];
    const sectionScrollPadding = 100;

    // Get node targets and their labels
    const nodeTargets = Array.from(nodes).map(node => {
        sectionLabels.push(node.dataset.label || 'Section');
        return node.dataset.target;
    });

    nodeTargets.forEach(selector => {
        const section = document.querySelector(selector);
        if (section) {
            targetSections.push(section);
            targetPositions.push(section.getBoundingClientRect().top + window.scrollY);
        } else {
            console.warn(`Scroll nav target section "${selector}" not found.`);
        }
    });

    if (!targetPositions.length) {
        console.error("No valid target sections found for scroll navigation.");
        scrollNav.style.display = 'none';
        return;
    }

    // --- Calculate Node Spacing ---
    const firstNodeOffsetLeft = nodes[0].offsetLeft;
    const nodePositionsX = Array.from(nodes).map(node =>
        node.offsetLeft - firstNodeOffsetLeft + (node.offsetWidth / 2)
    );

    // --- Add particle animation ---
    function animateParticles() {
        const particles = scrollNav.querySelectorAll('.scroll-nav-particles span');
        particles.forEach(particle => {
            // Randomize initial positions slightly
            const randomX = (Math.random() - 0.5) * 10;
            const randomY = (Math.random() - 0.5) * 10;
            particle.style.transform = `translate(${randomX}px, ${randomY}px)`;
        });
    }

    // Run particle animation
    animateParticles();

    // --- Scroll Event Handler ---
    let lastScrollTop = 0;
    let scrollDirection = 'down';

    const handleScroll = () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const windowHeight = window.innerHeight;

        // Determine scroll direction
        scrollDirection = scrollTop > lastScrollTop ? 'down' : 'up';
        lastScrollTop = scrollTop;

        // Adjust activation point based on scroll direction
        const activationPoint = scrollTop + windowHeight * (scrollDirection === 'down' ? 0.6 : 0.4);

        let currentTargetIndex = -1;

        // Determine which section is currently active
        for (let i = targetPositions.length - 1; i >= 0; i--) {
            if (activationPoint >= targetPositions[i] - sectionScrollPadding) {
                currentTargetIndex = i;
                break;
            }
        }

        // Update node active states with enhanced effects
        nodes.forEach((node, index) => {
            const isActive = index === currentTargetIndex;
            const wasActive = node.classList.contains('active');

            if (isActive && !wasActive) {
                // Activate this node with effects
                node.classList.add('active');
                node.classList.add('activating');

                // Update current section display with animation only on mobile
                if (currentSectionDisplay && window.innerWidth < 1024) {
                    // Fade out
                    currentSectionDisplay.style.opacity = '0';
                    currentSectionDisplay.style.transform = 'translateY(5px)';

                    // After a short delay, update text and fade in
                    setTimeout(() => {
                        currentSectionDisplay.textContent = sectionLabels[index] || 'Section';
                        currentSectionDisplay.style.opacity = '1';
                        currentSectionDisplay.style.transform = 'translateY(0)';
                    }, 200);
                }

                // Enhance glow effects when section changes
                const glows = scrollNav.querySelectorAll('.scroll-nav-glow');
                glows.forEach(glow => {
                    glow.style.opacity = '0.3';
                    setTimeout(() => {
                        glow.style.opacity = '0.15';
                    }, 800);
                });

                // Remove activating class after transition
                setTimeout(() => node.classList.remove('activating'), 10);
            } else if (!isActive && wasActive) {
                node.classList.remove('active');
            }
        });

        // Check if we're in desktop mode (vertical nav)
        const isDesktopMode = window.innerWidth >= 1024;

        // Update progress bar (width for horizontal, height for vertical)
        if (isDesktopMode) {
            // Vertical progress bar for desktop
            let barHeight = 0;
            if (currentTargetIndex === -1) {
                barHeight = 0;
            } else {
                // Get node positions vertically
                const nodePositionsY = Array.from(nodes).map(node =>
                    node.offsetTop + (node.offsetHeight / 2) - nodes[0].offsetTop
                );

                const currentNodePosY = nodePositionsY[currentTargetIndex];

                if (currentTargetIndex === targetPositions.length - 1) {
                    // Last section is active, fill bar to the last node
                    barHeight = currentNodePosY;
                } else {
                    // Calculate progress with improved easing
                    const sectionStart = targetPositions[currentTargetIndex] - sectionScrollPadding;
                    const nextSectionStart = targetPositions[currentTargetIndex + 1] - sectionScrollPadding;
                    const sectionTravel = nextSectionStart - sectionStart;
                    const scrollInSection = Math.max(0, activationPoint - sectionStart);

                    // Use cubic easing for smoother progress
                    let progress = Math.min(1, scrollInSection / sectionTravel);
                    progress = easeInOutCubic(progress);

                    const nextNodePosY = nodePositionsY[currentTargetIndex + 1];
                    const segmentHeight = nextNodePosY - currentNodePosY;
                    barHeight = currentNodePosY + (segmentHeight * progress);
                }
            }

            // Apply progress bar height with limits
            const blueLineHeight = blueLine.offsetHeight;
            revealBar.style.height = `${Math.min(barHeight, blueLineHeight)}px`;
            revealBar.style.width = '2px'; // Ensure width is set for vertical mode
        } else {
            // Horizontal progress bar for mobile
            let barWidth = 0;
            if (currentTargetIndex === -1) {
                barWidth = 0;
            } else {
                const currentNodePosX = nodePositionsX[currentTargetIndex];

                if (currentTargetIndex === targetPositions.length - 1) {
                    barWidth = currentNodePosX;
                } else {
                    // Calculate progress with improved easing
                    const sectionStart = targetPositions[currentTargetIndex] - sectionScrollPadding;
                    const nextSectionStart = targetPositions[currentTargetIndex + 1] - sectionScrollPadding;
                    const sectionTravel = nextSectionStart - sectionStart;
                    const scrollInSection = Math.max(0, activationPoint - sectionStart);

                    // Use cubic easing for smoother progress
                    let progress = Math.min(1, scrollInSection / sectionTravel);
                    progress = easeInOutCubic(progress);

                    const nextNodePosX = nodePositionsX[currentTargetIndex + 1];
                    const segmentWidth = nextNodePosX - currentNodePosX;
                    barWidth = currentNodePosX + (segmentWidth * progress);
                }
            }

            // Apply progress bar width with limits
            const blueLineWidth = blueLine.offsetWidth;
            revealBar.style.width = `${Math.min(barWidth, blueLineWidth)}px`;
            revealBar.style.height = '2px'; // Ensure height is set for horizontal mode
        }
    };

    // Easing function for smoother animations
    function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    // --- Enhanced Click Event Handlers ---
    nodes.forEach((node, index) => {
        node.addEventListener('click', () => {
            if (index < targetPositions.length) {
                // Add click effect
                node.classList.add('activating');
                setTimeout(() => node.classList.remove('activating'), 300);

                // Scroll to target with enhanced smoothness
                const targetScrollTop = targetPositions[index];

                // Use smooth scroll with callback
                smoothScrollTo(targetScrollTop, 800);
            }
        });
    });

    logoLink.addEventListener('click', (e) => {
        e.preventDefault();

        // Add click effect to logo
        const logoGlow = logoLink.querySelector('.scroll-nav-logo-glow');
        if (logoGlow) {
            logoGlow.style.opacity = '1';
            logoGlow.style.transform = 'scale(2)';
            setTimeout(() => {
                logoGlow.style.opacity = '0';
                logoGlow.style.transform = 'scale(1)';
            }, 800);
        }

        // Scroll to top with enhanced smoothness
        smoothScrollTo(0, 800);

        // Update section name only on mobile
        if (currentSectionDisplay && window.innerWidth < 1024) {
            currentSectionDisplay.style.opacity = '0';
            setTimeout(() => {
                currentSectionDisplay.textContent = 'Top';
                currentSectionDisplay.style.opacity = '1';
            }, 200);
        }
    });

    // Enhanced smooth scroll function
    function smoothScrollTo(targetY, duration) {
        const startY = window.scrollY;
        const difference = targetY - startY;
        const startTime = performance.now();

        function step() {
            const currentTime = performance.now();
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Use easing function for smoother motion
            const easeProgress = easeInOutCubic(progress);

            window.scrollTo(0, startY + difference * easeProgress);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }

        requestAnimationFrame(step);
    }

    // --- Initial Call & Attach Listener ---
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- Enhanced Resize Handler ---
    let resizeTimeout;
    let lastScreenWidth = window.innerWidth;

    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const isDesktopMode = window.innerWidth >= 1024;
            const wasDesktopMode = lastScreenWidth >= 1024;
            const layoutChanged = (isDesktopMode !== wasDesktopMode);

            // Update for next resize check
            lastScreenWidth = window.innerWidth;

            // Handle layout transition animations
            if (layoutChanged) {
                // Reset any existing transforms
                scrollNav.style.transition = 'none';
                scrollNav.style.transform = isDesktopMode ?
                    'translateY(-50%)' :
                    'translateX(-50%)';

                // Force reflow
                void scrollNav.offsetWidth;

                // Add transition back
                scrollNav.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';

                // Apply appropriate animation based on new layout
                if (isDesktopMode) {
                    // Animate for desktop mode
                    scrollNav.style.transform = 'translateY(-50%) scale(0.95)';
                    setTimeout(() => {
                        scrollNav.style.transform = 'translateY(-50%)';
                    }, 300);
                } else {
                    // Animate for mobile mode
                    scrollNav.style.transform = 'translateX(-50%) scale(0.95)';
                    setTimeout(() => {
                        scrollNav.style.transform = 'translateX(-50%)';
                    }, 300);
                }

                // Reset progress bar
                if (isDesktopMode) {
                    revealBar.style.width = '2px';
                    revealBar.style.height = '0';
                } else {
                    revealBar.style.height = '2px';
                    revealBar.style.width = '0';
                }
            } else {
                // Simple scale animation for same layout
                const transform = isDesktopMode ?
                    'translateY(-50%) scale(0.98)' :
                    'translateX(-50%) scale(0.98)';

                scrollNav.style.transform = transform;
                setTimeout(() => {
                    scrollNav.style.transform = isDesktopMode ?
                        'translateY(-50%)' :
                        'translateX(-50%)';
                }, 300);
            }

            // Recalculate positions
            targetPositions.length = 0;
            targetSections.forEach(section => {
                targetPositions.push(section.getBoundingClientRect().top + window.scrollY);
            });

            // Recalculate node positions
            const newFirstNodeOffsetLeft = nodes[0].offsetLeft;
            nodePositionsX.length = 0;
            nodes.forEach(node => {
                nodePositionsX.push(node.offsetLeft - newFirstNodeOffsetLeft + (node.offsetWidth / 2));
            });

            // Update the navigation state
            handleScroll();
        }, 250);
    });
}

// Testimonials section has been removed

// --- Optional: Copy to Clipboard Helper Function ---
// (Keep if you plan to add copy buttons, otherwise remove)
function copyToClipboard(text, buttonElement) {
   if (!navigator.clipboard) {
      console.warn("Clipboard API not available.");
      // Implement fallback if needed (e.g., using document.execCommand)
      return;
   }

   navigator.clipboard.writeText(text).then(() => {
       const originalText = buttonElement.innerHTML;
       // Indicate success
       buttonElement.innerHTML = '<i class="fas fa-check mr-1"></i> Copied!';
       buttonElement.classList.add('bg-green-600', 'border-green-500'); // Add temporary success styles
       // Revert after a delay
       setTimeout(() => {
           buttonElement.innerHTML = originalText;
           buttonElement.classList.remove('bg-green-600', 'border-green-500');
       }, 2000); // 2 seconds
   }).catch(err => {
       console.error('Failed to copy text: ', err);
       const originalText = buttonElement.innerHTML;
       // Indicate failure
       buttonElement.innerHTML = '<i class="fas fa-times mr-1"></i> Failed';
       buttonElement.classList.add('bg-red-600', 'border-red-500'); // Add temporary error styles
       // Revert after a delay
        setTimeout(() => {
           buttonElement.innerHTML = originalText;
           buttonElement.classList.remove('bg-red-600', 'border-red-500');
       }, 2500); // 2.5 seconds
   });
}
