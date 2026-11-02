/* ===========================================================
   script.js - each feature is a small function, called at the bottom.
   Features:
   1  Footer year               2  Mobile menu               3  Esc key closes menu
   4  Dark/Light theme (saved)  5  Active nav link on scroll 6  Back-to-top button
   7  Project filter + counter  8  Show/hide key features    9  Form validation on submit
   10 Live validation per field 11 Message character counter 12 Profile image fallback
   =========================================================== */

// Short helpers so we type less
const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

// 1. Show the current year in the footer
function setYear() {
  $('#year').textContent = new Date().getFullYear();
}

// 2 + 3. Mobile menu: open/close with the button, close with a link or the Esc key
function setupMenu() {
  const btn = $('#menuBtn');
  const links = $('#navLinks');

  function closeMenu() {
    links.classList.remove('open');
    btn.setAttribute('aria-expanded', 'false');
  }

  btn.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    btn.setAttribute('aria-expanded', open);
  });
  $$('#navLinks a').forEach((a) => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
}

// 4. Dark / Light theme, remembered with localStorage
function setupTheme() {
  const btn = $('#themeBtn');

  function apply(isLight) {
    document.body.classList.toggle('light', isLight);
    btn.textContent = isLight ? '\u263E' : '\u2600'; // moon or sun
    btn.setAttribute('aria-label', isLight ? 'Switch to dark theme' : 'Switch to light theme');
  }

  let saved = null;
  try { saved = localStorage.getItem('theme'); } catch (e) { /* storage blocked, ignore */ }
  apply(saved === 'light');

  btn.addEventListener('click', () => {
    const isLight = !document.body.classList.contains('light');
    apply(isLight);
    try { localStorage.setItem('theme', isLight ? 'light' : 'dark'); } catch (e) { /* ignore */ }
  });
}

// 5 + 6. Things that happen when the page scrolls
function setupScroll() {
  const sections = $$('main section');
  const links = $$('#navLinks a');
  const topBtn = $('#topBtn');

  function onScroll() {
    const y = window.scrollY;

    // 6. show back-to-top after scrolling down
    topBtn.hidden = y < 400;

    // 5. highlight the nav link of the section we are in
    let current = 'home';
    sections.forEach((s) => { if (y >= s.offsetTop - 120) current = s.id; });
    links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  }

  window.addEventListener('scroll', onScroll);
  topBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  onScroll();
}

// 7. Filter projects by category and show how many are visible
function setupFilter() {
  const buttons = $$('.filter');
  const cards = $$('.card');
  const count = $('#count');

  buttons.forEach((btn) => btn.addEventListener('click', () => {
    const type = btn.dataset.filter;
    buttons.forEach((b) => b.classList.toggle('active', b === btn));
    let shown = 0;
    cards.forEach((card) => {
      const match = type === 'all' || card.dataset.category === type;
      card.hidden = !match;
      if (match) shown++;
    });
    count.textContent = 'Showing ' + shown + ' project' + (shown === 1 ? '' : 's');
  }));
  count.textContent = 'Showing ' + cards.length + ' projects';
}

// 8. Show / hide key features on each project card
function setupReadMore() {
  $$('.toggle').forEach((btn) => btn.addEventListener('click', () => {
    const more = btn.parentElement.querySelector('.more');
    more.hidden = !more.hidden;
    btn.textContent = more.hidden ? 'Show key features' : 'Hide key features';
    btn.setAttribute('aria-expanded', !more.hidden);
  }));
}

// 9, 10, 11. Contact form: validation on submit, live validation, character counter
function setupForm() {
  const form = $('#contactForm');
  const name = $('#name');
  const mail = $('#mail');
  const msg = $('#msg');

  // Show (or clear) an error under a field. Returns true when there is no error.
  function setError(input, errId, message) {
    $(errId).textContent = message;
    input.setAttribute('aria-invalid', message !== '');
    return message === '';
  }

  const checkName = () => setError(name, '#nameErr', name.value.trim().length >= 2 ? '' : 'Please enter your name.');
  const checkMail = () => setError(mail, '#mailErr',
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(mail.value.trim()) ? '' : 'Please enter a valid email, like name@example.com.');
  const checkMsg = () => setError(msg, '#msgErr', msg.value.trim().length >= 10 ? '' : 'Message must be at least 10 characters.');

  // 10. check each field when the user leaves it
  name.addEventListener('blur', checkName);
  mail.addEventListener('blur', checkMail);
  msg.addEventListener('blur', checkMsg);

  // 11. character counter
  msg.addEventListener('input', () => { $('#chars').textContent = msg.value.length; });

  // 9. check everything when Send is pressed
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const allOk = [checkName(), checkMail(), checkMsg()].every(Boolean);
    if (allOk) {
      $('#formOk').textContent = 'Thank you ' + name.value.trim() + ' for sending a message.';
      form.reset();
      $('#chars').textContent = '0';
    } else {
      $('#formOk').textContent = '';
    }
  });
}

// 12. If profile.jpg is missing, show initials instead of a broken image
function setupImageFallback() {
  const img = $('#profile');
  img.addEventListener('error', () => {
    const box = document.createElement('div');
    box.className = 'initials';
    box.setAttribute('role', 'img');
    box.setAttribute('aria-label', 'Initials of Haziq');
    box.textContent = 'MH';
    img.replaceWith(box);
  });
}

// Start everything when the page is ready
document.addEventListener('DOMContentLoaded', () => {
  setYear();
  setupMenu();
  setupTheme();
  setupScroll();
  setupFilter();
  setupReadMore();
  setupForm();
  setupImageFallback();
});
