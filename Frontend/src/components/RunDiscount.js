import React, { useState} from 'react';
import { useParams,useNavigate } from 'react-router-dom';
import './RunDiscount.css'

const DiscountForm = () => {
    const {productId,storeId} = useParams()
    const navigate = useNavigate()
    const Backend = 'http://localhost:3000';

  const [formValues, setFormValues] = useState({
  
    discountAmount: 0,
    discountPercentage: 0,
    discountDuration: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (e) => {
    setFormValues((prev) => ({ ...prev, discountDuration: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formValues);
    // Add API submission or logic to handle the form data
    try{
    const discountInfo = await fetch(`${Backend }/api/marketplace/rundiscount/${productId}`,{
        method:"PUT",
        headers:{
            'Content-type':'application/json'
        },

        body:JSON.stringify(formValues),
        credentials:'include'


    })
    if(discountInfo.ok){
        alert('Discount set successfully')
        navigate(`/seller/manageproducts/${storeId}`)
    }else {
        alert(`Failed to set discount: ${discountInfo.statusText}`);
    }
}catch(err){
        console.log(err)
        alert('An Error Occured')
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <h2>Run a Discount</h2>

        {/* Discount Amount */}
        <div className="form-group">
          <label htmlFor="discountAmount">Discount Amount ($):</label>
          <input
            type="number"
            id="discountAmount"
            name="discountAmount"
            value={formValues.discountAmount}
            onChange={handleInputChange}
            min="0"
          />
        </div>

        {/* Discount Percentage */}
        <div className="form-group">
          <label htmlFor="discountPercentage">Discount Percentage (%):</label>
          <input
            type="number"
            id="discountPercentage"
            name="discountPercentage"
            value={formValues.discountPercentage}
            onChange={handleInputChange}
            min="0"
            max="100"
          />
        </div>

        {/* Discount Duration */}
        <div className="form-group">
          <label htmlFor="discountDuration">Discount Duration (End Date):</label>
          <input
            type="date"
            id="discountDuration"
            name="discountDuration"
            value={formValues.discountDuration || ''}
            onChange={handleDateChange}
          />
        </div>

        {/* Submit Button */}
        <div className="form-group">
          <button type="submit">Apply Discount</button>
        </div>
      </form>
    </div>
  );
};

export default DiscountForm;
