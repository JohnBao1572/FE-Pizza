import { useEffect, useState } from "react";
import { Card, Spin } from "antd";
import { FaArrowAltCircleRight, FaArrowAltCircleLeft, FaTags } from "react-icons/fa";
import handleAPI from "../../apis/handleAPI";
import type { Category } from "../../models/CategoryModel";

const PAGE_SIZE = 5;
const categoryIconMap: any = {};

const CategorySection = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const res: any = await handleAPI({
                    url: '/categories/getAll',
                    method: 'get',
                });
                if (Array.isArray(res)) {
                    setCategories(res);
                } else {
                    setCategories([]);
                }
            } catch (error) {
                console.log(error);
                setCategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const startIndex = page * PAGE_SIZE;
    const visibleCategories = categories.slice(startIndex, startIndex + PAGE_SIZE);

    const canNext = startIndex + PAGE_SIZE < categories.length;
    const canPrev = page > 0;

    return (
        <div className="container mx-auto py-8 ">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">You will be liked</h2>

                <div className="flex gap-3">
                    <button
                        disabled={!canPrev}
                        onClick={() => setPage((prev) => prev - 1)}
                        className={`text-2xl transition ${canPrev ? "text-gray-700 hover:text-black" : "text-gray-300 cursor-not-allowed"
                            }`}
                    >
                        <FaArrowAltCircleLeft />
                    </button>

                    <button
                        disabled={!canNext}
                        onClick={() => setPage((prev) => prev + 1)}
                        className={`text-2xl transition ${canNext ? "text-gray-700 hover:text-black" : "text-gray-300 cursor-not-allowed"
                            }`}
                    >
                        <FaArrowAltCircleRight />
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-10">
                    <Spin />
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {visibleCategories.map((cat) => (
                        <Card
                            key={cat.id}
                            hoverable
                            className="text-center rounded-xl shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex flex-col items-center gap-2">
                                <div className="text-orange-500">
                                    {categoryIconMap[cat.title] || <FaTags size={32} />}
                                </div>
                                <p className="text-sm font-medium">{cat.title}</p>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CategorySection;
