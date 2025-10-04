// PoCreator.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardContent, Typography, TextField } from "@mui/material";
import Select from "react-select";
import itemList from "./itemList.json";

export default function PoCreator() {
  const navigate = useNavigate();

  const vehicleTypes = [
    { value: "EICER", label: "EICER" },
    { value: "BOLERO", label: "BOLERO" },
    { value: "CONTAINER", label: "CONTAINER" },
  ];

  const [selectedItem, setSelectedItem] = useState(null);
  const [itemOptions, setItemOptions] = useState([]);
  const [qty, setQty] = useState(1);
  const [cart, setCart] = useState([]);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicleTypes[0]);

  useEffect(() => {
    const options = itemList.map(it => ({
      value: it.itemid,
      label: `${it.itemcode} - ${it.itemname}`,
      data: it
    }));
    setItemOptions(options);
    setSelectedItem(options[0]);
  }, []);

  const handleAddToCart = () => {
    if (!selectedItem || qty <= 0) return;
    const existingIndex = cart.findIndex(c => c.item.itemid === selectedItem.data.itemid);
    let next = [...cart];
    if (existingIndex >= 0) {
      next[existingIndex].qty += Number(qty);
    } else {
      next.push({ item: selectedItem.data, qty: Number(qty) });
    }
    setCart(next);
    setQty(1);
  };

  const handleRemove = (index) => {
    const next = [...cart];
    next.splice(index, 1);
    setCart(next);
  };

  const goBack = () => navigate(-1);

  const createPo = () => {
    if (!cart.length) return;
    navigate("/popreview", { state: { items: cart, vehicle: selectedVehicle.value } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-300 via-blue-100 to-teal-200 p-6 flex flex-col items-center">
      
      {/* Header + Back Button */}
      <div className="w-full max-w-6xl flex justify-between items-center mb-4">
        <Button
          onClick={goBack}
          className="bg-gradient-to-r from-gray-400 to-gray-600 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-xl transition"
        >
          Back
        </Button>
        <Typography variant="h4" className="font-bold text-purple-700 text-center">
          Purchase Order Creator
        </Typography>
        <div></div> {/* empty for spacing */}
      </div>

      {/* Inputs Card */}
      <Card className="bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl p-6 w-full max-w-6xl mb-0 border border-white/30">
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
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

            {/* Quantity */}
            <div>
              <Typography className="mb-1 font-medium text-gray-700">Quantity</Typography>
              <TextField
                type="number"
                size="small"
                fullWidth
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="bg-white/80 rounded"
              />
            </div>

            {/* Vehicle Type */}
            <div>
              <Typography className="mb-1 font-medium text-gray-700">Vehicle Type</Typography>
              <Select
                value={selectedVehicle}
                onChange={(opt) => setSelectedVehicle(opt)}
                options={vehicleTypes}
                className="rounded"
                menuPortalTarget={document.body}
                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
              />
            </div>

            {/* Add Button */}
            <div>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleAddToCart}
                className="shadow-md hover:shadow-xl transition"
              >
                Add Item
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cart Card - no gap from input card */}
      <Card className="bg-white/20 backdrop-blur-lg shadow-xl rounded-2xl border border-white/30 w-full max-w-6xl -mt-2">
        <CardContent>
          <Typography variant="h6" className="mb-4 font-semibold text-gray-700">
            Cart
          </Typography>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border-collapse">
              <thead className="bg-white/30 backdrop-blur-sm sticky top-0">
                <tr>
                  <th className="p-3 text-left font-medium text-gray-600">Item Code</th>
                  <th className="p-3 text-left font-medium text-gray-600">Item Name</th>
                  <th className="p-3 text-left font-medium text-gray-600">Qty</th>
                  <th className="p-3 text-left font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((c, idx) => (
                  <tr key={idx} className="hover:bg-white/20 transition">
                    <td className="p-2">{c.item.itemcode}</td>
                    <td className="p-2">{c.item.itemname}</td>
                    <td className="p-2">{c.qty}</td>
                    <td className="p-2">
                      <Button color="error" size="small" onClick={() => handleRemove(idx)}>
                        Remove
                      </Button>
                    </td>
                  </tr>
                ))}
                {cart.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center p-4 text-gray-500">
                      Cart is empty
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Create PO Button */}
          <div className="mt-6 flex justify-end">
            <Button
              variant="contained"
              color="success"
              onClick={createPo}
              className="shadow-md hover:shadow-xl transition"
            >
              Create PO
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
