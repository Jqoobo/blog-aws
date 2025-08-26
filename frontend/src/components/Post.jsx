import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function Post({ user }) {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [message, setMessage] = useState("");
  const [comment, setComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  useEffect(() => {
    fetchPost();
    fetchTags();
  }, [id]);

  async function fetchPost() {
    try {
      const res = await axios.get(`/api/posts/${id}`);
      const data = res.data;
      setBlog({
        ...data,
        comments: Array.isArray(data.comments) ? data.comments : [],
      });
      setTitle(data.title);
      setContent(data.content);
      setSelectedTags(data.tags.map((tag) => (typeof tag === "string" ? tag : tag._id)));
    } catch {
      setBlog(null);
    }
  }

  async function fetchTags() {
    try {
      const res = await axios.get("/api/tags");
      setAvailableTags(res.data);
    } catch {
      setAvailableTags([]);
    }
  }

  async function handleEdit() {
    setIsEditing(true);
    fetchTags();
  }

  function handleCancel() {
    setIsEditing(false);
    setTitle(blog.title);
    setContent(blog.content);
    setSelectedTags(blog.tags.map((tag) => (typeof tag === "string" ? tag : tag.name)));
  }

  async function handleSave() {
    try {
      const res = await axios.put(
        `/api/posts/${id}`,
        {
          title,
          content,
          tags: selectedTags,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMessage("Edycja postu powiodła się!");
      setIsEditing(false);
      fetchPost();
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Błąd edycji posta");
      }
    }
  }

  async function handleAddComment() {
    if (comment.trim() === "") return;
    try {
      const res = await axios.post(
        "/api/comments",
        { content: comment, post: id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setComment("");
      fetchPost();
      console.log(res.data);
    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage("Błąd dodawania komentarza");
      }
    }
  }

  function handleEditComment(commentId) {
    setEditingCommentId(commentId);
    const commentToEdit = blog.comments.find((c) => c._id === commentId);
    if (commentToEdit) {
      setEditingCommentText(commentToEdit.content);
    }
  }

  async function handleSaveComment(commentId) {
    if (editingCommentText.trim() === "") return;
    try {
      await axios.put(
        `/api/comments/${commentId}`,
        { content: editingCommentText },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setEditingCommentId(null);
      setEditingCommentText("");
      fetchPost();
    } catch (error) {
      setMessage(
        error.response && error.response.data && error.response.data.message
          ? error.response.data.message
          : "Błąd edycji komentarza!"
      );
    }
  }

  async function handleRemoveComment(commentId) {
    try {
      const res = await axios.delete(`/api/comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (res.status === 200) {
        fetchPost();
      } else {
        setMessage("Błąd usuwania komentarza");
      }
    } catch {
      setMessage("Błąd połączenia z API");
    }
  }

  function toggleTag(tagId) {
    setSelectedTags((prevTags) =>
      prevTags.includes(tagId) ? prevTags.filter((t) => t !== tagId) : [...prevTags, tagId]
    );
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString("pl-PL", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  }

  if (!blog) {
    return <div>Post nie istnieje</div>;
  }

  return (
    <main className="flex flex-col justify-between h-full py-8">
      <div className={`flex flex-col ${isEditing ? "justify-start gap-6" : "justify-between"} h-full`}>
        {isEditing ? (
          <>
            <h2 className="mb-4 text-4xl font-bold">Edytuj post</h2>
            <div>
              <p className="font-bold">Tytuł</p>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-1 mt-2 text-black border-2 border-black outline-none hover:border-amber-500"
              />
            </div>
            <div>
              <p className="font-bold">Treść</p>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-1 mt-2 text-black border-2 border-black outline-none hover:border-amber-500"
              />
            </div>
            <div>
              <p className="font-bold ">Wybierz tagi albo odznacz, aby usunąć</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {availableTags.length > 0 ? (
                  availableTags.map((tag) => (
                    <button
                      key={tag._id}
                      type="button"
                      className={`px-4 py-1 text-sm font-bold uppercase rounded-lg  ${
                        selectedTags.includes(tag._id) ? "bg-blue-800 " : "bg-gray-300 text-black"
                      }`}
                      onClick={() => toggleTag(tag._id)}
                    >
                      {tag.name}
                    </button>
                  ))
                ) : (
                  <p className="text-gray-500">Nie znaleziono tagów.</p>
                )}
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <button onClick={handleSave} className="px-3 py-1 text-lg bg-blue-800 rounded-lg">
                Zapisz
              </button>
              <button onClick={handleCancel} className="px-3 py-1 text-lg bg-blue-800 rounded-lg">
                Anuluj
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col justify-between gap-4">
              <div className="text-xl font-light text-right">{formatDate(blog.createdAt)}</div>
              {user?.id === blog.author._id && (
                <button onClick={handleEdit} className="self-end px-4 py-1 text-lg bg-blue-800 rounded-lg w-fit ">
                  Edytuj post
                </button>
              )}
              <div className="flex flex-col gap-8 mt-10">
                <h3 className="text-4xl font-bold">{blog.title}</h3>
                <p className="text-lg">{blog.content}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-start gap-2 py-8">
              Tagi:
              {(blog.tags || []).map((tag, idx) => (
                <div key={idx} className="px-4 py-1 text-sm font-bold uppercase bg-blue-800 rounded-lg">
                  {typeof tag === "string" ? tag : tag.name}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="border-t-[1px] border-amber-500 py-4">
        <h4 className="mb-4 text-2xl font-bold">Komentarze</h4>
        {Array.isArray(blog.comments) && blog.comments.length === 0 ? (
          <p className="mt-2 text-sm font-light">Brak komentarzy</p>
        ) : (
          blog.comments &&
          blog.comments.map((c, index) => (
            <div key={c._id} className="flex items-center justify-between py-2 px-4 border-b-[1px] border-gray-500">
              <div>
                {editingCommentId === c._id ? (
                  <>
                    <textarea
                      value={editingCommentText}
                      onChange={(e) => setEditingCommentText(e.target.value)}
                      className="w-full py-1 px-4 outline-none min-h-[50px] border-[1px] border-black hover:border-amber-500 text-black"
                    />
                    <button onClick={() => handleSaveComment(c._id)} className="px-3 py-1 my-2 bg-blue-800 rounded-lg">
                      Zapisz
                    </button>
                  </>
                ) : (
                  <>
                    <p>{c.content}</p>
                    <p className="mt-1 text-sm text-gray-500">{formatDate(c.createdAt)}</p>
                  </>
                )}
              </div>
              <div className="flex gap-2">
                {user?.id === blog.author._id && (
                  <>
                    <button onClick={() => handleEditComment(c._id)} className="px-3 py-1 bg-blue-800 rounded-lg">
                      Edytuj
                    </button>
                    <button onClick={() => handleRemoveComment(c._id)} className="px-3 py-1 bg-red-700 rounded-lg">
                      Usuń
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}

        <div className="mt-4">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Napisz coś miłego..."
            className="w-full py-1 px-2 min-h-[50px] text-black outline-none border-[1px] border-black hover:border-amber-500"
          />
          <button onClick={handleAddComment} className="px-4 py-1 mt-2 text-lg bg-blue-700 rounded-lg">
            Dodaj komentarz
          </button>
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

export default Post;
