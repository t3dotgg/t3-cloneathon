import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function TermsAndConditionsPage() {
  return (
    <div className="container mx-auto max-w-4xl px-4 py-8 relative">
      <Link
        href="/"
        className="absolute top-4 left-4 sm:top-6 sm:left-6 flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200 text-sm sm:text-base"
      >
        <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Back Home</span>
      </Link>

      <div className="prose prose-invert max-w-none mt-16 sm:mt-20">
        <h1>T3 Chat Cloneathon Terms & Conditions</h1>

        <section>
          <h2>1. Organizer</h2>
          <ul>
            <li>
              The "T3 Chat Cloneathon" (the "Hackathon") is organized by T3
              Tools Inc. ("Organizer").
            </li>
          </ul>
        </section>

        <section>
          <h2>2. Eligibility</h2>
          <ul>
            <li>Open to individuals aged 18 or older as of the start date.</li>
          </ul>
        </section>

        <section>
          <h2>3. Registration & Timeline</h2>
          <ul>
            <li>
              Registration opens on June 10, 2025 and closes on June 17, 2025.
            </li>
            <li>
              {"All teams (max. 4 members each) must register "}
              <Link href="/register">{"here"}</Link>.
            </li>
          </ul>
        </section>

        <section>
          <h2>4. Submission Requirements</h2>
          <ul>
            <li>
              Project must be original work developed during the Hackathon
              period.
            </li>
            <li>
              Code must be published in a public GitHub (or equivalent)
              repository.
            </li>
            <li>
              Repository must include one of the following permissive
              open-source licenses:
              <ul>
                <li>MIT License</li>
                <li>Apache 2.0 License</li>
                <li>BSD 2- or 3-Clause License</li>
              </ul>
              (No "copyleft" or proprietary licenses allowed.)
            </li>
            <li>Include a clear README with build/run instructions.</li>
          </ul>
        </section>

        <section>
          <h2>5. Judging & Prizes</h2>
          <ul>
            <li>
              A panel of judges selected by the Organizer will evaluate
              submissions based on:
              <ul>
                <li>Technical execution</li>
                <li>Originality & creativity</li>
                <li>User experience</li>
                <li>Code quality & documentation</li>
              </ul>
            </li>
            <li>
              Prizes: total cash pool of ​$8,000, distributed as follows:
              <ul>
                <li>1st Place: ​$5,000​</li>
                <li>2nd Place: ​$2,000​</li>
                <li>3rd Place: ​$1,000​</li>
              </ul>
            </li>
            <li>Winners will be announced no later than June 30, 2025.</li>
          </ul>
        </section>

        <section>
          <h2>6. Intellectual Property</h2>
          <ul>
            <li>Participants retain full ownership of their code.</li>
            <li>
              By submitting, you grant the Organizer a worldwide, royalty-free
              license to reproduce, display, and distribute your project for
              promotional purposes.
            </li>
          </ul>
        </section>

        <section>
          <h2>7. Privacy & Publicity</h2>
          <ul>
            <li>
              Organizer collects only contact details and submission materials.
            </li>
            <li>
              Competitors may be asked to participate in publicity (interviews,
              social media).
            </li>
          </ul>
        </section>

        <section>
          <h2>8. Disqualification</h2>
          <ul>
            <li>
              Any attempt to cheat, plagiarize, or violate these rules may
              result in immediate disqualification.
            </li>
            <li>
              Submissions that fail to include a valid permissive license will
              be disqualified.
            </li>
          </ul>
        </section>

        <section>
          <h2>9. Limitation of Liability</h2>
          <ul>
            <li>
              Organizer is not responsible for lost, late, misdirected, or
              incomplete submissions.
            </li>
            <li>
              To the maximum extent permitted by law, Organizer disclaims all
              warranties and liability.
            </li>
          </ul>
        </section>

        <section>
          <h2>10. Governing Law</h2>
          <ul>
            <li>
              These Terms are governed by the laws of the State of California
              (USA), excluding its conflicts-of-law rules.
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
