import { useEffect, useState } from "react";
import handleAPI from "../../apis/handleAPI";
import { Card, Spin } from "antd";
import { Link } from "react-router-dom";

const PizzaSection = () => {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res: any = await handleAPI({
                    url: "/products/getAll",
                    method: "get"
                });

                if (res) {
                    // 👉 sort theo createdAt và lấy 10 item mới nhất
                    const sorted = res
                        .filter((p: any) => !p.isDeleted)
                        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 8);

                    setProducts(sorted);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="container mx-auto py-8">
            <h2 className="text-xl font-semibold mb-4">Pizza</h2>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Spin size="large" />
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {products.map((p: any) => {
                        // Tạo slug thân thiện với SEO từ tiêu đề sản phẩm
                        const slug = p.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
                        return (
                            <Link key={p.id} to={`/users/products/${slug}/${p.id}`}>
                                <Card
                                    hoverable
                                    cover={
                                        <img
                                            src={p.image}
                                            className="w-full h-40 object-cover rounded"
                                            alt={p.title}
                                        />
                                    }
                                    className="shadow-md rounded-lg cursor-pointer"
                                >
                                    <h4 className="font-medium">{p.title}</h4>
                                    <p className="text-red-600">
                                        {p.price.toLocaleString("vi-VN")}₫
                                    </p>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default PizzaSection;
