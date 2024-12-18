import React, { useState } from 'react';
import './SellerRegistrationForm.css';
import { useNavigate } from 'react-router-dom';
const Backend = 'http://localhost:3000'

const SellerRegistrationForm = () => {
const navigate = useNavigate()
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    address: '',
    nationalId: '',
    idNumber: '',
    bankName: '',
    bankAccountNumber: ''
  });
  const [agreedToPolicies, setAgreedToPolicies] = useState(false);

  const businessTypes = ['Individual', 'Partnership', 'Corporation'];
  const nationalIdTypes = ['Ghana Card','Driver\'s License', 'Passport', 'Voter\'s ID'];
  const bankNames = ['Bank of America', 'Wells Fargo', 'Chase', 'HSBC', 'Standard Chartered'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCheckChange = (e) => {
    setAgreedToPolicies(e.target.checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!agreedToPolicies) {
        alert('You must agree to the terms and policies to proceed.');
        return;
      }
    try{
    const response = await fetch(`${Backend}/api/marketplace/sell`,{
        method : 'POST',
        headers:{
         'content-type':'application/json'
        },
        body: JSON.stringify(formData),
        credentials: 'include'
    })
    if(response.ok){
        navigate('/seller/login')
        console.log(formData);

    }}catch(err){
        console.log(err)
    }


    
  };

  return (
    <div className="registration-container">
      <h1 className="registration-title">Seller Registration</h1>
      <form className="registration-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Business Name</label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            required
            placeholder="Enter your business name"
          />
        </div>

        <div className="form-group">
          <label>Business Type</label>
          <select name="businessType" value={formData.businessType} onChange={handleChange} required>
            <option value="">Select Business Type</option>
            {businessTypes.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Enter your business address"
          />
        </div>

        <div className="form-group">
          <label>National ID Type</label>
          <select name="nationalId" value={formData.nationalId} onChange={handleChange} required>
            <option value="">Select National ID</option>
            {nationalIdTypes.map((idType) => (
              <option key={idType} value={idType}>{idType}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>ID Number</label>
          <input
            type="text"
            name="idNumber"
            value={formData.idNumber}
            onChange={handleChange}
            required
            placeholder="Enter your ID Number"
          />
        </div>

        <div className="form-group">
          <label>Bank Name</label>
          <select name="bankName" value={formData.bankName} onChange={handleChange} required>
            <option value="">Select Bank Name</option>
            {bankNames.map((bank) => (
              <option key={bank} value={bank}>{bank}</option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Bank Account Number</label>
          <input
            type="text"
            name="bankAccountNumber"
            value={formData.bankAccountNumber}
            onChange={handleChange}
            required
            placeholder="Enter your bank account number"
          />
        </div>

        <div className="form-group checkbox-group">
          <input
            type="checkbox"
            id="agree"
            name="agree"
            checked={agreedToPolicies}
            onChange={handleCheckChange}
            required
          />
          <label htmlFor="agree">
            I agree to the <a href="/terms">Terms and Conditions</a> and <a href="/policies">Privacy Policies</a>.
          </label>
        </div>

        <button type="submit" className="submit-btn">Register</button>
      </form>
    </div>
  );
};

export default SellerRegistrationForm;
