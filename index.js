import React, {
    useState,
    useEffect
} from "https://cdn.skypack.dev/react@17.0.1";
import ReactDOM from "https://cdn.skypack.dev/react-dom";
import axios from "https://cdn.skypack.dev/axios@1.5.0";
import parse from "https://cdn.skypack.dev/html-react-parser"; // Render HTML strings as real HTML

const URL = "https://techcrunch.com/wp-json/wp/v2/posts"; // URL variable stores JSON url || API taken from TechCrunch

const Filter = () => {
    const [post, setPost] = useState([]);
    const [allPosts, setAllPosts] = useState([]);
    const [numberOfPosts] = useState(6);
    const [displayCount, setDisplayCount] = useState(numberOfPosts);

    useEffect(() => {
        axios
            .get(URL, {
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json"
                }
            })
            .then(({ data }) => {
                setPost(data);
                setAllPosts(data);
            })
            .catch((err) => {});
    }, []);

    const onKeyUp = (e) => {
        const filteredPosts = allPosts.filter((item) =>
            parse(item.title.rendered)
                .toLowerCase()
                .includes(e.target.value.toLowerCase())
        );
        setPost(filteredPosts);
    };

    const loadMore = () => {
        // New function
        setDisplayCount((prevCount) => prevCount + numberOfPosts);
    };

    return (
        <>
            <div className="search-outer">
                <form
                    role="search"
                    method="get"
                    id="searchform"
                    className="searchform"
                    action=""
                >
                    <input
                        type="search"
                        onChange={onKeyUp}
                        name="s"
                        id="s"
                        placeholder="Search"
                    />
                    <button type="submit" id="searchsubmit">
                        <i className="fa fa-search" aria-hidden="true" />
                    </button>
                </form>
            </div>
            <ul className="posts">
                {post.slice(0, displayCount).map((item, index) => (
                    <li className={`block-${index}`} key={index}>
                        <a href={item.link} target="_blank">
                            <img
                                className="image"
                                src={
                                    item.yoast_head_json &&
                                    item.yoast_head_json.og_image &&
                                    item.yoast_head_json.og_image[0] &&
                                    item.yoast_head_json.og_image[0].url
                                        ? item.yoast_head_json.og_image[0].url
                                        : "" // Fallback image URL
                                }
                                loading="lazy"
                            />
                            <div className="content">
                                <h3 className="title">
                                    {parse(item.title.rendered)}
                                </h3>

                                <div className="link">Read more</div>
                            </div>
                        </a>
                    </li>
                ))}
            </ul>
            {displayCount < post.length && (
                <button className="load-more" onClick={loadMore}>
                    Load More
                </button>
            )}
        </>
    );
};

const App = () => {
    return (
        <div className="container">
            <Filter />
        </div>
    );
};

ReactDOM.render(<App />, document.querySelector("#root"));
