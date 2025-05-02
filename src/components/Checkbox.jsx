export default function Checkbox({ id, checked, onChange, label }) {
  return (
    <label className="flex items-center space-x-2">
      <input
        type="checkbox"
        checked={checked}
        onChange={() => onChange(id)}
        className="h-5 w-5"
      />
      <span className={checked ? "text-green-600" : ""}>{label}</span>
    </label>
  );
}