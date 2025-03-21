import React, { useContext } from "react";
import { CartContext } from "../../Components/Cart/CartContext";
import "./CartPage.css";

const CartPage = () => {
  const { cartItems, removeFromCart } = useContext(CartContext);

  const totalAmount = cartItems.reduce(
    (acc, item) => acc + (item.discountPrice || item.price) * item.quantity,
    0
  );

  return (
    <div className="cart-page-container">
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table className="cart-table">
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Remove</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={`http://localhost:5199/${item.imageUrl}`}
                    alt={item.name}
                    className="cart-item-image"
                  />
                </td>
                <td>{item.name}</td>
                <td>{item.discountPrice || item.price} KM</td>
                <td>{item.quantity}</td>
                <td>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="remove-button"
                  >
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {cartItems.length > 0 && (
        <div className="cart-summary">
          <h3>Total: {totalAmount.toFixed(2)} EUR</h3>
          <button className="checkout-button">Proceed to Checkout</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
