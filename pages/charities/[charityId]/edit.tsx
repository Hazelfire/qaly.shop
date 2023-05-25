import React, { useState, ReactNode, FormEvent } from 'react';
import Layout from '../../_layout';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { PrismaClient } from '@prisma/client';
import { FormInput, FormTextarea, FormButton, Form } from 'components/Form'
import UploadImageButton from 'components/UploadImageButton'
import { useRouter } from 'next/router';



const prisma = new PrismaClient();

type EditCharityFormProps = {
    charityId: string;
    defaultData: {
        name: string;
        description: string;
        logoUrl: string;
        homepageLink: string;
        donateUrl: string;
    };
};

const EditCharityForm: React.FC<EditCharityFormProps> = ({
    defaultData,
    charityId
}) => {
    const [name, setName] = useState<string>(defaultData.name);
    const [description, setDescription] = useState<string>(defaultData.description);
    const [logoUrl, setLogoUrl] = useState<string>(defaultData.logoUrl);
    const [homepageLink, setHomepageLink] = useState<string>(defaultData.homepageLink);
    const [donateUrl, setDonateUrl] = useState<string>(defaultData.donateUrl);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<boolean>(false);
    // Inside your component
    const router = useRouter();

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);
      
        try {
          const response = await fetch('/api/editCharity', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              id: charityId, // Replace with the actual charity ID
              name,
              description,
              logoUrl,
              homepageLink,
              donateUrl,
            }),
          });
      
          if (response.ok) {
            setSuccess(true);
            // Goes back to main page
            router.push(`/charities/${charityId}`);

          } else {
            setError('Failed to update the charity. Please try again.');
          }
        } catch (error) {
          setError('An error occurred while updating the charity. Please try again.');
        } finally {
          setSubmitting(false);
        }
      };

    return (
        <Layout>
            <Form
                title="Edit Charity"
                error={error}
                success={success}
                handleSubmit={handleSubmit}
                submitting={submitting}
                successMessage="Charity updated successfully!"
            >
                <FormInput
                    label="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    required
                />

                <FormTextarea
                    label="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                />

                <UploadImageButton
                    value={logoUrl}
                    onLogoUrl={setLogoUrl}
                    buttonText="Upload Logo"
                />

                <FormInput
                    label="Homepage Link"
                    value={homepageLink}
                    onChange={(e) => setHomepageLink(e.target.value)}
                    placeholder="Homepage Link"
                    required
                />

                <FormInput
                    label="Donate URL"
                    value={donateUrl}
                    onChange={(e) => setDonateUrl(e.target.value)}
                    placeholder="Donate URL"
                    required
                />
            </Form>
        </Layout>
    );
};
export const getServerSideProps: GetServerSideProps = async (context) => {
    const { charityId } = context.params;

    try {
        const charity = await prisma.charity.findUnique({
            where: { id: Number(charityId) },
        });

        if (!charity) {
            return { notFound: true };
        }

        return {
            props: {
                charityId,
                defaultData: {
                    name: charity.name,
                    description: charity.description,
                    logoUrl: charity.logoUrl,
                    homepageLink: charity.homepageLink,
                    donateUrl: charity.donateUrl,
                },
            },
        };
    } catch (error) {
        return { props: { defaultData: null } };
    }
};

export default EditCharityForm;
