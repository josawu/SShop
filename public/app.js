let cart=[];
let tg=window.Telegram.WebApp;
let userId=tg.initDataUnsafe.user?.id;

async function loadProducts(){
  const res=await fetch("/api/products");
  const products=await res.json();
  const div=document.getElementById("products");
  div.innerHTML="";
  products.forEach(p=>{
    div.innerHTML+=`
    <div class="product">
      <img src="${p.image}" width="150">
      <h3>${p.name}</h3>
      <p>${p.price}€</p>
      <button onclick='add(${JSON.stringify(p)})'>Добавить</button>
    </div>`;
  });
}

function add(p){
  cart.push(p);
  renderCart();
}

function renderCart(){
  const div=document.getElementById("cart");
  div.innerHTML="";
  cart.forEach(p=>{
    div.innerHTML+=p.name+"<br>";
  });
}

async function checkout(){
  await fetch("/api/order",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      cart,
      name:name.value,
      phone:phone.value,
      address:address.value,
      userId
    })
  });
  alert("Заказ отправлен");
}

loadProducts();
