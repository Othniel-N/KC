import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';

const ReportComponent = () => {
  const [data, setData] = useState([]);
  const [breakdownData, setBreakdownData] = useState([]);

  useEffect(() => {
    // Fetch main report data
    axios.get('http://localhost:5000/api/day-expenses')
      .then(response => setData(response.data))
      .catch(error => console.error('Error fetching data:', error));

    // Fetch breakdown data
    axios.get('http://localhost:5000/api/day-expenses')  // Adjust API endpoint for breakdown data
      .then(response => setBreakdownData(response.data))
      .catch(error => console.error('Error fetching breakdown data:', error));
  }, []);

  // Filter breakdown data for the current date only
  const currentDate = new Date().toISOString().split('T')[0]; // Get current date in YYYY-MM-DD format
  const filteredData = data.filter(item => item.date.startsWith(currentDate));
  const filteredBreakdownData = breakdownData.filter(item => item.date.startsWith(currentDate));

  // Group breakdown data by site name
  const breakdownGroupedBySite = filteredBreakdownData.reduce((acc, item) => {
    if (!acc[item.siteName]) {
      acc[item.siteName] = [];
    }
    acc[item.siteName].push(item);
    return acc;
  }, {});

  const generatePDF = () => {
    const doc = new jsPDF();

    // Header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(34, 139, 34); // Green color
    doc.text('Expense Report', 105, 20, { align: 'center' });

    // Sub-header
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0); // Black color
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 10, 40);
    doc.text('Name: Gangadharan', 10, 50);
    doc.text('Position: Engineer', 10, 60);
    doc.text('Office Address: [Your Office Address]', 150, 40, { align: 'right' });

    // Add remark about raw materials not being included
    doc.setFontSize(10);
    doc.text('Note: Raw material expenses are not included, only site-related expenses are shown.', 10, 70);

    // Main Table
    const tableData = filteredData.map((item, index) => [
      index + 1,
      item.date,
      item.siteName,
      item.detail,
      item.totalExpenses
    ]);

    doc.autoTable({
      head: [['SI.No', 'Date', 'Site Name', 'Detail', 'Total Expenses']],
      body: tableData,
      startY: 80,
    });

    // Breakdown Table (Grouped by Site)
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.text('Expense Breakdown', 105, doc.lastAutoTable.finalY + 20, { align: 'center' });

    // Iterate through each site and generate its breakdown
    let startY = doc.lastAutoTable.finalY + 10;
    for (const [siteName, siteBreakdowns] of Object.entries(breakdownGroupedBySite)) {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`Site Name: ${siteName}`, 10, startY);
      startY += 10;

      // Filter out breakdown values that are null or 0
      const breakdownTableData = siteBreakdowns.map((item) => {
        const filtered = [];
        if (item.labourExpenses && item.labourExpenses !== 0) filtered.push(['Labour Expenses', item.labourExpenses]);
        if (item.miscExpenses && item.miscExpenses !== 0) filtered.push(['Misc Expenses', item.miscExpenses]);
        if (item.transportationCost && item.transportationCost !== 0) filtered.push(['Transportation Cost', item.transportationCost]);
        if (item.equipmentRentalCost && item.equipmentRentalCost !== 0) filtered.push(['Equipment Rental Cost', item.equipmentRentalCost]);
        if (item.governmentFees && item.governmentFees !== 0) filtered.push(['Government Fees', item.governmentFees]);
        if (item.techniciansFees && item.techniciansFees !== 0) filtered.push(['Technicians Fees', item.techniciansFees]);
        if (item.fuelCostForMachineries && item.fuelCostForMachineries !== 0) filtered.push(['Fuel Cost for Machineries', item.fuelCostForMachineries]);
        if (item.tips && item.tips !== 0) filtered.push(['Tips', item.tips]);
        if (item.printBillAndPhoneBill && item.printBillAndPhoneBill !== 0) filtered.push(['Print & Phone Bill', item.printBillAndPhoneBill]);
        if (item.purchasingExpenses && item.purchasingExpenses !== 0) filtered.push(['Purchasing Expenses', item.purchasingExpenses]);
        if (item.otherExpenses && item.otherExpenses !== 0) filtered.push(['Other Expenses', item.otherExpenses]);

        return filtered;
      });

      // Flatten the filtered data
      const flattenedTableData = breakdownTableData.flat();

      // Add the breakdown table to the PDF if there is data
      if (flattenedTableData.length > 0) {
        doc.autoTable({
          head: [['Expense Category', 'Amount']],
          body: flattenedTableData,
          startY: startY,
        });
      }

      // Update startY for next site
      startY = doc.lastAutoTable.finalY + 10;
    }

    // Footer with Engineer Signature
    doc.text('Engineer Signature: ____________________', 10, startY + 20);

    // Save PDF
    doc.save('Expense_Report.pdf');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Generate Expense Report</h2>
      <button 
        onClick={generatePDF} 
        style={{ 
          padding: '10px 20px', 
          backgroundColor: '#228B22', 
          color: 'white', 
          border: 'none', 
          borderRadius: '5px', 
          cursor: 'pointer' 
        }}
      >
        Generate PDF
      </button>

      {/* Main Expense Table */}
      <table border="1" style={{ marginTop: '20px', width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th>SI.No</th>
            <th>Date</th>
            <th>Site Name</th>
            <th>Detail</th>
            <th>Total Expenses</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{item.date}</td>
              <td>{item.siteName}</td>
              <td>{item.detail}</td>
              <td>{item.totalExpenses}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Breakdown Table (Grouped by Site) */}
      <h3 style={{ marginTop: '40px' }}>Expense Breakdown</h3>
      <div style={{ border: '1px solid black', padding: '10px', marginTop: '10px' }}>
        {Object.entries(breakdownGroupedBySite).map(([siteName, siteBreakdowns], index) => (
          <div key={index}>
            <h4>Site Name: {siteName}</h4>
            <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f2f2f2' }}>
                  <th>Expense Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {siteBreakdowns.map((item, index) => {
                  return (
                    <>
                      {item.labourExpenses !== 0 && item.labourExpenses != null && (
                        <tr key={index}>
                          <td>Labour Expenses</td>
                          <td>{item.labourExpenses}</td>
                        </tr>
                      )}
                      {item.miscExpenses !== 0 && item.miscExpenses != null && (
                        <tr key={index}>
                          <td>Misc Expenses</td>
                          <td>{item.miscExpenses}</td>
                        </tr>
                      )}
                      {item.transportationCost !== 0 && item.transportationCost != null && (
                        <tr key={index}>
                          <td>Transportation Cost</td>
                          <td>{item.transportationCost}</td>
                        </tr>
                      )}
                      {item.equipmentRentalCost !== 0 && item.equipmentRentalCost != null && (
                        <tr key={index}>
                          <td>Equipment Rental Cost</td>
                          <td>{item.equipmentRentalCost}</td>
                        </tr>
                      )}
                      {item.governmentFees !== 0 && item.governmentFees != null && (
                        <tr key={index}>
                          <td>Government Fees</td>
                          <td>{item.governmentFees}</td>
                        </tr>
                      )}
                      {item.techniciansFees !== 0 && item.techniciansFees != null && (
                        <tr key={index}>
                          <td>Technicians Fees</td>
                          <td>{item.techniciansFees}</td>
                        </tr>
                      )}
                      {item.fuelCostForMachineries !== 0 && item.fuelCostForMachineries != null && (
                        <tr key={index}>
                          <td>Fuel Cost for Machineries</td>
                          <td>{item.fuelCostForMachineries}</td>
                        </tr>
                      )}
                      {item.tips !== 0 && item.tips != null && (
                        <tr key={index}>
                          <td>Tips</td>
                          <td>{item.tips}</td>
                        </tr>
                      )}
                      {item.printBillAndPhoneBill !== 0 && item.printBillAndPhoneBill != null && (
                        <tr key={index}>
                          <td>Print & Phone Bill</td>
                          <td>{item.printBillAndPhoneBill}</td>
                        </tr>
                      )}
                      {item.purchasingExpenses !== 0 && item.purchasingExpenses != null && (
                        <tr key={index}>
                          <td>Purchasing Expenses</td>
                          <td>{item.purchasingExpenses}</td>
                        </tr>
                      )}
                      {item.otherExpenses !== 0 && item.otherExpenses != null && (
                        <tr key={index}>
                          <td>Other Expenses</td>
                          <td>{item.otherExpenses}</td>
                        </tr>
                      )}
                    </>
                  );
                })}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportComponent;
