import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface IEPGoal {
  id: string;
  title: string;
  description: string;
  status: 'not-started' | 'in-progress' | 'completed';
  progress: number;
  targetDate: string;
  category: string;
}

export interface IEPMeeting {
  date: string;
  type: string;
  participants: string[];
  notes?: string;
}

export interface IEPData {
  childName: string;
  dateOfBirth?: string;
  grade?: string;
  studentId?: string;
  activeGoals: IEPGoal[];
  completedGoals?: IEPGoal[];
  upcomingMeetings?: IEPMeeting[];
  nextMeeting?: IEPMeeting;
  generatedDate?: string;
  schoolYear?: string;
  accommodations?: string[];
  services?: string[];
  notes?: string;
}

/**
 * Generate a branded IEP PDF document
 * @param iepData - The IEP data to include in the PDF
 * @param options - Optional configuration
 * @returns Promise that resolves when PDF is downloaded
 */
export async function exportIepToPdf(
  iepData: IEPData,
  options?: {
    filename?: string;
    returnBlob?: boolean;
  }
): Promise<Blob | void> {
  const filename = options?.filename || `IEP_${iepData.childName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;

  // Create a hidden container for rendering
  const container = document.createElement('div');
  container.style.position = 'absolute';
  container.style.left = '-9999px';
  container.style.top = '0';
  container.style.width = '800px';
  container.style.backgroundColor = '#ffffff';
  container.style.padding = '40px';
  container.style.fontFamily = 'Arial, sans-serif';

  // Build the HTML content
  container.innerHTML = generateIepHtml(iepData);

  document.body.appendChild(container);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    // Calculate PDF dimensions
    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    const pdf = new jsPDF('p', 'mm', 'a4');
    let position = 0;

    // Add first page
    const imgData = canvas.toDataURL('image/png');
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft > 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Remove the temporary container
    document.body.removeChild(container);

    if (options?.returnBlob) {
      return pdf.output('blob');
    }

    // Download the PDF
    pdf.save(filename);
  } catch (error) {
    document.body.removeChild(container);
    throw new Error(`Failed to generate PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Generate HTML content for the IEP document
 */
function generateIepHtml(data: IEPData): string {
  const today = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
    <div style="color: #1f2937;">
      <!-- Header -->
      <div style="border-bottom: 3px solid #FF7B5C; padding-bottom: 20px; margin-bottom: 30px;">
        <div style="display: flex; align-items: center; margin-bottom: 10px;">
          <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #FF7B5C 0%, #FF636F 100%); border-radius: 12px; margin-right: 15px;"></div>
          <div>
            <h1 style="margin: 0; font-size: 32px; color: #1f2937; font-weight: bold;">AIVO Learning Platform</h1>
            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">Individualized Education Program (IEP)</p>
          </div>
        </div>
      </div>

      <!-- Student Information -->
      <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 30px; border: 1px solid #e5e7eb;">
        <h2 style="margin: 0 0 20px 0; color: #1f2937; font-size: 20px; font-weight: 600;">Student Information</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
          <div>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; font-weight: 500;">Student Name</p>
            <p style="margin: 0; font-size: 16px; color: #1f2937; font-weight: 600;">${data.childName}</p>
          </div>
          ${data.dateOfBirth ? `
          <div>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; font-weight: 500;">Date of Birth</p>
            <p style="margin: 0; font-size: 16px; color: #1f2937; font-weight: 600;">${data.dateOfBirth}</p>
          </div>
          ` : ''}
          ${data.grade ? `
          <div>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; font-weight: 500;">Grade</p>
            <p style="margin: 0; font-size: 16px; color: #1f2937; font-weight: 600;">${data.grade}</p>
          </div>
          ` : ''}
          ${data.studentId ? `
          <div>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; font-weight: 500;">Student ID</p>
            <p style="margin: 0; font-size: 16px; color: #1f2937; font-weight: 600;">${data.studentId}</p>
          </div>
          ` : ''}
          <div>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; font-weight: 500;">Report Generated</p>
            <p style="margin: 0; font-size: 16px; color: #1f2937; font-weight: 600;">${today}</p>
          </div>
          ${data.schoolYear ? `
          <div>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #6b7280; font-weight: 500;">School Year</p>
            <p style="margin: 0; font-size: 16px; color: #1f2937; font-weight: 600;">${data.schoolYear}</p>
          </div>
          ` : ''}
        </div>
      </div>

      <!-- Active Goals -->
      ${data.activeGoals && data.activeGoals.length > 0 ? `
      <div style="margin-bottom: 30px;">
        <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px; font-weight: 600;">Active Goals</h2>
  ${data.activeGoals.map((goal) => `
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
              <div style="flex: 1;">
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                  <span style="background: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600;">${goal.category || 'General'}</span>
                  <span style="background: ${getStatusColor(goal.status)}; color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600;">${formatStatus(goal.status)}</span>
                </div>
                <h3 style="margin: 0 0 8px 0; color: #1f2937; font-size: 16px; font-weight: 600;">${goal.title}</h3>
                <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.5;">${goal.description}</p>
              </div>
            </div>
            <div style="margin-top: 12px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
                <span style="font-size: 12px; color: #6b7280;">Progress</span>
                <span style="font-size: 12px; font-weight: 600; color: #1f2937;">${goal.progress}%</span>
              </div>
              <div style="width: 100%; height: 8px; background: #e5e7eb; border-radius: 4px; overflow: hidden;">
                <div style="height: 100%; background: linear-gradient(90deg, #FF7B5C 0%, #FF636F 100%); width: ${goal.progress}%; border-radius: 4px;"></div>
              </div>
              ${goal.targetDate ? `
              <p style="margin: 8px 0 0 0; font-size: 12px; color: #6b7280;">
                <strong>Target Date:</strong> ${new Date(goal.targetDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
              ` : ''}
            </div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- Completed Goals -->
      ${data.completedGoals && data.completedGoals.length > 0 ? `
      <div style="margin-bottom: 30px;">
        <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px; font-weight: 600;">Completed Goals</h2>
        ${data.completedGoals.map(goal => `
          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 12px; padding: 16px; margin-bottom: 12px;">
            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
              <span style="background: #22c55e; color: white; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600;">✓ Completed</span>
              <span style="background: #dbeafe; color: #1e40af; padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 600;">${goal.category || 'General'}</span>
            </div>
            <h3 style="margin: 0 0 6px 0; color: #1f2937; font-size: 15px; font-weight: 600;">${goal.title}</h3>
            <p style="margin: 0; color: #6b7280; font-size: 13px;">${goal.description}</p>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- Accommodations & Services -->
      ${(data.accommodations && data.accommodations.length > 0) || (data.services && data.services.length > 0) ? `
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px;">
        ${data.accommodations && data.accommodations.length > 0 ? `
        <div style="background: #fef3c7; border: 1px solid #fbbf24; border-radius: 12px; padding: 20px;">
          <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 16px; font-weight: 600;">Accommodations</h3>
          <ul style="margin: 0; padding-left: 20px; color: #78350f;">
            ${data.accommodations.map(acc => `<li style="margin-bottom: 6px; font-size: 14px;">${acc}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
        ${data.services && data.services.length > 0 ? `
        <div style="background: #e0e7ff; border: 1px solid #818cf8; border-radius: 12px; padding: 20px;">
          <h3 style="margin: 0 0 12px 0; color: #3730a3; font-size: 16px; font-weight: 600;">Services</h3>
          <ul style="margin: 0; padding-left: 20px; color: #312e81;">
            ${data.services.map(service => `<li style="margin-bottom: 6px; font-size: 14px;">${service}</li>`).join('')}
          </ul>
        </div>
        ` : ''}
      </div>
      ` : ''}

      <!-- Upcoming Meetings -->
      ${data.upcomingMeetings && data.upcomingMeetings.length > 0 ? `
      <div style="margin-bottom: 30px;">
        <h2 style="margin: 0 0 16px 0; color: #1f2937; font-size: 20px; font-weight: 600;">Upcoming Meetings</h2>
        ${data.upcomingMeetings.map(meeting => `
          <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: start;">
              <div>
                <h3 style="margin: 0 0 6px 0; color: #1f2937; font-size: 16px; font-weight: 600;">${meeting.type}</h3>
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                  <strong>Date:</strong> ${new Date(meeting.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </p>
                ${meeting.participants && meeting.participants.length > 0 ? `
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                  <strong>Participants:</strong> ${meeting.participants.join(', ')}
                </p>
                ` : ''}
                ${meeting.notes ? `
                <p style="margin: 8px 0 0 0; color: #6b7280; font-size: 13px; font-style: italic;">${meeting.notes}</p>
                ` : ''}
              </div>
            </div>
          </div>
        `).join('')}
      </div>
      ` : ''}

      <!-- Notes -->
      ${data.notes ? `
      <div style="background: #fef9f3; border: 1px solid #fdba74; border-radius: 12px; padding: 20px; margin-bottom: 30px;">
        <h3 style="margin: 0 0 12px 0; color: #9a3412; font-size: 16px; font-weight: 600;">Additional Notes</h3>
        <p style="margin: 0; color: #7c2d12; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.notes}</p>
      </div>
      ` : ''}

      <!-- Footer -->
      <div style="border-top: 2px solid #e5e7eb; padding-top: 20px; margin-top: 30px; text-align: center;">
        <p style="margin: 0; color: #9ca3af; font-size: 12px;">
          Generated by AIVO Learning Platform on ${today}
        </p>
        <p style="margin: 4px 0 0 0; color: #9ca3af; font-size: 12px;">
          This document is confidential and should be stored securely.
        </p>
      </div>
    </div>
  `;
}

/**
 * Get status badge color
 */
function getStatusColor(status: string): string {
  switch (status) {
    case 'completed':
      return '#22c55e';
    case 'in-progress':
      return '#3b82f6';
    case 'not-started':
      return '#6b7280';
    default:
      return '#6b7280';
  }
}

/**
 * Format status text
 */
function formatStatus(status: string): string {
  return status
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
