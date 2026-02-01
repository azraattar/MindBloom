import { Line } from "react-chartjs-2";

const SkillChart = ({ labels, dataPoints }) => {
    const data = {
        labels,
        datasets: [
            {
                label: "Skill Progress",
                data: dataPoints,
            },
        ],
    };

    return <Line data={data} />;
};

export default SkillChart;
