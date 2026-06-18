import { useEffect } from "react";
import { useStudio } from "../contexts/StudioContext";

export default function DebugMoodboards() {
  const { selectedConcepts } = useStudio();
  useEffect(() => {
    console.log("selectedConcepts:", selectedConcepts);
  }, [selectedConcepts]);
  return <div>Debug Mode</div>;
}
