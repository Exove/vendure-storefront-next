interface RadioOptionProps {
  value: string;
  name: string;
  groupName: string;
  onChange?: () => void;
}

export default function RadioOption({
  value,
  name,
  groupName,
  onChange,
}: RadioOptionProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-lg border border-slate-700 p-4 transition-colors hover:border-slate-600 hover:bg-slate-800">
      <input
        type="radio"
        name={groupName}
        value={value}
        className="h-5 w-5 appearance-none rounded-full border-2 border-slate-400 bg-transparent transition-all checked:border-[5px] checked:border-blue-500 hover:border-slate-300"
        required
        onChange={onChange}
      />
      <div>
        <div className="font-medium text-slate-100">{name}</div>
      </div>
    </label>
  );
}
