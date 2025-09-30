//Q4 Flag our VIPs: Find the customers who have spent > $80 (total)


db.orders.aggregate([
  { $match: { status: "paid" } },
  { $unwind: "$items" },
  { $group: {
      _id: "$_id",
      customer_id: { $first: "$customer_id" },
      order_total: { $sum: { $multiply: ["$items.quantity", "$items.unit_price"] } }
  }},
  { $group: {
      _id: "$customer_id",
      total_spend_usd: { $sum: "$order_total" }
  }},
  { $match: { total_spend_usd: { $gte: 80 } } },
  { $lookup: {
      from: "customers", localField: "_id", foreignField: "_id", as: "cust"
  }},
  { $set: {
      name: { $first: "$cust.name" },
      region: { $first: "$cust.region" }
  }},
  { $project: { _id: 0, customer_id: "$_id", name: 1, region: 1, total_spend_usd: 1 } },
  { $sort: { total_spend_usd: -1 } }
]);
