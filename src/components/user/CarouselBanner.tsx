import { Carousel } from "antd";
import { useEffect, useState } from "react";
import type { Discount } from "../../models/DiscountModel";
import handleAPI from "../../apis/handleAPI";

const CarouselBanner = () => {
    const [banners, setBanners] = useState<Discount[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLatestDiscounts = async () => {
            setIsLoading(true);
            try {
                const response: any = await handleAPI({ url: '/discount', method: 'get' });

                // API có thể trả về mảng trực tiếp hoặc nằm trong thuộc tính `data`
                const discountList: Discount[] = response?.data && Array.isArray(response.data)
                    ? response.data
                    : Array.isArray(response)
                        ? response
                        : [];

                if (discountList.length > 0) {
                    // Sắp xếp theo ngày tạo giảm dần để lấy mục mới nhất
                    const latestDiscounts = discountList
                        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                        .slice(0, 2); // Chỉ lấy 2 mục đầu tiên

                    setBanners(latestDiscounts);
                }
            } catch (error) {
                console.error("Failed to fetch discounts for banner:", error);
                // Nếu có lỗi, banners sẽ là một mảng rỗng
            } finally {
                setIsLoading(false);
            }
        };

        fetchLatestDiscounts();
    }, []);

    // Hiển thị trạng thái loading hoặc placeholder nếu không có banner
    if (isLoading || banners.length === 0) {
        return (
            <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg relative z-0 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">{isLoading ? 'Loading discounts...' : 'Not found discounts'}</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4">
            <div className="w-full h-64 rounded-xl overflow-hidden shadow-lg relative z-0">
                <Carousel autoplay>
                    {banners.map((banner) => (
                        <div key={banner.id} className="bg-gray-100">
                            <img
                                src={banner.image?.[0]}
                                className="w-full h-64 object-contain"
                                alt={banner.title}
                            />
                        </div>
                    ))}
                </Carousel>
            </div>
        </div>
    );
};

export default CarouselBanner;
