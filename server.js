const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");

const app = express();
app.use(express.json());
app.use(express.static("public"));

const client = new MongoClient(process.env.MONGO_URI);
let db;

async function start(){
  await client.connect();
  db = client.db("shop");
  console.log("MongoDB connected");
}
start();

const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = Number(process.env.ADMIN_ID);

// get products
app.get("/api/products", async (req,res)=>{
  const products = await db.collection("products").find().toArray();
  res.json(products);
});

// add product
app.post("/api/products", async (req,res)=>{
  if(Number(req.body.adminId)!==ADMIN_ID)
    return res.sendStatus(403);

  await db.collection("products").insertOne({
    name:req.body.name,
    price:req.body.price,
    image:req.body.image
  });

  res.json({success:true});
});

// delete product
app.delete("/api/products/:id", async (req,res)=>{
  if(Number(req.body.adminId)!==ADMIN_ID)
    return res.sendStatus(403);

  await db.collection("products").deleteOne({
    _id:new ObjectId(req.params.id)
  });

  res.json({success:true});
});

// order
app.post("/api/order", async (req,res)=>{

  const order = req.body;

  await db.collection("orders").insertOne(order);

  let text="🛒 Новый заказ\n\n";

  order.cart.forEach(p=>{
    text+=p.name+" - "+p.price+"€\n";
  });

  text+="\nИмя: "+order.name;
  text+="\nТелефон: "+order.phone;
  text+="\nАдрес: "+order.address;

  await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({
      chat_id:ADMIN_ID,
      text
    })
  });

  res.json({success:true});
});

app.listen(process.env.PORT||3000, ()=>{
  console.log("Server started");
});
