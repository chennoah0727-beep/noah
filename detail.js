const menu = document.querySelector('#menu');
const nav = document.querySelector('#nav');
const mobile = window.matchMedia('(max-width: 820px)');

function resetMenu() {
  menu.hidden = !mobile.matches;
  nav.hidden = mobile.matches;
  menu.setAttribute('aria-expanded', 'false');
}

menu.addEventListener('click', () => {
  nav.hidden = !nav.hidden;
  menu.setAttribute('aria-expanded', String(!nav.hidden));
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && mobile.matches && !nav.hidden) {
    resetMenu();
    menu.focus();
  }
});

mobile.addEventListener('change', resetMenu);
resetMenu();
