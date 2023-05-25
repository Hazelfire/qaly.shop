import { useState } from 'react';
import { FormFileUploadButton } from 'components/Form';

type UploadImageButtonProps = {
    buttonText: string;
    onLogoUrl: (url: string) => void;
    value: string;
};

const UploadImageButton: React.FC<UploadImageButtonProps> = ({ buttonText, onLogoUrl, value }) => {

    const handleLogoFileSelect = async (file: File) => {
        const response = await fetch('/api/uploadimage', {
            method: 'POST',
            body: JSON.stringify({ filename: file.name, type: file.type }),
            headers: {
                'Content-Type': 'application/json',
            },
        });
        const { url, imageUrl } = await response.json();

        const uploadResponse = await fetch(url, {
            method: 'PUT',
            body: file,
            headers: {
                'Content-Type': file.type,
            },
        });

        if (uploadResponse.ok) {
            console.log('Uploaded successfully!');
            onLogoUrl(imageUrl);
        } else {
            console.log('Upload failed.');
        }
    };

    return (
        <FormFileUploadButton
            onFileSelect={handleLogoFileSelect}
            accept="image/*"
            buttonText={buttonText}
            uploadedImage={value}
        />
    );
};

export default UploadImageButton;