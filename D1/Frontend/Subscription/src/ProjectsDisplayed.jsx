import AllProj from "./AllProj.jsx";
import ProjectTemplate from "./ProjectTemplate.jsx";

function ProjectsDisplayed(){
    return(
        <div className="projects">
            {AllProj.map((proj, index) => (
                <ProjectTemplate
                    key={index}
                    image={proj.image}
                    project_name={proj.project_name}
                    project_desc={proj.project_desc}
                    github_link={proj.github_link}
                />
            ))}
        </div>
    )
}

export default ProjectsDisplayed;