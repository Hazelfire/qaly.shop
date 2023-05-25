import { Button, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText, Typography, LinearProgress } from '@material-ui/core';
import React, { useState, ReactNode, FormEvent } from 'react';

type FormInputProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label: string;
  required?: boolean;
};

export const FormInput: React.FC<FormInputProps> = ({ value, onChange, placeholder, label, required }) => (
  <TextField
    id={label}
    name={label}
    required={required}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    label={label}
    fullWidth
    margin="normal"
  />
);

type FormSelectProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: { value: string; label: string }[];
  label: string;
};

export const FormSelect: React.FC<FormSelectProps> = ({ value, onChange, options, label }) => (
  <FormControl fullWidth margin="normal">
    <InputLabel id={`${label}-label`}>{label}</InputLabel>
    <Select labelId={`${label}-label`} id={label} value={value} onChange={onChange}>
      {options.map((option) => (
        <MenuItem key={option.value} value={option.value}>
          {option.label}
        </MenuItem>
      ))}
    </Select>
  </FormControl>
);

type FormNumberProps = {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  label: string;
  required?: boolean;
};

export const FormNumber: React.FC<FormNumberProps> = ({ value, onChange, placeholder, label, required }) => (
  <TextField
    id={label}
    name={label}
    required={required}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    label={label}
    fullWidth
    margin="normal"
    type="number"
  />
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
  <TextField
    id={label}
    name={label}
    value={value}
    onChange={onChange}
    required={required}
    label={label}
    fullWidth
    margin="normal"
    multiline
  />
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
  <Button type={type} disabled={disabled} variant="contained" color="primary">
    {children}
  </Button>
);

type FormFileUploadButtonProps = {
  onFileSelect: (file: File) => void;
  accept?: string;
  buttonText?: string;
  uploadedImage?: string;
};

export const FormFileUploadButton: React.FC<FormFileUploadButtonProps> = ({
  onFileSelect,
  accept = "image/*",
  buttonText = "Upload File",
  uploadedImage,
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
      <input
        accept={accept}
        style={{ display: 'none' }}
        id="fileUpload"
        type="file"
        onChange={handleFileSelect}
      />
      <label htmlFor="fileUpload">
        <Button variant="contained" component="span">
          {buttonText}
        </Button>
      </label>
      {selectedFile && <Typography variant="body1">Selected file: {selectedFile.name}</Typography>}
      {uploadedImage && <img src={uploadedImage} alt={selectedFile?.name} />}
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
  includeButton?: boolean;
};

export const Form: React.FC<FormProps> = ({
  title,
  error,
  success,
  handleSubmit,
  submitting,
  successMessage,
  children,
  includeButton=true
}) => {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1em' }}>
      <Typography variant="h4" align="center">{title}</Typography>
      {error && <FormHelperText error>{error}</FormHelperText>}
      {success && <FormHelperText>{successMessage}</FormHelperText>}
      {submitting && <LinearProgress />}
      <form onSubmit={handleSubmit}>
        {children}
        {includeButton && <Button type="submit" disabled={submitting} variant="contained" color="primary" style={{ marginTop: '1em' }}>
          {submitting ? "Submitting..." : "Submit"}
        </Button> }
      </form>
    </div>
  );
};

export default Form;
