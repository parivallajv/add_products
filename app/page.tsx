"use client";
import { useState } from "react";
import { Row, Col, Typography } from "antd";
import CreateProduct from "./components/CreateProduct";
import ProductCard from "./components/ProductCard";

interface Product {
  name: string;
  size: string;
  color:string;
  price: number;
  image: string;
  specifications: { key: string; value: string }[];
}

const { Title } = Typography;

export default function Home() {
  const [products, setProducts] = useState<Product[]>([]);

  const addProduct = (product: Product) => {
    setProducts([product, ...products]);
  };

  return (
    <div style={{ padding: 24 }}>
      <Title level={2}>Product Management</Title>
      <CreateProduct onAdd={addProduct} />

      <Row gutter={[16, 16]} style={{ marginTop: 24 }}>
        {products.map((product, idx) => (
          <Col key={idx} xs={24} sm={12} md={8} lg={6}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </div>
  );
}
