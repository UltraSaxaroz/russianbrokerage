'use client'
// app/reset-password/page.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';

const ResetPassword = () => {
    const router = useRouter();
    const { token } = router.query; // Get the token from the query
    const [newPassword, setNewPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!token) return; // Check if token is available

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
