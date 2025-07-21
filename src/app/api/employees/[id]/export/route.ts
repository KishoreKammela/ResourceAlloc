// /src/app/api/employees/[id]/export/route.ts
import { NextResponse } from 'next/server';
import { getEmployeeById } from '@/services/employees.services';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { CellHookData } from 'jspdf-autotable';

// Extend jsPDF with autoTable - this is how the plugin is used
interface jsPDFWithAutoTable extends jsPDF {
  autoTable: (options: any) => jsPDF;
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const employeeId = params.id;

  if (!employeeId) {
    return new NextResponse('Employee ID is required', { status: 400 });
  }

  try {
    const employee = await getEmployeeById(employeeId);

    if (!employee) {
      return new NextResponse('Employee not found', { status: 404 });
    }

    const doc = new jsPDF() as jsPDFWithAutoTable;

    // Header
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text(employee.name, 14, 22);

    doc.setFontSize(14);
    doc.setFont('helvetica', 'normal');
    doc.text(employee.title, 14, 30);
    if (employee.email) {
      doc.setTextColor(40, 40, 200);
      doc.textWithLink(employee.email, 14, 38, {
        url: `mailto:${employee.email}`,
      });
      doc.setTextColor(0, 0, 0);
    }
    doc.line(14, 42, 196, 42); // Horizontal line

    let yPos = 50;

    // Professional Summary
    if (employee.professionalSummary) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Professional Summary', 14, yPos);
      yPos += 8;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      const summaryLines = doc.splitTextToSize(
        employee.professionalSummary,
        182
      );
      doc.text(summaryLines, 14, yPos);
      yPos += summaryLines.length * 5 + 10;
    }

    // Skills
    if (employee.skills && employee.skills.length > 0) {
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Skills', 14, yPos);
      yPos += 8;

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.autoTable({
        startY: yPos,
        body: [employee.skills],
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
        'Content-Disposition': `attachment; filename="${employee.name}_Profile.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
