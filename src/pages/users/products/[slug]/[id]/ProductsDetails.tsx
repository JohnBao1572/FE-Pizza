import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Spin, Alert, message, Button, Card, Tag } from 'antd';
import type { Product } from '../../../../../models/ProductModel';
import handleAPI from '../../../../../apis/handleAPI';
import Header from '../../../../../components/user/Header';
import Footer from '../../../../../components/user/Footer';

const ProductsDetails = () => {
    const { id } = useParams();

    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!id) {
            setIsLoading(false);
            return;
        }

        const fetchProductDetails = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response: any = await handleAPI({
                    url: `/products/getOne/${id}`,
                    method: 'get',
                });

                const productData = response?.data || response;
                if (productData) {
                    setProduct(productData);
                } else {
                    setError('Không tìm thấy sản phẩm.');
                }
            } catch (err: any) {
                const errorMessage = err.message || 'Lấy dữ liệu chi tiết sản phẩm thất bại.';
                setError(errorMessage);
                message.error(errorMessage);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <main className="flex-grow flex justify-center items-center">
                    <Spin size="large" />
                </main>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <main className="flex-grow container mx-auto p-8">
                    <Alert message="Lỗi" description={error} type="error" showIcon />
                </main>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col min-h-screen bg-gray-50">
                <Header />
                <main className="flex-grow container mx-auto p-8 text-center text-gray-600">
                    <p>Không tìm thấy sản phẩm</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            <Header />
            <main className="flex-grow pt-28 pb-10">
                <div className="container mx-auto px-4 lg:px-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        
                        {/* Ảnh sản phẩm */}
                        <Card
                            hoverable
                            bordered={false}
                            className="shadow-md rounded-2xl overflow-hidden"
                        >
                            <img
                                src={product.image}
                                alt={product.title}
                                className="w-full h-96 object-contain bg-white"
                            />
                        </Card>

                        {/* Info sản phẩm */}
                        <div className="flex flex-col gap-4 bg-white shadow-md p-6 rounded-2xl border border-gray-100">
                            <h1 className="text-3xl font-bold text-gray-800">{product.title}</h1>

                            <div className="flex items-center gap-3">
                                <Tag color="red" className="text-lg py-1 px-3 rounded-lg">
                                    {product.price?.toLocaleString('vi-VN')}₫
                                </Tag>
                            </div>

                            <p className="text-gray-600 leading-relaxed text-base">
                                {product.description}
                            </p>

                            <div className="flex gap-3 mt-4">
                                <Button type="primary" size="large" className={`w-full rounded-lg ${product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={product.quantity === 0}>
                                    Thêm vào giỏ hàng
                                </Button>
                                <Button size="large" className={`w-full rounded-lg ${product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    disabled={product.quantity === 0}>
                                    Mua ngay
                                </Button>
                            </div>

                            <div className="mt-4 text-sm text-gray-500">
                                <p><strong>SKU:</strong> {product.id}</p>
                                <p className="flex items-center">
                                    <strong>Trạng thái:</strong> 
                                    {product.quantity > 0 ? (
                                        <Tag color="green" className="ml-1">Còn hàng</Tag>
                                    ) : (
                                        <Tag color="red" className="ml-1">Hết hàng</Tag>
                                    )}
                                </p>
                                {/* <p><strong>Số lượng còn:</strong> {product.quantity}</p> */}
                            </div>
                        </div>

                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
};

export default ProductsDetails;
