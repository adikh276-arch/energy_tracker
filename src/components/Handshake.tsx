import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface HandshakeProps {
    onSuccess: () => void;
}

const Handshake: React.FC<HandshakeProps> = ({ onSuccess }) => {
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const handleHandshake = async () => {
            // Step 1: Extract Token from query parameter ?token=UUID
            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");

            const existingUserId = sessionStorage.getItem("user_id");

            if (existingUserId) {
                // Success case if user_id is already in session
                onSuccess();
                return;
            }

            if (!token) {
                // Step 4: Token missing - Redirect
                console.warn("Handshake failed: token missing");
                window.location.href = "/token";
                return;
            }

            try {
                // Step 2: Validate Token against MantraCare API
                const response = await axios.post("https://api.mantracare.com/user/user-info", { token });

                if (response.status === 200 && response.data.user_id) {
                    // Step 3: Success handling
                    const { user_id } = response.data;
                    sessionStorage.setItem("user_id", user_id.toString());

                    // Step 3: Remove token from URL
                    const url = new URL(window.location.href);
                    url.searchParams.delete("token");
                    window.history.replaceState({}, "", url.toString());

                    onSuccess();
                } else {
                    // Token invalid according to API
                    console.error("Handshake failed: invalid token response");
                    window.location.href = "/token";
                }
            } catch (err) {
                console.error("Authentication handshake failed:", err);
                setError("Auth validation failed. Redirecting...");
                setTimeout(() => {
                    window.location.href = "/token";
                }, 1500);
            }
        };

        handleHandshake();
    }, [onSuccess]);

    // Phase 8: Full screen loader to block UI during handshake
    return (
        <div className="flex h-[100dvh] w-screen items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-6">
                <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-glow-primary"></div>
                <p className="text-sm font-semibold text-foreground/70 tracking-widest animate-pulse">
                    SECURE AUTHENTICATION...
                </p>
                {error && <p className="text-destructive text-xs">{error}</p>}
            </div>
        </div>
    );
};

export default Handshake;
