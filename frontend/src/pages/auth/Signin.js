import React, { useState } from "react";
import { api } from "../../const";
import toast from "react-hot-toast";
import { Step1 } from "../../components/formSteps/Step1";
import Step2 from "../../components/formSteps/Step2";
import Step3 from "../../components/formSteps/Step3";
import Step4 from "../../components/formSteps/Step4";
import Step5 from "../../components/formSteps/Step5";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    usernameOrEmail: "",
    phoneNumber: "",
    password: "",
    companyName: "",
    companySize: "",
    companyAddress: "",
    gstNumber: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleRegistration = async () => {
    // Prevent multiple submissions
    if (loading || registrationComplete) return;

    const data = {
      username: formData.usernameOrEmail,
      email: formData.usernameOrEmail,
      password: formData.password,
      phone: formData.phoneNumber,
    };

    try {
      setLoading(true);
      const response = await api.post('/api/register', data);
      localStorage.setItem('tenantId', response.data.tenantId);
      localStorage.setItem('userId', response.data.userId);

      if (response.status === 201) {
        setRegistrationComplete(true);
        toast.success('Registration successful');
        setStep(2);
      } else {
        toast.error(response.data?.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.message || 'An error occurred during registration.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const completeRegistration = async () => {
    const data = {
      companyName: formData.companyName,
      companySize: formData.companySize,
      companyAddress: formData.companyAddress,
      companyGST: formData.gstNumber,
      number: formData.phoneNumber
    }

    try {
      setLoading(true);
      const response = await api.put(
        '/api/updateTenant/' + localStorage.getItem('tenantId') + '/' + localStorage.getItem('userId')
        , data);
      console.log(response.data);
      
      if (response.status === 200) {
        setRegistrationComplete(true);
        toast.success('Registration successful');
        navigate('/login', { replace: true });
      } else {
        toast.error(response.data?.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error("Registration error:", error);
      const errorMessage = error.response?.data?.message || 'An error occurred during registration.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const nextStep = () => setStep(prevStep => prevStep + 1);
  const prevStep = () => setStep(prevStep => prevStep - 1);

  const renderStep = () => {
    const steps = {
      1: <Step1
        nextStep={nextStep}
        formData={formData}
        handleChange={handleChange}
        handleRegistration={handleRegistration}
        loading={loading}
      />,
      2: <Step2
        nextStep={nextStep}
        prevStep={prevStep}
        formData={formData}
        handleChange={handleChange}
      />,
      3: <Step3
        nextStep={nextStep}
        prevStep={prevStep}
        formData={formData}
        handleChange={handleChange}
      />,
      4: <Step4
        nextStep={nextStep}
        prevStep={prevStep}
        formData={formData}
        handleChange={handleChange}
      />,
      5: <Step5
        prevStep={prevStep}
        formData={formData}
        handleChange={handleChange}
        completeRegistration={completeRegistration}
      />
    };

    return steps[step] || null;
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full flex flex-col justify-center items-center bg-black bg-opacity-5">
      {renderStep()}
    </div>
  );
}

export default Signup;