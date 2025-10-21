import { Button } from "../../../../components/ui";
import { AbsencesTable } from "./components";

interface AbsencesProps {
  searchValue: string;
}

export function Absences({ searchValue }: AbsencesProps) {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Absences</h2>
        <Button
          variant="primary"
          onClick={() => console.log("Add request clicked")}
        >
          + Add Request
        </Button>
      </div>
      <p className="text-gray-500">
        Track staff absences, leaves, and time-off requests.
      </p>

      <AbsencesTable searchValue={searchValue} />
    </div>
  );
}
