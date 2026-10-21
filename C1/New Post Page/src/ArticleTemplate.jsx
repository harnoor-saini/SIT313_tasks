function ArticleTemplate(props){
    return(
        <div className="article-card">
            <img src={props.image} alt={props.article_name} />
            <h3>{props.article_name}</h3>
            <p className="article-desc">{props.description}</p>
            <div className="article-meta">
                <span>⭐ {props.rating}</span>
                <span>{props.author}</span>
            </div>
        </div>
    )
}

export default ArticleTemplate;