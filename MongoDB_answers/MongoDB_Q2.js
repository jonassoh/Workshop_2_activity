//Q1 What is the total revenue and the total number of orders of all time?


db.orders.aggregate([
  { $match: { status: "paid" } },
  { $unwind: "$items" },
  { $group: {
      _id: "$_id",
      order_total: { $sum: { $multiply: ["$items.quantity", "$items.unit_price"] } }
  }},
  { $group: { _id: null, orders: { $sum: 1 }, revenue_usd: { $sum: "$order_total" } } },
  { $project: { _id: 0 } }
]);
