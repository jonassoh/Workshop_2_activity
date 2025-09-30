db.customers.drop();
db.products.drop();
db.orders.drop();

db.customers.insertMany([
  { _id: 1, name: "Ava Reed",   email: "ava@sample.com",   region: "NA",   created_at: ISODate("2025-06-10T00:00:00Z") },
  { _id: 2, name: "Ben Ortega", email: "ben@sample.com",   region: "NA",   created_at: ISODate("2025-07-02T00:00:00Z") },
  { _id: 3, name: "Chloe Park", email: "chloe@sample.com", region: "EU",   created_at: ISODate("2025-07-15T00:00:00Z") },
  { _id: 4, name: "Drew Khan",  email: "drew@sample.com",  region: "APAC", created_at: ISODate("2025-08-01T00:00:00Z") },
  { _id: 5, name: "Eli Zhang",  email: "eli@sample.com",   region: "EU",   created_at: ISODate("2025-08-05T00:00:00Z") },
  { _id: 6, name: "Fern Cole",  email: "fern@sample.com",  region: "NA",   created_at: ISODate("2025-08-20T00:00:00Z") }
]);

db.products.insertMany([
  { _id: 1, name: "Skyline Tee",    category: "Graphic", price_usd: 25.00 },
  { _id: 2, name: "Minimal Tee",    category: "Plain",   price_usd: 18.00 },
  { _id: 3, name: "Retro Pop Tee",  category: "Graphic", price_usd: 22.00 },
  { _id: 4, name: "Mono Tee",       category: "Plain",   price_usd: 15.00 },
  { _id: 5, name: "Galaxy Limited", category: "Limited", price_usd: 35.00 },
  { _id: 6, name: "Palm Limited",   category: "Limited", price_usd: 40.00 },
  { _id: 7, name: "Sunset Tee",     category: "Graphic", price_usd: 24.00 },
  { _id: 8, name: "Blank Premium",  category: "Plain",   price_usd: 20.00 }
]);

db.orders.insertMany([
  // Ava
  { _id: 1, customer_id: 1, order_date: ISODate("2025-08-28T10:12:00Z"), status: "paid",
    items: [ {product_id:1, quantity:1, unit_price:25.00}, {product_id:2, quantity:2, unit_price:18.00} ] },
  { _id: 2, customer_id: 1, order_date: ISODate("2025-09-04T09:31:00Z"), status: "paid",
    items: [ {product_id:5, quantity:1, unit_price:35.00} ] },
  // Ben
  { _id: 3, customer_id: 2, order_date: ISODate("2025-09-05T14:20:00Z"), status: "paid",
    items: [ {product_id:3, quantity:2, unit_price:22.00} ] },
  { _id: 4, customer_id: 2, order_date: ISODate("2025-09-18T19:05:00Z"), status: "paid",
    items: [ {product_id:6, quantity:1, unit_price:40.00}, {product_id:2, quantity:1, unit_price:18.00} ] },
  // Chloe
  { _id: 5, customer_id: 3, order_date: ISODate("2025-09-02T08:10:00Z"), status: "refunded",
    items: [ {product_id:4, quantity:1, unit_price:15.00} ] },
  { _id: 6, customer_id: 3, order_date: ISODate("2025-09-12T12:44:00Z"), status: "paid",
    items: [ {product_id:7, quantity:1, unit_price:24.00}, {product_id:8, quantity:2, unit_price:20.00} ] },
  // Drew
  { _id: 7, customer_id: 4, order_date: ISODate("2025-09-07T21:03:00Z"), status: "paid",
    items: [ {product_id:1, quantity:1, unit_price:25.00}, {product_id:5, quantity:1, unit_price:35.00} ] },
  // Eli
  { _id: 8, customer_id: 5, order_date: ISODate("2025-09-08T11:55:00Z"), status: "paid",
    items: [ {product_id:2, quantity:3, unit_price:18.00} ] },
  // Fern
  { _id: 9, customer_id: 6, order_date: ISODate("2025-09-10T15:42:00Z"), status: "paid",
    items: [ {product_id:3, quantity:1, unit_price:22.00}, {product_id:4, quantity:1, unit_price:15.00}, {product_id:8, quantity:1, unit_price:20.00} ] },
  { _id:10, customer_id: 6, order_date: ISODate("2025-09-26T16:10:00Z"), status: "paid",
    items: [ {product_id:6, quantity:1, unit_price:40.00} ] }
]);

// Optional: add an order_total to each doc for faster reporting (demonstrates pre-computation)
db.orders.aggregate([
  { $set: { order_total: { $sum: { $map: {
      input: "$items",
      as: "it",
      in: { $multiply: ["$$it.quantity", "$$it.unit_price"] }
  }}}}},
  { $merge: { into: "orders", whenMatched: "merge", whenNotMatched: "discard" } }
]);
