export function isLoggedIn() {
    return !!sessionStorage.getItem("access_token");
}

export function logout() {
    const idToken = sessionStorage.getItem("id_token");

    // Clear all tokens from session storage
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("id_token");

    // Redirect to Keycloak logout endpoint
    // Note: Make sure "http://localhost:55757/*" is added to "Valid Post Logout Redirect URIs" 
    // in your Keycloak client settings
    let logoutUrl =
        "http://localhost:18080/realms/instaclone/protocol/openid-connect/logout"
        + `?post_logout_redirect_uri=${encodeURIComponent("http://localhost:55757/")}`;

    // Only add id_token_hint if we have a valid token
    if (idToken && idToken !== "undefined" && idToken !== "null") {
        logoutUrl += `&id_token_hint=${idToken}`;
    }

    window.location.href = logoutUrl;
}

// Simple logout - just clears local tokens without Keycloak redirect
// Use this if you haven't configured post_logout_redirect_uri in Keycloak
export function simpleLogout() {
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("refresh_token");
    sessionStorage.removeItem("id_token");

    window.location.href = "/";
}

// Notify other components that auth state changed
export function notifyAuthChange() {
    window.dispatchEvent(new Event("authChange"));
}