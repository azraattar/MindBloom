const RewardPopup = ({ show, message, onClose }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
            <div className="bg-white p-6 rounded-xl text-center">
                <h2 className="text-2xl mb-2">🎉 Great Job!</h2>
                <p>{message}</p>
                <button
                    onClick={onClose}
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default RewardPopup;
