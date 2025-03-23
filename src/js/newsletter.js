const newsletterSignupForm = document.getElementById('newsletter-signup-form');

newsletterSignupForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = newsletterSignupForm.elements['email'].value;
  
  // Save to localStorage
  localStorage.setItem('email', email);
  console.log(`Email saved to local storage: ${email}`);

  // Show success message (prevent duplicates)
  let successMessage = document.getElementById('newsletter-success');
  if (!successMessage) {
    successMessage = document.createElement('div');
    successMessage.id = 'newsletter-success';
    successMessage.textContent = 'Thank you for signing up for our newsletter!';
    successMessage.style.marginTop = '10px';
    newsletterSignupForm.appendChild(successMessage);
  }
});
