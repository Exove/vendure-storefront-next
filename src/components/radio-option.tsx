interface RadioOptionProps {
  value: string;
  name: string;
  groupName: string;
}

export default function RadioOption({
  value,
  name,
  groupName,
}: RadioOptionProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border p-4 hover:bg-slate-800">
      <input
        type="radio"
        name={groupName}
        value={value}
        className="h-4 w-4"
        required
      />
      <div>
        <div className="font-medium">{name}</div>
      </div>
    </label>
  );
}
