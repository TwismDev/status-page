import React, { useState } from 'react';
import './App.css';
import PoolstatLogo from './PoolstatLogo';
import AutoCompleteInput from './AutoCompleteInput';

function App() {
	// Manage the visibility of the subscription form
	const [showForm, setShowForm] = useState(false);

	// Form data state
	const [formData, setFormData] = useState({
		name: '',
		organization: '',
		email: '',
		phone: '',
	});

	// Example: overall system status (you could determine this dynamically)
	// “operational”, “partial”, or “outage” could drive different banner colors
	const overallStatus = 'operational';

	// Grouped status data, to mimic something like vpsblocks with multiple sections
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

	// Sample issues log (only displayed if at least one exists)
	const issues = [
		{ date: '2025-01-20', description: 'Issue with connection' },
		{ date: '2025-01-15', description: 'Hosting service outage' },
	];

	// Handle form field changes
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	// Handle form submission
	const handleSubmit = (e) => {
		e.preventDefault();
		// Here you would typically send the formData to your server/API
		console.log('Form submitted:', formData);

		// Reset the form (optional) and hide it
		setFormData({
			name: '',
			organization: '',
			email: '',
			phone: '',
		});
		setShowForm(false);
	};

	// Decide banner styling based on overallStatus
	let bannerClass = 'top-banner ';
	if (overallStatus === 'operational') {
		bannerClass += 'banner-operational';
	} else if (overallStatus === 'partial') {
		bannerClass += 'banner-partial';
	} else {
		bannerClass += 'banner-outage';
	}

	// Decide banner text
	const bannerText =
		overallStatus === 'operational'
			? 'All Systems Operational'
			: overallStatus === 'partial'
			? 'Partial Outage or Maintenance'
			: 'Major Outage';

	return (
		<div className='container'>
			{/* Top Banner - e.g. “All Systems Operational” */}
			<div className={bannerClass}>{bannerText}</div>

			{/* Header */}
			<header className='header'>
				{/* SVG placed inline */}
				<div className='header-logo'>
					<PoolstatLogo />
				</div>

				{/* Page title */}
				<h1>Status Page</h1>
			</header>

			{/* Display grouped services */}
			{serviceGroups.map((group, idx) => (
				<div key={idx}>
					<h2 className='service-group-title'>{group.groupName}</h2>
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
						<h2>Subscribe to Updates</h2>
						<form onSubmit={handleSubmit}>
							<div className='form-group'>
								<label htmlFor='name'>Name*</label>
								<input
									type='text'
									id='name'
									name='name'
									value={formData.name}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div className='form-group'>
								<label htmlFor='organization'>Organization*</label>
								<AutoCompleteInput />
							</div>
							<div className='form-group'>
								<label htmlFor='email'>Email*</label>
								<input
									type='email'
									id='email'
									name='email'
									value={formData.email}
									onChange={handleInputChange}
									required
								/>
							</div>
							<div className='form-group'>
								<label htmlFor='phone'>Phone (optional)</label>
								<input
									type='text'
									id='phone'
									name='phone'
									value={formData.phone}
									onChange={handleInputChange}
								/>
							</div>
							<div className='form-actions'>
								<button
									type='submit'
									className='submit-btn'
								>
									Submit
								</button>
								<button
									type='button'
									className='cancel-btn'
									onClick={() => setShowForm(false)}
								>
									Cancel
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Display issues log only if there are previous issues */}
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
