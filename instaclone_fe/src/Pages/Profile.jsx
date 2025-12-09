import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { simpleLogout } from "../auth";
import { deleteMyAccount } from '../api/account.js';

export default function Profile() {
    const [user, setUser] = useState(null);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = sessionStorage.getItem("access_token");

        async function getUserInfo(accessToken) {
            const res = await fetch("http://localhost:18080/realms/instaclone/protocol/openid-connect/userinfo", {
                headers: {
                    "Authorization": `Bearer ${accessToken}`
                }
            });
            return res.json();
        }
        getUserInfo(token).then(setUser);
    }, []);

    const handleDeleteAccount = async () => {
        // GDPR requires clear confirmation
        const confirmed = window.confirm(
            "Are you sure you want to delete your account?\n\n" +
            "This action is PERMANENT and cannot be undone.\n\n" +
            "The following data will be deleted:\n" +
            "• Your profile information\n" +
            "• All your posts and images\n" +
            "• Your Keycloak account\n\n" +
            "Type 'DELETE' in the next prompt to confirm."
        );

        if (!confirmed) return;

        const confirmText = window.prompt("Type 'DELETE' to confirm account deletion:");
        if (confirmText !== 'DELETE') {
            alert("Account deletion cancelled. You must type 'DELETE' exactly to confirm.");
            return;
        }

        setDeleting(true);
        setError(null);

        try {
            await deleteMyAccount();

            // Clear all session data
            sessionStorage.removeItem("access_token");
            sessionStorage.removeItem("refresh_token");
            sessionStorage.removeItem("id_token");

            alert("Your account has been successfully deleted. All your data has been removed.");
            navigate("/");
        } catch (err) {
            console.error("Failed to delete account:", err);
            if (err.response?.status === 401) {
                setError("Session expired. Please log in again.");
                simpleLogout();
            } else {
                setError(err.response?.data?.message || "Failed to delete account. Please try again or contact support.");
            }
        } finally {
            setDeleting(false);
        }
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <h1>Profile</h1>

            {user.picture && <img src={user.picture} alt="Profile" style={{ borderRadius: '50%', width: '100px', height: '100px' }} />}

            <div style={{ marginTop: '20px' }}>
                <p><strong>Username:</strong> {user.preferred_username}</p>
                <p><strong>Name:</strong> {user.name}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>

            {error && (
                <div style={{ color: 'red', marginTop: '20px', padding: '10px', backgroundColor: '#ffe0e0', borderRadius: '5px' }}>
                    {error}
                </div>
            )}

            <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                <button
                    onClick={simpleLogout}
                    style={{ padding: '10px 20px', cursor: 'pointer' }}
                >
                    Logout
                </button>

                <button
                    onClick={handleDeleteAccount}
                    disabled={deleting}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        cursor: deleting ? 'not-allowed' : 'pointer',
                        opacity: deleting ? 0.6 : 1
                    }}
                >
                    {deleting ? 'Deleting...' : 'Delete Account'}
                </button>
            </div>

            <p style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
                Deleting your account will permanently remove all your data including posts and images.
                This action cannot be undone.
            </p>
        </div>
    );
}