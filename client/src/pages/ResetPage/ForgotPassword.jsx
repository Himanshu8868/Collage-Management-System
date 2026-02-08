import React, { useState } from "react";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/auth/forgot-password`,
        { email }
      );
      setMessage(res.data.message);
      setEmail("");
    } catch (err) {
      setError(
        err.response?.data?.message || 
        "Failed to send reset link. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="card-header">
          <h2>Reset Your Password</h2>
          <p className="subtitle">
            Enter your email and we'll send you a link to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Sending...
              </>
            ) : (
              "Send Reset Link"
            )}
          </button>
        </form>

        {message && (
          <div className="message success">
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <p>{message}</p>
          </div>
        )}

        {error && (
          <div className="message error">
            <svg className="icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M11 15h2v2h-2zm0-8h2v6h-2zm.99-5C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"/>
            </svg>
            <p>{error}</p>
          </div>
        )}

        <div className="back-link">
          <a href="/login">Back to Login</a>
        </div>
      </div>

      <style jsx>{`
        .forgot-password-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
          padding: 20px;
        }

        .forgot-password-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
          padding: 2.5rem;
          width: 100%;
          max-width: 420px;
          text-align: center;
        }

        .card-header {
          margin-bottom: 2rem;
        }

        .card-header h2 {
          color: #2d3748;
          margin-bottom: 0.5rem;
          font-size: 1.8rem;
        }

        .subtitle {
          color: #718096;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .input-group {
          margin-bottom: 1.5rem;
          text-align: left;
        }

        .input-group label {
          display: block;
          margin-bottom: 0.5rem;
          color: #4a5568;
          font-weight: 500;
          font-size: 0.95rem;
        }

        .input-group input {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          transition: all 0.2s;
          background: #f8fafc;
        }

        .input-group input:focus {
          outline: none;
          border-color: #4299e1;
          box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.1);
          background: white;
        }

        .input-group input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .submit-btn {
          width: 100%;
          padding: 14px;
          background: #4299e1;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          background: #3182ce;
          transform: translateY(-1px);
        }

        .submit-btn:active:not(:disabled) {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .message {
          margin-top: 1.5rem;
          padding: 1rem;
          border-radius: 8px;
          display: flex;
          align-items: flex-start;
          gap: 12px;
          text-align: left;
        }

        .message.success {
          background: #f0fff4;
          border: 1px solid #9ae6b4;
          color: #276749;
        }

        .message.error {
          background: #fff5f5;
          border: 1px solid #fc8181;
          color: #c53030;
        }

        .message .icon {
          width: 20px;
          height: 20px;
          flex-shrink: 0;
          margin-top: 2px;
        }

        .message p {
          margin: 0;
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .back-link {
          margin-top: 2rem;
          padding-top: 1.5rem;
          border-top: 1px solid #e2e8f0;
        }

        .back-link a {
          color: #4299e1;
          text-decoration: none;
          font-size: 0.95rem;
          transition: color 0.2s;
        }

        .back-link a:hover {
          color: #3182ce;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
};

export default ForgotPassword;