"use client";
import { useState } from "react";
import {
  Modal,
  Form,
  Input,
  Button,
  InputNumber,
  Upload,
  Space,
  message,
} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Image from "next/image";
import type { UploadChangeParam } from "antd/es/upload";

interface Product {
  name: string;
  size: string;
  color: string;
  price: number;
  image: string;
  specifications: { key: string; value: string }[];
}

export default function CreateProduct({
  onAdd,
}: {
  onAdd: (product: Product) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [specs, setSpecs] = useState([{ key: "", value: "" }]);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const [form] = Form.useForm();

  const handleImageUpload = (info: UploadChangeParam) => {
    if (info.file.status === "done" && info.file.originFileObj) {
      getBase64(info.file.originFileObj as File, (url: string) => {
        setImageUrl(url);
        message.success("Image uploaded!");
      });
    }
  };

  const getBase64 = (file: File, cb: (url: string) => void) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => cb(reader.result as string);
  };

  const handleSpecChange = (index: number, field: string, value: string) => {
    const newSpecs = [...specs];
    newSpecs[index][field as "key" | "value"] = value;
    setSpecs(newSpecs);
  };

  const handleAddSpec = () => {
    setSpecs([...specs, { key: "", value: "" }]);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const product: Product = {
        ...values,
        image: imageUrl || "",
        specifications: specs,
      };
      // Dummy POST API call
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        }
      );
      if (!response.ok) {
        throw new Error("Failed to submit product");
      }
      message.success("Product submitted successfully!");
      onAdd(product);
      form.resetFields();
      setSpecs([]);
      setImageUrl(null);
      setIsModalOpen(false);
    } catch {
      message.error("Failed to submit product. Please try again.");
    }
  };

  return (
    <>
      <Button type="primary" onClick={() => setIsModalOpen(true)}>
        + Create Product
      </Button>

      <Modal
        title="Create Tshirt"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        okText="Create"
      >
        <Form layout="vertical" form={form}>
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="color" label="Color" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="size" label="Size" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="price" label="Price" rules={[{ required: true }]}>
            <InputNumber min={0} style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item label="Image">
            <Upload
              listType="picture-card"
              maxCount={1}
              customRequest={({ onSuccess }) => {
                setTimeout(() => onSuccess && onSuccess("ok"), 0);
              }}
              showUploadList={false}
              onChange={handleImageUpload}
            >
              {imageUrl ? (
                <Image src={imageUrl} alt="product" style={{ width: "100%" }} />
              ) : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>

          <Form.Item label="Specifications">
            {specs.map((spec, index) => (
              <Space key={index} style={{ marginBottom: 8 }}>
                <Input
                  placeholder="Key"
                  value={spec.key}
                  onChange={(e) =>
                    handleSpecChange(index, "key", e.target.value)
                  }
                />
                <Input
                  placeholder="Value"
                  value={spec.value}
                  onChange={(e) =>
                    handleSpecChange(index, "value", e.target.value)
                  }
                />
              </Space>
            ))}
            <Button
              onClick={handleAddSpec}
              style={{ width: "100%", marginTop: 8 }}
            >
              + Add Specification
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
