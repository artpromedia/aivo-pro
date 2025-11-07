import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface ConsentFormData {
  id: string;
  title: string;
  description: string;
  type: string;
  content: string;
  studentName: string;
  parentName: string;
  signedDate?: string;
  signature?: string;
  status: string;
  dueDate: string;
  createdDate: string;
}

/**
 * Exports a consent form to PDF
 * @param formData - The consent form data to export
 * @returns Promise that resolves when PDF is generated and downloaded
 */
export async function exportConsentFormToPdf(formData: ConsentFormData): Promise<void> {
  try {
    // Create a temporary div to render the consent form content
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    tempDiv.style.top = '-9999px';
    tempDiv.style.width = '800px';
    tempDiv.style.background = 'white';
    tempDiv.style.padding = '40px';
    tempDiv.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    tempDiv.style.fontSize = '14px';
    tempDiv.style.lineHeight = '1.6';
    tempDiv.style.color = '#374151';

    // Generate HTML content for the consent form
    tempDiv.innerHTML = generateConsentFormHTML(formData);
    document.body.appendChild(tempDiv);

    // Convert HTML to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 1.5,
      useCORS: true,
      backgroundColor: '#ffffff',
      width: 800,
      height: tempDiv.scrollHeight
    });

    // Remove temporary div
    document.body.removeChild(tempDiv);

    // Create PDF
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `Consent_Form_${formData.title.replace(/\s+/g, '_')}_${timestamp}.pdf`;

    // Download the PDF
    pdf.save(filename);
  } catch (error) {
    console.error('Error generating consent form PDF:', error);
    throw new Error('Failed to generate PDF. Please try again.');
  }
}

/**
 * Generates HTML content for the consent form
 */
function generateConsentFormHTML(formData: ConsentFormData): string {
  const statusColor = (status: string): string => {
    switch (status.toLowerCase()) {
      case 'signed': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'declined': return '#ef4444';
      case 'expired': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return `
    <div style="max-width: 800px; margin: 0 auto; background: white;">
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 40px; padding: 30px; background: linear-gradient(135deg, #ff7b5c, #ff636f); color: white; border-radius: 12px;">
        <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: bold;">AIVO Learning Platform</h1>
        <h2 style="margin: 0 0 5px 0; font-size: 20px; font-weight: 500;">Digital Consent Form</h2>
        <p style="margin: 0; font-size: 14px; opacity: 0.9;">${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Authorization</p>
      </div>

      <!-- Form Information -->
      <div style="margin-bottom: 30px; padding: 25px; border: 2px solid #e5e7eb; border-radius: 12px; background: #f9fafb;">
        <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: bold; color: #374151; border-bottom: 2px solid #ff7b5c; padding-bottom: 8px;">Form Information</h3>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
          <div>
            <strong style="color: #374151;">Form Title:</strong><br>
            <span style="color: #6b7280;">${formData.title}</span>
          </div>
          <div>
            <strong style="color: #374151;">Form ID:</strong><br>
            <span style="color: #6b7280;">${formData.id}</span>
          </div>
          <div>
            <strong style="color: #374151;">Student Name:</strong><br>
            <span style="color: #6b7280;">${formData.studentName}</span>
          </div>
          <div>
            <strong style="color: #374151;">Parent/Guardian:</strong><br>
            <span style="color: #6b7280;">${formData.parentName}</span>
          </div>
          <div>
            <strong style="color: #374151;">Created Date:</strong><br>
            <span style="color: #6b7280;">${formatDate(formData.createdDate)}</span>
          </div>
          <div>
            <strong style="color: #374151;">Due Date:</strong><br>
            <span style="color: #6b7280;">${formatDate(formData.dueDate)}</span>
          </div>
        </div>

        <div style="margin-top: 20px;">
          <strong style="color: #374151;">Status:</strong>
          <span style="background: ${statusColor(formData.status)}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600; margin-left: 10px;">
            ${formData.status.toUpperCase()}
          </span>
        </div>

        ${formData.description ? `
        <div style="margin-top: 20px;">
          <strong style="color: #374151;">Description:</strong><br>
          <span style="color: #6b7280; line-height: 1.6;">${formData.description}</span>
        </div>
        ` : ''}
      </div>

      <!-- Form Content -->
      <div style="margin-bottom: 30px;">
        <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: bold; color: #374151; border-bottom: 2px solid #ff7b5c; padding-bottom: 8px;">Consent Form Content</h3>
        <div style="padding: 25px; border: 1px solid #e5e7eb; border-radius: 8px; background: white; line-height: 1.8;">
          ${formData.content.replace(/\n/g, '<br>')}
        </div>
      </div>

      <!-- Signature Section -->
      ${formData.status === 'signed' && formData.signedDate ? `
      <div style="margin-bottom: 30px;">
        <h3 style="margin: 0 0 20px 0; font-size: 18px; font-weight: bold; color: #374151; border-bottom: 2px solid #ff7b5c; padding-bottom: 8px;">Digital Signature</h3>
        <div style="padding: 25px; border: 1px solid #10b981; border-radius: 8px; background: #f0fdf4;">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
            <div>
              <strong style="color: #059669;">Signed By:</strong><br>
              <span style="color: #047857; font-size: 16px;">${formData.parentName}</span>
            </div>
            <div>
              <strong style="color: #059669;">Date Signed:</strong><br>
              <span style="color: #047857; font-size: 16px;">${formatDate(formData.signedDate)}</span>
            </div>
          </div>
          ${formData.signature ? `
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #86efac;">
            <strong style="color: #059669;">Digital Signature:</strong><br>
            <div style="margin-top: 10px; padding: 15px; background: white; border: 1px solid #86efac; border-radius: 4px; font-family: cursive; font-size: 18px; color: #047857;">
              ${formData.signature}
            </div>
          </div>
          ` : ''}
          <div style="margin-top: 20px; padding: 15px; background: #dcfce7; border-radius: 6px; text-align: center;">
            <div style="display: inline-flex; align-items: center; gap: 8px; color: #059669; font-weight: 600;">
              <div style="width: 20px; height: 20px; background: #10b981; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 12px;">✓</span>
              </div>
              This form has been digitally signed and is legally binding
            </div>
          </div>
        </div>
      </div>
      ` : ''}

      <!-- Legal Notice -->
      <div style="margin-bottom: 30px; padding: 20px; background: #fef3c7; border: 1px solid #fbbf24; border-radius: 8px;">
        <h4 style="margin: 0 0 10px 0; color: #92400e; font-size: 16px; font-weight: 600;">Legal Notice</h4>
        <p style="margin: 0; color: #78350f; font-size: 13px; line-height: 1.6;">
          This digital consent form has been generated by the AIVO Learning Platform. 
          The information contained herein is confidential and protected under FERPA regulations. 
          Digital signatures are legally binding and equivalent to handwritten signatures when properly executed.
        </p>
      </div>

      <!-- Footer -->
      <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px;">
        <p style="margin: 0;">Generated on ${new Date().toLocaleDateString()} by AIVO Learning Platform</p>
        <p style="margin: 5px 0 0 0;">Document ID: ${formData.id} | Type: ${formData.type.charAt(0).toUpperCase() + formData.type.slice(1)} Consent</p>
      </div>
    </div>
  `;
}