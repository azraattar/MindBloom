import SkillCard from "../components/SkillCard";

const ParentDashboard = () => {
    return (
        <div className="p-6">
            <h2 className="text-2xl mb-4">Child Overview</h2>

            <div className="grid grid-cols-3 gap-4">
                <SkillCard title="Phonics" score={75} />
                <SkillCard title="Visual" score={68} />
                <SkillCard title="Fluency" score={80} />
            </div>
        </div>
    );
};

export default ParentDashboard;
