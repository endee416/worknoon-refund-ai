import "dotenv/config";
import { db } from "../firebase.js";
import { Timestamp } from "firebase-admin/firestore";

function daysAgo(days: number) {
  const date = new Date();
  date.setDate(date.getDate() - days);
  return Timestamp.fromDate(date);
}

const customers = [
  {
    id: "customer_001",
    name: "Sarah Johnson",
    email: "sarah.johnson@example.com",
  },
  {
    id: "customer_002",
    name: "Michael Brown",
    email: "michael.brown@example.com",
  },
  {
    id: "customer_003",
    name: "Emily Davis",
    email: "emily.davis@example.com",
  },
  {
    id: "customer_004",
    name: "Daniel Wilson",
    email: "daniel.wilson@example.com",
  },
  {
    id: "customer_005",
    name: "Olivia Martinez",
    email: "olivia.martinez@example.com",
  },
  {
    id: "customer_006",
    name: "James Anderson",
    email: "james.anderson@example.com",
  },
  {
    id: "customer_007",
    name: "Sophia Taylor",
    email: "sophia.taylor@example.com",
  },
  {
    id: "customer_008",
    name: "Benjamin Thomas",
    email: "benjamin.thomas@example.com",
  },
  {
    id: "customer_009",
    name: "Ava Jackson",
    email: "ava.jackson@example.com",
  },
  {
    id: "customer_010",
    name: "Lucas White",
    email: "lucas.white@example.com",
  },
  {
    id: "customer_011",
    name: "Mia Harris",
    email: "mia.harris@example.com",
  },
  {
    id: "customer_012",
    name: "Ethan Martin",
    email: "ethan.martin@example.com",
  },
  {
    id: "customer_013",
    name: "Isabella Thompson",
    email: "isabella.thompson@example.com",
  },
  {
    id: "customer_014",
    name: "Noah Garcia",
    email: "noah.garcia@example.com",
  },
  {
    id: "customer_015",
    name: "Charlotte Robinson",
    email: "charlotte.robinson@example.com",
  },
];

const orders = [
  {
    id: "ORD-1001",
    customerId: "customer_001",
    productName: "Wireless Headphones",
    amount: 129.99,
    finalSale: false,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(5),
  },
  {
    id: "ORD-1002",
    customerId: "customer_002",
    productName: "Running Shoes",
    amount: 89.99,
    finalSale: false,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(8),
  },
  {
    id: "ORD-1003",
    customerId: "customer_003",
    productName: "Limited Edition Jacket",
    amount: 199.99,
    finalSale: true,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(4),
  },
  {
    id: "ORD-1004",
    customerId: "customer_004",
    productName: "Mechanical Keyboard",
    amount: 149.99,
    finalSale: false,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(45),
  },
  {
    id: "ORD-1005",
    customerId: "customer_005",
    productName: "Gaming Laptop",
    amount: 899.99,
    finalSale: false,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(7),
  },
  {
    id: "ORD-1006",
    customerId: "customer_006",
    productName: "Smart Watch",
    amount: 249.99,
    finalSale: false,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(12),
  },
  {
    id: "ORD-1007",
    customerId: "customer_007",
    productName: "Bluetooth Speaker",
    amount: 79.99,
    finalSale: false,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(2),
  },
  {
    id: "ORD-1008",
    customerId: "customer_008",
    productName: "4K Monitor",
    amount: 549.99,
    finalSale: false,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(10),
  },
  {
    id: "ORD-1009",
    customerId: "customer_009",
    productName: "USB-C Hub",
    amount: 49.99,
    finalSale: false,
    status: "delivered",
    refunded: true,
    purchasedAt: daysAgo(6),
  },
  {
    id: "ORD-1010",
    customerId: "customer_010",
    productName: "Office Chair",
    amount: 329.99,
    finalSale: false,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(20),
  },
  {
    id: "ORD-1011",
    customerId: "customer_011",
    productName: "Phone Case",
    amount: 24.99,
    finalSale: true,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(3),
  },
  {
    id: "ORD-1012",
    customerId: "customer_012",
    productName: "Tablet",
    amount: 479.99,
    finalSale: false,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(15),
  },
  {
    id: "ORD-1013",
    customerId: "customer_013",
    productName: "Camera",
    amount: 749.99,
    finalSale: false,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(3),
  },
  {
    id: "ORD-1014",
    customerId: "customer_014",
    productName: "Desk Lamp",
    amount: 59.99,
    finalSale: false,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(35),
  },
  {
    id: "ORD-1015",
    customerId: "customer_015",
    productName: "Coffee Maker",
    amount: 119.99,
    finalSale: false,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(9),
  },
  {
    id: "ORD-1016",
    customerId: "customer_001",
    productName: "Webcam",
    amount: 99.99,
    finalSale: false,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(11),
  },
  {
    id: "ORD-1017",
    customerId: "customer_002",
    productName: "Gaming Mouse",
    amount: 69.99,
    finalSale: false,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(1),
  },
  {
    id: "ORD-1018",
    customerId: "customer_003",
    productName: "Designer Sunglasses",
    amount: 299.99,
    finalSale: true,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(6),
  },
  {
    id: "ORD-1019",
    customerId: "customer_004",
    productName: "Smartphone",
    amount: 699.99,
    finalSale: false,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(14),
  },
  {
    id: "ORD-1020",
    customerId: "customer_005",
    productName: "Portable Charger",
    amount: 39.99,
    finalSale: false,
    status: "delivered",
    refunded: false,
    purchasedAt: daysAgo(5),
  },
];

async function seed() {
  console.log("Seeding Firestore...");

  const batch = db.batch();

  for (const customer of customers) {
    const { id, ...data } = customer;

    batch.set(db.collection("customers").doc(id), {
      ...data,
      createdAt: Timestamp.now(),
    });
  }

  for (const order of orders) {
    const { id, ...data } = order;

    batch.set(db.collection("orders").doc(id), {
      ...data,
      orderNumber: id,
      createdAt: Timestamp.now(),
    });
  }

  await batch.commit();

  console.log(`Seeded ${customers.length} customers`);
  console.log(`Seeded ${orders.length} orders`);
  console.log("Done.");
}

seed()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  });