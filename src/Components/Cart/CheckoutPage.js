import React, { useState, useContext } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import api from "../../Api";
import { CartContext } from "../Cart/CartContext";
import StepIndicator from "./StepIndicator";
import CartSummary from "./CartSummary";
import "./checkout.css";

const steps = ["Shipping", "Payment", "Review", "Success"];

const shippingSchema = Yup.object({
  fullName: Yup.string().min(2).required("Required"),
  email: Yup.string().email().required("Required"),
  phone: Yup.string().required("Required"),
  address: Yup.string().min(5).required("Required"),
  city: Yup.string().required("Required"),
  zip: Yup.string().required("Required"),
  country: Yup.string().required("Required"),
});

const paymentSchema = Yup.object({
  method: Yup.string().oneOf(["CreditCard", "PayPal", "CashOnDelivery"]),
  cardNumber: Yup.string().when("method", {
    is: "CreditCard",
    then: (schema) => schema.length(16, "16 digits").required("Required"),
  }),
  cardName: Yup.string().when("method", {
    is: "CreditCard",
    then: (schema) => schema.required("Required"),
  }),
  exp: Yup.string().when("method", {
    is: "CreditCard",
    then: (schema) => schema.matches(/^(0[1-9]|1[0-2])\/\d{2}$/, "MM/YY"),
  }),
  cvc: Yup.string().when("method", {
    is: "CreditCard",
    then: (schema) => schema.length(3, "3 digits"),
  }),
});

export default function CheckoutPage() {
  const { cartItems, clearCart } = useContext(CartContext);
  const [step, setStep] = useState(0);
  const [orderId, setOrderId] = useState(null);
  const token = localStorage.getItem("token");

  // -------- handlers
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  // -------- initial values
  const shippingInit = {
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "Bosnia and Herzegovina",
  };

  const paymentInit = {
    method: "CreditCard",
    cardNumber: "",
    cardName: "",
    exp: "",
    cvc: "",
  };

  // -------- submit order
  const placeOrder = async (shipping, payment) => {
    const payload = {
      customerName: shipping.fullName,
      address: `${shipping.address}, ${shipping.city}, ${shipping.zip}, ${shipping.country}`,
      paymentMethod: payment.method,
      items: cartItems.map((i) => ({
        productId: i.id,
        quantity: i.quantity,
        price: i.discountPrice || i.price,
      })),
    };
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    const { data } = await api.post("/order", payload, { headers });
    setOrderId(data.orderId);
    clearCart();
    next();
  };

  // -------- guard
  if (!cartItems.length && step < 3)
    return (
      <div className="checkout-wrapper">
        <h2>Your cart is empty.</h2>
      </div>
    );

  return (
    <div className="checkout-wrapper">
      <StepIndicator steps={steps} current={step} />

      {/* ---------------- SHIPPING ---------------- */}
      {step === 0 && (
        <Formik
          initialValues={shippingInit}
          validationSchema={shippingSchema}
          onSubmit={(values) => {
            localStorage.setItem("shipping", JSON.stringify(values));
            next();
          }}
        >
          <Form className="grid-two">
            {["fullName", "email", "phone"].map((f) => (
              <div key={f} className="form-group">
                <label>{f === "fullName" ? "Full Name" : f.charAt(0).toUpperCase() + f.slice(1)}</label>
                <Field name={f} />
                <ErrorMessage name={f} component="span" className="error" />
              </div>
            ))}

            <div className="form-group full">
              <label>Address</label>
              <Field name="address" />
              <ErrorMessage name="address" component="span" className="error" />
            </div>

            <div className="form-group">
              <label>City</label>
              <Field name="city" />
              <ErrorMessage name="city" component="span" className="error" />
            </div>

            <div className="form-group">
              <label>ZIP</label>
              <Field name="zip" />
              <ErrorMessage name="zip" component="span" className="error" />
            </div>

            <div className="form-group full">
              <label>Country</label>
              <Field name="country" />
            </div>

            <div className="actions full">
              <button type="submit" className="btn-primary">
                Continue to Payment →
              </button>
            </div>
          </Form>
        </Formik>
      )}

      {/* ---------------- vrsgta placanja ---------------- */}
      {step === 1 && (
        <Formik
          initialValues={paymentInit}
          validationSchema={paymentSchema}
          onSubmit={(values) => {
            localStorage.setItem("payment", JSON.stringify(values));
            next();
          }}
        >
          {({ values }) => (
            <Form className="grid-two">
              <div className="form-group full">
                <label>Payment Method</label>
                <Field as="select" name="method">
                  <option value="CreditCard">Credit Card</option>
                  <option value="PayPal">PayPal</option>
                  <option value="CashOnDelivery">Cash on Delivery</option>
                </Field>
              </div>

              {values.method === "CreditCard" && (
                <>
                  <div className="form-group full">
                    <label>Card Number</label>
                    <Field name="cardNumber" placeholder="1234 5678 9012 3456" />
                    <ErrorMessage name="cardNumber" component="span" className="error" />
                  </div>

                  <div className="form-group full">
                    <label>Name on Card</label>
                    <Field name="cardName" />
                    <ErrorMessage name="cardName" component="span" className="error" />
                  </div>

                  <div className="form-group">
                    <label>Expiry (MM/YY)</label>
                    <Field name="exp" placeholder="02/27" />
                    <ErrorMessage name="exp" component="span" className="error" />
                  </div>

                  <div className="form-group">
                    <label>CVC</label>
                    <Field name="cvc" placeholder="123" />
                    <ErrorMessage name="cvc" component="span" className="error" />
                  </div>
                </>
              )}

              <div className="actions full">
                <button type="button" onClick={back} className="btn-secondary">
                  ← Back
                </button>
                <button type="submit" className="btn-primary">
                  Review Order →
                </button>
              </div>
            </Form>
          )}
        </Formik>
      )}

      {/* ---------------- REVIEW ---------------- */}
      {step === 2 && (
        <div className="review-grid">
          <div>
            <h3>Shipping</h3>
            {Object.entries(JSON.parse(localStorage.getItem("shipping"))).map(([k, v]) => (
              <p key={k}>
                <strong>{k[0].toUpperCase() + k.slice(1)}:</strong> {v}
              </p>
            ))}
          </div>

          <div>
            <h3>Payment</h3>
            <p>{JSON.parse(localStorage.getItem("payment")).method}</p>
          </div>

          <CartSummary items={cartItems} />

          <div className="actions full">
            <button onClick={back} className="btn-secondary">
              ← Back
            </button>
            <button
              onClick={() =>
                placeOrder(
                  JSON.parse(localStorage.getItem("shipping")),
                  JSON.parse(localStorage.getItem("payment"))
                )
              }
              className="btn-primary"
            >
              Place Order
            </button>
          </div>
        </div>
      )}

      {/* ---------------- SUCCESS ---------------- */}
      {step === 3 && (
        <div className="success-box">
          <h2>Thank you! 🎉</h2>
          <p>Your order <strong>#{orderId}</strong> has been placed.</p>
        </div>
      )}
    </div>
  );
}
