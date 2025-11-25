import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

function AuthCallback() {
    const navigate = useNavigate();
    const hasExchanged = useRef(false);

    useEffect(() => {
        if (hasExchanged.current) return; // prevent duplicate requests

        const url = new URL(window.location.href);
        const code = url.searchParams.get("code");
        if (!code) return;

        async function exchangeCode() {
            const params = new URLSearchParams();
            params.append("grant_type", "authorization_code");
            params.append("client_id", "public-client");
            params.append("code", code);
            params.append("redirect_uri", "http://localhost:55757/auth/callback");

            const res = await fetch(
                "http://localhost:18080/realms/instaclone/protocol/openid-connect/token",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/x-www-form-urlencoded" },
                    body: params,
                }
            );

            const data = await res.json();

            sessionStorage.setItem("access_token", data.access_token);
            sessionStorage.setItem("refresh_token", data.refresh_token);
            sessionStorage.setItem("id_token", data.id_token);

            hasExchanged.current = true; // mark as done
            navigate("/profile");
        }

        exchangeCode();
    }, [navigate]);

    return <p>Finalizing login...</p>;
}

export default AuthCallback;
