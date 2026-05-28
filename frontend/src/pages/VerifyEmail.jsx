import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { verifyEmail, resendVerification } from "../api/auth";

export function VerifyEmail() {
    const [params] = useSearchParams();
    const token = params.get("token");
    const emailFromLink = params.get("email") || "";

    const [status, setStatus] = useState("verifying"); // verifying | success | error
    const [message, setMessage] = useState("");
    const [email, setEmail] = useState(emailFromLink);
    const [resending, setResending] = useState(false);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            if (!token) {
                if (!cancelled) {
                    setStatus("error");
                    setMessage("Missing verification token.");
                }
                return;
            }

            try {
                const res = await verifyEmail(token);
                if (!cancelled) {
                    setStatus("success");
                    setMessage(res.data?.message || "Email verified successfully.");
                }
            } catch (err) {
                if (!cancelled) {
                    setStatus("error");
                    setMessage(err.response?.data?.message || "Verification failed.");
                }
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [token]);

    const handleResend = async (e) => {
        e.preventDefault();
        setResending(true);
        try {
            const res = await resendVerification(email);
            setMessage(res.data?.message || "If the account exists, a verification email has been sent.");
        } catch (err) {
            setMessage(err.response?.data?.message || "Could not resend verification email.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="bg-white p-6 rounded-xl shadow-md w-full max-w-md">
                <h2 className="text-xl font-semibold mb-2">Verify your email</h2>

                {status === "verifying" && (
                    <p className="text-gray-600">Verifying…</p>
                )}

                {status !== "verifying" && (
                    <p className={status === "success" ? "text-green-700" : "text-red-700"}>
                        {message}
                    </p>
                )}

                {status === "success" && (
                    <div className="mt-4">
                        <Link className="text-blue-600 underline" to="/login">
                            Go to login
                        </Link>
                    </div>
                )}

                {status === "error" && (
                    <form onSubmit={handleResend} className="mt-4 space-y-2">
                        <input
                            type="email"
                            placeholder="Enter your email to resend"
                            className="border p-2 w-full rounded"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button
                            disabled={resending}
                            className="bg-blue-600 text-white px-4 py-2 w-full rounded disabled:opacity-50"
                        >
                            {resending ? "Sending…" : "Resend verification email"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

