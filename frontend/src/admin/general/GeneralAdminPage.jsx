import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./GeneralAdminPage.module.scss";

const defaultGeneral = {
    instagramLink: "",
    facebookLink: "",
    youtubeLink: "",
    contactNumber: "",
    contactEmail: "",
    analytics: {
        yearsOfOperation: 0,
        employeesCount: 0,
        bakedKilograms: 0,
        destinationsCount: 0,
    },
    mapEmbedUrl: "",
    faq: [],
};

const GeneralAdminPage = () => {
    const [general, setGeneral] = useState(defaultGeneral);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [msg, setMsg] = useState("");
    const [faqQ, setFaqQ] = useState("");
    const [faqA, setFaqA] = useState("");
    const [editMode, setEditMode] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError("");
        axios
            .get("/general/")
            .then((res) => setGeneral({ ...defaultGeneral, ...res.data }))
            .catch(() => setError("Failed to fetch general info"))
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (field, value) => {
        setGeneral((prev) => ({ ...prev, [field]: value }));
    };
    const handleAnalyticsChange = (field, value) => {
        setGeneral((prev) => ({
            ...prev,
            analytics: { ...prev.analytics, [field]: value },
        }));
    };
    const handleFaqAdd = (e) => {
        e.preventDefault();
        setMsg("");
        setError("");
        axios
            .post(
                "/general/faq",
                { question: faqQ, answer: faqA },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                }
            )
            .then((res) => {
                setGeneral((prev) => ({ ...prev, faq: res.data.config.faq }));
                setFaqQ("");
                setFaqA("");
                setMsg("FAQ added");
            })
            .catch(() => setError("Failed to add FAQ"));
    };
    const handleFaqDelete = (faqId) => {
        setMsg("");
        setError("");
        axios
            .delete(`/general/faq/${faqId}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then((res) => {
                setGeneral((prev) => ({ ...prev, faq: res.data.config.faq }));
                setMsg("FAQ removed");
            })
            .catch(() => setError("Failed to remove FAQ"));
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        setMsg("");
        setError("");
        axios
            .put("/general/change", general, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            })
            .then(() => {
                setMsg("General info updated");
                setEditMode(false);
            })
            .catch(() => setError("Failed to update info"));
    };
    const handleEditClick = () => {
        setEditMode(true);
        setMsg("");
        setError("");
    };

    return (
        <div className={styles.generalAdminPage}>
            <h2>General Config Editor</h2>
            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div className={styles.errorMsg}>{error}</div>
            ) : (
                <form className={styles.generalForm} onSubmit={handleSubmit}>
                    <div className={styles.formRow}>
                        <label>Instagram Link</label>
                        <input
                            value={general.instagramLink}
                            onChange={(e) =>
                                handleChange("instagramLink", e.target.value)
                            }
                            disabled={!editMode}
                            placeholder="Instagram URL"
                        />
                        <label>Facebook Link</label>
                        <input
                            value={general.facebookLink}
                            onChange={(e) =>
                                handleChange("facebookLink", e.target.value)
                            }
                            disabled={!editMode}
                            placeholder="Facebook URL"
                        />
                        <label>YouTube Link</label>
                        <input
                            value={general.youtubeLink}
                            onChange={(e) =>
                                handleChange("youtubeLink", e.target.value)
                            }
                            disabled={!editMode}
                            placeholder="YouTube URL"
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Contact Number</label>
                        <input
                            value={general.contactNumber}
                            onChange={(e) =>
                                handleChange("contactNumber", e.target.value)
                            }
                            disabled={!editMode}
                            placeholder="Contact Number"
                        />
                        <label>Contact Email</label>
                        <input
                            value={general.contactEmail}
                            onChange={(e) =>
                                handleChange("contactEmail", e.target.value)
                            }
                            disabled={!editMode}
                            placeholder="Contact Email"
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Analytics</label>
                        <input
                            type="number"
                            value={general.analytics.yearsOfOperation}
                            onChange={(e) =>
                                handleAnalyticsChange(
                                    "yearsOfOperation",
                                    e.target.value
                                )
                            }
                            disabled={!editMode}
                            placeholder="Years of Operation"
                        />
                        <input
                            type="number"
                            value={general.analytics.employeesCount}
                            onChange={(e) =>
                                handleAnalyticsChange(
                                    "employeesCount",
                                    e.target.value
                                )
                            }
                            disabled={!editMode}
                            placeholder="Employees Count"
                        />
                        <input
                            type="number"
                            value={general.analytics.bakedKilograms}
                            onChange={(e) =>
                                handleAnalyticsChange(
                                    "bakedKilograms",
                                    e.target.value
                                )
                            }
                            disabled={!editMode}
                            placeholder="Baked Kilograms"
                        />
                        <input
                            type="number"
                            value={general.analytics.destinationsCount}
                            onChange={(e) =>
                                handleAnalyticsChange(
                                    "destinationsCount",
                                    e.target.value
                                )
                            }
                            disabled={!editMode}
                            placeholder="Destinations Count"
                        />
                    </div>
                    <div className={styles.formRow}>
                        <label>Map Embed URL</label>
                        <input
                            value={general.mapEmbedUrl}
                            onChange={(e) =>
                                handleChange("mapEmbedUrl", e.target.value)
                            }
                            disabled={!editMode}
                            placeholder="Map Embed URL"
                        />
                    </div>
                    <div className={styles.buttonRow}>
                        {!editMode ? (
                            <button
                                type="button"
                                className={styles.editBtn}
                                onClick={handleEditClick}
                            >
                                Edit
                            </button>
                        ) : (
                            <>
                                <br />
                                <br />
                                <br />
                                <button
                                    type="submit"
                                    className={styles.saveBtn}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                    }}
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className={styles.cancelBtn}
                                    onClick={() => {
                                        setEditMode(false);
                                        setMsg("");
                                        setError("");
                                    }}
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </form>
            )}
            <h3>FAQ</h3>
            <form onSubmit={handleFaqAdd} className={styles.faqForm}>
                <input
                    placeholder="Question"
                    value={faqQ}
                    onChange={(e) => setFaqQ(e.target.value)}
                    required
                />
                <input
                    placeholder="Answer"
                    value={faqA}
                    onChange={(e) => setFaqA(e.target.value)}
                    required
                />
                <button type="submit" className={styles.addFaqBtn}>
                    Add FAQ
                </button>
            </form>
            <ul className={styles.faqList}>
                {general.faq.map((f) => (
                    <li key={f._id}>
                        <b>{f.question}</b>: {f.answer}
                        <button
                            className={styles.deleteFaqBtn}
                            onClick={() => handleFaqDelete(f._id)}
                        >
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
            {msg && <div className={styles.successMsg}>{msg}</div>}
            {error && <div className={styles.errorMsg}>{error}</div>}
        </div>
    );
};

export default GeneralAdminPage;
