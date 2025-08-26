import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    axios
      .get("/api/posts")
      .then((res) => setPosts(res.data.posts || []))
      .catch((err) => console.error(err));
  }, []);

  return (
    <main className="w-full h-full">
      <h2 className="py-8 text-4xl font-bold">Sprawdź nasze posty</h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post, idx) => (
          <Link to={`/post/${post._id}`} key={post._id}>
            <div
              className={`p-4 min-h-[170px] flex flex-col justify-between backdrop-blur-3xl ${
                idx % 2 === 0 ? "border-amber-500" : "border-blue-700"
              } border-[1px]`}
            >
              <div className="mb-1 text-right">{post.createdAt ? new Date(post.createdAt).toLocaleString() : ""}</div>
              <div className="flex flex-col">
                <h3 className="mb-2 text-3xl font-bold break-all">{post.title}</h3>
                <div className="mb-2 text-sm text-gray-400">By {post.author?.username || post.author || "Unknown"}</div>
                <div className="flex items-center justify-between w-full">
                  <div className="flex gap-2 mt-2">
                    {(post.tags || []).map((tag, tagIdx) => (
                      <div key={tagIdx} className="px-4 py-1 text-sm font-bold uppercase bg-blue-800 rounded-lg">
                        {typeof tag === "string" ? tag : tag.name}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}

export default Home;
