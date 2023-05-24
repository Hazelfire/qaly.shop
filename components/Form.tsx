import React, {useState, ReactNode, FormEvent} from 'react';

type FormInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label: string;
  required?: boolean
};

export const FormInput: React.FC<FormInputProps> = ({ value, onChange, placeholder, label, required }) => (
  <div>
    <label htmlFor={label}>{label}</label>
    <input
      type="text"
      id={label}
      name={label}
      required={required}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    <style jsx>{`
      div {
        margin-bottom: 0.5em;
      }

      label {
        display: block;
        font-weight: bold;
        margin-bottom: 0.25em;
      }

      input {
        padding: 0.5em;
        width: 100%;
        max-width: 300px;
      }
    `}</style>
  </div>
);

type FormSelectProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  label: string;
};

export const FormSelect: React.FC<FormSelectProps> = ({ value, onChange, options, label }) => (
  <div>
    <label htmlFor={label}>{label}</label>
    <select value={value} onChange={onChange} id={label} name={label}>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <style jsx>{`
      div {
        margin-bottom: 0.5em;
      }

      label {
        font-weight: bold;
        margin-bottom: 0.25em;
      }

      select {
        margin-top: 0.25em;
        padding: 0.5em;
        width: 100%;
        max-width: 300px;
      }
    `}</style>
  </div>
);

type FormNumberProps = {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label: string;
  required?: boolean;
};

export const FormNumber: React.FC<FormNumberProps> = ({ value, onChange, placeholder, label, required }) => (
  <div>
    <label htmlFor={label}>{label}</label>
    <input
      type="number"
      id={label}
      required={required}
      name={label}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
    <style jsx>{`
      div {
        margin-bottom: 0.5em;
      }

      label {
        font-weight: bold;
        margin-bottom: 0.25em;
      }

      input {
        padding: 0.5em;
        width: 100%;
        max-width: 300px;
      }
    `}</style>
  </div>
);

type FormTextareaProps = {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    required?: boolean;
  };
  
  export const FormTextarea: React.FC<FormTextareaProps> = ({
    label,
    value,
    onChange,
    required = false,
  }) => (
    <div>
      <label htmlFor={label}>{label}</label>
      <textarea
        id={label}
        name={label}
        value={value}
        onChange={onChange}
        required={required}
      />
      <style jsx>{`
        label {
          font-weight: bold;
          margin-bottom: 0.5rem;
        }
  
        textarea {
          padding: 0.5rem;
          margin-bottom: 1rem;
          width: 100%;
          max-width: 300px;
        }
      `}</style>
    </div>
  );
  
  type FormButtonProps = {
    type: "submit" | "button" | "reset";
    disabled?: boolean;
    children: React.ReactNode;
  };
  
  export const FormButton: React.FC<FormButtonProps> = ({
    type,
    disabled = false,
    children,
  }) => (
    <button type={type} disabled={disabled}>
      {children}
      <style jsx>{`
        button {
          padding: 0.5rem 1rem;
          background-color: #007bff;
          color: #fff;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </button>
  );

  type FormFileUploadButtonProps = {
    onFileSelect: (file: File) => void;
    accept?: string;
    buttonText?: string;
  };
  
export const FormFileUploadButton: React.FC<FormFileUploadButtonProps> = ({
    onFileSelect,
    accept = "image/*",
    buttonText = "Upload File",
  }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
  
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    };
  
    return (
      <div>
        <label htmlFor="fileUpload">{buttonText}</label>
        <input
          type="file"
          id="fileUpload"
          accept={accept}
          onChange={handleFileSelect}
        />
        {selectedFile && <p>Selected file: {selectedFile.name}</p>}
      </div>
    );
  };

type FormProps = {
  title: string;
  error: string | null;
  success: boolean;
  handleSubmit?: (e: FormEvent) => void;
  submitting: boolean;
  children: ReactNode;
  successMessage: string;
};

export const Form: React.FC<FormProps> = ({
  title,
  error,
  success,
  handleSubmit,
  submitting,
  successMessage,
  children,
}) => {
  return (
      <div className="container">
        <h1>{title}</h1>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{successMessage}</p>}
        {handleSubmit ? 
        <form onSubmit={handleSubmit}>
          {children}
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
        : <form>{children}</form>
        }

        <style jsx>{`
          .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 1em;
          }
          form {
            display: flex;
            flex-direction: column;
          }

          .error {
            color: red;
          }

          .success {
            color: green;
          }
        `}</style>
      </div>
  );
};

export default Form;
