import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "../auth";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        if (isLoggedIn()) {
            navigate("/profile");
        }
    }, [navigate]);

    function login() {
        // Build Keycloak login URL
        const url =
            "http://localhost:18080/realms/instaclone/protocol/openid-connect/auth"
            + "?client_id=public-client"
            + "&redirect_uri=http://localhost:55757/auth/callback"
            + "&response_type=code"
            + "&scope=openid";

        window.location.href = url;
    }

    return (
        <div>
            <h1>Welcome</h1>
            <p>You are not logged in.</p>
            <button onClick={login}>Login with Keycloak</button>
        </div>
    );
}
