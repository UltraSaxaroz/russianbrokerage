// app/reset-password/page.tsx
'use client'; // Add this line to make it a client component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const ResetPassword = () => {
    const router = useRouter();
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [token, setToken] = useState<string | null>(null); // State to store the token

    // Use useEffect to get the token from URL
    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = searchParams.get('token');
        setToken(tokenFromUrl); // Set the token state
    }, []); // Empty dependency array to run only once

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) {
            setMessage('Token is missing');
            return;
        }

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, newPassword }),
            });
            const data = await response.json();
            if (response.ok) {
                setMessage(data.message);
                // Optionally redirect to login page or homepage
                router.push('/login'); // Redirect after successful password reset
            } else {
                setMessage(data.message);
            }
        } catch (error) {
            setMessage('Error resetting password');
        }
    };

    return (
        <div>
            <h1>Reset Password</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                />
                <button type="submit">Reset Password</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
