const categories = [
    { name: "Combo Đại Sứ", icon: "https://img.icons8.com/fluency/96/hamburger.png" },
    { name: "Deal Mùa Lễ Hội", icon: "https://img.icons8.com/fluency/96/discount.png" },
    { name: "Pizza", icon: "https://img.icons8.com/fluency/96/pizza.png" },
    { name: "Chicken Lover", icon: "https://img.icons8.com/fluency/96/fried-chicken.png" },
    { name: "Drinks", icon: "https://n7media.coolmate.me/image/May2022/15-loai-nuoc-uong-giai-khat-mua-he_591.jpg" },
];

const CategorySection = () => (
    <div className="container mx-auto py-8">
        <h2 className="text-xl font-semibold mb-4">Bạn Sẽ Thích</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
            {categories.map((cat) => (
                <div
                    key={cat.name}
                    className="text-center p-2 hover:scale-105 transition"
                >
                    <img src={cat.icon} className="mx-auto h-16" alt={cat.name} />
                    <p className="mt-2 text-sm">{cat.name}</p>
                </div>
            ))}
        </div>
    </div>
);

export default CategorySection;
