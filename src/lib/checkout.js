// Checkout helpers — build an order summary, route to email (mailto:) or
// WhatsApp (wa.me). No payment gateway; the order is also persisted to
// localStorage so the success screen has something to display.

import { parsePrice, formatNaira } from "./format";

export const ORDERS_KEY = "saffron_orders_v1";

export const buildOrderLines = (cart) =>
  cart.map((item) => ({
    title: item.title,
    quantity: item.quantity,
    unitPrice: parsePrice(item.price),
    lineTotal: parsePrice(item.price) * item.quantity,
  }));

export const buildOrderTotal = (cart) =>
  cart.reduce((acc, item) => acc + parsePrice(item.price) * item.quantity, 0);

export const buildOrderMessage = ({ cart, customer, orderId, delivery }) => {
  const lines = buildOrderLines(cart);
  const total = buildOrderTotal(cart);

  const header = [
    `Saffron & Sage — New Order #${orderId}`,
    `Customer: ${customer.fullName}`,
    `Email: ${customer.email}`,
    `Phone: ${customer.phone}`,
    `Delivery: ${delivery}`,
    `Address: ${customer.address}, ${customer.city}`,
    "",
    "Items:",
  ];

  const itemLines = lines.map(
    (l) => `  • ${l.title}  ×${l.quantity}  —  ${formatNaira(l.lineTotal)}`
  );

  const footer = ["", `Subtotal: ${formatNaira(total)}`, "", "Thank you for shopping with Saffron & Sage."];

  return [...header, ...itemLines, ...footer].join("\n");
};

export const persistOrder = ({ cart, customer, delivery, channel }) => {
  const orderId = `ORD-${Date.now()}`;
  const record = {
    id: orderId,
    createdAt: new Date().toISOString(),
    customer,
    delivery,
    channel,
    items: buildOrderLines(cart),
    total: buildOrderTotal(cart),
  };

  try {
    const existing = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    localStorage.setItem(ORDERS_KEY, JSON.stringify([record, ...existing]));
  } catch {
    // localStorage unavailable — order still goes out via email/WhatsApp
  }

  return record;
};

export const placeOrderByEmail = ({ cart, customer, delivery, order }) => {
  const message = buildOrderMessage({
    cart,
    customer,
    orderId: order.id,
    delivery,
  });
  const subject = encodeURIComponent(`Saffron & Sage — Order ${order.id}`);
  const body = encodeURIComponent(message);
  window.location.href = `mailto:${customer.email}?subject=${subject}&body=${body}`;
};

export const placeOrderByWhatsApp = ({ cart, customer, delivery, order, businessPhone }) => {
  const phone = String(businessPhone || customer.phone || "").replace(/[^0-9+]/g, "");
  const message = buildOrderMessage({
    cart,
    customer,
    orderId: order.id,
    delivery,
  });
  const url = `https://wa.me/${phone.replace(/^\+/, "")}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
};