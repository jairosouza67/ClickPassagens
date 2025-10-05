import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType } from 'docx';
import { saveAs } from 'file-saver';

/**
 * Função auxiliar para formatar valor monetário
 */
const formatCurrency = (value) => {
  if (typeof value !== 'number') return 'R$ 0,00';
  return `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

/**
 * Função auxiliar para formatar milhas
 */
const formatMiles = (value) => {
  if (typeof value !== 'number') return '0';
  return Math.ceil(value).toLocaleString('pt-BR');
};

/**
 * Gera orçamento em PDF
 */
export const generatePDF = (quote, quoteType = 'client') => {
  console.log('generatePDF chamado:', { quote, quoteType });
  
  if (!quote) {
    console.error('Quote não fornecido');
    alert('Erro: Dados do orçamento não disponíveis');
    return;
  }
  
  try {
    const doc = new jsPDF();
    const isInternal = quoteType === 'internal';
    
    // Configuração de cores
    const primaryColor = isInternal ? [16, 185, 129] : [59, 130, 246];
    
    let yPos = 20;
    
    // CABEÇALHO
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont(undefined, 'bold');
    doc.text(isInternal ? 'ORÇAMENTO INTERNO' : 'ORÇAMENTO DE VIAGEM', 20, 20);
    
    doc.setFontSize(10);
    doc.setFont(undefined, 'normal');
    doc.text(isInternal ? '(CONFIDENCIAL)' : 'ClickPassagens - Viaje com Inteligência', 20, 28);
    doc.text(`Número: ${quote.quoteNumber || 'N/A'}`, 20, 35);
    
    yPos = 50;
    
    // DADOS DA VIAGEM
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(14);
    doc.setFont(undefined, 'bold');
    doc.text('Dados da Viagem', 20, yPos);
    yPos += 8;
    
    const flight = quote.flight || {};
    const flightData = [
      ['Companhia Aérea:', flight.airline || 'N/A'],
      ['Número do Voo:', flight.flightNumber || 'N/A'],
      ['Origem:', `${flight.origin?.name || 'N/A'} (${flight.origin?.code || 'N/A'})`],
      ['Destino:', `${flight.destination?.name || 'N/A'} (${flight.destination?.code || 'N/A'})`],
      ['Data de Ida:', `${flight.departure?.date || 'N/A'} - ${flight.departure?.time || 'N/A'}`],
    ];
    
    if (flight.return) {
      flightData.push(['Data de Volta:', `${flight.return.date} - ${flight.return.time}`]);
    }
    
    flightData.push(
      ['Duração:', flight.duration || 'N/A'],
      ['Paradas:', flight.stops || 'N/A'],
      ['Classe:', flight.class || 'N/A']
    );
    
    doc.autoTable({
      startY: yPos,
      body: flightData,
      theme: 'plain',
      styles: { fontSize: 10, cellPadding: 2 },
      columnStyles: {
        0: { fontStyle: 'bold', cellWidth: 50 },
        1: { cellWidth: 'auto' }
      }
    });
    
    yPos = doc.lastAutoTable.finalY + 10;
    
    // VALORES
    if (isInternal) {
      // ORÇAMENTO INTERNO
      doc.setFillColor(220, 252, 231);
      doc.rect(10, yPos, 190, 8, 'F');
      doc.setTextColor(6, 95, 70);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Análise Financeira', 20, yPos + 6);
      yPos += 12;
      
      const pricing = quote.pricing || {};
      const pricingData = [
        ['Custo Base da Passagem', formatCurrency(pricing.basePrice)],
        ['Taxas de Embarque', formatCurrency(pricing.airportTaxes?.total || 0)],
        ['SUBTOTAL (Custo Real)', formatCurrency(pricing.subtotal)],
        [`LUCRO (${pricing.profit?.percentage || '0%'})`, `+ ${formatCurrency(pricing.profit?.amount || 0)}`],
      ];
      
      doc.autoTable({
        startY: yPos,
        body: pricingData,
        theme: 'striped',
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 100 },
          1: { halign: 'right', cellWidth: 'auto' }
        }
      });
      
      yPos = doc.lastAutoTable.finalY + 5;
      
      // Total ao Cliente
      doc.setFillColor(...primaryColor);
      doc.rect(10, yPos, 190, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('PREÇO AO CLIENTE:', 20, yPos + 8);
      doc.text(formatCurrency(pricing.clientPrice || pricing.total), 190, yPos + 8, { align: 'right' });
      
      yPos += 18;
      
      // Análise em Milhas
      if (pricing.miles) {
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Análise em Milhas', 20, yPos);
        yPos += 6;
        
        const milesData = [
          ['Milhas Base (Custo)', formatMiles(pricing.miles.baseNeeded)],
          [`Lucro em Milhas (${pricing.miles.profitPercentage || '0%'})`, `+ ${formatMiles(pricing.miles.profit || 0)}`],
          ['Total ao Cliente', `${formatMiles(pricing.miles.clientTotal)} milhas`],
        ];
        
        doc.autoTable({
          startY: yPos,
          body: milesData,
          theme: 'striped',
          styles: { fontSize: 10, cellPadding: 3 },
          columnStyles: {
            0: { fontStyle: 'bold', cellWidth: 100 },
            1: { halign: 'right', cellWidth: 'auto' }
          }
        });
        
        yPos = doc.lastAutoTable.finalY + 8;
      }
      
    } else {
      // ORÇAMENTO CLIENTE
      doc.setFillColor(239, 246, 255);
      doc.rect(10, yPos, 190, 8, 'F');
      doc.setTextColor(30, 58, 138);
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text('Valores', 20, yPos + 6);
      yPos += 12;
      
      const pricing = quote.pricing || {};
      const pricingData = [
        ['Passagem', formatCurrency(pricing.flightPrice || pricing.total)],
        ['Taxas de Embarque', formatCurrency(pricing.taxes?.airportTaxes || 0)],
      ];
      
      doc.autoTable({
        startY: yPos,
        body: pricingData,
        theme: 'plain',
        styles: { fontSize: 10, cellPadding: 3 },
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 100 },
          1: { halign: 'right', cellWidth: 'auto' }
        }
      });
      
      yPos = doc.lastAutoTable.finalY + 5;
      
      // Total
      doc.setFillColor(...primaryColor);
      doc.rect(10, yPos, 190, 12, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont(undefined, 'bold');
      doc.text('TOTAL:', 20, yPos + 8);
      doc.text(formatCurrency(pricing.total), 190, yPos + 8, { align: 'right' });
      
      yPos += 18;
      
      // Opção em Milhas
      if (pricing.milesOption) {
        doc.setFillColor(254, 243, 199);
        doc.rect(10, yPos, 190, 15, 'F');
        doc.setTextColor(146, 64, 14);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Opção em Milhas', 20, yPos + 6);
        doc.setFontSize(10);
        doc.setFont(undefined, 'normal');
        doc.text(`${formatMiles(pricing.milesOption.totalMiles)} milhas`, 20, yPos + 11);
        
        yPos += 20;
      }
      
      // Formas de Pagamento
      if (pricing.paymentMethods && pricing.paymentMethods.length > 0) {
        doc.setTextColor(30, 41, 59);
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.text('Formas de Pagamento', 20, yPos);
        yPos += 8;
        
        pricing.paymentMethods.forEach((method) => {
          doc.setFillColor(248, 250, 252);
          doc.rect(10, yPos, 190, 10, 'F');
          doc.setFontSize(10);
          doc.setFont(undefined, 'bold');
          doc.setTextColor(30, 41, 59);
          doc.text(method.method || 'Forma de Pagamento', 20, yPos + 6);
          
          if (method.finalPrice) {
            doc.setTextColor(16, 185, 129);
            doc.setFont(undefined, 'normal');
            doc.text(`${formatCurrency(method.finalPrice)} (${method.discount || ''})`, 120, yPos + 6);
          } else if (method.installments) {
            doc.setTextColor(100, 116, 139);
            doc.setFont(undefined, 'normal');
            const installmentText = typeof method.installments === 'string' 
              ? method.installments 
              : `${method.installments}x de ${formatCurrency(method.installmentValue || 0)}`;
            doc.text(installmentText, 120, yPos + 6);
          } else if (method.miles) {
            doc.setTextColor(59, 130, 246);
            doc.setFont(undefined, 'normal');
            doc.text(`${formatMiles(method.miles)} milhas + ${formatCurrency(method.taxesCash || 0)}`, 120, yPos + 6);
          }
          
          yPos += 12;
        });
        
        yPos += 5;
      }
    }
    
    // Contato
    const agency = quote.agency || {};
    doc.setFillColor(254, 243, 199);
    doc.rect(10, yPos, 190, 15, 'F');
    doc.setTextColor(146, 64, 14);
    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text('Contato:', 20, yPos + 6);
    doc.setFont(undefined, 'normal');
    doc.text(`${agency.name || 'ClickPassagens'} | ${agency.phone || '(11) 99999-9999'} | ${agency.email || 'contato@clickpassagens.com'}`, 20, yPos + 11);
    
    // RODAPÉ
    const pageCount = doc.internal.getNumberOfPages();
    doc.setTextColor(156, 163, 175);
    doc.setFontSize(8);
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text(`Página ${i} de ${pageCount}`, 105, 290, { align: 'center' });
      const validUntil = quote.validUntil ? new Date(quote.validUntil).toLocaleDateString('pt-BR') : 'N/A';
      doc.text(`Válido até: ${validUntil}`, 20, 290);
      doc.text('www.clickpassagens.com', 190, 290, { align: 'right' });
    }
    
    // Salvar
    const fileName = `orcamento-${quoteType}-${quote.quoteNumber || Date.now()}.pdf`;
    console.log('Salvando PDF:', fileName);
    doc.save(fileName);
    
    console.log('PDF gerado com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar PDF:', error);
    alert(`Erro ao gerar PDF: ${error.message}`);
  }
};

/**
 * Gera orçamento em Word (DOCX)
 */
export const generateWord = async (quote, quoteType = 'client') => {
  console.log('generateWord chamado:', { quote, quoteType });
  
  if (!quote) {
    console.error('Quote não fornecido');
    alert('Erro: Dados do orçamento não disponíveis');
    return;
  }
  
  try {
    const isInternal = quoteType === 'internal';
    const sections = [];
    
    // CABEÇALHO
    sections.push(
      new Paragraph({
        text: isInternal ? 'ORÇAMENTO INTERNO (CONFIDENCIAL)' : 'ORÇAMENTO DE VIAGEM',
        heading: 'Heading1',
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 }
      }),
      new Paragraph({
        text: `ClickPassagens - ${isInternal ? 'Análise Interna' : 'Viaje com Inteligência'}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: `Número do Orçamento: ${quote.quoteNumber || 'N/A'}`,
        alignment: AlignmentType.CENTER,
        spacing: { after: 300 }
      })
    );
    
    // DADOS DA VIAGEM
    sections.push(
      new Paragraph({
        text: 'Dados da Viagem',
        heading: 'Heading2',
        spacing: { before: 300, after: 200 }
      })
    );
    
    const flight = quote.flight || {};
    const flightRows = [
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: 'Companhia Aérea', bold: true })] }),
          new TableCell({ children: [new Paragraph(flight.airline || 'N/A')] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: 'Número do Voo', bold: true })] }),
          new TableCell({ children: [new Paragraph(flight.flightNumber || 'N/A')] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: 'Origem', bold: true })] }),
          new TableCell({ children: [new Paragraph(`${flight.origin?.name || 'N/A'} (${flight.origin?.code || 'N/A'})`)] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: 'Destino', bold: true })] }),
          new TableCell({ children: [new Paragraph(`${flight.destination?.name || 'N/A'} (${flight.destination?.code || 'N/A'})`)] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: 'Data de Ida', bold: true })] }),
          new TableCell({ children: [new Paragraph(`${flight.departure?.date || 'N/A'} - ${flight.departure?.time || 'N/A'}`)] })
        ]
      })
    ];
    
    if (flight.return) {
      flightRows.push(
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: 'Data de Volta', bold: true })] }),
            new TableCell({ children: [new Paragraph(`${flight.return.date} - ${flight.return.time}`)] })
          ]
        })
      );
    }
    
    flightRows.push(
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: 'Duração', bold: true })] }),
          new TableCell({ children: [new Paragraph(flight.duration || 'N/A')] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: 'Paradas', bold: true })] }),
          new TableCell({ children: [new Paragraph(flight.stops || 'N/A')] })
        ]
      }),
      new TableRow({
        children: [
          new TableCell({ children: [new Paragraph({ text: 'Classe', bold: true })] }),
          new TableCell({ children: [new Paragraph(flight.class || 'N/A')] })
        ]
      })
    );
    
    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: flightRows
      })
    );
    
    // VALORES
    sections.push(
      new Paragraph({
        text: isInternal ? 'Análise Financeira' : 'Valores',
        heading: 'Heading2',
        spacing: { before: 400, after: 200 }
      })
    );
    
    const pricing = quote.pricing || {};
    
    if (isInternal) {
      // Orçamento Interno
      const pricingRows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: 'Custo Base da Passagem', bold: true })] }),
            new TableCell({ children: [new Paragraph(formatCurrency(pricing.basePrice))] })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: 'Taxas de Embarque', bold: true })] }),
            new TableCell({ children: [new Paragraph(formatCurrency(pricing.airportTaxes?.total || 0))] })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: 'SUBTOTAL (Custo Real)', bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: formatCurrency(pricing.subtotal), bold: true })] })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: `LUCRO (${pricing.profit?.percentage || '0%'})`, bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: `+ ${formatCurrency(pricing.profit?.amount || 0)}`, bold: true })] })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: 'PREÇO AO CLIENTE', bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: formatCurrency(pricing.clientPrice || pricing.total), bold: true })] })
          ]
        })
      ];
      
      sections.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: pricingRows
        })
      );
    } else {
      // Orçamento Cliente
      const pricingRows = [
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: 'Passagem', bold: true })] }),
            new TableCell({ children: [new Paragraph(formatCurrency(pricing.flightPrice || pricing.total))] })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: 'Taxas de Embarque', bold: true })] }),
            new TableCell({ children: [new Paragraph(formatCurrency(pricing.taxes?.airportTaxes || 0))] })
          ]
        }),
        new TableRow({
          children: [
            new TableCell({ children: [new Paragraph({ text: 'TOTAL', bold: true })] }),
            new TableCell({ children: [new Paragraph({ text: formatCurrency(pricing.total), bold: true })] })
          ]
        })
      ];
      
      sections.push(
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: pricingRows
        })
      );
      
      // Formas de Pagamento
      if (pricing.paymentMethods && pricing.paymentMethods.length > 0) {
        sections.push(
          new Paragraph({
            text: 'Formas de Pagamento',
            heading: 'Heading2',
            spacing: { before: 400, after: 200 }
          })
        );
        
        pricing.paymentMethods.forEach(method => {
          let paymentText = method.method || 'Forma de Pagamento';
          if (method.finalPrice) {
            paymentText += ` - ${formatCurrency(method.finalPrice)} (${method.discount || ''})`;
          } else if (method.installments) {
            paymentText += typeof method.installments === 'string' 
              ? ` - ${method.installments}` 
              : ` - ${method.installments}x de ${formatCurrency(method.installmentValue || 0)}`;
          } else if (method.miles) {
            paymentText += ` - ${formatMiles(method.miles)} milhas + ${formatCurrency(method.taxesCash || 0)}`;
          }
          
          sections.push(
            new Paragraph({
              text: paymentText,
              spacing: { after: 100 }
            })
          );
        });
      }
    }
    
    // CONTATO
    const agency = quote.agency || {};
    sections.push(
      new Paragraph({
        text: 'Contato',
        heading: 'Heading2',
        spacing: { before: 400, after: 200 }
      }),
      new Paragraph({
        text: agency.name || 'ClickPassagens',
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: `Telefone: ${agency.phone || '(11) 99999-9999'}`,
        spacing: { after: 100 }
      }),
      new Paragraph({
        text: `E-mail: ${agency.email || 'contato@clickpassagens.com'}`,
        spacing: { after: 100 }
      })
    );
    
    // RODAPÉ
    const validUntil = quote.validUntil ? new Date(quote.validUntil).toLocaleDateString('pt-BR') : 'N/A';
    sections.push(
      new Paragraph({
        text: `\nVálido até: ${validUntil}`,
        alignment: AlignmentType.CENTER,
        spacing: { before: 400 }
      }),
      new Paragraph({
        text: 'www.clickpassagens.com',
        alignment: AlignmentType.CENTER
      })
    );
    
    const doc = new Document({
      sections: [{
        properties: {},
        children: sections
      }]
    });
    
    const blob = await Packer.toBlob(doc);
    const fileName = `orcamento-${quoteType}-${quote.quoteNumber || Date.now()}.docx`;
    console.log('Salvando Word:', fileName);
    saveAs(blob, fileName);
    
    console.log('Word gerado com sucesso!');
  } catch (error) {
    console.error('Erro ao gerar Word:', error);
    alert(`Erro ao gerar Word: ${error.message}`);
  }
};
