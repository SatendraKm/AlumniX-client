import HomeContent from "./HomeContent";
import RightSidebar from "./RightSidebar";

const Home = () => {
  return (
    <>
      <div className="flex w-full">
        <HomeContent className="w-2/3" />
        <RightSidebar className="w-1/3" />
      </div>
    </>
  );
};

export default Home;
