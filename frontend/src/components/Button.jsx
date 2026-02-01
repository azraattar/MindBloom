const Button = ({ text, onClick, type = "primary" }) => {
    const styles =
        type === "primary"
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-400 hover:bg-gray-500";

    return (
        <button
            onClick={onClick}
            className={`${styles} text-white px-4 py-2 rounded-lg`}
        >
            {text}
        </button>
    );
};

export default Button;
