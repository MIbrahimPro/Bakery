import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./CookingVideosAdminPage.module.scss";

const emptyVideo = {
    title: "",
    description: "",
    videoUrl: null,
};

const CookingVideosAdminPage = () => {
    const [videos, setVideos] = useState([]);
    const [form, setForm] = useState(emptyVideo);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");

    const fetchVideos = () => {
        setLoading(true);
        setError("");
        axios
            .get("/cooking-videos/all")
            .then((res) => setVideos(res.data))
            .catch(() => setError("Failed to fetch videos"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleEdit = (v) => {
        setEditing(v._id);
        setForm({
            title: v.title,
            description: v.description || "",
            videoUrl: null,
        });
    };

    const handleDelete = (id) => {
        if (!window.confirm("Delete this video?")) return;
        setMsg("");
        setError("");
        axios
            .delete(`/cooking-videos/admin/delete/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then(() => {
                setMsg("Video deleted");
                fetchVideos();
            })
            .catch(() => setError("Failed to delete video"));
    };

    const handleFormChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "videoUrl") {
            setForm({ ...form, videoUrl: files[0] });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setMsg("");
        setError("");
        const data = new FormData();
        data.append("title", form.title);
        data.append("description", form.description);
        // Always append a video file if present, even on update
        if (form.videoUrl) {
            data.append("video", form.videoUrl);
        } else if (editing) {
            // If editing and no new file, send a flag to backend to keep old video
            data.append("keepOldVideo", "true");
        }
        const config = {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
                "Content-Type": "multipart/form-data",
            },
        };
        if (editing) {
            axios
                .put(`/cooking-videos/admin/change/${editing}`, data, config)
                .then(() => {
                    setMsg("Video updated");
                    setEditing(null);
                    setForm(emptyVideo);
                    fetchVideos();
                })
                .catch(() => setError("Failed to update video"));
        } else {
            axios
                .post("/cooking-videos/admin/add", data, config)
                .then(() => {
                    setMsg("Video added");
                    setForm(emptyVideo);
                    fetchVideos();
                })
                .catch(() => setError("Failed to add video"));
        }
    };

    return (
        <div className={styles.cookingVideosAdminPage}>
            <h2>Manage Cooking Videos</h2>
            <form className={styles.videoForm} onSubmit={handleFormSubmit}>
                <input
                    name="title"
                    placeholder="Title"
                    value={form.title}
                    onChange={handleFormChange}
                    required
                />
                <input
                    name="description"
                    placeholder="Description"
                    value={form.description}
                    onChange={handleFormChange}
                />
                <input
                    name="videoUrl"
                    type="file"
                    accept="video/*"
                    onChange={handleFormChange}
                />
                <button type="submit">
                    {editing ? "Update" : "Add"} Video
                </button>
                {editing && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditing(null);
                            setForm(emptyVideo);
                        }}
                    >
                        Cancel
                    </button>
                )}
            </form>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className={styles.errorMsg}>{error}</div>
            ) : (
                <table className={styles.videoTable}>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Video</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {videos.map((v) => (
                            <tr key={v._id}>
                                <td>{v.title}</td>
                                <td>{v.description}</td>
                                <td>
                                    {v.videoUrl && (
                                        <video width="180" controls>
                                            <source
                                                src={v.videoUrl}
                                                type="video/mp4"
                                            />
                                            Your browser does not support the
                                            video tag.
                                        </video>
                                    )}
                                </td>
                                <td>
                                    <button
                                        className={styles.editBtn}
                                        onClick={() => handleEdit(v)}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        className={styles.deleteBtn}
                                        onClick={() => handleDelete(v._id)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {msg && <div className={styles.successMsg}>{msg}</div>}
        </div>
    );
};

export default CookingVideosAdminPage;
