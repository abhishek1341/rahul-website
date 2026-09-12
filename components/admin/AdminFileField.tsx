type AdminFileFieldProps = {
  accept: string;
  fileName?: string;
  onChange: (file: File | null) => void;
  label?: string;
};

export default function AdminFileField({
  accept,
  fileName,
  onChange,
  label = 'Choose file',
}: AdminFileFieldProps) {
  return (
    <label className="admin-file">
      <input
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => onChange(event.target.files?.[0] ?? null)}
      />
      <span className="admin-file-btn">{label}</span>
      <span className="admin-file-name">{fileName || 'No file chosen'}</span>
    </label>
  );
}
