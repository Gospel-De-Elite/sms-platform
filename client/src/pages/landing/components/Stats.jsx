export default function Stats() {
    const stats = [
        { value: "500M+", label: "SMS Delivered" },
        { value: "98.5%", label: "Delivery Rate" },
        { value: "all networks", label: "Nigerian Networks" },
        { value: "10,000+", label: "Active Businesses" },
    ];

    return (
        <section className="bg-blue-600 py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="text-3xl sm:text-4xl font-bold text-white mb-1">
                                {stat.value}
                            </p>
                            <p className="text-blue-200 text-sm">{stat.label}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}