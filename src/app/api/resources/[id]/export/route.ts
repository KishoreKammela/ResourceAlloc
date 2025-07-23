// /src/app/api/resources/[id]/export/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { getResourceById } from '@/services/resources.services';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { CellHookData } from 'jspdf-autotable';
import { auth as adminAuth } from 'firebase-admin';
import { initAdminApp } from '@/lib/firebase/admin-config';
import { getTeamMemberProfile } from '@/services/users.services';

// Extend jsPDF with autoTable - this is how the plugin is used
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

async function getAuthenticatedUser(request: NextRequest) {
  const authorization = request.headers.get('Authorization');
  if (authorization?.startsWith('Bearer ')) {
    const idToken = authorization.split('Bearer ')[1];
    try {
      await initAdminApp();
      const decodedToken = await adminAuth().verifyIdToken(idToken);
      return decodedToken;
    } catch (error) {
      console.error('Error verifying auth token:', error);
      return null;
    }
  }

  const token = request.nextUrl.searchParams.get('token');
  if (token) {
    try {
      await initAdminApp();
      const decodedToken = await adminAuth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      console.error('Error verifying auth token:', error);
      return null;
    }
  }
  return null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const resourceId = params.id;
  const decodedToken = await getAuthenticatedUser(request);

  if (!decodedToken) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  if (!resourceId) {
    return new NextResponse('Resource ID is required', { status: 400 });
  }

  try {
    const userProfile = await getTeamMemberProfile(decodedToken.uid);
    const companyId = userProfile?.companyId;

    if (!companyId) {
      return new NextResponse('User does not belong to a company', {
        status: 403,
      });
    }

    const resource = await getResourceById(resourceId, companyId);

    if (!resource) {
      return new NextResponse('Resource not found or access denied', {
        status: 404,
      });
    }

    const doc = new jsPDF() as jsPDFWithAutoTable;
    const resourceName = `${resource.firstName} ${resource.lastName}`;

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(resourceName, 14, 22);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(resource.designation, 14, 30);
    if (resource.email) {
      doc.setTextColor(40, 40, 200);
      doc.textWithLink(resource.email, 14, 38, {
        url: `mailto:${resource.email}`,
      });
      doc.setTextColor(0, 0, 0);
    }
    doc.line(14, 42, 196, 42); // Horizontal line

    let yPos = 50;

    // // Professional Summary - Placeholder for when this field is added
    // if (resource.professionalSummary) {
    //   doc.setFontSize(16);
    //   doc.setFont('helvetica', 'bold');
    //   doc.text('Professional Summary', 14, yPos);
    //   yPos += 8;

    //   doc.setFontSize(11);
    //   doc.setFont('helvetica', 'normal');
    //   const summaryLines = doc.splitTextToSize(
    //     resource.professionalSummary,
    //     182
    //   );
    //   doc.text(summaryLines, 14, yPos);
    //   yPos += summaryLines.length * 5 + 10;
    // }

    // Skills
    const skills =
      resource.technicalSkills?.map((s) => `${s.name} (${s.level})`) || [];
    if (skills.length > 0) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Skills', 14, yPos);
      yPos += 8;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.autoTable({
        startY: yPos,
        body: [skills],
        theme: 'plain',
        styles: {
          cellPadding: 1.5,
          fontSize: 10,
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
        },
        didDrawCell: (data: CellHookData) => {
          if (data.section === 'body') {
            doc.setDrawColor(221, 221, 221); // Set border color
            doc.roundedRect(
              data.cell.x,
              data.cell.y,
              data.cell.width,
              data.cell.height,
              2,
              2,
              'S'
            );
          }
        },
      });
    }

    const pdfBuffer = doc.output('arraybuffer');

    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${resourceName}_Profile.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
