let tg=window.Telegram.WebApp;
let adminId=tg.initDataUnsafe.user?.id;

async function addProduct(){
  await fetch("/api/products",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      adminId,
      name:name.value,
      price:Number(price.value),
      image:image.value
    })
  });
  status.innerText="Добавлено";
}
