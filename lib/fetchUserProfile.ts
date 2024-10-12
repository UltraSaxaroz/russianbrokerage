// lib/fetchUserProfile.ts
const fetchUserProfile = async (email: string) => {
    const response = await fetch('/api/user', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            email, // Pass the email in the headers
        },
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch user profile');
    }

    return response.json();
};

export default fetchUserProfile;
