import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const VITE_API_BASE = import.meta.env.VITE_API_BASE;

function AddPost({ getBlogs, getTags }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {
    try {
      const res = await axios.get(`${VITE_API_BASE}/api/tags`);
      setAvailableTags(res.data);
    } catch (err) {
      setMessage("Błąd pobierania tagów");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title || !content) {
      setMessage("Tytuł i treść są wymagane!");
      return;
    }

    try {
      const res = await axios.post(
        `${VITE_API_BASE}/api/posts`,
        {
          title,
          content,
          tags: selectedTags,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("Post dodany pomyślnie!");
      setTitle("");
      setContent("");
      setSelectedTags([]);
      if (getBlogs) getBlogs();
      navigate("/");
    } catch (err) {
      setMessage(err.response?.data?.message || "Błąd dodawania posta");
    }
  }

  async function handleAddTag() {
    if (newTag.trim() === "") return;

    try {
      const res = await axios.post(
        `${VITE_API_BASE}/api/tags`,
        { name: newTag },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setMessage("Tag dodany pomyślnie!");
      setNewTag("");
      fetchTags();
      if (getTags) getTags();
    } catch (err) {
      setMessage(err.response?.data?.message || "Błąd dodawania tagu");
    }
  }

  function toggleTag(tagId) {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId) ? prevTags.filter((t) => t !== tagId) : [...prevTags, tagId]
    );
  }

  return (
    <main className="flex flex-col justify-start h-full gap-6 py-8">
      <h2 className="mb-5 text-4xl font-bold">Dodaj nowy post</h2>

      <form className="grid gap-4 pb-8 border-b-[1px] border-amber-500" onSubmit={handleSubmit}>
        <div>
          <p className="font-bold ">Tytuł</p>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-1 mt-2 text-black border-2 border-black outline-none hover:border-amber-500 focus:border-amber-500 active:border-amber-500"
          />
        </div>
        <div>
          <p className="font-bold">Treść</p>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full px-4 py-1 mt-2 text-black border-2 border-black outline-none hover:border-amber-500 focus:border-amber-500 active:border-amber-500"
          />
        </div>
        <div>
          <p className="font-bold">Dodaj nowy tag (opcjonalnie)</p>
          <div className="flex items-center justify-start gap-2 w-fit">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              className="w-full px-4 py-1 mt-2 text-black border-2 border-black outline-none hover:border-amber-500 focus:border-amber-500 active:border-amber-500"
              placeholder="Nazwa tagu"
            />
            <button type="button" onClick={handleAddTag} className="px-2 py-1 mt-2 bg-blue-800 rounded-lg text-nowrap">
              Dodaj tag
            </button>
          </div>
        </div>
        <div>
          <p className="font-bold">Wybierz istniejące tagi</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {availableTags.map((tag) => (
              <button
                key={tag._id}
                type="button"
                className={`px-4 py-1 text-sm font-bold uppercase rounded-lg ${
                  selectedTags.includes(tag._id) ? "bg-blue-800" : "bg-gray-300 text-black"
                }`}
                onClick={() => toggleTag(tag._id)}
              >
                {tag.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button className="px-3 py-1 text-lg bg-blue-800 rounded-lg" type="submit">
            Dodaj post
          </button>
        </div>
      </form>

      {message && (
        <div className="mt-4 text-lg font-bold text-amber-400">
          {message}
          <div className="hidden">{setTimeout(() => setMessage(""), 3000)}</div>
        </div>
      )}
    </main>
  );
}

export default AddPost;
