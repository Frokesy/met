import MainContainer from "../../components/containers/MainContainer";
import { useState } from "react";
import { Trash2, Plus } from "lucide-react";

const SystemSettings = () => {
  const [units, setUnits] = useState<string[]>(["Unit A", "Unit B"]);
  const [newUnit, setNewUnit] = useState("");

  const handleAddUnit = () => {
    if (newUnit.trim() && !units.includes(newUnit)) {
      setUnits([...units, newUnit.trim()]);
      setNewUnit("");
    }
  };

  const handleDeleteUnit = (unit: string) => {
    setUnits(units.filter((u) => u !== unit));
  };

  return (
    <MainContainer active="system settings">
      <div className="text-[20px] text-gray-400 font-semibold mb-8">
        Home / System Settings
      </div>

      <div className="space-y-10 overflow-y-auto max-h-[calc(100vh-200px)] py-10">
        <SettingsCard title="General">
          <div className="grid gap-4 md:grid-cols-2">
            <SettingInput label="System Name" placeholder="e.g. SFIMS" />
            <SettingInput label="Default Unit" placeholder="e.g. Unit A" />
            <SettingToggle label="Maintenance Mode" />
          </div>
        </SettingsCard>

        <SettingsCard title="Security">
          <div className="grid gap-4 md:grid-cols-2 items-center">
            <SettingInput label="Min Password Length" placeholder="e.g. 8" />
            <div className="mt-8">
              <SettingToggle label="Enforce 2FA (Coming soon)" disabled />
            </div>
            <SettingToggle label="Allow Password Reset" />
          </div>
        </SettingsCard>

        <SettingsCard title="Roles & Permissions">
          <div className="grid gap-4">
            <SettingInput
              label="Available Roles"
              placeholder="e.g. Officer, Commander, Admin"
            />
            <button className="bg-blue-600 hover:bg-blue-500 text-white py-2 px-4 rounded-md w-fit">
              Manage Permissions
            </button>
          </div>
        </SettingsCard>

        <SettingsCard title="Manage Units">
          <div className="flex flex-col md:flex-row gap-3 mb-4">
            <input
              type="text"
              value={newUnit}
              onChange={(e) => setNewUnit(e.target.value)}
              placeholder="Add new unit"
              className="p-3 bg-gray-700 text-white rounded-md outline-none flex-1"
            />
            <button
              onClick={handleAddUnit}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-md"
            >
              <Plus size={18} />
              Add Unit
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {units.map((unit) => (
              <div
                key={unit}
                className="flex justify-between items-center bg-gray-700 px-4 py-3 rounded-md"
              >
                <span className="text-white">{unit}</span>
                <button
                  onClick={() => handleDeleteUnit(unit)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </SettingsCard>
      </div>
    </MainContainer>
  );
};

export default SystemSettings;

const SettingsCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-gray-800 p-6 rounded-md shadow-md">
    <h3 className="text-xl text-white font-semibold mb-4">{title}</h3>
    {children}
  </div>
);

const SettingInput = ({
  label,
  placeholder,
}: {
  label: string;
  placeholder?: string;
}) => {
  const [value, setValue] = useState("");
  return (
    <div className="flex flex-col gap-1">
      <label className="text-gray-300 text-sm mb-2">{label}</label>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="p-3 bg-gray-700 text-white rounded-md outline-none"
      />
    </div>
  );
};

const SettingToggle = ({
  label,
  disabled,
}: {
  label: string;
  disabled?: boolean;
}) => {
  const [enabled, setEnabled] = useState(false);
  return (
    <div className="flex items-center justify-between bg-gray-700 p-3 rounded-md">
      <span className="text-gray-300">{label}</span>
      <input
        type="checkbox"
        disabled={disabled}
        checked={enabled}
        onChange={() => setEnabled((prev) => !prev)}
        className="scale-125 accent-blue-500"
      />
    </div>
  );
};
