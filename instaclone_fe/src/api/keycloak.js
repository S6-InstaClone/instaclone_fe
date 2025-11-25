import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
    url: 'http://localhost:18080/auth', // replace with your Keycloak server URL
    realm: 'instaclone',               // replace with your realm name
    clientId: 'public-client',        // replace with your client ID
});

async function exchangeCodeForTokens(code) {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", "myclient");
    params.append("code", code);
    params.append("redirect_uri", "http://localhost:3000");
    params.append("code_verifier", localStorage.getItem("pkce_verifier")); // if using PKCE

    const res = await fetch("http://localhost:18080/realms/instaclone/protocol/openid-connect/token", {
        method: "POST",
        headers: {"Content-Type": "application/x-www-form-urlencoded"},
        body: params.toString()
    });

    return res.json()
}

function decodeJwt(token) {
    return JSON.parse(atob(token.split('.')[1]));
}
async function deleteAccount() {
    const token = sessionStorage.getItem("access_token");

    await fetch("http://localhost:18080/realms/instaclone/account", {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${token}`
        }
    });

    // Clear session
    sessionStorage.clear();
    window.location.href = "/";
}
export default {
    keycloak,
        exchangeCodeForTokens,
        decodeJwt,
        deleteAccount
};
