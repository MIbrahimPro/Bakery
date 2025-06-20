import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AdminContext = createContext();

export function AdminProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            setIsAdmin(false);
            setChecked(true);
            return;
        }
        axios
            .get("/users/me/is-admin", {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => setIsAdmin(res.data.isAdmin))
            .catch(() => setIsAdmin(false))
            .finally(() => setChecked(true));
    }, []);

    return (
        <AdminContext.Provider value={{ isAdmin, checked }}>
            {children}
        </AdminContext.Provider>
    );
}

export function useAdmin() {
    return useContext(AdminContext);
}
