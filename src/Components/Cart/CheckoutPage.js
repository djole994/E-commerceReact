import React, { useState, useContext } from "react";
import { CartContext } from "../../Components/Cart/CartContext";
import api from "../../Api"; 
import "./CheckoutPage.css";

const CheckoutPage = () => {
  const { cartItems, clearCart } = useContext(CartContext);

  const [customerName, setCustomerName] = useState("");
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CreditCard");
  const [message, setMessage] = useState("");

  const handleCheckout = async (e) => {
    e.preventDefault();

    const orderData = {
      customerName: customerName,
      address: address,
      paymentMethod: paymentMethod,
      items: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.discountPrice || item.price
      }))
    };

    try {
      const response = await api.post("/order", orderData);
      setMessage("Order successfully placed!");
      clearCart();
    } catch (error) {
      console.error("Error placing order:", error);
      setMessage("Something went wrong. Please try again.");
    }
  };



  return (
    <div className="checkout-container">
      <h2>Checkout</h2>
      <form className="checkout-form" onSubmit={handleCheckout}>
        <div className="form-group">
          <label htmlFor="customerName">Full Name:</label>
          <input
            id="customerName"
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Shipping Address:</label>
          <input
            id="address"
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Payment Method:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="CreditCard">Credit Card</option>
            <option value="PayPal">PayPal</option>
            <option value="CashOnDelivery">Cash on Delivery</option>
          </select>
        </div>

        <button type="submit" className="confirm-button">
          Confirm Order
        </button>
      </form>

      {message && <p className="checkout-message">{message}</p>}
    </div>
  );
};

export default CheckoutPage;
