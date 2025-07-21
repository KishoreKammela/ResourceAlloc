'use client';

import type { GenerateProjectReportOutput } from '@/ai/flows/generate-project-report';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Lightbulb, ListChecks, AlertTriangle } from 'lucide-react';

type ReportDisplayProps = {
    report: GenerateProjectReportOutput;
}

export default function ReportDisplay({ report }: ReportDisplayProps) {
    return (
        <div className="space-y-6 text-sm">
             <Card className="border-none shadow-none">
                <CardHeader className="flex-row items-center gap-3 space-y-0 p-0 pb-4">
                    <Lightbulb className="w-6 h-6 text-yellow-500" />
                    <CardTitle className="text-lg font-semibold">AI Summary</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                    <p className="text-muted-foreground italic">"{report.summary}"</p>
                </CardContent>
            </Card>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold flex items-center mb-3"><ListChecks className="mr-2 h-5 w-5 text-green-500" /> Key Achievements</h3>
                    <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                        {report.achievements.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold flex items-center mb-3"><AlertTriangle className="mr-2 h-5 w-5 text-orange-500" /> Potential Risks</h3>
                     <ul className="space-y-2 list-disc pl-5 text-muted-foreground">
                        {report.risks.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
