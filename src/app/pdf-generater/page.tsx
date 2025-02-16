'use client'
import AgreementPdf from '@/components/pdf/AgreementPdf'
import React, { useRef } from 'react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const Page = () => {
    const pdfRef = useRef(null);

    const downloadHandler = async () => {
        const inputData = pdfRef.current;
        if (!inputData) return;

        try {
            const canvas = await html2canvas(inputData, {
                scale: 2, // Improve resolution
                useCORS: true
            });

            const imgData = canvas.toDataURL("image/png");
            const pdf = new jsPDF({
                orientation: "portrait",
                unit: "px",
                format: "a4"
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;

            let yOffset = 0;

            while (yOffset < imgHeight) {
                const chunkCanvas = document.createElement("canvas");
                chunkCanvas.width = imgWidth;
                chunkCanvas.height = Math.min(pdfHeight * (imgWidth / pdfWidth), imgHeight - yOffset);

                const ctx = chunkCanvas.getContext("2d");
                if (ctx) {
                    ctx.drawImage(canvas, 0, yOffset, imgWidth, chunkCanvas.height, 0, 0, imgWidth, chunkCanvas.height);
                }

                const chunkImgData = chunkCanvas.toDataURL("image/png");
                pdf.addImage(chunkImgData, "PNG", 0, 0, pdfWidth, (chunkCanvas.height * pdfWidth) / imgWidth);

                yOffset += chunkCanvas.height;

                if (yOffset < imgHeight) {
                    pdf.addPage();
                }
            }

            pdf.save("License.pdf");
        } catch (e) {
            console.error("PDF generation failed", e);
        }
    };

    return (
        <div className="bg-red-400">
            <button onClick={downloadHandler} className="p-xl bg-brand1-500">Download</button>
            <div ref={pdfRef} className="p-6 bg-white">
                <AgreementPdf />
            </div>
        </div>
    );
};

export default Page;
