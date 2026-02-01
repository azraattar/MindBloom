import RewardPopup from "../components/RewardPopup";

const GameResult = () => {
    return (
        <RewardPopup
            show={true}
            message="You improved your phonics skill!"
            onClose={() => { }}
        />
    );
};

export default GameResult;
