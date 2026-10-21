import { useState } from "react";

function Post(){

    const [postType, setPostType] = useState("question");

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [abstract, setAbstract] = useState("");
    const [articleText, setArticleText] = useState("");
    const [tags, setTags] = useState("");

    const [titleError, setTitleError] = useState("");
    const [descriptionError, setDescriptionError] = useState("");
    const [abstractError, setAbstractError] = useState("");
    const [articleTextError, setArticleTextError] = useState("");
    const [tagsError, setTagsError] = useState("");

    function handlePost(){

        let valid = true;

        if (title.length < 5){
            setTitleError("Title must be at least 5 characters.");
            valid = false;
        } else {
            setTitleError("");
        }

        if (postType === "question" && description.length < 20){
            setDescriptionError("Description must be at least 20 characters.");
            valid = false;
        } else {
            setDescriptionError("");
        }

        if (postType === "article" && abstract.length < 20){
            setAbstractError("Abstract must be at least 20 characters.");
            valid = false;
        } else {
            setAbstractError("");
        }

        if (postType === "article" && articleText.length < 50){
            setArticleTextError("Article text must be at least 50 characters.");
            valid = false;
        } else {
            setArticleTextError("");
        }

                const tagList = tags.split(",");
        let tagsMessage = "";

        if (tags === ""){
            tagsMessage = "Please add at least 1 tag.";
        } else if (tagList.length > 3){
            tagsMessage = "You can add up to 3 tags only.";
        } else {
            for (let i = 0; i < tagList.length; i++){
                if (tagList[i].trim() === ""){
                    tagsMessage = "Tags cannot be empty. Separate tags with commas, like Java, React.";
                } else if (tagList[i].trim().length > 20){
                    tagsMessage = "Each tag must be 20 characters or less.";
                }
            }
        }

        setTagsError(tagsMessage);

        if (tagsMessage !== ""){
            valid = false;
        }

        if (valid){
            alert("Your post has been sent successfully!");
        } else {
            alert("An error occurred. Please check the red messages and try again.");
        }
    }

    return(
        <div className="post_page">

            <div className="post_bar">New Post</div>

            <div className="post_type">
                <label>Select Post Type:</label>

                <label>
                    <input
                        type="radio"
                        checked={postType === "question"}
                        onChange={() => setPostType("question")}
                    />
                    Question
                </label>

                <label>
                    <input
                        type="radio"
                        checked={postType === "article"}
                        onChange={() => setPostType("article")}
                    />
                    Article
                </label>
            </div>

            <div className="post_bar">What do you want to ask or share</div>

            {postType === "question" && (
                <div className="post_form">
                    <div className="post_row">
                        <label>Title</label>
                        <input
                            type="text"
                            placeholder="Start your question with how, what, why, etc."
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    {titleError && <p className="post_error">{titleError}</p>}

                    <label className="post_label">Describe your problem</label>
                    <textarea
                        className="post_big_box"
                        onChange={(e) => setDescription(e.target.value)}
                    ></textarea>
                    {descriptionError && <p className="post_error">{descriptionError}</p>}

                    <div className="post_row">
                        <label>Tags</label>
                        <input
                            type="text"
                            placeholder="Please add up to 3 tags to describe what your question is about e.g., Java"
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>
                    {tagsError && <p className="post_error">{tagsError}</p>}
                </div>
            )}

            {postType === "article" && (
                <div className="post_form">
                    <div className="post_row">
                        <label>Title</label>
                        <input
                            type="text"
                            placeholder="Enter a descriptive title"
                            onChange={(e) => setTitle(e.target.value)}
                        />
                    </div>
                    {titleError && <p className="post_error">{titleError}</p>}

                    <label className="post_label">Abstract</label>
                    <textarea
                        className="post_small_box"
                        placeholder="Enter a 1-paragraph abstract"
                        onChange={(e) => setAbstract(e.target.value)}
                    ></textarea>
                    {abstractError && <p className="post_error">{abstractError}</p>}

                    <label className="post_label">Article Text</label>
                    <textarea
                        className="post_big_box"
                        placeholder="Enter your article text"
                        onChange={(e) => setArticleText(e.target.value)}
                    ></textarea>
                    {articleTextError && <p className="post_error">{articleTextError}</p>}

                    <div className="post_row">
                        <label>Tags</label>
                        <input
                            type="text"
                            placeholder="Please add up to 3 tags to describe what your article is about e.g., Java"
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>
                    {tagsError && <p className="post_error">{tagsError}</p>}
                </div>
            )}

            <div className="post_btn_row">
                <button className="post_btn" onClick={handlePost}>Post</button>
            </div>

        </div>
    )
}

export default Post