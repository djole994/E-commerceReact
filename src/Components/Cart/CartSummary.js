import React from "react";

export default function CartSummary({ items }) {
  const subtotal = items.reduce(
    (sum, i) => sum + (i.discountPrice || i.price) * i.quantity,
    0
  );
  return (
    <div>
      <h3>Cart</h3>
      {items.map((i) => (
        <p key={i.id}>
          {i.name} × {i.quantity} — {(i.discountPrice || i.price).toFixed(2)} €
        </p>
      ))}
      <hr />
      <p>
        <strong>Total: {subtotal.toFixed(2)} €</strong>
      </p>
    </div>
  );
}
