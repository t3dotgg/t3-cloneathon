import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import ProjectSubmissionForm from "./ProjectSubmissionForm";

export default function Registration() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative">
      <ProjectSubmissionForm />
    </div>
  );
}
