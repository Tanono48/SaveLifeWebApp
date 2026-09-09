const cart = new Map();
const itemsEl = document.querySelector('#cartItems');
const totalEl = document.querySelector('#total');
const orderButton = document.querySelector('#orderButton');
const toast = document.querySelector('#toast');

function money(value) { return `฿${value.toLocaleString('th-TH')}`; }
function renderCart() {
  const entries = [...cart.values()];
  itemsEl.innerHTML = entries.length ? entries.map(item => `
    <div class="cart-item"><div><strong>${item.name}</strong><small>${money(item.price)} / จาน</small></div>
    <div class="quantity"><button data-change="-1" data-name="${item.name}">−</button><b>${item.quantity}</b><button data-change="1" data-name="${item.name}">＋</button></div>
  </div>`).join('') : '<p class="empty">ยังไม่มีเมนูในรายการ<br><span>กด + เพื่อเพิ่มเมนู</span></p>';
  const total = entries.reduce((sum, item) => sum + item.price * item.quantity, 0);
  totalEl.textContent = money(total);
  orderButton.disabled = !entries.length;
}
function notify(message) { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2100); }

document.querySelectorAll('.add').forEach(button => button.addEventListener('click', () => {
  const {name, price} = button.dataset;
  const item = cart.get(name) || { name, price: Number(price), quantity: 0 };
  item.quantity++; cart.set(name, item); renderCart(); notify(`เพิ่ม “${name}” แล้ว`);
}));
itemsEl.addEventListener('click', event => {
  const button = event.target.closest('[data-change]'); if (!button) return;
  const item = cart.get(button.dataset.name); item.quantity += Number(button.dataset.change);
  if (!item.quantity) cart.delete(item.name); renderCart();
});
document.querySelector('#clearCart').addEventListener('click', () => { cart.clear(); renderCart(); });
document.querySelectorAll('.category').forEach(button => button.addEventListener('click', () => {
  document.querySelector('.category.active').classList.remove('active'); button.classList.add('active');
  document.querySelectorAll('.menu-card').forEach(card => card.hidden = button.dataset.category !== 'all' && card.dataset.category !== button.dataset.category);
}));
document.querySelector('#splitBill').addEventListener('click', () => notify('ฟีเจอร์หารบิลพร้อมใช้งานหลังยืนยันออเดอร์'));
orderButton.addEventListener('click', () => { notify('ส่งออเดอร์เข้าครัวเรียบร้อย!'); cart.clear(); renderCart(); });
renderCart();
