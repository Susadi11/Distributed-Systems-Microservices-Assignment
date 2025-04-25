import React, { useEffect, useState } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { motion } from 'framer-motion';
import { Download } from 'lucide-react';

const Transactions = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await axios.get('http://localhost:5552/payment-intents');
        setPayments(res.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching payments:', err);
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'succeeded': return 'bg-green-100 text-green-800';
      case 'requires_payment_method': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'canceled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF({
      orientation: 'landscape', // More horizontal space
      unit: 'pt',
      format: 'A4',
    });
  
    // Header - YUM YUM™
    doc.setFontSize(24);
    doc.setTextColor(220, 38, 38); // Tailwind red-600
    doc.setFont('helvetica', 'bold');
    doc.text('YUM YUM', 40, 50);
  
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.setFont('helvetica', 'normal');
    doc.text('™', 135, 42); // Position slightly above
  
    // Subtitle
    doc.setFontSize(14);
    doc.setTextColor(50);
    doc.setFont('helvetica', 'normal');
    doc.text('Payment Transactions Report', 40, 70);
  
    // Table
    autoTable(doc, {
      startY: 90,
      head: [['Payment ID', 'Amount', 'Currency', 'Status', 'Method', 'Created At']],
      body: payments.map(p => [
        p.paymentIntentId,
        `$${(p.amount / 100).toFixed(2)}`,
        p.currency.toUpperCase(),
        p.status,
        p.paymentMethod || '-',
        new Date(p.createdAt).toLocaleString()
      ]),
      styles: {
        fontSize: 10,
        overflow: 'linebreak',
        cellWidth: 'wrap',
        halign: 'left',
        valign: 'middle',
      },
      columnStyles: {
        0: { cellWidth: 120 },
        1: { cellWidth: 60 },
        2: { cellWidth: 60 },
        3: { cellWidth: 100 },
        4: { cellWidth: 90 },
        5: { cellWidth: 150 },
      },
      headStyles: {
        fillColor: [220, 38, 38], // red-600
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'left',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      rowStyles: {
        textColor: [55, 65, 81], 
      },
      theme: 'striped',
      didDrawPage: (data) => {
        // Optional footer or logo draw can go here
      },
    });
  
    doc.save('yumyum_transactions.pdf');
  };
  

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-700">Payment Transactions</h2>
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg shadow transition duration-200"
        >
          <Download size={18} /> Download PDF
        </button>
      </div>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 bg-white">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold">Payment ID</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Amount</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Currency</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Status</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Method</th>
                <th className="px-6 py-3 text-left text-sm font-semibold">Created At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {payments.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-3">{p.paymentIntentId}</td>
                  <td className="px-6 py-3">${(p.amount / 100).toFixed(2)}</td>
                  <td className="px-6 py-3 uppercase">{p.currency}</td>
                  <td className="px-6 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(p.status)}`}
                    >
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-3">{p.paymentMethod || '-'}</td>
                  <td className="px-6 py-3">{new Date(p.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default Transactions;
