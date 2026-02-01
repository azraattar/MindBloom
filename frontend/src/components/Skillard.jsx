const SkillCard = ({ title, score }) => {
    return (
        <div className="bg-white p-4 shadow rounded-lg text-center">
            <h3 className="text-lg font-semibold">{title}</h3>
            <p className="text-2xl text-green-500">{score}%</p>
        </div>
    );
};

export default SkillCard;
