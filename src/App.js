import React, { useState, useEffect } from 'react';
import './App.css';
import PoolstatLogo from './PoolstatLogo';
import AutoCompleteInput from './AutoCompleteInput';
import { OTPInputField } from 'react-otp-input-type';
import { createClient } from '@supabase/supabase-js';
import { Auth } from '@supabase/auth-ui-react';

const supabase = createClient(
	process.env.REACT_APP_SUPABASE_URL,
	process.env.REACT_APP_SUPABASE_ANON_KEY
  );
  

function App() {
	const [showForm, setShowForm] = useState(false);
	const [isEmailValid, setIsEmailValid] = useState(false);
	const [isVerifyClicked, setIsVerifyClicked] = useState(false);
	const [isOTPVisible, setIsOTPVisible] = useState(false);
	const [isOTPVerified, setIsOTPVerified] = useState(false); // Track OTP verification status
	const [otp, setOtp] = useState('');

	const [formData, setFormData] = useState({
		firstName: '',
		lastName: '',
		organization: '',
		email: '',
	});

	// Example “overall status”
	const overallStatus = 'operational';
	let bannerClass = 'top-banner ';
	let bannerText = '';

	if (overallStatus === 'operational') {
		bannerClass += 'banner-operational';
		bannerText = 'All Systems Operational';
	} else if (overallStatus === 'partial') {
		bannerClass += 'banner-partial';
		bannerText = 'Partial Outage or Maintenance';
	} else {
		bannerClass += 'banner-outage';
		bannerText = 'Major Outage';
	}

	// Grouped status data
	const serviceGroups = [
		{
			groupName: 'Services',
			services: [{ name: 'Poolstat Website', status: 'online' }],
		},
		{
			services: [{ name: 'Hosting Service / Provider', status: 'online' }],
		},
		{
			services: [{ name: 'Connection / ISP', status: 'online' }],
		},
	];

	// Sample issues
	const issues = [
		{ date: '2025-01-20', description: 'Issue with connection' },
		{ date: '2025-01-15', description: 'Hosting service outage' },
	];

	useEffect(() => {}, [otp]);

	const handleVerifyClick = () => {
		setIsVerifyClicked(true);
		verifyEmail(formData.email);
		setIsOTPVisible(true);
	};

	async function verifyEmail(email) {
		const { data, error } = await supabase.auth.signInWithOtp(
			{ email },
			{
				data: {
					firstName: formData.firstName,
					lastName: formData.lastName,
					orgId: formData.orgId,
				},
				shouldCreateUser: true, // Only if you want user creation on the fly
			}
		);

		if (error) {
			console.error(error);
		} else {
			console.log(data);
		}
	}

	const handleVerifyOTP = async () => {
		if (otp.length === 6) {
			const {
				data: { session },
				error,
			} = await supabase.auth.verifyOtp({
				email: formData.email,
				token: otp,
				type: 'email',
			});
			setIsOTPVerified(true); // Mark OTP as verified
		} else {
			alert('Please enter a valid 6-digit OTP.');
		}
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));

		if (name === 'email') {
			const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
			setIsEmailValid(emailRegex.test(value));
		}
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!isOTPVerified) return;
		console.log('Form submitted:', formData);
		setFormData({
			firstName: '',
			lastName: '',
			organization: '',
			email: '',
		});
		setShowForm(false);
		setIsVerifyClicked(false);
		setIsOTPVisible(false);
		setIsOTPVerified(false);
	};

	return (
		<div className='container'>
			{/* Banner */}
			<div className={bannerClass}>{bannerText}</div>

			{/* Header */}
			<header className='header'>
				<div className='header-logo'>
					<PoolstatLogo />
				</div>
				<h1>Status Page</h1>
			</header>

			{/* Display grouped services */}
			{serviceGroups.map((group, idx) => (
				<div key={idx}>
					{group.groupName && (
						<h2 className='service-group-title'>{group.groupName}</h2>
					)}
					<div className='status-list'>
						{group.services.map((service, sIdx) => (
							<div
								key={sIdx}
								className='status-list-item'
							>
								<span className='service-name'>{service.name}</span>
								<span className={`status ${service.status}`}>
									{service.status.charAt(0).toUpperCase() +
										service.status.slice(1)}
								</span>
							</div>
						))}
					</div>
				</div>
			))}

			{/* Subscribe button */}
			<button
				className='subscribe-btn'
				onClick={() => setShowForm(true)}
			>
				Subscribe to Updates
			</button>

			{/* Subscription form modal */}
			{showForm && (
				<div className='modal-overlay'>
					<div className='modal-content'>
						<button
							className='close-btn'
							aria-label='Close'
							onClick={() => setShowForm(false)}
						>
							&times;
						</button>
						<h2>Subscribe to Updates</h2>
						<form onSubmit={handleSubmit}>
							{/* First Name */}
							<div className='form-group'>
								<label htmlFor='firstName'>First Name*</label>
								<input
									type='text'
									id='firstName'
									name='firstName'
									value={formData.firstName}
									onChange={handleInputChange}
									required
								/>
							</div>

							{/* Last Name */}
							<div className='form-group'>
								<label htmlFor='lastName'>Last Name*</label>
								<input
									type='text'
									id='lastName'
									name='lastName'
									value={formData.lastName}
									onChange={handleInputChange}
									required
								/>
							</div>

							{/* Organization */}
							<div className='form-group'>
								<label htmlFor='organization'>Organization*</label>
								<AutoCompleteInput />
							</div>

							{/* Email + Verify */}
							<div className='form-group'>
								<label htmlFor='email'>Email*</label>
								<input
									type='email'
									id='email'
									name='email'
									value={formData.email}
									onChange={handleInputChange}
									required
									style={{ marginBottom: '15px' }}
								/>
								{!isVerifyClicked && (
									<button
										type='button'
										className='button-29'
										onClick={handleVerifyClick}
										disabled={!isEmailValid}
									>
										Send OTP
									</button>
								)}
							</div>

							{/* OTP Input */}
							{isOTPVisible && (
								<div className='otp-verify'>
									<OTPInputField
										isOnlyNumberAllowed
										numOfInputs={6}
										handleChange={setOtp}
										inputClassName='otp-box'
										containerClassName='otp-container'
									/>
									<p className='otp-value'>
										Didn't receive the code?{' '}
										<span className='link'>Resend</span>
									</p>
									<button
										className='button-29'
										onClick={handleVerifyOTP}
									>
										Verify
									</button>
								</div>
							)}

							{/* Form Actions */}
							<div className='form-actions'>
								<button
									type='submit'
									className='submit-btn'
									disabled={!isOTPVerified} // Disable until OTP is verified
								>
									Submit
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Display issues log */}
			{issues.length > 0 && (
				<section className='issues-log'>
					<h2>Previous Issues</h2>
					<ul>
						{issues.map((issue, index) => (
							<li key={index}>
								<span className='issue-date'>{issue.date}</span>
								<span className='issue-desc'>{issue.description}</span>
							</li>
						))}
					</ul>
				</section>
			)}
		</div>
	);
}

export default App;
