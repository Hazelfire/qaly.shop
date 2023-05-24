import { useState, ChangeEvent, FormEvent } from 'react';
import { Form, FormInput, FormTextarea, FormButton, FormFileUploadButton } from 'components/Form'
import Layout from "./_layout"

const AddCharityPage: React.FC = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [homepageLink, setHomepageLink] = useState('');
  const [donateUrl, setDonateUrl] = useState('');
  const [stripeId, setStripeId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/charities', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          logoUrl,
          homepageLink,
          donateUrl,
          stripeId,
        }),
      });

      if (response.ok) {
        setSuccess(true);
        setName('');
        setDescription('');
        setLogoUrl('');
        setHomepageLink('');
        setDonateUrl('');
        setStripeId('');
      } else {
        setError('Failed to submit the charity. Please try again.');
      }
    } catch (error) {
      setError('An error occurred while submitting the charity. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'name':
        setName(value);
        break;
      case 'description':
        setDescription(value);
        break;
      case 'logoUrl':
        setLogoUrl(value);
        break;
      case 'homepageLink':
        setHomepageLink(value);
        break;
      case 'donateUrl':
        setDonateUrl(value);
        break;
      case 'stripeId':
        setStripeId(value);
        break;
      default:
        break;
    }
  };

  const handleLogoFileSelect = async (file: File) => {
    const response = await fetch('/api/uploadimage', {
      method: 'POST',
      body: JSON.stringify({ filename: file.name }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const { url } = await response.json();

    const uploadResponse = await fetch(url, {
      method: 'PUT',
      body: file,
      headers: {
        'Content-Type': file.type,
      },
    });

    if (uploadResponse.ok) {
      console.log('Uploaded successfully!');
    } else {
      console.log('Upload failed.');
    }
  }
  return (
    <Layout>
      <Form
        title="Add Charity"
        error={error}
        success={success}
        handleSubmit={handleSubmit}
        submitting={submitting}
        successMessage="Charity submitted successfully!"
      >
        <FormInput
          label="Name"
          value={name}
          placeholder='Name'
          onChange={(e) => setName(e.target.value)}
          required
        />

        <FormTextarea
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <FormFileUploadButton
          onFileSelect={handleLogoFileSelect}
          accept="image/*"
          buttonText="Upload Logo"
        />

        <FormInput
          placeholder='Homepage Link'
          label="Homepage Link"
          value={homepageLink}
          onChange={(e) => setHomepageLink(e.target.value)}
          required
        />

        <FormInput
          placeholder='Donate URL'
          label="Donate URL"
          value={donateUrl}
          onChange={(e) => setDonateUrl(e.target.value)}
          required
        />
        </Form>
    </Layout>
  );
};

export default AddCharityPage;