// PoPreview.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Typography } from "@mui/material";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export default function PoPreview() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) return <div>No PO data found</div>;

  const poCreated = {
    id: `PO-${Date.now()}`,
    date: new Date(),
    vehicle: state.vehicle,
    items: state.items
  };
const date = poCreated.date;
const day = String(date.getDate()).padStart(2, '0');      // 01, 02, ...
const month = String(date.getMonth() + 1).padStart(2, '0'); // 01-12
const year = date.getFullYear();

const formattedDate = `${day}/${month}/${year}`;
  // Export CSV
//   const exportCsv = () => {
//     const rows = [
//       ["PO Date",formattedDate],
//       ["Vehicle Type", poCreated.vehicle],
//       [],
//       ["Item Code", "Item Name", "Qty"],
//       ...poCreated.items.map(it => [it.item.itemcode, it.item.itemname, it.qty])
//     ];

//     const csvContent = rows
//       .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))
//       .join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement("a");
//     a.href = url;
//     a.download = `${poCreated.id}.csv`;
//     a.click();
//     URL.revokeObjectURL(url);
//   };

const exportCsv = async () => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("PO");

  // Add header rows
  ws.addRow(["PO Date", formattedDate]);
  ws.addRow(["Vehicle Type", poCreated.vehicle]);
  ws.addRow([]);
  ws.addRow(["Item Code", "Item Name", "Qty"]);

  // Add items
  poCreated.items.forEach(it => {
    ws.addRow([it.item.itemcode, it.item.itemname, it.qty]);
  });

 // Apply styles for PO Date and Vehicle Type
["A1", "B1",'C1', "A2", "B2",'C2'].forEach(cell => {
  ws.getCell(cell).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFADD8E6" } 
  };
  ws.getCell(cell).font = {
    color: { argb: "FFFFFF" }, 
    bold: true
  };
});


  // Generate and download
  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `${poCreated.id}.xlsx`);
};


  // Export PDF
  const exportPdf = () => {
    const w = window.open("", "_blank", "width=900,height=700");
    const html = `
      <html>
        <head>
          <title>${poCreated.id}</title>
          <style>
            body { font-family: Arial, Helvetica, sans-serif; padding: 20px; background: #f0f0f0; }
            .card { background: rgba(255,255,255,0.8); padding: 20px; border-radius: 12px; box-shadow: 0 4px 10px rgba(0,0,0,0.1);}
            h2 { color: #4f46e5; }
            table { border-collapse: collapse; width: 100%; margin-top: 15px; }
            th, td { border: 1px solid #333; padding: 8px; text-align: left; }
            th { background: #e0e7ff; }
          </style>
        </head>
        <body>
          <div class="card">
            <h2>Purchase Order</h2>
            <p><strong>PO Date:</strong> ${formattedDate}</p>
            <p><strong>Vehicle Type:</strong> ${poCreated.vehicle}</p>
            <table>
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
                ${poCreated.items.map(it => `
                  <tr>
                    <td>${it.item.itemcode}</td>
                    <td>${it.item.itemname}</td>
                    <td>${it.qty}</td>
                  </tr>`).join("")}
              </tbody>
            </table>
          </div>
        </body>
      </html>
    `;
    w.document.open();
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 via-blue-100 to-teal-200 p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl flex justify-start mb-4">
        <Button
          onClick={() => navigate(-1)}
          className="bg-gradient-to-r from-gray-400 to-gray-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-xl transition"
        >
          Back
        </Button>
      </div>

      <Card className="bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl border border-white/30 w-full max-w-6xl">
        <CardContent>
          <Typography variant="h5" className="mb-4 font-bold text-purple-700 text-center">
            Purchase Order Preview - {poCreated.id}
          </Typography>

          <Typography className="mb-2"><strong>PO Date:</strong> {formattedDate}</Typography>
          <Typography className="mb-4"><strong>Vehicle Type:</strong> {poCreated.vehicle}</Typography>

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-white/30 backdrop-blur-sm sticky top-0">
                <tr>
                  <th className="p-3 text-left font-medium text-gray-600">Item Code</th>
                  <th className="p-3 text-left font-medium text-gray-600">Item Name</th>
                  <th className="p-3 text-left font-medium text-gray-600">Qty</th>
                </tr>
              </thead>
              <tbody>
                {poCreated.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-white/20 transition">
                    <td className="p-2">{it.item.itemcode}</td>
                    <td className="p-2">{it.item.itemname}</td>
                    <td className="p-2">{it.qty}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex gap-3 justify-center">
            <Button
              variant="outlined"
              onClick={exportCsv}
              className="bg-gradient-to-r from-blue-400 to-teal-400 text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition"
            >
              Export Excel (CSV)
            </Button>
            <Button
              variant="outlined"
              onClick={exportPdf}
              className="bg-gradient-to-r from-blue-400 to-teal-400 text-white font-semibold rounded-xl shadow-md hover:shadow-xl transition"
            >
              Export PDF
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
