import Banner from "./Banner";
import AuthorInfo from './AuthorInfo';
import ProjectsDisplayed from "./ProjectsDisplayed"
import Gallery from './Gallery';
import FeaturedArticles from "./FeaturedArticles";
import FeaturedTutorials from "./FeaturedTutorials";
import SubscribeContainer from "./SubscribeContainer";

function Home() {
  return (
    <>
      <Banner/>
      <AuthorInfo/>
      <ProjectsDisplayed/>
      <Gallery/>
      <FeaturedArticles/>
      <FeaturedTutorials/>
      <SubscribeContainer/>
    </>
  )
}

export default Home