import { useState, useEffect } from "react";
import UserContent from "./userContent";
import AdminContent from "./adminContent";

export default function ReportAboutBugIndexPage() {
    const [currentRole, setCurrentRole] = useState("");

    const whoIsUser  = () => {
        const role = localStorage.getItem("role");
        setCurrentRole(role);
    };

    useEffect(() => {
        whoIsUser ();
    }, []); // Empty dependency array means this runs once on mount

    return (
        <div>
            {currentRole === "user" ? (
                <UserContent />
            ) : (
                <AdminContent />
            )}
        </div>
    );
}