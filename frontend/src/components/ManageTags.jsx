import React, { useState, useEffect } from "react";
import axios from "axios";

function ManageTags({ getTags }) {
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchTags();
  }, []);

  async function fetchTags() {
    try {
      const res = await axios.get("/api/tags");
      setTags(res.data);
    } catch (err) {
      setMessage("Błąd pobierania tagów");
    }
  }

  async function handleAddTag() {
    if (newTag.trim() === "") return;

    try {
      const res = await axios.post(
        "/api/tags",
        { name: newTag },
        {
          headers: {
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

  async function handleRemoveTag(tag) {
    try {
      const tagObj = tags.find((t) => t.name === tag);
      if (!tagObj) return setMessage("Nie znaleziono tagu");

      const res = await axios.delete(`/api/tags/${tagObj._id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setMessage(`Tag "${tag}" usunięty pomyślnie!`);
      fetchTags();
      if (getTags) getTags();
    } catch (err) {
      setMessage(err.response?.data?.message || "Błąd usuwania tagu");
    }
  }

  return (
    <main className="h-full py-8">
      <h2 className="text-4xl font-bold">Globalne Zarządzanie Tagami</h2>

      <div className="flex gap-2 mt-4 w-fit">
        <input
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          className="px-4 py-1 mt-2 text-black border-2 border-black outline-none hover:border-amber-500 focus:border-amber-500 active:border-amber-500"
          placeholder="Enter new tag..."
        />
        <button type="button" onClick={handleAddTag} className="px-2 py-1 mt-2 bg-blue-800 rounded-lg text-nowrap">
          Dodaj tag
        </button>
      </div>

      <div className="mt-4">
        <h3 className="font-bold">Istniejące Globalne Tagi</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {tags.length === 0 ? (
            <p className="text-gray-500">Brak dostępnych tagów.</p>
          ) : (
            tags.map((tag, index) => (
              <div key={tag._id} className="px-4 py-1 text-sm font-bold uppercase bg-blue-800 rounded-lg">
                {tag.name}
                <button className="ml-2 font-bold " onClick={() => handleRemoveTag(tag.name)}>
                  ❌
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {message && (
        <div className="mt-4 text-lg font-bold text-amber-400">
          {message}
          <div className="hidden">{setTimeout(() => setMessage(""), 3000)}</div>
        </div>
      )}
    </main>
  );
}

export default ManageTags;
