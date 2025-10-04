// PoPreview.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Typography } from "@mui/material";

export default function PoPreview() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) return <div>No PO data found</div>;

  const poCreated = {
    id: `SO-${Date.now()}`,
    date: new Date(),
    customer: state.customer,
    items: state.items,
    subtotal: state.items.reduce((s, c) => s + c.qty * c.price, 0),
  };

  // Export CSV (Excel)
  const exportCsv = () => {
    const rows = [
      ["PO ID", poCreated.id],
      ["Date", poCreated.date.toLocaleString()],
      ["Customer", poCreated.customer.name],
      ["Address", poCreated.customer.address],
      [],
      ["Item Code", "Item Name", "Qty", "Unit Price (IRN)", "Line Total (IRN)"],
      ...poCreated.items.map((it) => [
        it.item.itemCode,
        it.item.itemName,
        it.qty,
        it.price,
        it.qty * it.price,
      ]),
      [],
      ["Subtotal (IRN)", poCreated.subtotal],
    ];

    const csvContent = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${poCreated.id}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Export PDF (Print-friendly)
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
            <h2>Sales Order - ${poCreated.id}</h2>
            <p><strong>Date:</strong> ${poCreated.date.toLocaleString()}</p>
            <p><strong>Customer:</strong> ${poCreated.customer.name}</p>
            <p><strong>Address:</strong> ${poCreated.customer.address}</p>
            <table>
              <thead>
                <tr>
                  <th>Item Code</th>
                  <th>Item Name</th>
                  <th>Qty</th>
                  <th>Unit Price (IRN)</th>
                  <th>Line Total (IRN)</th>
                </tr>
              </thead>
              <tbody>
                ${poCreated.items
                  .map(
                    (it) =>
                      `<tr>
                        <td>${it.item.itemCode}</td>
                        <td>${it.item.itemName}</td>
                        <td>${it.qty}</td>
                        <td>${it.price}</td>
                        <td>${it.qty * it.price}</td>
                      </tr>`
                  )
                  .join("")}
              </tbody>
            </table>

            <h3>Subtotal (IRN): ${poCreated.subtotal}</h3>
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
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-6">
      <Button
        onClick={() => navigate(-1)}
        className="mb-4 shadow-md hover:shadow-lg transition"
      >
        Back
      </Button>

      <Card className="bg-white/30 backdrop-blur-md shadow-lg rounded-xl border border-white/20 p-6">
        <CardContent>
          <Typography variant="h5" className="mb-4 font-bold text-purple-700">
            SO Preview - {poCreated.id}
          </Typography>

          <Typography><strong>Date:</strong> {poCreated.date.toLocaleString()}</Typography>
          <Typography><strong>Customer:</strong> {poCreated.customer.name}</Typography>
          <Typography><strong>Address:</strong> {poCreated.customer.address}</Typography>
          
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-white/40 backdrop-blur-sm sticky top-0">
                <tr>
                  <th className="p-3 text-left font-medium text-gray-600">Item Code</th>
                  <th className="p-3 text-left font-medium text-gray-600">Item Name</th>
                  <th className="p-3 text-left font-medium text-gray-600">Qty</th>
                  <th className="p-3 text-left font-medium text-gray-600">Unit Price (IRN)</th>
                  <th className="p-3 text-left font-medium text-gray-600">Line Total (IRN)</th>
                </tr>
              </thead>
              <tbody>
                {poCreated.items.map((it, idx) => (
                  <tr key={idx} className="hover:bg-white/20 transition">
                    <td className="p-2">{it.item.itemCode}</td>
                    <td className="p-2">{it.item.itemName}</td>
                    <td className="p-2">{it.qty}</td>
                    <td className="p-2">{it.price}</td>
                    <td className="p-2">{it.qty * it.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Typography variant="h6" className="mt-4 font-semibold text-gray-700">
            Subtotal (IRN): {poCreated.subtotal}
          </Typography>

          <div className="mt-4 flex gap-3">
            <Button variant="outlined" onClick={exportCsv}>Export Excel (CSV)</Button>
            <Button variant="outlined" onClick={exportPdf}>Export PDF</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
