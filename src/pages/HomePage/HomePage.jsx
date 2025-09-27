import Header from "./Header";
import FirstPage from "./FirstPage";
import SecondPage from "./SecondPage";
import ThirdPage from "./ThirdPage";
import FourthPage from "./FourthPage";
import FifthPage from "./FifthPage";
import SixthPage from "./SixthPage";
import SeventhPage from "./SeventhPage";
import EighthPage from "./EighthPage";
import FAQSection from "./FAQSection";
import Testimonials from "./Testimonials";
import JoinCommunitySection from "./joincomminunity";
import Footer from "./Footer";

const HomePage = () => {
  return (
    <div>
      <Header />
      <div id="firstPage">
        <FirstPage />
      </div>
      <div id="secondPage">
        <SecondPage />
      </div>
      <div id="thirdPage">
        <ThirdPage />
      </div>
      <div id="fourthPage">
        <FourthPage />
      </div>
      <div id="fifthPage">
        <FifthPage />
      </div>
      <div id="sixthPage">
        <SixthPage />
      </div>
      <div id="seventhPage">
        <SeventhPage />
      </div>
      <div id="eighthPage">
        <EighthPage />
      </div>
      <JoinCommunitySection />
      <FAQSection />
      <Testimonials />
      <Footer />
    </div>
  );
};

export default HomePage;
