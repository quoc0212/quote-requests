export async function sendQuoteConfirmationEmail(_data: {
  name: string;
  email: string;
  services: string[];
  other_service?: string;
  timeline?: string;
  budget?: string;
  project_description?: string;
  additional_notes?: string;
}): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 5000));
}
