function TutorialTemplate(props){
    return(
        <div className="article-card">
            <img src={props.image} alt={props.tutorial_name} />
            <h3>{props.tutorial_name}</h3>
            <p className="article-desc">{props.description}</p>
            <div className="article-meta">
                <span>⭐ {props.rating}</span>
                <span>{props.username}</span>
            </div>
        </div>
    )
}

export default TutorialTemplate;