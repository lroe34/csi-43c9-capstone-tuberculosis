import Card from "@/components/Card";

export default function DiagnosisPage() {
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <Card title="Symptoms">
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Enter symptoms"
          />
        </Card>
        <Card title="Medical History">
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            placeholder="Enter medical history"
          />
        </Card>
        <button className="bg-gray-700 text-white px-4 py-2 rounded-md">
          Upload Your Information
        </button>
        <button className="bg-yellow-600 text-white px-6 py-2 rounded-md ml-4">
          Continue
        </button>
      </div>
      <div className="col-span-1">
        <Card title="More Resources"></Card>
      </div>
    </div>
  );
}
