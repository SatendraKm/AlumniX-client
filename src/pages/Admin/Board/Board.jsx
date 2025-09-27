import BoardContent from "./BoardContent";

const Board = () => {
  return (
    <div className="flex w-full bg-white">
      <div className="w-[100%] p-2">
        <BoardContent />
      </div>
    </div>
  );
};

export default Board;
