//Q3 Give the revenue by region on September 2025


db.orders.aggregate([
    { $match: {
        status: "paid",
        order_date: { $gte: ISODate("2025-09-01T00:00:00Z"), $lt: ISODate("2025-10-01T00:00:00Z") }
    }},
    { $lookup: {
        from: "customers", localField: "customer_id", foreignField: "_id", as: "cust"
    }},
    { $set: { region: { $first: "$cust.region" } } },
    { $unwind: "$items" },
    { $group: {
        _id: "$region",
        revenue_usd: { $sum: { $multiply: ["$items.quantity", "$items.unit_price"] } }
    }},
    { $project: { _id: 0, region: "$_id", revenue_usd: 1 } },
    { $sort: { revenue_usd: -1 } }
  ]);
  