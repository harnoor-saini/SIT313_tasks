function ProjectTemplate(props){
    return(
        <div className="project">
            <img src={props.image} alt={props.project_name} />
            <p className="project-desc">
                <strong><u>{props.project_name}</u></strong>
                <br />
                {props.project_desc}
                <br />
                <a href={props.github_link} target="_blank" rel="noreferrer">View on GitHub</a>
            </p>
        </div>
    )
}

export default ProjectTemplate;