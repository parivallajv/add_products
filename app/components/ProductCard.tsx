import { Card, Tag } from "antd";

interface Product {
  name: string;
  color: string;
  size: string;
  price: number;
  image: string;
  specifications: { key: string; value: string }[];
}

export default function ProductCard({ product }: { product: Product }) {
  console.log(product);
  return (
    <Card
      hoverable
      cover={
        <img
          alt={product.name}
          src={product.image}
          style={{ height: 200, objectFit: "cover" }}
        />
      }
    >
      <h3>{product.name}</h3>

      <p>
        <strong>Color:</strong>
        {product.color}
      </p>
      <p>
        <strong>Size:</strong>
        {product.size}
      </p>
      <p>
        <strong>Price:</strong> ₹{product.price}
      </p>
      <div>
        {product.specifications &&
          product.specifications.map((spec, idx) => (
            <Tag key={idx}>
              {spec.key}: {spec.value}
            </Tag>
          ))}
      </div>
    </Card>
  );
}
