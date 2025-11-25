import { useEffect, useState } from "react";
import deleteAccount from '../api/keycloak.js';
export default function Profile() {
    const [user, setUser] = useState(null);

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

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h1>Profile</h1>
            <img src={user.picture} alt="pfp" />
            <p>Username: {user.preferred_username}</p>
            <p>Name: {user.name}</p>

            <button onClick={deleteAccount}>Delete Account</button>
        </div>
    );
}
