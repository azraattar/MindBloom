const ParentLogin = () => {
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-xl mb-4">Parent Login</h2>
                <input className="input" placeholder="Email" />
                <input className="input mt-2" placeholder="Password" />
                <button className="btn mt-4">Login</button>
            </div>
        </div>
    );
};

export default ParentLogin;
