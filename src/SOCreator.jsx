// PoCreator.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Typography, TextField } from "@mui/material";
import Select from "react-select";
import customerItemMapping from "./customerItemMapping.json";

export default function PoCreator() {
  const navigate = useNavigate();

  // Customers from mapping
  const customersJson = customerItemMapping.map(c => ({
    id: c.customerId,
    name: c.customerName,
    address: c.address,
    items: c.items
  }));

  // State
  const [selectedCustomer, setSelectedCustomer] = useState(customersJson[0]);
  const [itemOptions, setItemOptions] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);

  // Update item dropdown based on selected customer
  useEffect(() => {
    const options = selectedCustomer.items.map(it => ({
      value: it.itemCode,
      label: `${it.itemCode} - ${it.itemName}`,
      data: it
    }));
    setItemOptions(options);
    setSelectedItem(options[0]);
  }, [selectedCustomer]);

  const handleAddToCart = () => {
    if (!selectedItem || qty <= 0) return;
    const existingIndex = cart.findIndex(c => c.item.itemCode === selectedItem.data.itemCode);
    let next = [...cart];
    if (existingIndex >= 0) {
      next[existingIndex] = { ...next[existingIndex], qty: next[existingIndex].qty + Number(qty) };
    } else {
      next.push({ item: selectedItem.data, qty: Number(qty), price: selectedItem.data.priceIRN });
    }
    setCart(next);
    setQty(1);
  };

  const handleRemove = (index) => {
    const next = [...cart];
    next.splice(index, 1);
    setCart(next);
  };

  const createPo = () => {
    if (!cart.length) return;
    navigate("/sopreview", {
      state: {
        customer: selectedCustomer,
        items: cart
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 p-6">
      <Typography variant="h4" className="mb-6 text-center font-bold text-purple-700">
        Sales Order Creator
      </Typography>

      {/* Inputs Card */}
      <Card className="bg-white/30 backdrop-blur-md shadow-lg rounded-xl p-6 mb-6 border border-white/20">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            {/* Customer */}
            <div>
              <Typography className="mb-1 font-medium text-gray-700">Customer</Typography>
              <Select
                value={{ value: selectedCustomer.id, label: selectedCustomer.name }}
                onChange={(opt) => setSelectedCustomer(opt.data)}
                options={customersJson.map(c => ({ value: c.id, label: c.name, data: c }))}
                className="rounded"
                menuPortalTarget={document.body}
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
              />
            </div>

            {/* Item */}
            <div>
              <Typography className="mb-1 font-medium text-gray-700">Item</Typography>
              <Select
                value={selectedItem}
                onChange={(opt) => setSelectedItem(opt)}
                options={itemOptions}
                isSearchable
                className="rounded"
                menuPortalTarget={document.body}
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
              />
            </div>

            {/* Quantity + Add Button */}
            <div className="flex flex-col gap-2">
              <TextField
                type="number"
                size="small"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="bg-white/80 rounded"
              />
            </div>
            <div>
               <Button variant="contained" color="primary" onClick={handleAddToCart}>
                Add Item to Cart
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cart Card */}
      <Card className="bg-white/30 backdrop-blur-md shadow-lg rounded-xl border border-white/20">
        <CardContent>
          <Typography variant="h6" className="mb-4 font-semibold text-gray-700">
            Cart
          </Typography>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-white/40 backdrop-blur-sm sticky top-0">
                <tr>
                  <th className="p-3 text-left font-medium text-gray-600">Item Code</th>
                  <th className="p-3 text-left font-medium text-gray-600">Item Name</th>
                  <th className="p-3 text-left font-medium text-gray-600">Qty</th>
                  <th className="p-3 text-left font-medium text-gray-600">Unit Price (IRN)</th>
                  <th className="p-3 text-left font-medium text-gray-600">Line Total (IRN)</th>
                  <th className="p-3 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((c, idx) => (
                  <tr key={idx} className="hover:bg-white/20 transition">
                    <td className="p-2">{c.item.itemCode}</td>
                    <td className="p-2">{c.item.itemName}</td>
                    <td className="p-2">{c.qty}</td>
                    <td className="p-2">{c.price}</td>
                    <td className="p-2">{c.qty * c.price}</td>
                    <td className="p-2">
                      <Button color="error" onClick={() => handleRemove(idx)} size="small">
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
                {cart.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-gray-500">
                      Cart is empty
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Subtotal + Create PO */}
          <div className="mt-6 flex justify-between items-center">
            <Typography variant="h6" className="font-semibold text-gray-700">
              Subtotal (IRN): {cart.reduce((s, c) => s + c.qty * c.price, 0)}
            </Typography>
            <Button
              variant="contained"
              color="success"
              className="shadow-lg hover:shadow-xl transition"
              onClick={createPo}
            >
              Create PO
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
