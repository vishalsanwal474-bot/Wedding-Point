import { useEffect, useId, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../context/AuthContext';
import usePageTitle from '../hooks/usePageTitle';
import './PageShell.css';
import './LoginPage.css';

function LoginPage() {
  usePageTitle('Admin Login');
  const formId = useId();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, bootstrapping } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from || '/admin/dashboard';

  useEffect(() => {
    setSubmitError(null);
  }, [email, password]);

  if (!bootstrapping && isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  const validate = () => {
    const next = {};
    if (!email.trim()) {
      next.email = 'Email is required.';
    } else if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      next.email = 'Enter a valid email address.';
    }
    if (!password) {
      next.password = 'Password is required.';
    } else if (password.length < 8) {
      next.password = 'Password must be at least 8 characters.';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitError(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    try {
      await login({ email: email.trim(), password });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setSubmitError(error.message || 'Unable to sign in. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page-shell login-page">
      <section className="section-block">
        <div className="container login-page__wrap">
          <div className="login-card">
            <p className="login-card__eyebrow">Wedding Point</p>
            <h1>Admin Login</h1>
            <p className="login-card__intro">
              Sign in to manage inquiries, services, packages, gallery, and
              business settings.
            </p>

            {submitError ? <ErrorMessage message={submitError} /> : null}

            <form className="login-form" onSubmit={handleSubmit} noValidate>
              <div className="login-field">
                <label htmlFor={`${formId}-email`}>Email</label>
                <input
                  id={`${formId}-email`}
                  type="email"
                  name="email"
                  autoComplete="username"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={
                    errors.email ? `${formId}-email-error` : undefined
                  }
                />
                {errors.email ? (
                  <p id={`${formId}-email-error`} className="login-field__error">
                    {errors.email}
                  </p>
                ) : null}
              </div>

              <div className="login-field">
                <label htmlFor={`${formId}-password`}>Password</label>
                <input
                  id={`${formId}-password`}
                  type="password"
                  name="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={
                    errors.password ? `${formId}-password-error` : undefined
                  }
                />
                {errors.password ? (
                  <p
                    id={`${formId}-password-error`}
                    className="login-field__error"
                  >
                    {errors.password}
                  </p>
                ) : null}
              </div>

              <Button type="submit" variant="primary" disabled={submitting}>
                {submitting ? 'Signing in…' : 'Sign In'}
              </Button>
            </form>

            <p className="login-card__footer">
              <Link to="/">Return to website</Link>
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LoginPage;
