import SkillChart from "../components/SkillChart";

const ChildProgress = () => {
    return (
        <div className="p-6">
            <h2 className="text-xl mb-4">Progress Over Time</h2>

            <SkillChart
                labels={["Day 1", "Day 2", "Day 3"]}
                dataPoints={[50, 65, 80]}
            />
        </div>
    );
};

export default ChildProgress;
