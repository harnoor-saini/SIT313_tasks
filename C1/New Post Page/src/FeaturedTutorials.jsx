import AllTutorials from "./AllTutorials.jsx";
import TutorialTemplate from "./TutorialTemplate.jsx";

function FeaturedTutorials(){
    return(
        <div className="featured-section">
            <h2>Featured Tutorials</h2>
            <div className="cards-row">
                {AllTutorials.map((tutorial, index) => (
                    <TutorialTemplate
                        key={index}
                        image={tutorial.image}
                        tutorial_name={tutorial.tutorial_name}
                        description={tutorial.description}
                        rating={tutorial.rating}
                        username={tutorial.username}
                    />
                ))}
            </div>
            <button className="see-all-btn">See all tutorials</button>
        </div>
    )
}

export default FeaturedTutorials;