import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto p-6">
      <Helmet>
        <title>Privacy Policy & Terms of Service - Tutors Forum</title>
        <meta name="description" content="Read the Privacy Policy and Terms of Service for Tutors Forum." />
      </Helmet>
      <h1 className="text-3xl font-bold mb-4">Privacy Policy & Terms of Service</h1>

      <p className="mb-4">
        This document (“Agreement”) constitutes a legally binding contract between you (the “User”) and TutorsForum (“Company,” “we,” “our,” or “us”) governing the collection, storage, processing, and usage of personal and non-personal data within the scope of the TutorsForum platform, in compliance with applicable data protection laws and regulatory frameworks.
      </p>

      <h2 className="text-xl font-semibold mt-6">1. Definitions and Interpretation</h2>
      <p>
        1.1 **“User”** refers to any individual who accesses, registers, or engages with the services provided by TutorsForum.  
        1.2 **“Personal Data”** means any information that identifies or can be used to identify an individual, including but not limited to name, email address, contact information, and payment records.  
        1.3 **“Platform”** refers to the TutorsForum website and any associated mobile applications or extensions.  
      </p>

      <h2 className="text-xl font-semibold mt-6">2. Data Collection & Processing</h2>
      <p>
        2.1 **Scope of Data Collection:** TutorsForum collects and processes Personal Data, including but not limited to:
      </p>
      <ul className="list-disc ml-6">
        <li>Identifiers: Name, email address, phone number (if voluntarily provided).</li>
        <li>Transactional Data: Class bookings, session history, and financial transactions (processed via third-party payment gateways).</li>
        <li>Usage Data: Log files, browser metadata, device information, and engagement metrics.</li>
      </ul>

      <p>
        2.2 **Lawful Basis for Processing:**  
        - Personal Data is collected based on **contractual necessity** (e.g., for facilitating class bookings).  
        - Processing may occur under **legitimate interests** (e.g., fraud prevention, service optimization).  
        - Where legally required, **explicit user consent** shall be obtained before data collection.  
      </p>

      <h2 className="text-xl font-semibold mt-6">3. User Obligations & Responsibilities</h2>
      <p>
        3.1 **Confidentiality:** Users shall not disclose or transmit sensitive data (including but not limited to phone numbers, emails, or payment credentials) outside of designated communication channels within the platform.  
        3.2 **Compliance with Applicable Law:** Users agree to comply with all relevant legal, regulatory, and jurisdictional requirements while engaging with the TutorsForum platform.  
        3.3 **Account Security:** Users shall maintain the confidentiality of their account credentials and notify TutorsForum in case of any unauthorized access or security breaches.  
      </p>

      <h2 className="text-xl font-semibold mt-6">4. Data Retention & Security</h2>
      <p>
        4.1 **Retention Period:** Personal Data shall be retained for the duration necessary to fulfill contractual obligations, comply with legal requirements, or as mandated by applicable data retention laws.  
        4.2 **Security Measures:** TutorsForum employs industry-standard encryption, secure socket layer (SSL) protocols, and firewall protections to mitigate risks related to unauthorized access, data breaches, or cyber threats.  
        4.3 **Third-Party Processing:** Data may be shared with authorized third-party service providers (e.g., payment processors) solely for the purposes outlined in this Agreement, subject to confidentiality obligations.  
      </p>

      <h2 className="text-xl font-semibold mt-6">5. Limitation of Liability & Disclaimers</h2>
      <p>
        5.1 TutorsForum shall not be liable for:  
        - Any indirect, incidental, or consequential damages arising from the use of the platform.  
        - Disruptions, delays, or system failures resulting from third-party service providers or force majeure events.  
        - Misuse of personal data by users in violation of this Agreement.  
      </p>

      <h2 className="text-xl font-semibold mt-6">6. Termination & Account Suspension</h2>
      <p>
        6.1 **Grounds for Suspension:** TutorsForum reserves the right to suspend or terminate user accounts, with or without prior notice, under the following circumstances:  
        - Violation of platform policies, including but not limited to fraudulent activities, unauthorized data access, or dissemination of prohibited content.  
        - Failure to comply with payment obligations (if applicable).  
        - Engagement in conduct deemed detrimental to the safety and integrity of the platform.  
      </p>

      <h2 className="text-xl font-semibold mt-6">7. Dispute Resolution & Governing Law</h2>
      <p>
        7.1 **Jurisdiction & Venue:** This Agreement shall be governed by and construed in accordance with the laws of [Your Country/State], without regard to conflict-of-law principles.  
        7.2 **Arbitration Clause:** Any dispute arising from or related to this Agreement shall be resolved exclusively through binding arbitration conducted in [Arbitration Location], pursuant to the rules of [Arbitration Authority].  
      </p>

      <h2 className="text-xl font-semibold mt-6">8. Modifications & Amendments</h2>
      <p>
        8.1 TutorsForum reserves the right to update, modify, or amend this Agreement at any time. Continued use of the platform following such changes shall constitute acceptance of the revised terms.  
      </p>

      <h2 className="text-xl font-semibold mt-6">9. Contact Information</h2>
      <p>
        For inquiries, complaints, or data protection concerns, users may contact TutorsForum at:  
        <br />
        📧 **Email:** support@tutorsforum.in 
        📍 **Address:** First Floor, Plot Number-26, District Center, Bhubaneswar, Odisha 751016  
      </p>

      <p className="mt-6">
        <strong>By accessing and using TutorsForum, you acknowledge that you have read, understood, and agreed to be bound by the terms outlined in this Privacy Policy & Terms of Service.</strong>
      </p>
    </div>
  );
};

export default PrivacyPolicy;
