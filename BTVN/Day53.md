## Học viên xây dựng service NodeJS với database từ JSON-SERVER để hoàn thiện các tính năng sau:

- Read: Get All Products
- Read One: Get Product by ID
- Delete: Delete Product by ID
- Update: Update Product
- Add: Add Product

```javascript
products = [
	{
		id: 1,
		title: "Product 1",
		price: 1000,
	},
	{
		id: 2,
		title: "Product 2",
		price: 2000,
	},
	{
		id: 3,
		title: "Product 3",
		price: 3000,
	},
];
```

**Yêu cầu:**

- Sử dụng JSON-SERVER để tạo database từ mảng products trên
- Xây dựng service NodeJS để thực hiện các tính năng trên
- Nếu sản phẩm không tìm thấy thì trả về thông báo "Product not found"
- Nếu request router không tìm thấy thì trả về thông báo "Router not found"
