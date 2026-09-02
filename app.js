const seedCards = [
  { name: 'Pikachu', set: 'sv151', setName: 'Scarlet & Violet 151', rarity: 'Illustration Rare', number: '173/165', value: 28.5, condition: 'Near Mint', image: 'https://images.pokemontcg.io/sv3pt5/173.png', liked: true },
  { name: 'Charizard ex', set: 'sv151', setName: 'Scarlet & Violet 151', rarity: 'Ultra Rare', number: '199/165', value: 42.15, condition: 'Near Mint', image: 'https://images.pokemontcg.io/sv3pt5/199.png', liked: false },
  { name: 'Umbreon VMAX', set: 'sv-obf', setName: 'Obsidian Flames', rarity: 'Rare Holo', number: '095/203', value: 18.75, condition: 'Near Mint', image: 'https://images.pokemontcg.io/swsh7/095.png', liked: true },
  { name: 'Mew ex', set: 'sv151', setName: 'Scarlet & Violet 151', rarity: 'Ultra Rare', number: '193/165', value: 25.0, condition: 'Near Mint', image: 'https://images.pokemontcg.io/sv3pt5/193.png', liked: false },
  { name: 'Gengar', set: 'base', setName: 'Base Set', rarity: 'Rare Holo', number: '5/102', value: 86.25, condition: 'Lightly Played', image: 'https://images.pokemontcg.io/base1/5.png', liked: true },
  { name: 'Eevee', set: 'sv151', setName: 'Scarlet & Violet 151', rarity: 'Illustration Rare', number: '133/165', value: 12.4, condition: 'Near Mint', image: 'https://images.pokemontcg.io/sv3pt5/133.png', liked: false },
  { name: 'Lugia', set: 'neo', setName: 'Neo Genesis', rarity: 'Rare Holo', number: '9/111', value: 112.0, condition: 'Moderately Played', image: 'https://images.pokemontcg.io/neo1/9.png', liked: false },
  { name: 'Bulbasaur', set: 'sv151', setName: 'Scarlet & Violet 151', rarity: 'Illustration Rare', number: '166/165', value: 16.8, condition: 'Near Mint', image: 'https://images.pokemontcg.io/sv3pt5/166.png', liked: false },
  { name: 'Mewtwo', set: 'base', setName: 'Base Set', rarity: 'Rare Holo', number: '10/102', value: 44.0, condition: 'Near Mint', image: 'https://images.pokemontcg.io/base1/10.png', liked: false },
  { name: 'Psyduck', set: 'sv151', setName: 'Scarlet & Violet 151', rarity: 'Illustration Rare', number: '175/165', value: 22.7, condition: 'Near Mint', image: 'https://images.pokemontcg.io/sv3pt5/175.png', liked: true },
  { name: 'Tyranitar', set: 'neo', setName: 'Neo Genesis', rarity: 'Rare Holo', number: '12/111', value: 31.2, condition: 'Lightly Played', image: 'https://images.pokemontcg.io/neo1/12.png', liked: false },
  { name: 'Charmander', set: 'sv151', setName: 'Scarlet & Violet 151', rarity: 'Illustration Rare', number: '168/165', value: 19.9, condition: 'Near Mint', image: 'https://images.pokemontcg.io/sv3pt5/168.png', liked: false }
];

let cards = JSON.parse(localStorage.getItem('cardfolio-cards') || 'null') || seedCards;
const grid = document.querySelector('#cardGrid');
const emptyState = document.querySelector('#emptyState');
const searchInput = document.querySelector('#searchInput');
const setFilter = document.querySelector('#setFilter');
const rarityFilter = document.querySelector('#rarityFilter');
const sortFilter = document.querySelector('#sortFilter');

function renderCards() {
  const search = searchInput.value.toLowerCase().trim();
  const set = setFilter.value;
  const rarity = rarityFilter.value;
  let visible = cards.filter(card => (!search || `${card.name} ${card.setName} ${card.rarity}`.toLowerCase().includes(search)) && (set === 'all' || card.set === set) && (rarity === 'all' || card.rarity === rarity));
  if (sortFilter.value === 'value-high') visible.sort((a, b) => b.value - a.value);
  if (sortFilter.value === 'value-low') visible.sort((a, b) => a.value - b.value);
  if (sortFilter.value === 'name') visible.sort((a, b) => a.name.localeCompare(b.name));
  grid.innerHTML = visible.map((card, index) => `<article class="card-item"><div class="card-image"><button class="heart ${card.liked ? 'liked' : ''}" data-heart="${cards.indexOf(card)}" aria-label="${card.liked ? 'Remove from favorites' : 'Add to favorites'}">${card.liked ? '♥' : '♡'}</button><img src="${card.image}" alt="${card.name} card" loading="lazy" onerror="this.src='https://placehold.co/145x205/e9edf3/7c879a?text=Card'" /></div><div class="card-details"><h3>${card.name}</h3><div class="meta"><span>${card.setName}</span><span>#${card.number}</span></div><div class="card-footer"><span class="rarity">${card.rarity}</span><span class="card-price">$${Number(card.value).toFixed(2)}<small>${card.condition}</small></span></div></div></article>`).join('');
  emptyState.hidden = visible.length > 0;
  grid.hidden = visible.length === 0;
  document.querySelector('#resultCount').textContent = visible.length;
  document.querySelector('#collectionCount').textContent = cards.length;
  document.querySelector('#totalCards').textContent = cards.length + 112;
  renderChips();
}

function renderChips() {
  const chips = [];
  if (setFilter.value !== 'all') chips.push({ element: setFilter, label: setFilter.options[setFilter.selectedIndex].text });
  if (rarityFilter.value !== 'all') chips.push({ element: rarityFilter, label: rarityFilter.value });
  document.querySelector('#activeFilters').innerHTML = chips.map(chip => `<span class="filter-chip">${chip.label}<button data-clear="${chip.element.id}" aria-label="Remove ${chip.label} filter">×</button></span>`).join('');
}

[searchInput, setFilter, rarityFilter, sortFilter].forEach(control => control.addEventListener('input', renderCards));
grid.addEventListener('click', event => {
  const button = event.target.closest('[data-heart]');
  if (!button) return;
  cards[Number(button.dataset.heart)].liked = !cards[Number(button.dataset.heart)].liked;
  localStorage.setItem('cardfolio-cards', JSON.stringify(cards));
  renderCards();
});
document.querySelector('#activeFilters').addEventListener('click', event => { const button = event.target.closest('[data-clear]'); if (button) { document.querySelector(`#${button.dataset.clear}`).value = 'all'; renderCards(); } });
document.querySelector('#clearFilters').addEventListener('click', () => { searchInput.value = ''; setFilter.value = 'all'; rarityFilter.value = 'all'; renderCards(); });
document.querySelectorAll('.view-button').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.view-button').forEach(item => item.classList.remove('active')); button.classList.add('active'); grid.classList.toggle('list-view', button.dataset.layout === 'list'); }));
document.querySelectorAll('.nav-item[data-view]').forEach(button => button.addEventListener('click', () => { document.querySelectorAll('.nav-item[data-view]').forEach(item => item.classList.remove('active')); button.classList.add('active'); if (button.dataset.view !== 'collection') alert(`${button.textContent.trim()} is coming soon.`); }));

const modal = document.querySelector('#modalBackdrop');
function closeModal() { modal.hidden = true; }
document.querySelector('#openModal').addEventListener('click', () => { modal.hidden = false; document.querySelector('[name="name"]').focus(); });
document.querySelector('#closeModal').addEventListener('click', closeModal);
document.querySelector('#cancelModal').addEventListener('click', closeModal);
modal.addEventListener('click', event => { if (event.target === modal) closeModal(); });
document.querySelector('#cardForm').addEventListener('submit', event => {
  event.preventDefault();
  const form = new FormData(event.target);
  const setName = { sv151: 'Scarlet & Violet 151', base: 'Base Set', neo: 'Neo Genesis', 'sv-obf': 'Obsidian Flames' }[form.get('set')];
  cards.unshift({ name: form.get('name'), set: form.get('set'), setName, rarity: form.get('rarity'), number: 'NEW', value: Number(form.get('value') || 0), condition: form.get('condition'), image: 'https://placehold.co/145x205/e9edf3/7c879a?text=New+Card', liked: false });
  localStorage.setItem('cardfolio-cards', JSON.stringify(cards)); event.target.reset(); closeModal(); renderCards();
});
document.querySelector('#mobileMenu').addEventListener('click', () => document.querySelector('#sidebar').classList.toggle('open'));
renderCards();
