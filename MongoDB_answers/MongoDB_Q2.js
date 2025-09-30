//Q1 Which products made the top 3 highest revenue in September 2025?


db.orders.aggregate([
  { $match: {
      status: "paid",
      order_date: { $gte: ISODate("2025-09-01T00:00:00Z"), $lt: ISODate("2025-10-01T00:00:00Z") }
  }},
  { $unwind: "$items" },
  { $group: {
      _id: "$items.product_id",
      revenue_usd: { $sum: { $multiply: ["$items.quantity", "$items.unit_price"] } }
  }},
  { $sort: { revenue_usd: -1 } },
  { $limit: 3 },
  { $lookup: {
      from: "products", localField: "_id", foreignField: "_id", as: "prod"
  }},
  { $set: { name: { $first: "$prod.name" } } },
  { $project: { _id: 0, product_id: "$_id", name: 1, revenue_usd: 1 } }
]);

