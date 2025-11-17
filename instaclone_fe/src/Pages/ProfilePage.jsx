import React, { useEffect, useState } from "react";

// Functional, unstyled single-file Profile page that talks to the provided API.
// Usage: place this file in src/components/ProfilePage.jsx and import <ProfilePage /> in your app.

const API_BASE = "http://localhost:5043/api/Profile"; // adjust if your API base path differs

export default function ProfilePage() {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Create form state
    const [createUsername, setCreateUsername] = useState("");
    const [createName, setCreateName] = useState("");
    const [createDesc, setCreateDesc] = useState("");

    // Search state
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState(null);

    useEffect(() => {
        fetchAllProfiles();
    }, []);

    async function fetchAllProfiles() {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/GetProfiles`);
            if (!res.ok) throw new Error(`Error fetching profiles: ${res.status}`);
            const data = await res.json();
            setProfiles(data);
        } catch (err) {
            setError(err.message || "Unknown error");
        } finally {
            setLoading(false);
        }
    }

    async function handleCreateProfile(e) {
        e.preventDefault();
        setError(null);
        try {
            const payload = {
                username: createUsername,
                name: createName,
                description: createDesc,
            };

            const res = await fetch(`${API_BASE}/CreateProfile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Create failed: ${res.status} ${text}`);
            }

            const result = await res.json();
            // result contains { message, id }
            // reload list
            await fetchAllProfiles();
            setCreateUsername("");
            setCreateName("");
            setCreateDesc("");
            alert(result?.message || "Created");
        } catch (err) {
            setError(err.message || "Create error");
        }
    }

    async function handleSearch(e) {
        e && e.preventDefault();
        setError(null);
        setSearchResults(null);
        try {
            // The API expects a string in the body. We send a JSON string (i.e. "username").
            const res = await fetch(`${API_BASE}/SearchForProfile`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(searchTerm),
            });
            if (!res.ok) {
                throw new Error(`Search failed: ${res.status}`);
            }
            const data = await res.json();
            // API returns { message: "", results }
            setSearchResults(data.results ?? data);
        } catch (err) {
            setError(err.message || "Search error");
        }
    }

    async function handleUpdateName(id, newName) {
        setError(null);
        try {
            const dto = { id, name: newName };
            const res = await fetch(`${API_BASE}/UpdateProfileName`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto),
            });
            if (!res.ok) throw new Error(`Update name failed: ${res.status}`);
            await fetchAllProfiles();
            alert("Name updated");
        } catch (err) {
            setError(err.message || "Update name error");
        }
    }

    async function handleUpdateDescription(id, newDesc) {
        setError(null);
        try {
            const dto = { id, description: newDesc };
            const res = await fetch(`${API_BASE}/UpdateProfileDescription`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(dto),
            });
            if (!res.ok) throw new Error(`Update desc failed: ${res.status}`);
            await fetchAllProfiles();
            alert("Description updated");
        } catch (err) {
            setError(err.message || "Update description error");
        }
    }

    async function handleDeleteProfile(id) {
        if (!window.confirm("Delete profile?")) return;
        setError(null);
        try {
            const res = await fetch(`${API_BASE}/DeleteProfile/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) {
                const json = await res.json().catch(() => null);
                throw new Error(json?.message || `Delete failed: ${res.status}`);
            }
            const result = await res.json();
            await fetchAllProfiles();
            alert(result?.message || "Deleted");
        } catch (err) {
            setError(err.message || "Delete error");
        }
    }

    async function handleUploadPicture(id, file) {
        if (!file) return;
        setError(null);
        try {
            const form = new FormData();
            form.append("Id", id);
            form.append("File", file);

            const res = await fetch(`${API_BASE}/UploadProfilePicture`, {
                method: "POST",
                body: form,
            });
            if (!res.ok) {
                const text = await res.text();
                throw new Error(`Upload failed: ${res.status} ${text}`);
            }
            const result = await res.json();
            await fetchAllProfiles();
            alert(result?.message || "Uploaded");
        } catch (err) {
            setError(err.message || "Upload error");
        }
    }

    // UI helpers: editable inputs stored locally per profile
    const [editingNameFor, setEditingNameFor] = useState(null);
    const [editingDescFor, setEditingDescFor] = useState(null);
    const [tempName, setTempName] = useState("");
    const [tempDesc, setTempDesc] = useState("");

    function startEditName(profile) {
        setEditingNameFor(profile.id);
        setTempName(profile.name || "");
    }
    function startEditDesc(profile) {
        setEditingDescFor(profile.id);
        setTempDesc(profile.description || "");
    }

    return (
        <div style={{ padding: 12 }}>
    <h2>Profiles</h2>

    {error && (
        <div style={{ color: "red" }}>
        <strong>Error:</strong> {error}
    </div>
    )}

    <div style={{ marginBottom: 16 }}>
    <h3>Create profile</h3>
    <form onSubmit={handleCreateProfile}>
        <div>
            <label>Username: </label>
    <input
    value={createUsername}
    onChange={(e) => setCreateUsername(e.target.value)}
    required
    />
    </div>
    <div>
    <label>Name: </label>
    <input value={createName} onChange={(e) => setCreateName(e.target.value)} />
    </div>
    <div>
    <label>Description: </label>
    <input value={createDesc} onChange={(e) => setCreateDesc(e.target.value)} />
    </div>
    <div>
    <button type="submit">Create</button>
        <button type="button" onClick={() => { setCreateUsername(""); setCreateName(""); setCreateDesc(""); }}>
    Clear
    </button>
    </div>
    </form>
    </div>

    <div style={{ marginBottom: 16 }}>
    <h3>Search profiles</h3>
    <form onSubmit={handleSearch}>
    <input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="username" />
    <button type="submit">Search</button>
        <button
    type="button"
    onClick={() => {
        setSearchTerm("");
        setSearchResults(null);
    }}
>
    Clear
    </button>
    </form>
    {searchResults && (
        <div>
            <h4>Search results</h4>
        {searchResults.length === 0 && <div>No matches</div>}
        <ul>
        {searchResults.map((p) => (
                <li key={p.id}>{p.username} — {p.name} — {p.description}</li>
        ))}
            </ul>
            </div>
        )}
        </div>

        <div style={{ marginBottom: 16 }}>
        <h3>All profiles</h3>
        {loading ? (
            <div>Loading...</div>
        ) : (
            <table border={1} cellPadding={6}>
            <thead>
                <tr>
                    <th>Id</th>
            <th>Username</th>
            <th>Name</th>
            <th>Description</th>
            <th>Picture</th>
            <th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {profiles.map((p) => (
                    <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.username}</td>
                    <td>
                    {editingNameFor === p.id ? (
                        <>
                            <input value={tempName} onChange={(e) => setTempName(e.target.value)} />
        <button onClick={() => { handleUpdateName(p.id, tempName); setEditingNameFor(null); }}>Save</button>
        <button onClick={() => setEditingNameFor(null)}>Cancel</button>
        </>
        ) : (
            <>
                {p.name}
            <button onClick={() => startEditName(p)}>Edit</button>
        </>
        )}
            </td>
            <td>
            {editingDescFor === p.id ? (
                <>
                    <input value={tempDesc} onChange={(e) => setTempDesc(e.target.value)} />
        <button onClick={() => { handleUpdateDescription(p.id, tempDesc); setEditingDescFor(null); }}>Save</button>
        <button onClick={() => setEditingDescFor(null)}>Cancel</button>
        </>
        ) : (
            <>
                {p.description}
            <button onClick={() => startEditDesc(p)}>Edit</button>
        </>
        )}
            </td>
            <td>
            {/* If your API returns a picture URL as part of Profile, show it here. We assume profile may have `pictureUrl` or similar. */}
            {p.pictureUrl ? (
                <div>
                    <img src={p.pictureUrl} alt="pf" style={{ maxWidth: 80, maxHeight: 80 }} />
            </div>
            ) : (
                <div>No picture</div>
            )}
            <div>
                <input
                    type="file"
            accept="image/*"
            onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleUploadPicture(p.id, file);
        }}
            />
            </div>
            </td>
            <td>
            <button onClick={() => handleDeleteProfile(p.id)}>Delete</button>
        </td>
        </tr>
        ))}
            </tbody>
            </table>
        )}
        </div>

        <div>
        <button onClick={fetchAllProfiles}>Refresh</button>
            </div>
            </div>
    );
    }
