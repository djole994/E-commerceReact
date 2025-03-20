import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../Api";
import "../../Components/Product/Product.css"

const ProductList = () => {
  const { categoryId } = useParams(); 
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        const response = await api.get(`/Product/ByCategory/${categoryId}`);
        setProducts(response.data);
      } catch (error) {
        console.error("Greška pri dohvatanju proizvoda:", error);
      }
    };

    if (categoryId) {
      fetchProductsByCategory();
    }
  }, [categoryId]);

  return (
    <div className="product-list-container">
      <h2>Proizvodi u kategoriji</h2>
      <div className="product-grid">
        {products.map((prod) => (
          <div key={prod.id} className="product-card">
            <img
              src={`http://localhost:5199/${prod.imageUrl}`}
              alt={prod.name}
              className="product-image"
            />
            <h3>{prod.name}</h3>
            <p className="product-description">{prod.description}</p>

            {prod.isDiscounted ? (
              <p className="discounted-price">
                <span className="original-price">{prod.price} KM</span>{" "}
                {prod.discountPrice} KM
              </p>
            ) : (
              <p className="product-price">{prod.price} KM</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;
