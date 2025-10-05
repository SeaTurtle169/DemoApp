import { useState } from 'react';

function useSubmitForm(apiFunction) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  const submitForm = async (formData) => {
    setIsSubmitting(true);
    setError(null);
    setResponse(null);

    try {
      const result = await apiFunction(formData); // Gọi API với dữ liệu form
      setResponse(result);
    } catch (err) {
      setError(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submitForm, isSubmitting, error, response };
}

export default useSubmitForm;
