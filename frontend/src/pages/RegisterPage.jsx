import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMutation } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Header } from '../components/Header';
import Navbar from '../components/Navbar';
import LoadingScreen from '../components/LoadingScreen';
import authServices from '../services/authService';
import { setUser } from '../features/auth/authSlice';

export default function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const { mutate, data, isError, error, isPending, isSuccess } = useMutation({
    mutationFn: (formData) => authServices.registerUserFetch(formData),
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    qualification: '',
    location: '',
  });
  const [profileImage, setProfileImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const { name, email, phone, password, qualification, location } = formData;

  const handleChange = (e) => {
    const { name: field, value } = e.target;
    // Phone: digits only, max 10 (backend requires exactly 10)
    if (field === 'phone' && !/^\d*$/.test(value)) return;
    setFormData((prev) => ({
      ...prev,
      [field]: field === 'phone' ? value.slice(0, 10) : value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setProfileImage(file || null);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim() || !password || !qualification.trim() || !location.trim()) {
      toast.error('Please fill all details');
      return;
    }
    if (phone.length !== 10) {
      toast.error('Please enter a valid 10-digit phone number');
      return;
    }
    if (!profileImage) {
      toast.error('Please upload a profile photo');
      return;
    }
    if (!termsAccepted) {
      toast.error('Please accept the Terms of Service');
      return;
    }
    const payload = new FormData();
    payload.append('name', name.trim());
    payload.append('email', email.trim());
    payload.append('phone', phone.trim());
    payload.append('password', password);
    payload.append('qualification', qualification.trim());
    payload.append('location', location.trim());
    payload.append('profile_image', profileImage);
    mutate(payload);
  };

  // useEffect(() => {
  //   if (isSuccess && data) {
  //     dispatch(setUser(data));
  //     toast.success('Account created successfully');
  //   }
  //   if (user?.userType) {
  //     if (user.userType === 'ADMIN') navigate('/auth/admin', { replace: true });
  //     else if (user.userType === 'COUNSELOR') navigate('/auth/counselor', { replace: true });
  //     else navigate('/auth/profile', { replace: true });
  //   }
  //   if (isError && error) {
  //     toast.error(error?.response?.data?.message || error?.message || 'Registration failed');
  //   }
  // }, [isSuccess, data, user?.userType, isError, error]);
  // 1. Success
  useEffect(() => {
    if (isSuccess && data) {
      dispatch(setUser(data));
      toast.success("Account created successfully");
    }
  }, [isSuccess, data, dispatch]);


  // 2. Navigation
  useEffect(() => {
    if (!user?.userType) return;

    if (user.userType === "ADMIN") {
      navigate("/auth/admin");
    } else if (user.userType === "COUNSELOR") {
      navigate("/auth/counselor");
    } else {
      navigate("/auth/profile");
    }
  }, [user?.userType, navigate]);


  // 3. Errors
  useEffect(() => {
    if (isError && error) {
      toast.error(
        error?.response?.data?.message || "Registration failed"
      );
    }
  }, [isError, error]);


  if (isPending) {
    return <LoadingScreen loadingMessage="Creating your account..." />;
  }

  return (
    <div className="min-h-screen bg-parchment flex flex-col overflow-x-hidden">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 bg-grid-pattern">
        <div className="w-full max-w-lg bg-parchment-card border-4 border-navy rounded-3xl p-4 sm:p-6 lg:p-8 shadow-pop-lg relative">
          <div className="absolute -top-3 -right-3 bg-yellow text-navy font-mono text-[10px] font-bold uppercase tracking-widest px-3 py-1 border-2 border-navy -rotate-3 shadow-pop-sm">
            Get 5 Free Credits
          </div>

          <div className="text-center mb-8">
            <div className="inline-block bg-rust-container border-3 border-navy px-4 py-1 rounded-full shadow-pop-sm font-mono text-xs font-bold text-navy mb-3">
              START YOUR JOURNEY 🚀
            </div>
            <h1 className="font-grotesk font-extrabold text-2xl sm:text-3xl text-navy tracking-tight">
              Join <span className="text-rust">CareerBridge</span> India
            </h1>
            <p className="font-body text-xs text-navy-muted mt-2">
              Build AI career roadmaps, discover Indian tech & Govt jobs, and connect with top counselors.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-grotesk font-bold text-xs uppercase tracking-wider text-navy mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={name}
                onChange={handleChange}
                placeholder="e.g. Priya Patel"
                className="w-full bg-parchment border-3 border-navy rounded-xl px-4 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-grotesk font-bold text-xs uppercase tracking-wider text-navy mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={email}
                onChange={handleChange}
                placeholder="priya@example.com"
                className="w-full bg-parchment border-3 border-navy rounded-xl px-4 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-grotesk font-bold text-xs uppercase tracking-wider text-navy mb-1.5">
                  Phone (10-digit) *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={phone}
                  onChange={handleChange}
                  maxLength={10}
                  placeholder="e.g. 9876543210"
                  className="w-full bg-parchment border-3 border-navy rounded-xl px-4 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-grotesk font-bold text-xs uppercase tracking-wider text-navy mb-1.5">
                  Location *
                </label>
                <input
                  type="text"
                  name="location"
                  value={location}
                  onChange={handleChange}
                  placeholder="e.g. Mumbai, Maharashtra"
                  className="w-full bg-parchment border-3 border-navy rounded-xl px-4 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-grotesk font-bold text-xs uppercase tracking-wider text-navy mb-1.5">
                Qualification *
              </label>
              <input
                type="text"
                name="qualification"
                value={qualification}
                onChange={handleChange}
                placeholder="e.g. B.Tech CSE, 12th with PCM"
                className="w-full bg-parchment border-3 border-navy rounded-xl px-4 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
              />
            </div>

            <div>
              <label className="block font-grotesk font-bold text-xs uppercase tracking-wider text-navy mb-1.5">
                Profile Photo *
              </label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                <div className="w-14 h-14 rounded-2xl bg-parchment border-3 border-navy overflow-hidden flex items-center justify-center font-grotesk font-extrabold text-navy shrink-0">
                  {preview ? (
                    <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-xl">?</span>
                  )}
                </div>
                <input
                  type="file"
                  name="profile_image"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full bg-parchment border-3 border-navy rounded-xl px-4 py-2.5 font-body text-xs text-navy shadow-pop-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-2 file:border-navy file:bg-yellow file:font-bold file:text-navy"
                />
              </div>
            </div>

            <div>
              <label className="block font-grotesk font-bold text-xs uppercase tracking-wider text-navy mb-1.5">
                Create Password *
              </label>
              <input
                type="password"
                name="password"
                value={password}
                onChange={handleChange}
                placeholder="Minimum 8 characters"
                className="w-full bg-parchment border-3 border-navy rounded-xl px-4 py-2.5 font-body text-sm text-navy shadow-pop-sm focus:outline-none"
              />
            </div>

            <div className="flex items-start space-x-3 pt-2">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                id="terms"
                className="w-5 h-5 bg-parchment border-2 border-navy rounded text-yellow focus:ring-0 mt-0.5"
              />
              <label htmlFor="terms" className="font-body text-xs text-navy">
                I agree to the <a href="#" className="font-bold underline text-rust">Terms of Service</a> and{' '}
                <a href="#" className="font-bold underline text-rust">Privacy Policy</a> of CareerBridge India.
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-yellow hover:bg-yellow-fixed text-navy font-grotesk font-extrabold text-base py-3.5 rounded-2xl border-3 border-navy shadow-pop transition-all active:translate-x-1 active:translate-y-1 active:shadow-none mt-4"
            >
              CREATE FREE ACCOUNT & CLAIM CREDITS →
            </button>
          </form>

          <div className="mt-6 text-center pt-4 border-t-2 border-navy/20">
            <p className="font-body text-xs text-navy">
              Already have an account?{' '}
              <Link to="/login" className="font-grotesk font-extrabold text-rust hover:underline">
                Sign In Instead
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
