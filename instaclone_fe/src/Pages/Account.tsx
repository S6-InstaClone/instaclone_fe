import ProfileService from "../api/ProfileService.ts";
import {useEffect, useState} from "react";

function AccountPage(){

    const [profile, setProfile] = useState(null);
    const profileService = useEffect();

    useEffect(() => {
        const loadProfile = async () => {
            const data = await profileService.getProfile(); // assuming it returns a Promise
            setProfile(data);
        };
        loadProfile();
    }, [profileService]);
    return (
        <div>
            <h1>Account Page</h1>
            {profile ? (
                <pre>{JSON.stringify(profile, null, 2)}</pre>
            ) : (
                <p>Loading profile...</p>
            )}
        </div>
    );
}

export default AccountPage;