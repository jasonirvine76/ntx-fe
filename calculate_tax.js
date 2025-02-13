function calculateTax(income, age, dependents) {
    // Input validation
    if (typeof income !== "number" || income < 0) return "Invalid income";
    if (typeof age !== "number" || age < 0) return "Invalid age";
    if (typeof dependents !== "number" || dependents < 0) return "Invalid dependents";

    // Age-based conditions
    if (age < 18) return "Not eligible for tax";
    let discount = age >= 65 ? 0.2 : 0; // 20% discount for seniors

    // Recursive function to compute tax
    function computeTax(income) {
        if (income <= 10000) return income * 0.1;
        if (income <= 50000) return income * 0.2;
        return income * 0.3;
    }

    let tax = computeTax(income);

    tax -= dependents * 500;
    tax = Math.max(0, tax); 

    return tax * (1 - discount);
}

console.log(calculateTax(0, 25, 0)); // Expected: 0
console.log(calculateTax(8000, 30, 0)); // Expected: 800
console.log(calculateTax(20000, 40, 2)); // Expected: 3500
console.log(calculateTax(60000, 50, 1)); // Expected: 17500
console.log(calculateTax(100000, 70, 3)); // Expected: 22800
console.log(calculateTax(50000, 18, 0)); // Expected: 10000
console.log(calculateTax(15000, 17, 0)); // Expected: "Not eligible for tax"
console.log(calculateTax(-5000, 30, 1)); // Expected: "Invalid income"
console.log(calculateTax(50000, -5, 0)); // Expected: "Invalid age"
console.log(calculateTax(50000, 40, -2)); // Expected: "Invalid dependents"