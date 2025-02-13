function calculateShippingCost(destination, weight, priority) {
    // Input validation
    if (destination !== "domestic" && destination !== "international") return "Invalid destination";
    if (typeof weight !== "number" || weight <= 0) return "Invalid weight";
    if (!["standard", "express", "priority"].includes(priority)) return "Invalid priority";

    // Base cost mapping
    const costTable = {
        domestic: { standard: 5, express: 10, priority: 20 },
        international: { standard: 15, express: 25, priority: 50 }
    };

    let cost = weight * costTable[destination][priority];

    // Apply additional costs for heavy packages
    if (destination === "domestic" && weight > 10) cost += 10;
    if (destination === "international" && weight > 5) cost += 50;

    return cost;
}

console.log(calculateShippingCost("domestic", 8, "standard")); // $40
console.log(calculateShippingCost("domestic", 12, "express")); // $130 (10kg * $10 + $10 extra)
console.log(calculateShippingCost("international", 6, "priority")); // $350 (6kg * $50 + $50 extra)
console.log(calculateShippingCost("international", -2, "express")); // "Invalid weight"
