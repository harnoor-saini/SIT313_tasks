import AllArticles from "./AllArticles.jsx";
import ArticleTemplate from "./ArticleTemplate.jsx";

function FeaturedArticles(){
    return(
        <div className="featured-section">
            <h2>Featured Articles</h2>
            <div className="cards-row">
                {AllArticles.map((article, index) => (
                    <ArticleTemplate
                        key={index}
                        image={article.image}
                        article_name={article.article_name}
                        description={article.description}
                        rating={article.rating}
                        author={article.author}
                    />
                ))}
            </div>
            <button className="see-all-btn">See all articles</button>
        </div>
    )
}

export default FeaturedArticles;