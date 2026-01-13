const pizzas = [
    { title: "Pizza Hải Sản Xốt Pesto", price: "149.000₫", img: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500" },
    { title: "Pizza Pepperoni", price: "119.000₫", img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500" },
];

const PizzaSection = () => (
    <div className="container mx-auto py-8">
        <h2 className="text-xl font-semibold mb-4">Pizza</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pizzas.map((p) => (
                <div className="bg-white shadow-md p-3 rounded-lg">
                    <img src={p.img} className="w-full h-40 object-cover rounded" alt={p.title} />
                    <h4 className="mt-2 font-medium">{p.title}</h4>
                    <p className="text-red-600">{p.price}</p>
                </div>
            ))}
        </div>
    </div>
);

export default PizzaSection;
