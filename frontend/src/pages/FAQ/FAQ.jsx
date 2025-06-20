import React, { useEffect, useState } from "react";
import axios from "axios";
import "./FAQ.scss";

const FAQ = () => {
    const [faqs, setFaqs] = useState([]);
    const [open, setOpen] = useState([]);

    useEffect(() => {
        axios.get("/general").then((res) => {
            setFaqs(res.data?.faq || []);
            setOpen(Array(res.data?.faq?.length || 0).fill(false));
        });
    }, []);

    const toggle = (idx) => {
        setOpen((open) => open.map((v, i) => (i === idx ? !v : v)));
    };

    return (
        <div style={{ background: "#ffc996", minHeight: "100vh" }}>
            <div className="heading">
                <h1 className="faq">FREQUENTLY ASKED QUESTIONS!</h1>
            </div>
            <div className="parent">
                {faqs.map((q, idx) => (
                    <div className="ques" key={idx}>
                        <div className="child" style={{ position: "relative" }}>
                            <b>{q.question}</b>
                            <i
                                className={`fa fa-chevron-down${
                                    open[idx] ? " rot" : ""
                                }`}
                                onClick={() => toggle(idx)}
                                style={{
                                    cursor: "pointer",
                                    position: "absolute",
                                    right: 0,
                                }}
                            ></i>
                        </div>
                        <div className={`ans${open[idx] ? " show" : " hide"}`}>
                            {q.answer}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ;
