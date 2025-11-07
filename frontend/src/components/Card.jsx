const Card = ({ title, desc }) => {
    return (
        <div className="border rounded-xl p-6 shadow-sm hover:shadow-md transition bg-white">
            <h3 className="text-lg font-medium">{title}</h3>
            <p className="mt-2 text-gray-600 text-sm">{desc}</p>
        </div>
    );
};

export default Card;
