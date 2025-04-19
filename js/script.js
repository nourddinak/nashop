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

                 // 1. Create the outer wrapper div
                 const brandLogoDiv = document.createElement('div');
                 brandLogoDiv.className = 'brandLogo'; // Use the class from example CSS
                 brandLogoDiv.setAttribute('role', 'listitem'); // Role on the wrapper

                 // 2. Create the image element
                 const img = document.createElement('img');
                 img.src = logoBasePath + filename;
                 img.loading = 'lazy';

                 // Clean up alt text
                 let altText = filename.substring(0, filename.lastIndexOf('.')) || filename;
                 altText = altText.replace(/[-_]/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
                 img.alt = `Nashop Partner: ${altText}`;

                 // 3. **No need to add Tailwind classes to the IMG now**
                 // Styling is handled by `.brandLogo img` in style.css
                 // img.className = '...'; // Remove or comment this out

                 // 4. Append the image to the wrapper div
                 brandLogoDiv.appendChild(img);

                 // 5. Append the wrapper div to both logo sets
                 logoSet1Container.appendChild(brandLogoDiv.cloneNode(true)); // Add to set 1
                 logoSet2Container.appendChild(brandLogoDiv.cloneNode(true)); // Add to set 2
             });

            // Optional: Dynamically calculate track width after logos are added
            // This makes the animation calculation more robust
            const firstSetWidth = logoSet1Container.offsetWidth;
            const trackElement = document.getElementById('partner-marquee');
            if (trackElement) {
                 // Set total track width (set1 width + set2 width)
                 // Might need slight adjustments depending on exact rendering
                 trackElement.style.width = `${firstSetWidth * 2}px`;
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
                el.classList.add('is-visible');
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
                  // Calculate position relative to the card's center
                  const x = e.clientX - rect.left - rect.width / 2;
                  const y = e.clientY - rect.top - rect.height / 2;

                  // Calculate rotation angles (adjust sensitivity multipliers as needed)
                  const rotateY = (x / (rect.width / 2)) * 7;
                  const rotateX = -(y / (rect.height / 2)) * 5;

                  // Apply transformation using requestAnimationFrame for performance
                  requestAnimationFrame(() => {
                     card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(5px) scale(1.02)`;
                  });
             });

             // Reset transformation on mouse leave
             container.addEventListener('mouseleave', () => {
                 requestAnimationFrame(() => {
                     card.style.transform = ''; // Resets to CSS defined transform
                 });
             });
         } else {
            console.warn("No element with class 'card-3d-effect' found inside a 'perspective-container'.");
         }
    });

    // --- Newsletter Form Submission ---
    const newsletterForm = document.getElementById("newsletter-form");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", subscribeNewsletter);
    } else {
        console.warn("Newsletter form with ID 'newsletter-form' not found.");
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
