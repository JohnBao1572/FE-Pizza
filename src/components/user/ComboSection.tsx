const combos = [
    { title: "Combo Đại Sứ Ăn Ngon", price: "249.000₫", img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=500" },
    { title: "Combo Ngon Mê Không Ngớt", price: "349.000₫", img: "https://images.unsplash.com/photo-1593560708920-6389280b1161?w=500" },
];

const ComboSection = () => (
    <div className="container mx-auto py-8">
        <h2 className="text-xl font-semibold mb-4">Combo Đặc Biệt</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {combos.map((combo) => (
                <div className="bg-white shadow-lg p-4 rounded-lg flex items-center">
                    <img src={combo.img} className="w-32 h-32 object-cover rounded" alt={combo.title} />
                    <div className="ml-4">
                        <h3 className="font-bold">{combo.title}</h3>
                        <p className="text-red-500 mt-1">{combo.price}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);

export default ComboSection;
